import { NextResponse } from 'next/server';

// Utility to fetch data with error handling
async function fetchAPI(url: string, errorMessage: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);
    }
    return await response.json();
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
    const googleApiKey = process.env.GOOGLE_GEOCODING_API_KEY;
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
      const weatherData = await fetchAPI(weatherUrl, 'OpenWeatherMap fetch failed');
      weather = {
        temperature: weatherData.main?.temp,
        wind_speed: weatherData.wind?.speed,
        humidity: weatherData.main?.humidity,
        aqi: null, // AQI not available in free OpenWeatherMap, can be extended with another free API if needed
        description: weatherData.weather?.[0]?.description,
        icon: weatherData.weather?.[0]?.icon,
        clouds: weatherData.clouds?.all ?? null // Add clouds property for satellite.cloudCover
      };
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
      weather,
      satellite,
      analysis,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
