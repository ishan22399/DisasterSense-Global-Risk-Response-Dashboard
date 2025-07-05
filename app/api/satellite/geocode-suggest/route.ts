import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 });
  }

  try {
    // 1. Get autocomplete predictions
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places Autocomplete API error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    // 2. For each prediction, fetch details for accurate info
    const suggestions = await Promise.all(
      data.predictions.map(async (prediction: any) => {
        let country = "";
        let state = "";
        let city = "";
        let postcode = "";
        let coordinates = null;

        try {
          const detailsResp = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${GOOGLE_API_KEY}`
          );
          const detailsData = await detailsResp.json();
          const result = detailsData.result;
          if (result && result.geometry && result.geometry.location) {
            coordinates = {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng,
            };
          }
          if (result && result.address_components) {
            result.address_components.forEach((component: any) => {
              if (component.types.includes("country")) country = component.long_name;
              else if (component.types.includes("administrative_area_level_1")) state = component.long_name;
              else if (component.types.includes("locality")) city = component.long_name;
              else if (component.types.includes("postal_code")) postcode = component.long_name;
            });
          }
        } catch (err) {
          // Ignore errors, fallback to empty fields
        }

        return {
          id: prediction.place_id,
          name: prediction.structured_formatting.main_text,
          displayName: prediction.description,
          country,
          state,
          city,
          postcode,
          coordinates,
        };
      })
    );

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching geocode suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch geocode suggestions" }, { status: 500 });
  }
}
