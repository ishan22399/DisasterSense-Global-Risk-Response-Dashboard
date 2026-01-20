import { NextResponse } from 'next/server';

// Utility to fetch data with error handling
async function fetchAPI(url: string, errorMessage: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorMessage}: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text(); // Return text if not JSON
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const disasterType = searchParams.get('disasterType');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // 1. Geocoding (Reverse) - Use Google Geocoding API
    // Use the correct server-side env variable for Google Geocoding API key
    const googleApiKey =
      process.env.GOOGLE_GEOCODING_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY;

    if (!googleApiKey) {
      return NextResponse.json({ error: 'Google Geocoding API key not configured.' }, { status: 500 });
    }
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;
    const geoData = await fetchAPI(geoUrl, 'Google Geocoding failed');
    const geocoding = geoData.results?.[0] || {};

    // 2. Weather Data (OpenWeatherMap, free tier)
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    let weather = null;

    if (openWeatherApiKey) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
      const weatherData = await fetchAPI(weatherUrl, 'OpenWeatherMap weather fetch failed');
      weather = {
        temperature: weatherData.main?.temp,
        wind_speed: weatherData.wind?.speed,
        humidity: weatherData.main?.humidity,
        description: weatherData.weather?.[0]?.description,
        icon: weatherData.weather?.[0]?.icon,
        clouds: weatherData.clouds?.all ?? null
      };
    }

    // 2. AQI: Use Google Air Quality API first (fetch the correct AQI value)
    let aqi = null;
    let aqiDisplay = null;
    let aqiCategory = null;
    let aqiSource = null;

    if (googleApiKey) {
      try {
        const googleAqiResp = await fetch(
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${googleApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: { latitude: Number(lat), longitude: Number(lon) }
            })
          }
        );
        if (googleAqiResp.ok) {
          const googleAqiData = await googleAqiResp.json();
          // Google Air Quality API returns indexes at the root or inside currentConditions
          let index = null;
          if (googleAqiData.indexes && googleAqiData.indexes.length > 0) {
            index = googleAqiData.indexes[0];
          } else if (googleAqiData.currentConditions?.indexes && googleAqiData.currentConditions.indexes.length > 0) {
            index = googleAqiData.currentConditions.indexes[0];
          }
          if (index && typeof index.aqi === "number" && index.aqi > 0) {
            aqi = index.aqi;
            aqiDisplay = index.aqiDisplay;
            aqiCategory = index.category;
            aqiSource = "google";
          }
        }
      } catch (err) {
        // Ignore Google AQI errors
      }
    }

    // 3. Try AQICN if Google AQI not available or not valid
    if ((aqi === null || aqi === undefined || aqi <= 0) && process.env.AQICN_API_KEY) {
      try {
        const aqicnResp = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.AQICN_API_KEY}`);
        const aqicnData = await aqicnResp.json();
        if (
          aqicnData.status === "ok" &&
          aqicnData.data &&
          typeof aqicnData.data.aqi === "number" &&
          aqicnData.data.aqi > 0
        ) {
          aqi = aqicnData.data.aqi;
          aqiDisplay = String(aqi);
          aqiCategory = null;
          aqiSource = "aqicn";
        }
      } catch (err) {
        // Ignore AQICN errors
      }
    }

    // 4. Try OpenWeatherMap AQI as last fallback
    if ((aqi === null || aqi === undefined || aqi <= 0) && openWeatherApiKey) {
      try {
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`;
        const aqiData = await fetchAPI(aqiUrl, 'OpenWeatherMap AQI fetch failed');
        if (
          aqiData.list &&
          aqiData.list.length > 0 &&
          typeof aqiData.list[0].main.aqi === "number" &&
          aqiData.list[0].main.aqi > 0
        ) {
          aqi = aqiData.list[0].main.aqi;
          aqiDisplay = String(aqi);
          aqiCategory = null;
          aqiSource = "openweathermap";
        }
      } catch (owmAqiErr) {
        // Ignore fallback errors
      }
    }

    // 3. Satellite & Analysis Data (Simulated for now, but can be replaced with real APIs)
    const satellite = {
      timestamp: new Date().toISOString(),
      nextPass: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      resolution: '10m',
      cloudCover: weather?.clouds ?? 0,
      quality: 100,
      sensors: ['RGB', 'Multispectral', 'Thermal IR'],
    };

    const analysis = {
      vegetationIndex: Math.random(),
      thermalAnomaly: disasterType === 'wildfire' && Math.random() > 0.5,
      waterLevels: disasterType === 'flood' ? Math.random() : 0,
      fireDetection: disasterType === 'wildfire' ? Math.random() : 0,
      changeDetection: Math.random(),
    };

    return NextResponse.json({
      geocoding,
      weather: { ...weather, aqi, aqiDisplay, aqiCategory, aqiSource },
      satellite,
      analysis,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
