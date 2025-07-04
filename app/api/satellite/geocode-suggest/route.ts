import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    // Using Photon API for geocoding suggestions
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions from Photon API');
    }
    const data = await response.json();
    
    // Format the response to be more useful for the frontend
    const suggestions = data.features.map((feature: any) => ({
      id: feature.properties.osm_id,
      name: feature.properties.name,
      country: feature.properties.country,
      state: feature.properties.state,
      city: feature.properties.city,
      postcode: feature.properties.postcode,
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
      },
      displayName: feature.properties.name + (feature.properties.city ? `, ${feature.properties.city}` : '') + (feature.properties.country ? `, ${feature.properties.country}` : '')
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Geocode suggest error:', error);
    // @ts-ignore
    return NextResponse.json({ error: error.message || 'Failed to fetch geocoding suggestions.' }, { status: 500 });
  }
}