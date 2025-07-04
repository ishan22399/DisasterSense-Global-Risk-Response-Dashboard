import { NextResponse } from 'next/server';

// Mock function to simulate AI-powered damage assessment
const assessDamage = (disaster: any) => {
  const { lat, lng } = disaster.location;
  const assessment = {
    disasterId: disaster.id,
    heatmap: [],
    summary: {
      totalArea: 0,
      highDamage: 0,
      mediumDamage: 0,
      lowDamage: 0,
    },
  };

  const numPoints = 150;
  let totalArea = 0, high = 0, med = 0, low = 0;

  for (let i = 0; i < numPoints; i++) {
    const pointLat = lat + (Math.random() - 0.5) * 0.2;
    const pointLng = lng + (Math.random() - 0.5) * 0.2;
    const intensity = Math.random(); // 0 to 1, where 1 is high damage
    
    // @ts-ignore
    assessment.heatmap.push([pointLat, pointLng, intensity]);

    const area = Math.random() * 0.5; // sq km
    totalArea += area;
    if (intensity > 0.7) high += area;
    else if (intensity > 0.4) med += area;
    else low += area;
  }

  assessment.summary = {
    totalArea: totalArea,
    highDamage: high,
    mediumDamage: med,
    lowDamage: low,
  };

  return assessment;
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

    const damageAssessment = assessDamage(disaster);
    return NextResponse.json(damageAssessment);

  } catch (error) {
    console.error('Damage assessment API error:', error);
    return NextResponse.json({ error: 'Failed to assess damage.' }, { status: 500 });
  }
}
