
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
    // 1. Geocoding (Reverse)
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const geocoding = await fetchAPI(geoUrl, 'Geocoding failed');

    // 2. Weather Data
    const weatherKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!weatherKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
    const weatherResponse = await fetchAPI(weatherUrl, 'Weather API failed');

    const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=01d5a8a52924551bef6a05ba8b6b8dc9383e331a`;
    const aqiResponse = await fetchAPI(aqiUrl, 'AQI API failed');

    const weather = {
      temperature: weatherResponse.main.temp,
      wind_speed: weatherResponse.wind.speed,
      humidity: weatherResponse.main.humidity,
      description: weatherResponse.weather[0].description,
      icon: weatherResponse.weather[0].icon,
      aqi: aqiResponse.data.aqi,
    };

    // 3. Satellite & Analysis Data (Simulated for now, but can be replaced with real APIs)
    const satellite = {
      timestamp: new Date().toISOString(),
      nextPass: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      resolution: '10m',
      cloudCover: weatherResponse.clouds?.all || 0,
      quality: 100 - (weatherResponse.clouds?.all || 0),
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
