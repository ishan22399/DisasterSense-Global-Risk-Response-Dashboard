import { NextResponse } from 'next/server';

// Mock function to simulate AI-powered predictive pathing
const generatePredictivePath = (disaster: any) => {
  const { lat, lng } = disaster.location;
  const path = [];
  let currentLat = lat;
  let currentLng = lng;

  // Simulate a path moving in a general direction with some randomness
  const angle = Math.random() * 2 * Math.PI;
  const speed = (Math.random() * 0.05) + 0.02; // degrees per hour

  for (let i = 1; i <= 48; i++) { // 48 hours prediction
    currentLat += Math.sin(angle) * speed + (Math.random() - 0.5) * 0.01;
    currentLng += Math.cos(angle) * speed + (Math.random() - 0.5) * 0.01;
    path.push({ 
      lat: currentLat, 
      lng: currentLng, 
      timestamp: new Date(Date.now() + i * 3600 * 1000).toISOString() 
    });
  }

  return {
    disasterId: disaster.id,
    predictedPath: path,
    confidence: Math.random() * 0.3 + 0.65, // 65% - 95% confidence
  };
};

export async function POST(request: Request) {
  try {
    let disaster;
    try {
      disaster = await request.json();
    } catch (jsonError) {
      return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
    }

    if (!disaster || !disaster.location) {
      return NextResponse.json({ error: 'Invalid disaster data provided.' }, { status: 400 });
    }

    const predictivePath = generatePredictivePath(disaster);
    return NextResponse.json(predictivePath);

  } catch (error) {
    console.error('Predictive path API error:', error);
    return NextResponse.json({ error: 'Failed to generate predictive path.' }, { status: 500 });
  }
}
