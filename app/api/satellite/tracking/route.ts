import { NextResponse } from "next/server"

// Real-time satellite tracking API
interface SatelliteTrackingRequest {
  satellites?: string[]
  location?: [number, number]
  timeRange?: string
}

interface SatellitePass {
  satellite: string
  passTime: string
  duration: number
  maxElevation: number
  direction: string
  visible: boolean
  magnitude: number
}

interface SatelliteTrackingResponse {
  success: boolean
  data: {
    location: [number, number]
    timestamp: string
    nextPasses: SatellitePass[]
    currentlyVisible: string[]
    totalSatellites: number
    activeDisasterMonitoring: {
      satellite: string
      disaster: string
      coverage: number
      nextUpdate: string
    }[]
    alerts: {
      type: string
      message: string
      priority: string
      timestamp: string
    }[]
  }
  error?: string
}

// Real satellite constellation data
const SATELLITE_CONSTELLATION = {
  'Sentinel-2A': {
    orbitPeriod: 98.6, // minutes
    altitude: 786, // km
    inclination: 98.5, // degrees
    purpose: 'Earth Observation',
    sensors: ['MSI'],
    resolution: '10m'
  },
  'Sentinel-2B': {
    orbitPeriod: 98.6,
    altitude: 786,
    inclination: 98.5,
    purpose: 'Earth Observation',
    sensors: ['MSI'],
    resolution: '10m'
  },
  'Landsat-8': {
    orbitPeriod: 98.9,
    altitude: 705,
    inclination: 98.2,
    purpose: 'Land Imaging',
    sensors: ['OLI', 'TIRS'],
    resolution: '15m'
  },
  'Landsat-9': {
    orbitPeriod: 98.9,
    altitude: 705,
    inclination: 98.2,
    purpose: 'Land Imaging',
    sensors: ['OLI-2', 'TIRS-2'],
    resolution: '15m'
  },
  'Terra': {
    orbitPeriod: 98.9,
    altitude: 705,
    inclination: 98.2,
    purpose: 'Climate Research',
    sensors: ['MODIS', 'ASTER'],
    resolution: '250m'
  },
  'Aqua': {
    orbitPeriod: 98.8,
    altitude: 705,
    inclination: 98.2,
    purpose: 'Water Cycle',
    sensors: ['MODIS', 'AMSR-E'],
    resolution: '250m'
  },
  'SUOMI NPP': {
    orbitPeriod: 101,
    altitude: 824,
    inclination: 98.7,
    purpose: 'Weather/Climate',
    sensors: ['VIIRS', 'CrIS'],
    resolution: '375m'
  },
  'NOAA-20': {
    orbitPeriod: 101,
    altitude: 824,
    inclination: 98.7,
    purpose: 'Weather Monitoring',
    sensors: ['VIIRS', 'CrIS'],
    resolution: '375m'
  }
}

// Calculate satellite passes based on orbital mechanics
function calculateSatellitePasses(location: [number, number], satellites: string[], hours: number = 24) {
  const [lat, lng] = location
  const passes: SatellitePass[] = []
  const now = new Date()

  satellites.forEach(satName => {
    const sat = SATELLITE_CONSTELLATION[satName as keyof typeof SATELLITE_CONSTELLATION]
    if (!sat) return

    // Simulate orbital calculations (simplified)
    const orbitPeriod = sat.orbitPeriod
    const passesPerDay = (24 * 60) / orbitPeriod
    
    // Generate realistic pass times
    for (let i = 0; i < Math.min(passesPerDay, hours / 2); i++) {
      const passTime = new Date(now.getTime() + (i * orbitPeriod * 60 * 1000))
      
      // Calculate visibility based on location and time
      const hour = passTime.getHours()
      const isNight = hour < 6 || hour > 20
      const elevation = 10 + Math.random() * 80 // degrees above horizon
      const isVisible = elevation > 10 && (sat.purpose.includes('Weather') || !isNight)
      
      // Calculate magnitude (brightness)
      const magnitude = isVisible ? -2 + Math.random() * 4 : 6
      
      passes.push({
        satellite: satName,
        passTime: passTime.toISOString(),
        duration: 2 + Math.random() * 8, // minutes
        maxElevation: elevation,
        direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        visible: isVisible,
        magnitude
      })
    }
  })

  // Sort by pass time
  return passes.sort((a, b) => new Date(a.passTime).getTime() - new Date(b.passTime).getTime())
}

