import { NextResponse } from "next/server"

interface DisasterAnalysisRequest {
  disasterId: string
  disasterType: string
  coordinates: [number, number]
  severity: string
  timeRange: string
}

interface DisasterAnalysisResponse {
  success: boolean
  data: {
    disasterType: string
    severity: string
    affectedArea: number
    progressionRate: number
    riskAssessment: {
      immediate: boolean
      shortTerm: number
      longTerm: number
      evacuationRadius: number
      resourcesNeeded: string[]
    }
    recommendations: string[]
    satelliteMetrics: {
      temperatureAnomaly: number
      moistureContent: number
      vegetationHealth: number
      urbanImpact: number
      soilMoisture: number
      airQuality: number
      smokeDetection: number
      floodExtent: number
    }
    timeSeriesData: {
      timestamp: string
      severity: number
      spread: number
      intensity: number
    }[]
    impactAssessment: {
      populationAtRisk: number
      infrastructureImpact: number
      economicLoss: number
      environmentalDamage: number
      recoveryTime: number
    }
    emergencyActions: {
      priority: string
      action: string
      timeframe: string
      resources: string[]
    }[]
  }
  error?: string
}

// Disaster-specific analysis algorithms
const DISASTER_ANALYSIS = {
  wildfire: {
    temperatureThreshold: 40,
    spreadRate: 0.5, // km/hour
    fuelMoisture: 15,
    criticalWindSpeed: 25,
    evacuationRadius: 10,
    recoveryMultiplier: 2
  },
  flood: {
    waterLevelThreshold: 2, // meters
    spreadRate: 5, // km/hour
    criticalRainfall: 50, // mm/hour
    evacuationRadius: 5,
    recoveryMultiplier: 1.5
  },
  earthquake: {
    aftershockProbability: 0.1,
    structuralDamageRadius: 50,
    tsunamiRisk: 0.3,
    evacuationRadius: 20,
    recoveryMultiplier: 3
  },
  hurricane: {
    windSpeedThreshold: 119, // km/h
    stormSurgeHeight: 3,
    evacuationRadius: 100,
    recoveryMultiplier: 2.5
  },
  storm: {
    windSpeedThreshold: 88, // km/h
    stormSurgeHeight: 1.5,
    evacuationRadius: 50,
    recoveryMultiplier: 1.8
  },
  tornado: {
    windSpeedThreshold: 200, // km/h
    pathWidth: 1, // km
    evacuationRadius: 25,
    recoveryMultiplier: 2.2
  },
  volcano: {
    ashRadius: 200, // km
    lavaRadius: 50, // km
    evacuationRadius: 30,
    recoveryMultiplier: 4
  },
  drought: {
    rainfallDeficit: 75, // percentage
    durationMonths: 6,
    evacuationRadius: 0,
    recoveryMultiplier: 3
  },
  heatwave: {
    temperatureThreshold: 40, // celsius
    durationDays: 5,
    evacuationRadius: 0,
    recoveryMultiplier: 1.2
  },
  landslide: {
    slopeAngle: 30, // degrees
    soilMoisture: 80, // percentage
    evacuationRadius: 10,
    recoveryMultiplier: 2.5
  }
}

