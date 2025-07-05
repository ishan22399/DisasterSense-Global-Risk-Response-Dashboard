
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

    // 2. Weather Data (now handled client-side by Google Maps Platform)

    // 3. Satellite & Analysis Data (Simulated for now, but can be replaced with real APIs)
    const satellite = {
      timestamp: new Date().toISOString(),
      nextPass: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      resolution: '10m',
      cloudCover: 0, // Cloud cover will be handled by Google Maps Weather Layer
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
      satellite,
      analysis,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