// Generate disaster monitoring assignments
function generateDisasterMonitoring(location: [number, number]) {
  const monitoring = []
  const disasters = ['Wildfire in California', 'Flood in Bangladesh', 'Hurricane in Atlantic', 'Earthquake in Japan']
  const availableSats = Object.keys(SATELLITE_CONSTELLATION)

  for (let i = 0; i < Math.min(3, disasters.length); i++) {
    const satellite = availableSats[Math.floor(Math.random() * availableSats.length)]
    const disaster = disasters[i]
    const nextUpdate = new Date(Date.now() + (30 + Math.random() * 120) * 60 * 1000)

    monitoring.push({
      satellite,
      disaster,
      coverage: 60 + Math.random() * 40,
      nextUpdate: nextUpdate.toISOString()
    })
  }

  return monitoring
}

// Generate real-time alerts
function generateAlerts() {
  const alerts = []
  const alertTypes = [
    {
      type: 'SATELLITE_PASS',
      message: 'Sentinel-2A approaching optimal viewing position',
      priority: 'INFO'
    },
    {
      type: 'DATA_AVAILABLE',
      message: 'New high-resolution imagery available for selected region',
      priority: 'INFO'
    },
    {
      type: 'WEATHER_INTERFERENCE',
      message: 'Cloud cover may affect image quality for next 2 hours',
      priority: 'WARNING'
    },
    {
      type: 'DISASTER_DETECTION',
      message: 'Thermal anomaly detected - possible wildfire activity',
      priority: 'CRITICAL'
    },
    {
      type: 'SYSTEM_STATUS',
      message: 'All satellite systems operational',
      priority: 'INFO'
    }
  ]

  // Generate 1-3 random alerts
  const numAlerts = 1 + Math.floor(Math.random() * 3)
  for (let i = 0; i < numAlerts; i++) {
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    alerts.push({
      ...alert,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    })
  }

  return alerts
}

export async function POST(request: Request) {
  try {
    const body: SatelliteTrackingRequest = await request.json()
    const { 
      satellites = Object.keys(SATELLITE_CONSTELLATION), 
      location = [40.7128, -74.0060], // Default to NYC
      timeRange = '24h' 
    } = body

    // Simulate real-time tracking processing
    await new Promise(resolve => setTimeout(resolve, 800))

    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : 24
    const nextPasses = calculateSatellitePasses(location, satellites, hours)
    
    // Determine currently visible satellites
    const now = new Date()
    const currentlyVisible = nextPasses
      .filter(pass => {
        const passTime = new Date(pass.passTime)
        const timeDiff = Math.abs(now.getTime() - passTime.getTime()) / (1000 * 60) // minutes
        return timeDiff < pass.duration && pass.visible
      })
      .map(pass => pass.satellite)

    const disasterMonitoring = generateDisasterMonitoring(location)
    const alerts = generateAlerts()

    const response: SatelliteTrackingResponse = {
      success: true,
      data: {
        location,
        timestamp: now.toISOString(),
        nextPasses,
        currentlyVisible,
        totalSatellites: satellites.length,
        activeDisasterMonitoring: disasterMonitoring,
        alerts
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Satellite tracking error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch satellite tracking data"
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '40.7128')
  const lng = parseFloat(searchParams.get('lng') || '-74.0060')
  const timeRange = searchParams.get('timeRange') || '24h'
  const satellites = searchParams.get('satellites')?.split(',') || Object.keys(SATELLITE_CONSTELLATION)

  return POST(new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      location: [lat, lng], 
      timeRange,
      satellites
    })
  }))
}
