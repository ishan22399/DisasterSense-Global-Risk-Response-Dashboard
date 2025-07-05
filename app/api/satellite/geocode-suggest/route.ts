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

    const sessionToken = crypto.randomUUID(); // Generate a new session token for each autocomplete session

    const autocompleteResponse = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&sessiontoken=${sessionToken}`);
    
    if (!autocompleteResponse.ok) {
      throw new Error(`Google Places Autocomplete API request failed: ${autocompleteResponse.status}`);
    }

    const autocompleteData = await autocompleteResponse.json();

    if (autocompleteData.status !== 'OK' && autocompleteData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places Autocomplete API error: ${autocompleteData.status} - ${autocompleteData.error_message || 'Unknown error'}`);
    }

    if (autocompleteData.status === 'ZERO_RESULTS') {
      return NextResponse.json([]);
    }

    const suggestions = autocompleteData.predictions.map((prediction: any) => ({
      id: prediction.place_id,
      name: prediction.structured_formatting.main_text,
      country: '', // Not available from Autocomplete API directly
      state: '',   // Not available from Autocomplete API directly
      city: '',    // Not available from Autocomplete API directly
      postcode: '',// Not available from Autocomplete API directly
      coordinates: null, // Coordinates will be fetched on selection
      displayName: prediction.description,
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Geocode suggest error:', error);
    // @ts-ignore
    return NextResponse.json({ error: error.message || 'Failed to fetch Google Places Autocomplete suggestions.' }, { status: 500 });
  }
}