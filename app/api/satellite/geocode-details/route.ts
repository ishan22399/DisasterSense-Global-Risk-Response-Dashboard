import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('place_id');

  if (!placeId) {
    return NextResponse.json({ error: "Query parameter 'place_id' is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

    if (!apiKey) {
      throw new Error('Google Geocoding API key not configured.');
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Google Geocoding API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || data.results.length === 0) {
      throw new Error(`Google Geocoding API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const result = data.results[0];
    const geocodedData = {
      id: result.place_id,
      name: result.formatted_address,
      country: result.address_components.find((comp: any) => comp.types.includes('country'))?.long_name || '',
      state: result.address_components.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.long_name || '',
      city: result.address_components.find((comp: any) => comp.types.includes('locality'))?.long_name || '',
      postcode: result.address_components.find((comp: any) => comp.types.includes('postal_code'))?.long_name || '',
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      displayName: result.formatted_address,
    };

    return NextResponse.json(geocodedData);
  } catch (error) {
    console.error('Geocode details error:', error);
    // @ts-ignore
    return NextResponse.json({ error: error.message || 'Failed to fetch geocoding details.' }, { status: 500 });
  }
}