function generateDisasterAnalysis(disasterType: string, coordinates: [number, number], severity: string) {
  const [lat, lng] = coordinates
  const config = DISASTER_ANALYSIS[disasterType as keyof typeof DISASTER_ANALYSIS]
  
  if (!config) {
    throw new Error(`Unsupported disaster type: ${disasterType}`)
  }

  const severityMultiplier = severity === 'critical' ? 3 : severity === 'high' ? 2 : 1
  const isCoastal = Math.abs(lat) < 60 && Math.random() > 0.7
  const isUrban = Math.random() > 0.6

  const affectedArea = (50 + Math.random() * 200) * severityMultiplier
  const progressionRate = (20 + Math.random() * 60) * severityMultiplier

  // Generate realistic metrics based on disaster type
  let satelliteMetrics = {
    temperatureAnomaly: 0,
    moistureContent: 50 + Math.random() * 30,
    vegetationHealth: 60 + Math.random() * 40,
    urbanImpact: isUrban ? 30 + Math.random() * 50 : 10 + Math.random() * 20,
    soilMoisture: 40 + Math.random() * 40,
    airQuality: 60 + Math.random() * 40,
    smokeDetection: 0,
    floodExtent: 0
  }

  // Disaster-specific adjustments
  switch (disasterType) {
    case 'wildfire':
      satelliteMetrics.temperatureAnomaly = 30 + Math.random() * 50
      satelliteMetrics.smokeDetection = 40 + Math.random() * 60
      satelliteMetrics.vegetationHealth = Math.max(0, satelliteMetrics.vegetationHealth - 40)
      satelliteMetrics.airQuality = Math.max(0, satelliteMetrics.airQuality - 30)
      satelliteMetrics.soilMoisture = Math.max(0, satelliteMetrics.soilMoisture - 30)
      break
    case 'flood':
      satelliteMetrics.floodExtent = 20 + Math.random() * 70
      satelliteMetrics.soilMoisture = Math.min(100, satelliteMetrics.soilMoisture + 40)
      satelliteMetrics.moistureContent = Math.min(100, satelliteMetrics.moistureContent + 30)
      break
    case 'earthquake':
      satelliteMetrics.urbanImpact = Math.min(100, satelliteMetrics.urbanImpact + 40)
      break
    case 'hurricane':
    case 'storm':
      satelliteMetrics.moistureContent = Math.min(100, satelliteMetrics.moistureContent + 20)
      if (isCoastal) satelliteMetrics.floodExtent = 30 + Math.random() * 50
      break
    case 'tornado':
      satelliteMetrics.urbanImpact = Math.min(100, satelliteMetrics.urbanImpact + 30)
      satelliteMetrics.temperatureAnomaly = 5 + Math.random() * 15
      break
    case 'volcano':
      satelliteMetrics.temperatureAnomaly = 50 + Math.random() * 50
      satelliteMetrics.smokeDetection = 60 + Math.random() * 40
      satelliteMetrics.airQuality = Math.max(0, satelliteMetrics.airQuality - 50)
      break
    case 'drought':
      satelliteMetrics.vegetationHealth = Math.max(0, satelliteMetrics.vegetationHealth - 50)
      satelliteMetrics.soilMoisture = Math.max(0, satelliteMetrics.soilMoisture - 60)
      satelliteMetrics.moistureContent = Math.max(0, satelliteMetrics.moistureContent - 40)
      break
    case 'heatwave':
      satelliteMetrics.temperatureAnomaly = 20 + Math.random() * 30
      satelliteMetrics.vegetationHealth = Math.max(0, satelliteMetrics.vegetationHealth - 20)
      break
    case 'landslide':
      satelliteMetrics.soilMoisture = Math.min(100, satelliteMetrics.soilMoisture + 30)
      satelliteMetrics.vegetationHealth = Math.max(0, satelliteMetrics.vegetationHealth - 30)
      break
  }

  return {
    affectedArea,
    progressionRate,
    satelliteMetrics,
    evacuationRadius: config.evacuationRadius * severityMultiplier,
    recoveryTime: (30 + Math.random() * 90) * config.recoveryMultiplier
  }
}

function generateRecommendations(disasterType: string, severity: string, isCoastal: boolean, isUrban: boolean) {
  const baseRecommendations: { [key: string]: string[] } = {
    wildfire: [
      "Establish firebreaks and defensible space around structures",
      "Deploy aerial firefighting resources immediately",
      "Monitor wind patterns and weather conditions closely",
      "Evacuate residents within high-risk zones",
      "Coordinate with local fire departments and emergency services"
    ],
    flood: [
      "Issue flood warnings for downstream areas",
      "Open emergency shelters and evacuation centers",
      "Monitor dam and levee integrity continuously",
      "Restrict water releases from upstream reservoirs",
      "Deploy swift-water rescue teams to affected areas"
    ],
    earthquake: [
      "Conduct rapid structural assessments of buildings",
      "Deploy urban search and rescue teams",
      "Monitor aftershock activity and seismic sensors",
      "Evaluate tsunami risk for coastal areas",
      "Establish emergency communication networks"
    ],
    hurricane: [
      "Issue evacuation orders for storm surge zones",
      "Secure critical infrastructure and power systems",
      "Pre-position emergency supplies and equipment",
      "Monitor storm track and intensity changes",
      "Coordinate with National Hurricane Center"
    ],
    storm: [
      "Issue severe weather warnings and watches",
      "Secure outdoor objects and equipment",
      "Monitor for potential flooding and wind damage",
      "Prepare emergency shelters for displaced residents",
      "Coordinate with local emergency management"
    ],
    tornado: [
      "Issue tornado warnings for affected areas",
      "Direct residents to safe rooms or basements",
      "Monitor storm spotter reports and radar",
      "Prepare for rapid search and rescue operations",
      "Assess damage and structural integrity post-event"
    ],
    volcano: [
      "Establish evacuation zones around volcanic activity",
      "Monitor seismic activity and gas emissions",
      "Issue ash fall warnings for downwind areas",
      "Protect water supplies from ash contamination",
      "Coordinate with volcanological observatories"
    ],
    drought: [
      "Implement water conservation measures",
      "Monitor agricultural and livestock conditions",
      "Provide alternative water sources for communities",
      "Support affected farming and ranching operations",
      "Monitor wildfire risk in affected areas"
    ],
    heatwave: [
      "Open cooling centers for vulnerable populations",
      "Issue heat safety warnings and advisories",
      "Monitor elderly and at-risk individuals",
      "Increase emergency medical service readiness",
      "Implement energy conservation to prevent blackouts"
    ],
    landslide: [
      "Evacuate areas at risk of slope failure",
      "Monitor rainfall and soil saturation levels",
      "Inspect and reinforce vulnerable infrastructure",
      "Establish alternative transportation routes",
      "Deploy geotechnical assessment teams"
    ]
  }

  let recommendations = baseRecommendations[disasterType] || [
    "Monitor situation closely and follow emergency protocols",
    "Coordinate with local emergency management officials",
    "Keep emergency supplies and communication devices ready",
    "Stay informed through official channels and weather services"
  ]
  
  // Add severity-specific recommendations
  if (severity === 'critical') {
    recommendations.push("Activate state-level emergency response protocols")
    recommendations.push("Request federal disaster assistance")
  }
  
  if (isCoastal) {
    recommendations.push("Monitor coastal flood warnings and tide levels")
  }
  
  if (isUrban) {
    recommendations.push("Coordinate with urban emergency management systems")
  }

  return recommendations
}

