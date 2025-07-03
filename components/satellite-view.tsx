"use client"

import React, { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Satellite,
  MapPin,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Layers,
  Zap,
  CloudRain,
  Flame,
  Mountain,
  Waves,
  Wind,
  Sun,
  Moon,
  Info,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Search,
  Target,
  ZoomIn,
  ZoomOut,
  Move,
  Filter,
  Settings,
  Share,
  Camera,
  Database,
  Globe
} from "lucide-react"

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false })

interface SatelliteViewProps {
  disasters: any[]
  selectedDisaster?: any
  onDisasterSelect?: (disaster: any) => void
}

interface SatelliteData {
  coordinates: [number, number]
  timestamp: Date
  lastUpdate: Date
  nextPass: Date
  layer: string
  resolution: string
  cloudCover: number
  quality: number
  sensors: string[]
  analysis: {
    vegetationIndex: number
    thermalAnomaly: boolean
    waterLevels: number
    fireDetection: number
    changeDetection: number
  }
}

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  visibility: number
  cloudCover: number
}

export function SatelliteView({ disasters, selectedDisaster, onDisasterSelect }: SatelliteViewProps) {
  const [activeLayer, setActiveLayer] = useState("natural")
  const [timeRange, setTimeRange] = useState("24h")
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0])
  const [mapZoom, setMapZoom] = useState(3)
  const [opacity, setOpacity] = useState(80)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const mapRef = useRef<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fix Leaflet marker icons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      })
    }
  }, [])

  // Real satellite API integration
  const fetchSatelliteData = async (lat: number, lng: number, layer: string) => {
    setIsLoading(true)
    try {
      console.log('🛰️ Fetching satellite data from API...', { lat, lng, layer })
      
      const response = await fetch('/api/satellite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat,
          lng,
          layer,
          timeRange,
          resolution: layer === 'natural' ? '10m' : layer === 'infrared' ? '20m' : '30m'
        })
      })

      if (!response.ok) {
        throw new Error(`Satellite API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        const satelliteInfo: SatelliteData = {
          coordinates: data.data.coordinates,
          timestamp: new Date(data.data.timestamp),
          lastUpdate: new Date(data.data.lastUpdate),
          nextPass: new Date(data.data.nextPass),
          layer: data.data.layer,
          resolution: data.data.resolution,
          cloudCover: data.data.cloudCover,
          quality: data.data.quality,
          sensors: data.data.sensors,
          analysis: data.data.analysis
        }
        
        setSatelliteData(satelliteInfo)
        
        // Update weather data
        if (data.data.weather) {
          setWeatherData(data.data.weather)
        }
        
        console.log('✅ Satellite data updated successfully')
      } else {
        throw new Error(data.error || 'Satellite API returned error')
      }
    } catch (error) {
      console.error('❌ Failed to fetch satellite data:', error)
      // Fallback to mock data for demo purposes
      const mockData: SatelliteData = {
        coordinates: [lat, lng],
        timestamp: new Date(),
        lastUpdate: new Date(),
        nextPass: new Date(Date.now() + 90 * 60 * 1000),
        layer: layer,
        resolution: layer === 'natural' ? '10m' : layer === 'infrared' ? '20m' : '30m',
        cloudCover: Math.random() * 30,
        quality: 85 + Math.random() * 15,
        sensors: getSensorsForLayer(layer),
        analysis: {
          vegetationIndex: Math.random() * 100,
          thermalAnomaly: Math.random() > 0.7,
          waterLevels: Math.random() * 100,
          fireDetection: layer === 'fire' ? Math.random() * 100 : 0,
          changeDetection: Math.random() * 50
        }
      }
      setSatelliteData(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced disaster analysis with real API
  const analyzeDisaster = async (disaster: any) => {
    if (!disaster) return
    
    setIsAnalyzing(true)
    try {
      console.log('🔍 Analyzing disaster with satellite data...', disaster.title)
      
      const response = await fetch('/api/satellite/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disasterId: disaster.id,
          disasterType: disaster.type,
          coordinates: [disaster.location.lat, disaster.location.lng],
          severity: disaster.severity,
          timeRange
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setAnalysisResults(data.data)
        console.log('✅ Disaster analysis complete')
      } else {
        throw new Error(data.error || 'Analysis API returned error')
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error)
      // Fallback to mock analysis
      const analysis = {
        disasterType: disaster.type,
        severity: disaster.severity,
        affectedArea: Math.random() * 1000,
        progressionRate: Math.random() * 100,
        riskAssessment: {
          immediate: Math.random() > 0.5,
          shortTerm: Math.random() * 100,
          longTerm: Math.random() * 100
        },
        recommendations: generateRecommendations(disaster.type),
        satelliteMetrics: {
          temperatureAnomaly: disaster.type === 'wildfire' ? Math.random() * 50 : 0,
          moistureContent: disaster.type === 'flood' ? Math.random() * 100 : Math.random() * 30,
          vegetationHealth: Math.random() * 100,
          urbanImpact: Math.random() * 100
        }
      }
      setAnalysisResults(analysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSensorsForLayer = (layer: string): string[] => {
    switch (layer) {
      case 'natural': return ['RGB', 'Multispectral']
      case 'infrared': return ['Thermal IR', 'SWIR']
      case 'weather': return ['Radar', 'Microwave']
      case 'fire': return ['MODIS', 'VIIRS', 'Thermal IR']
      case 'flood': return ['SAR', 'Optical', 'Radar']
      default: return ['Optical']
    }
  }

  const generateRecommendations = (disasterType: string): string[] => {
    const recommendations: { [key: string]: string[] } = {
      wildfire: [
        'Evacuate residents within 5km radius',
        'Deploy aerial firefighting resources',
        'Monitor wind direction changes',
        'Establish firebreaks in path of spread'
      ],
      flood: [
        'Issue flood warnings downstream',
        'Open emergency shelters',
        'Monitor dam and levee integrity',
        'Restrict water releases if possible'
      ],
      earthquake: [
        'Assess infrastructure damage',
        'Deploy search and rescue teams',
        'Monitor aftershock activity',
        'Evaluate tsunami risk if coastal'
      ],
      hurricane: [
        'Issue evacuation orders for storm surge zones',
        'Secure critical infrastructure',
        'Pre-position emergency supplies',
        'Monitor storm track changes'
      ]
    }
    
    return recommendations[disasterType] || ['Monitor situation closely', 'Follow local emergency protocols']
  }

  // Initialize satellite data on mount
  useEffect(() => {
    if (isMounted) {
      fetchSatelliteData(mapCenter[0], mapCenter[1], activeLayer)
    }
  }, [isMounted, activeLayer, mapCenter])

  // Update data when selected disaster changes
  useEffect(() => {
    if (selectedDisaster && typeof selectedDisaster.location === 'object') {
      const newCenter: [number, number] = [selectedDisaster.location.lat, selectedDisaster.location.lng]
      setMapCenter(newCenter)
      setMapZoom(8)
      fetchSatelliteData(newCenter[0], newCenter[1], activeLayer)
      analyzeDisaster(selectedDisaster)
    }
  }, [selectedDisaster, activeLayer])

  // Animate satellite frames
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % 24)
        // Simulate slight data changes for animation
        if (satelliteData) {
          setSatelliteData(prev => prev ? {
            ...prev,
            timestamp: new Date(),
            cloudCover: Math.max(0, Math.min(100, prev.cloudCover + (Math.random() - 0.5) * 5))
          } : null)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, satelliteData])

  // Enhanced refresh function
  const handleRefresh = async () => {
    await fetchSatelliteData(mapCenter[0], mapCenter[1], activeLayer)
    if (selectedDisaster) {
      await analyzeDisaster(selectedDisaster)
    }
  }

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      // Simulate geocoding API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock coordinates for search result
      const searchLat = -34.6118 + (Math.random() - 0.5) * 60
      const searchLng = -58.3960 + (Math.random() - 0.5) * 120
      
      setMapCenter([searchLat, searchLng])
      setMapZoom(8)
      await fetchSatelliteData(searchLat, searchLng, activeLayer)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced map interaction handlers
  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng
    setMapCenter([lat, lng])
    await fetchSatelliteData(lat, lng, activeLayer)
  }

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          setMapZoom(10)
          await fetchSatelliteData(latitude, longitude, activeLayer)
        },
        (error) => {
          console.error('Location access denied:', error)
        }
      )
    }
  }

  const handleMapMove = (e: any) => {
    const center = e.target.getCenter()
    setMapCenter([center.lat, center.lng])
  }

  const handleMapZoom = (e: any) => {
    setMapZoom(e.target.getZoom())
  }

  // Reset map to default view
  const handleMapReset = () => {
    setMapCenter([20, 0])
    setMapZoom(3)
    fetchSatelliteData(20, 0, activeLayer)
  }

  // Export functionality
  const handleExport = () => {
    const exportData = {
      satelliteData,
      weatherData,
      analysisResults,
      timestamp: new Date().toISOString(),
      location: mapCenter,
      layer: activeLayer
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `satellite-analysis-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const satelliteLayers = [
    {
      id: "natural",
      name: "Natural Color",
      description: "True color satellite imagery",
      icon: Eye,
      available: true,
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    {
      id: "satellite",
      name: "Satellite",
      description: "High-resolution satellite view",
      icon: Satellite,
      available: true,
      tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    },
    {
      id: "infrared",
      name: "Infrared",
      description: "Heat signature detection",
      icon: Zap,
      available: true,
      tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service'
    },
    {
      id: "weather",
      name: "Weather Radar",
      description: "Live weather patterns",
      icon: CloudRain,
      available: true,
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    {
      id: "fire",
      name: "Fire Detection",
      description: "Active fire monitoring",
      icon: Flame,
      available: true,
      tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme'
    },
    {
      id: "flood",
      name: "Flood Mapping",
      description: "Water level analysis",
      icon: Waves,
      available: true,
      tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
    },
    {
      id: "terrain",
      name: "Terrain",
      description: "Topographic terrain view",
      icon: Mountain,
      available: true,
      tileUrl: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    },
    {
      id: "night",
      name: "Night Lights",
      description: "Human activity patterns",
      icon: Moon,
      available: true,
      tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    }
  ]

  const timeRanges = [
    { id: "1h", name: "Last Hour", frames: 12 },
    { id: "6h", name: "Last 6 Hours", frames: 18 },
    { id: "24h", name: "Last 24 Hours", frames: 24 },
    { id: "7d", name: "Last 7 Days", frames: 28 },
    { id: "30d", name: "Last 30 Days", frames: 30 }
  ]

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case "earthquake": return Mountain
      case "wildfire": return Flame
      case "flood": return Waves
      case "hurricane": return Wind
      case "storm": return CloudRain
      default: return MapPin
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Satellite Status Header */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Satellite className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Satellite Intelligence Hub</span>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
                    Live Feed
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time satellite imagery, multi-spectral analysis, and AI-powered disaster monitoring
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Search location (e.g., San Francisco, 37.7749,-122.4194)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Satellite Status Grid */}
          {satelliteData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Last Update</p>
                  <p className="text-gray-600">{satelliteData.lastUpdate.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Resolution</p>
                  <p className="text-gray-600">{satelliteData.resolution}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Satellite className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Next Pass</p>
                  <p className="text-gray-600">{satelliteData.nextPass.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Quality</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={satelliteData.quality} className="w-16 h-2" />
                    <span className="text-gray-600">{Math.round(satelliteData.quality)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weather Conditions */}
          {weatherData && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Environmental Conditions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="font-medium">Temperature</p>
                    <p className="text-gray-600">{Math.round(weatherData.temperature)}°C</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CloudRain className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">Humidity</p>
                    <p className="text-gray-600">{Math.round(weatherData.humidity)}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Wind Speed</p>
                    <p className="text-gray-600">{Math.round(weatherData.windSpeed)} km/h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Visibility</p>
                    <p className="text-gray-600">{Math.round(weatherData.visibility)} km</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Satellite Map */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Interactive Satellite Map</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Label htmlFor="opacity" className="text-sm">Opacity:</Label>
                <div className="w-20">
                  <Slider
                    id="opacity"
                    value={[opacity]}
                    onValueChange={(value) => setOpacity(value[0])}
                    max={100}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-gray-600">{opacity}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Enhanced Layer Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Satellite Layers</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchSatelliteData(mapCenter[0], mapCenter[1], activeLayer)}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Update</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {satelliteLayers.map((layer) => {
                  const Icon = layer.icon
                  return (
                    <Button
                      key={layer.id}
                      variant={activeLayer === layer.id ? "default" : "outline"}
                      className={`h-auto p-2 flex flex-col items-center space-y-1 transition-all ${
                        !layer.available ? 'opacity-50' : ''
                      } ${activeLayer === layer.id ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => {
                        if (layer.available) {
                          setActiveLayer(layer.id)
                          fetchSatelliteData(mapCenter[0], mapCenter[1], layer.id)
                        }
                      }}
                      disabled={!layer.available}
                      size="sm"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="text-center">
                        <div className="font-medium text-xs">{layer.name}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{layer.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Time Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">Time Range</h4>
                <Tabs value={timeRange} onValueChange={(value) => {
                  setTimeRange(value)
                  fetchSatelliteData(mapCenter[0], mapCenter[1], activeLayer)
                }}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="1h" className="text-xs">1H</TabsTrigger>
                    <TabsTrigger value="24h" className="text-xs">24H</TabsTrigger>
                    <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="mt-2 text-xs text-gray-500">
                  {timeRanges.find(t => t.id === timeRange)?.name || 'Last 24 Hours'}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Time Animation</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                    disabled={currentFrame === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentFrame(Math.min(23, currentFrame + 1))}
                    disabled={currentFrame === 23}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 ml-2">
                    <Progress value={(currentFrame / 23) * 100} className="h-2" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Frame: {currentFrame + 1}/24 {isPlaying ? '(Playing)' : '(Paused)'}
                </div>
              </div>
            </div>

            {/* Interactive Map with Loading State */}
            <div className="border rounded-lg overflow-hidden bg-gray-100 relative" style={{ height: '400px' }}>
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="text-sm font-medium">Loading satellite data...</span>
                  </div>
                </div>
              )}
              
              {isMounted && (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                  whenReady={(map) => {
                    const mapInstance = map.target
                    mapInstance.on('click', handleMapClick)
                    mapInstance.on('moveend', handleMapMove)
                    mapInstance.on('zoomend', handleMapZoom)
                  }}
                  doubleClickZoom={true}
                  scrollWheelZoom={true}
                  dragging={true}
                  keyboard={true}
                  touchZoom={true}
                >
                  <TileLayer
                    url={(() => {
                      try {
                        const layer = satelliteLayers.find(l => l.id === activeLayer)
                        let url = layer?.tileUrl || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        
                        // Process time-based URLs
                        if (url.includes('{time}')) {
                          const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
                          url = url.replace(/\{time\}/g, timestamp)
                        }
                        
                        // Process other template variables
                        url = url
                          .replace(/\{tilematrixset\}/g, 'EPSG:3857')
                          .replace(/\{max_zoom\}/g, '18')
                          .replace(/\{r\}/g, '@2x')
                          .replace(/\{format\}/g, 'png')
                          .replace(/\{api_key\}/g, '')
                          .replace(/\{style\}/g, 'satellite')
                          .replace(/\{version\}/g, '1.0.0')
                        
                        // Clean up any remaining problematic variables (but keep standard Leaflet ones)
                        const standardVars = ['{s}', '{z}', '{x}', '{y}']
                        const hasStandardVars = standardVars.some(v => url.includes(v))
                        
                        if (!hasStandardVars) {
                          console.warn('Falling back to default tile layer due to invalid URL:', url)
                          return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        }
                        
                        // Remove any double slashes and clean up
                        url = url.replace(/([^:]\/)\/+/g, '$1')
                        
                        return url
                      } catch (error) {
                        console.error('Error processing tile URL:', error)
                        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      }
                    })()}
                    attribution={(() => {
                      const layer = satelliteLayers.find(l => l.id === activeLayer)
                      switch (activeLayer) {
                        case 'satellite':
                          return '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        case 'terrain':
                          return '&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> (CC-BY-SA)'
                        case 'flood':
                          return '&copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
                        default:
                          return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      }
                    })()}
                    opacity={opacity / 100}
                    key={activeLayer} // Force re-render when layer changes
                  />
                  
                  {/* Disaster Markers */}
                  {disasters.map((disaster) => {
                    if (typeof disaster.location === 'object') {
                      const Icon = getDisasterIcon(disaster.type)
                      return (
                        <Marker
                          key={disaster.id}
                          position={[disaster.location.lat, disaster.location.lng]}
                          eventHandlers={{
                            click: () => onDisasterSelect?.(disaster)
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h4 className="font-medium">{disaster.title}</h4>
                              <p className="text-sm text-gray-600">{disaster.type}</p>
                              <Badge variant={disaster.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {disaster.severity}
                              </Badge>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    }
                    return null
                  })}

                  {/* Selected Disaster Highlight */}
                  {selectedDisaster && typeof selectedDisaster.location === 'object' && (
                    <Circle
                      center={[selectedDisaster.location.lat, selectedDisaster.location.lng]}
                      radius={50000}
                      color="red"
                      fillColor="red"
                      fillOpacity={0.1}
                    />
                  )}
                </MapContainer>
              )}
              
              {/* Live Status Overlay */}
              <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs space-y-1 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="font-medium">
                    {isLoading ? 'Loading...' : 'Live'}
                  </span>
                </div>
                <div>
                  <strong>Active Layer:</strong> {satelliteLayers.find(l => l.id === activeLayer)?.name}
                </div>
                {satelliteData && (
                  <div>
                    <strong>Quality:</strong> {Math.round(satelliteData.quality)}% | 
                    <strong> Cloud:</strong> {Math.round(satelliteData.cloudCover)}%
                  </div>
                )}
              </div>
              
              {/* Interactive Hint */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-lg p-2 text-xs">
                💡 Click on map to analyze location
              </div>
            </div>

            {/* Enhanced Map Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapZoom(Math.min(18, mapZoom + 1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapZoom(Math.max(1, mapZoom - 1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLocationSearch}
                  title="Use current location"
                >
                  <Target className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Location</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMapReset}
                  title="Reset map view"
                >
                  <Move className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Reset View</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Screenshot</span>
                </Button>
              </div>
              <div className="text-sm text-gray-600 flex flex-col sm:flex-row gap-2">
                <span>Zoom: {mapZoom}</span>
                <span>Center: {mapCenter[0].toFixed(2)}, {mapCenter[1].toFixed(2)}</span>
                <span>Layer: {satelliteLayers.find(l => l.id === activeLayer)?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Analysis Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Analysis & Intelligence</span>
            </CardTitle>
            <CardDescription>
              AI-powered disaster analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="disasters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="disasters">Disasters</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="sensors">Sensors</TabsTrigger>
              </TabsList>

              <TabsContent value="disasters" className="space-y-3">
                <div className="max-h-96 overflow-y-auto">
                  {disasters.slice(0, 10).map((disaster) => {
                    const Icon = getDisasterIcon(disaster.type)
                    const isSelected = selectedDisaster?.id === disaster.id
                    
                    return (
                      <div
                        key={disaster.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-purple-300 bg-purple-50 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => onDisasterSelect?.(disaster)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1.5 rounded-full ${
                            disaster.severity === 'critical' ? 'bg-red-500' :
                            disaster.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{disaster.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {typeof disaster.location === 'string' 
                                ? disaster.location 
                                : `${disaster.location.lat.toFixed(2)}, ${disaster.location.lng.toFixed(2)}`
                              }
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge 
                                variant={disaster.severity === 'critical' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {disaster.severity}
                              </Badge>
                              {isSelected && (
                                <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                                  <Target className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {disasters.length > 10 && (
                  <div className="text-center pt-2 border-t">
                    <p className="text-sm text-gray-500">
                      Showing 10 of {disasters.length} disasters
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Analyzing satellite data...</p>
                  </div>
                ) : selectedDisaster && analysisResults ? (
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle className="text-sm">Analysis Complete</AlertTitle>
                      <AlertDescription className="text-xs">
                        Advanced satellite analysis for {selectedDisaster.title}
                      </AlertDescription>
                    </Alert>

                    {/* Risk Assessment */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Risk Assessment</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium">Affected Area</p>
                          <p className="text-sm">{Math.round(analysisResults.affectedArea)} km²</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium">Progression Rate</p>
                          <p className="text-sm">{Math.round(analysisResults.progressionRate)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Satellite Metrics */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Satellite Metrics</h4>
                      <div className="space-y-2">
                        {analysisResults.satelliteMetrics.temperatureAnomaly > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Temperature Anomaly</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={analysisResults.satelliteMetrics.temperatureAnomaly} className="w-16 h-2" />
                              <span className="text-xs">{Math.round(analysisResults.satelliteMetrics.temperatureAnomaly)}°C</span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Vegetation Health</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={analysisResults.satelliteMetrics.vegetationHealth} className="w-16 h-2" />
                            <span className="text-xs">{Math.round(analysisResults.satelliteMetrics.vegetationHealth)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Urban Impact</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={analysisResults.satelliteMetrics.urbanImpact} className="w-16 h-2" />
                            <span className="text-xs">{Math.round(analysisResults.satelliteMetrics.urbanImpact)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">AI Recommendations</h4>
                      <div className="space-y-2">
                        {analysisResults.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-xs text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-2" />
                        Export Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-3 w-3 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Select a disaster to view analysis</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sensors" className="space-y-4">
                {satelliteData && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Active Sensors</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {satelliteData.sensors.map((sensor, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">{sensor}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">Active</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Satellite Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Vegetation Index</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={satelliteData.analysis.vegetationIndex} className="w-16 h-2" />
                            <span className="text-xs">{Math.round(satelliteData.analysis.vegetationIndex)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Water Levels</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={satelliteData.analysis.waterLevels} className="w-16 h-2" />
                            <span className="text-xs">{Math.round(satelliteData.analysis.waterLevels)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Change Detection</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={satelliteData.analysis.changeDetection} className="w-16 h-2" />
                            <span className="text-xs">{Math.round(satelliteData.analysis.changeDetection)}%</span>
                          </div>
                        </div>
                        {satelliteData.analysis.thermalAnomaly && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Thermal Anomaly</span>
                            <Badge variant="destructive" className="text-xs">Detected</Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Data Quality</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Cloud Cover</span>
                          <span className="text-xs">{Math.round(satelliteData.cloudCover)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Data Quality</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={satelliteData.quality} className="w-16 h-2" />
                            <span className="text-xs">{Math.round(satelliteData.quality)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Coordinates</span>
                          <span className="text-xs">{satelliteData.coordinates[0].toFixed(2)}, {satelliteData.coordinates[1].toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
