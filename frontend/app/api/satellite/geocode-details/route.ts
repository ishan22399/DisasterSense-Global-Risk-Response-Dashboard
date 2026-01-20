import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json({ error: "Place ID is required" }, { status: 400 });
  }

  // Use the correct server-side env variable for Google Places API key
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    const result = data.result;
    const location = result.geometry.location;
    const addressComponents = result.address_components;

    let country = "";
    let state = "";
    let city = "";
    let postcode = "";
    let aqi = null;

    addressComponents.forEach((component: any) => {
      if (component.types.includes("country")) country = component.long_name;
      else if (component.types.includes("administrative_area_level_1")) state = component.long_name;
      else if (component.types.includes("locality")) city = component.long_name;
      else if (component.types.includes("postal_code")) postcode = component.long_name;
    });

    // Fetch AQI data from OpenWeatherMap if available
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (openWeatherApiKey && location.lat && location.lng) {
      try {
        const aqiResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat}&lon=${location.lng}&appid=${openWeatherApiKey}`
        );
        const aqiData = await aqiResponse.json();
        if (aqiData.list && aqiData.list.length > 0) {
          aqi = aqiData.list[0].main.aqi;
        }
      } catch (aqiError) {
        console.warn("Failed to fetch AQI data:", aqiError);
      }
    }

    return NextResponse.json({
      id: result.place_id,
      name: result.name,
      displayName: result.formatted_address,
      coordinates: { lat: location.lat, lng: location.lng },
      country,
      state,
      city,
      postcode,
      aqi,
    });
  } catch (error) {
    console.error("Error fetching geocode details:", error);
    return NextResponse.json({ error: "Failed to fetch geocode details" }, { status: 500 });
  }
}