function generateEmergencyActions(disasterType: string, severity: string) {
  const actions = [
    {
      priority: "Immediate",
      action: "Activate Emergency Operations Center",
      timeframe: "0-1 hours",
      resources: ["Emergency Personnel", "Communication Systems"]
    },
    {
      priority: "High",
      action: "Deploy first responders to affected areas",
      timeframe: "1-3 hours",
      resources: ["Fire Department", "Police", "EMS"]
    },
    {
      priority: "Medium",
      action: "Establish public information center",
      timeframe: "3-6 hours",
      resources: ["Media Relations", "Public Information Officers"]
    }
  ]

  if (severity === 'critical') {
    actions.unshift({
      priority: "Critical",
      action: "Issue emergency evacuation orders",
      timeframe: "Immediate",
      resources: ["Emergency Alert System", "Law Enforcement"]
    })
  }

  return actions
}

function generateTimeSeriesData(disasterType: string, timeRange: string) {
  const frames = timeRange === '1h' ? 12 : timeRange === '6h' ? 18 : 24
  const data = []

  for (let i = 0; i < frames; i++) {
    const timestamp = new Date(Date.now() - (frames - i) * 60 * 60 * 1000).toISOString()
    
    // Simulate progression over time
    const timeProgress = i / frames
    const severity = Math.min(100, 20 + timeProgress * 60 + Math.random() * 20)
    const spread = Math.min(100, 10 + timeProgress * 70 + Math.random() * 15)
    const intensity = Math.min(100, 30 + timeProgress * 50 + Math.random() * 25)

    data.push({
      timestamp,
      severity,
      spread,
      intensity
    })
  }

  return data
}

export async function POST(request: Request) {
  try {
    const body: DisasterAnalysisRequest = await request.json()
    const { disasterId, disasterType, coordinates, severity, timeRange } = body

    // Validate input
    if (!disasterId || !disasterType || !coordinates || !severity) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields"
      }, { status: 400 })
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500))

    const [lat, lng] = coordinates
    const isCoastal = Math.abs(lat) < 60 && Math.random() > 0.7
    const isUrban = Math.random() > 0.6

    // Generate comprehensive analysis
    const analysis = generateDisasterAnalysis(disasterType, coordinates, severity)
    const recommendations = generateRecommendations(disasterType, severity, isCoastal, isUrban)
    const emergencyActions = generateEmergencyActions(disasterType, severity)
    const timeSeriesData = generateTimeSeriesData(disasterType, timeRange)

    const response: DisasterAnalysisResponse = {
      success: true,
      data: {
        disasterType,
        severity,
        affectedArea: analysis.affectedArea,
        progressionRate: analysis.progressionRate,
        riskAssessment: {
          immediate: severity === 'critical',
          shortTerm: Math.min(100, analysis.progressionRate + 20),
          longTerm: Math.min(100, analysis.progressionRate + 40),
          evacuationRadius: analysis.evacuationRadius,
          resourcesNeeded: [
            "Emergency Personnel",
            "Medical Teams",
            "Search & Rescue",
            "Heavy Equipment",
            "Communication Systems"
          ]
        },
        recommendations,
        satelliteMetrics: analysis.satelliteMetrics,
        timeSeriesData,
        impactAssessment: {
          populationAtRisk: Math.round(analysis.affectedArea * (isUrban ? 1000 : 100)),
          infrastructureImpact: Math.round(analysis.satelliteMetrics.urbanImpact),
          economicLoss: Math.round(analysis.affectedArea * 1000000), // $1M per km²
          environmentalDamage: Math.round(100 - analysis.satelliteMetrics.vegetationHealth),
          recoveryTime: Math.round(analysis.recoveryTime)
        },
        emergencyActions
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Disaster analysis error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to analyze disaster"
    }, { status: 500 })
  }
}
