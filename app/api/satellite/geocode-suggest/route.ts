import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

    if (!apiKey) {
      throw new Error('Google Geocoding API key not configured.');
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Google Geocoding API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Geocoding API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    const suggestions = data.results.map((result: any) => ({
      id: result.place_id,
      name: result.formatted_address, // Use formatted_address as the primary name
      country: result.address_components.find((comp: any) => comp.types.includes('country'))?.long_name || '',
      state: result.address_components.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.long_name || '',
      city: result.address_components.find((comp: any) => comp.types.includes('locality'))?.long_name || '',
      postcode: result.address_components.find((comp: any) => comp.types.includes('postal_code'))?.long_name || '',
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      displayName: result.formatted_address,
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Geocode suggest error:', error);
    // @ts-ignore
    return NextResponse.json({ error: error.message || 'Failed to fetch Google geocoding suggestions.' }, { status: 500 });
  }
}