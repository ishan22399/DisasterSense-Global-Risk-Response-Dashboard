import { NextResponse } from "next/server"

/**
 * DisasterSense Backend Integration
 * 
 * This endpoint now proxies to the FastAPI backend which:
 * - Runs scheduled ingestion every 10 minutes
 * - Stores data in MongoDB with lifecycle management
 * - Performs geospatial validation and deduplication
 * - Calculates rule-based risk scores
 * - Tracks event lifecycle (CREATED -> UPDATED -> RESOLVED/EXPIRED)
 */

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001'

export async function GET() {
  try {
    // Fetch from our FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/disasters?limit=50`, {
      next: { revalidate: 60 }, // Cache for 1 minute (backend updates every 10 minutes)
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const disasters = await response.json()

    // Transform to match frontend expectations
    const transformedDisasters = disasters.map((event: any) => ({
      id: event.id,
      type: event.type,
      title: event.title,
      location: event.location,
      magnitude: event.magnitude,
      time: event.event_time,
      severity: event.severity,
      affected: event.affected_population,
      source: event.source,
      description: event.description,
      url: event.source_url,
      
      // NEW: Enhanced fields from backend
      lifecycle_state: event.lifecycle_state,
      risk_score: event.risk_score,
      last_updated: event.last_updated,
      detected_time: event.detected_time,
      lifecycle_history: event.lifecycle_history,
      confidence: event.confidence,
      is_duplicate: event.is_duplicate,
      cluster_id: event.cluster_id
    }))

    // Get system health
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`)
    const health = healthResponse.ok ? await healthResponse.json() : null

    // Always return current time as lastUpdated since backend syncs every 1 minute continuously
    // If there's recent ingestion, use that, otherwise use now
    const lastIngestionTime = health?.last_ingestion ? new Date(health.last_ingestion).getTime() : 0
    const now = Date.now()
    const timeSinceLastIngestion = now - lastIngestionTime
    
    // If ingestion was within last 2 minutes, consider it fresh and use current time
    const lastUpdatedTime = timeSinceLastIngestion < 120000 ? new Date().toISOString() : health?.last_ingestion || new Date().toISOString()

    return NextResponse.json({
      success: true,
      disasters: transformedDisasters,
      lastUpdated: lastUpdatedTime,
      sources: ["FastAPI Backend Pipeline", "USGS", "NASA EONET", "OpenWeatherMap"],
      apiStatus: {
        nasa: health?.data_sources?.nasa || false,
        usgs: health?.data_sources?.usgs || false,
        weather: health?.data_sources?.weather || false,
        news: health?.data_sources?.news || false
      },
      count: transformedDisasters.length,
      
      // NEW: Backend system info
      backend_status: {
        healthy: health?.status === 'healthy',
        scheduler_running: health?.scheduler_running || false,
        database_connected: health?.database_connected || false,
        active_events: health?.active_events || 0,
        last_ingestion: health?.last_ingestion
      }
    })
  } catch (error) {
    console.error("Backend API error:", error)
    
    // Fallback to empty state with error message
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch disaster data from backend", 
      disasters: [],
      apiStatus: {
        nasa: false,
        usgs: false,
        weather: false,
        news: false
      },
      count: 0
    }, { status: 500 })
  }
}
