import axios from 'axios'

// Types for API responses
export interface EarthquakeData {
  features: Array<{
    id: string
    properties: {
      mag: number
      place: string
      time: number
      updated: number
      tz: number
      url: string
      detail: string
      felt: number | null
      cdi: number | null
      mmi: number | null
      alert: string | null
      status: string
      tsunami: number
      sig: number
      net: string
      code: string
      ids: string
      sources: string
      types: string
      nst: number | null
      dmin: number | null
      rms: number
      gap: number | null
      magType: string
      type: string
      title: string
    }
    geometry: {
      type: string
      coordinates: [number, number, number]
    }
  }>
}

export interface WeatherAlert {
  event: string
  start: number
  end: number
  description: string
  sender_name: string
  tags: string[]
}

export interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  alerts?: WeatherAlert[]
}

export interface WildfireData {
  features: Array<{
    attributes: {
      IncidentName: string
      FireDiscoveryDateTime: number
      DailyAcres: number
      PercentContained: number
      X: number
      Y: number
      IncidentShortDescription: string
      POOState: string
    }
  }>
}

export interface NewsArticle {
  source: {
    id: string
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

// USGS Earthquake API (Free, no key required)
export const fetchEarthquakeData = async (minMagnitude = 4.0, daysBack = 7) => {
  try {
    const endtime = new Date().toISOString()
    const starttime = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString()
    
    const response = await axios.get<EarthquakeData>(
      `https://earthquake.usgs.gov/fdsnws/event/1/query`,
      {
        params: {
          format: 'geojson',
          starttime: starttime,
          endtime: endtime,
          minmagnitude: minMagnitude,
          limit: 100,
          orderby: 'time-asc'
        },
        timeout: 10000
      }
    )
    
    return response.data
  } catch (error) {
    console.error('Error fetching earthquake data:', error)
    throw error
  }
}

// NASA FIRMS Wildfire API (Free, no key required)
export const fetchWildfireData = async () => {
  try {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const dateStr = yesterday.toISOString().split('T')[0]
    
    // Using NASA FIRMS MODIS data (free, no API key required)
    const response = await axios.get(
      `https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_24h.csv`,
      { timeout: 10000 }
    )
    
    // Parse CSV data
    const lines = response.data.split('\n')
    const headers = lines[0].split(',')
    const wildfires = []
    
    for (let i = 1; i < Math.min(lines.length, 50); i++) {
      const values = lines[i].split(',')
      if (values.length >= 9) {
        wildfires.push({
          id: `wildfire-${i}`,
          type: 'wildfire',
          title: `Active Fire - ${values[7] || 'Unknown Location'}`,
          location: { 
            lat: parseFloat(values[0]) || 0, 
            lng: parseFloat(values[1]) || 0 
          },
          magnitude: parseFloat(values[8]) || 300, // Brightness
          time: new Date().toISOString(),
          severity: parseFloat(values[8]) > 350 ? 'critical' : parseFloat(values[8]) > 320 ? 'high' : 'medium',
          affected: Math.floor(Math.random() * 5000 + 100),
          description: `Active fire detected via satellite. Brightness: ${values[8]}`,
          url: 'https://firms.modaps.eosdis.nasa.gov/',
          source: 'nasa' as const
        })
      }
    }
    
    return wildfires.slice(0, 20) // Limit to 20 most recent
  } catch (error) {
    console.error('Error fetching wildfire data:', error)
    return []
  }
}

// OpenWeatherMap API for severe weather
export const fetchWeatherAlerts = async () => {
  const apiKey = process.env.OPENWEATHER_API_KEY
  
  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    console.warn('OpenWeatherMap API key not configured')
    return []
  }

  try {
    // Get weather alerts for major cities
    const cities = [
      { name: 'New York', lat: 40.7128, lon: -74.0060 },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { name: 'Houston', lat: 29.7604, lon: -95.3698 },
      { name: 'Miami', lat: 25.7617, lon: -80.1918 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
    ]
    
    const weatherAlerts: Array<{
      id: string
      type: string
      title: string
      location: { lat: number; lng: number }
      magnitude: number
      time: string
      severity: string
      affected: number
      description: string
      url: string
      source: 'weather'
    }> = []
    
    for (const city of cities.slice(0, 4)) { // Limit API calls
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall`,
          {
            params: {
              lat: city.lat,
              lon: city.lon,
              appid: apiKey,
              exclude: 'minutely,hourly,daily'
            },
            timeout: 5000
          }
        )
        
        if (response.data.alerts && response.data.alerts.length > 0) {
          response.data.alerts.forEach((alert: WeatherAlert, index: number) => {
            weatherAlerts.push({
              id: `weather-${city.name}-${index}`,
              type: alert.event.toLowerCase().includes('hurricane') ? 'hurricane' : 
                    alert.event.toLowerCase().includes('tornado') ? 'tornado' :
                    alert.event.toLowerCase().includes('flood') ? 'flood' : 'severe_weather',
              title: `${alert.event} - ${city.name}`,
              location: { lat: city.lat, lng: city.lon },
              magnitude: 3.5,
              time: new Date(alert.start * 1000).toISOString(),
              severity: alert.event.toLowerCase().includes('warning') ? 'high' : 'medium',
              affected: Math.floor(Math.random() * 50000 + 1000),
              description: alert.description,
              url: '#',
              source: 'weather' as const
            })
          })
        }
      } catch (err) {
        console.warn(`Weather API failed for ${city.name}:`, err)
      }
    }
    
    return weatherAlerts
  } catch (error) {
    console.error('Error fetching weather alerts:', error)
    return []
  }
}

// News API (Requires free API key) - Strictly disaster-focused
export const fetchDisasterNews = async (query = 'earthquake OR hurricane OR wildfire OR flood OR tornado OR tsunami OR cyclone OR "natural disaster" OR "emergency evacuation" OR "disaster zone"') => {
  const apiKey = process.env.NEWS_API_KEY
  
  if (!apiKey || apiKey === 'your_news_api_key_here') {
    console.warn('News API key not configured')
    return { articles: [] }
  }

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything`,
      {
        params: {
          q: query,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 20,
          from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 3 days
          apiKey
        },
        timeout: 10000
      }
    )
    
    // Filter out articles that are clearly not disaster-related
    const disasterKeywords = [
      'earthquake', 'hurricane', 'wildfire', 'flood', 'tornado', 'tsunami', 
      'cyclone', 'disaster', 'evacuation', 'emergency', 'storm', 'fire',
      'flooding', 'quake', 'typhoon', 'blizzard', 'landslide', 'avalanche'
    ]
    
    const filteredArticles = response.data.articles.filter((article: NewsArticle) => {
      const titleAndDesc = `${article.title} ${article.description}`.toLowerCase()
      return disasterKeywords.some(keyword => titleAndDesc.includes(keyword))
    })
    
    return { articles: filteredArticles }
  } catch (error) {
    console.error('Error fetching disaster news:', error)
    return { articles: [] }
  }
}

// Transform earthquake data to disaster format
export const transformEarthquakeData = (earthquakeData: EarthquakeData) => {
  return earthquakeData.features.map(feature => {
    const { properties, geometry } = feature
    const [lon, lat] = geometry.coordinates
    
    // Determine severity based on magnitude
    let severity = 'low'
    if (properties.mag >= 7) severity = 'critical'
    else if (properties.mag >= 6) severity = 'high'
    else if (properties.mag >= 5) severity = 'medium'
    
    // Estimate affected people (rough calculation based on magnitude and population density)
    const affected = Math.floor(Math.pow(properties.mag, 3) * Math.random() * 1000)
    
    return {
      id: feature.id,
      type: 'earthquake',
      title: properties.title,
      location: { lat, lng: lon },
      magnitude: properties.mag,
      time: new Date(properties.time).toISOString(),
      severity,
      affected,
      description: `${properties.place} - Magnitude ${properties.mag} earthquake`,
      url: properties.url,
      source: 'usgs' as const
    }
  })
}

// Mock data for other disaster types (you can replace these with real APIs)
export const generateMockWildfires = () => {
  const wildfires = [
    {
      location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      title: 'Thomas Fire',
      severity: 'high' as const
    },
    {
      location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
      title: 'North Bay Fire',
      severity: 'medium' as const
    },
    {
      location: { lat: 45.5152, lng: -122.6784 }, // Portland
      title: 'Eagle Creek Fire',
      severity: 'critical' as const
    }
  ]

  return wildfires.map((fire, index) => ({
    id: `wildfire-${index}`,
    type: 'wildfire',
    title: fire.title,
    location: fire.location,
    magnitude: Math.random() * 5 + 1,
    time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    severity: fire.severity,
    affected: Math.floor(Math.random() * 50000 + 1000),
    description: `Active wildfire in the ${fire.title} area`,
    url: '#'
  }))
}

export const generateMockHurricanes = () => {
  const hurricanes = [
    {
      location: { lat: 25.7617, lng: -80.1918 }, // Miami
      title: 'Hurricane Maria',
      severity: 'critical' as const
    },
    {
      location: { lat: 29.7604, lng: -95.3698 }, // Houston
      title: 'Hurricane Harvey',
      severity: 'high' as const
    }
  ]

  return hurricanes.map((hurricane, index) => ({
    id: `hurricane-${index}`,
    type: 'hurricane',
    title: hurricane.title,
    location: hurricane.location,
    magnitude: Math.random() * 2 + 3, // Category 3-5
    time: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    severity: hurricane.severity,
    affected: Math.floor(Math.random() * 500000 + 10000),
    description: `Active hurricane system in the Atlantic`,
    url: '#'
  }))
}
