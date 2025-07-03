"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mountain, Flame, Waves, Cloud, RefreshCw, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorBoundary, MapErrorFallback } from "./error-boundary"

interface Disaster {
  id: string
  type: string
  title: string
  location: { lat: number; lng: number }
  magnitude: number
  time: string
  severity: string
  affected: number
  description?: string
  url?: string
  source: 'usgs' | 'news' | 'weather' | 'nasa'
}

interface DisasterMapProps {
  disasters: Disaster[]
  onRefresh?: () => void
  isLoading?: boolean
  selectedDisaster?: Disaster | null
  onDisasterSelect?: (disaster: Disaster) => void
  isVisible?: boolean
}

// Simple map component that loads Leaflet dynamically
function InteractiveMap({ disasters, onDisasterClick, getSeverityColor, selectedDisaster, isVisible, mapLayer }: {
  disasters: Disaster[]
  onDisasterClick: (disaster: Disaster) => void
  getSeverityColor: (severity: string) => string
  selectedDisaster?: Disaster | null
  isVisible?: boolean
  mapLayer: string
}) {
  const [isClient, setIsClient] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [L, setL] = useState<any>(null)

  const mapLayers = [
    { id: "street", name: "Street View", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
    { id: "satellite", name: "Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
    { id: "terrain", name: "Terrain", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" },
    { id: "dark", name: "Dark Mode", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" }
  ]

  const [mapContainerId, setMapContainerId] = useState<string>('')

  useEffect(() => {
    setIsClient(true)
    setMapContainerId(`disaster-map-${Math.random().toString(36).substr(2, 9)}`)
  }, [])

  useEffect(() => {
    if (!isClient || !isVisible || !mapContainerId) return

    // Add a delay to ensure DOM is ready and tab is visible
    const timeoutId = setTimeout(() => {
      loadMap()
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [isClient, isVisible, mapContainerId])

  // Separate effect for updating markers when disasters change
  useEffect(() => {
    if (!map || !isVisible) return
    updateMapMarkers()
  }, [disasters, map, isVisible])

  // Effect to reload map when layer changes
  useEffect(() => {
    if (map && isVisible) {
      loadMap()
    }
  }, [mapLayer])

  const loadMap = async () => {
    try {
      // Check if container exists first
      const mapContainer = document.getElementById(mapContainerId)
      if (!mapContainer || !mapContainerId) {
        console.warn('Map container not found, retrying...')
        setTimeout(() => loadMap(), 200)
        return
      }

      // Clear any existing map instance first
      if (map) {
        try {
          map.remove()
        } catch (e) {
          console.warn('Error removing existing map:', e)
        }
        setMap(null)
        setMarkers([])
      }

      // Clear the container innerHTML to ensure clean state
      mapContainer.innerHTML = ''

      // Dynamic import of Leaflet with better error handling
      const leafletModule = await import('leaflet')
      const L = leafletModule.default

      // Load CSS via link tag with error handling
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.onerror = () => console.warn('Failed to load Leaflet CSS')
        document.head.appendChild(link)
      }

      // Fix for default markers in Leaflet
      try {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })
      } catch (iconError) {
        console.warn('Error setting up Leaflet icons:', iconError)
      }

      // Clear container
      mapContainer.innerHTML = ''

      // Initialize map
      const mapInstance = L.map(mapContainerId, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      // Get current layer URL
      const currentLayer = mapLayers.find(layer => layer.id === mapLayer) || mapLayers[0]
      
      // Add tile layer
      L.tileLayer(currentLayer.url, {
        attribution: currentLayer.id === 'satellite' 
          ? '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
          : currentLayer.id === 'terrain'
          ? '© OpenTopoMap (CC-BY-SA)'
          : '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstance)

      setMap(mapInstance)
      setMapError(null)

      // Add markers after map is set
      setTimeout(() => {
        updateMapMarkers(mapInstance, L)
      }, 100)
    } catch (error) {
      console.error('Error loading map:', error)
      setMapError('Failed to load map. Please refresh the page.')
    }
  }

  const updateMapMarkers = (mapInstance?: any, L?: any) => {
    const currentMap = mapInstance || map
    if (!currentMap || !disasters.length) return

    // Clear existing markers
    markers.forEach(marker => currentMap.removeLayer(marker))
    setMarkers([])

    const markersArray: any[] = []

    // Add disaster markers
    disasters.forEach(disaster => {
      const severityColor = getSeverityColor(disaster.severity)
      
      const icon = (L || (window as any).L)?.divIcon({
        html: `
          <div style="
            background-color: ${severityColor};
            border: 2px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${getDisasterSymbol(disaster.type)}
          </div>
        `,
        className: 'custom-disaster-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      if (!icon) return

      const marker = (L || (window as any).L)?.marker([disaster.location.lat, disaster.location.lng], { icon })
        ?.addTo(currentMap)
        ?.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${disaster.title}</h3>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Type:</strong> ${disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Magnitude:</strong> ${disaster.magnitude}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Affected:</strong> ${disaster.affected.toLocaleString()}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Time:</strong> ${new Date(disaster.time).toLocaleString()}
            </p>
            ${disaster.description ? `<p style="margin: 8px 0 0 0; font-size: 12px;">${disaster.description}</p>` : ''}
          </div>
        `)
        ?.on('click', () => onDisasterClick(disaster))

      if (marker) {
        // Store disaster id for easy lookup
        ;(marker as any)._disasterId = disaster.id
        markersArray.push(marker)
      }
    })

    setMarkers(markersArray)

    // Fit map to show all markers if there are any
    if (disasters.length > 0 && markersArray.length > 0) {
      const group = (L || (window as any).L)?.featureGroup(markersArray)
      if (group) {
        currentMap.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }

  // Effect to focus on selected disaster
  useEffect(() => {
    if (!map || !selectedDisaster || !markers.length) return

    const selectedMarker = markers.find((marker: any) => marker._disasterId === selectedDisaster.id)
    if (selectedMarker) {
      // Focus map on the selected disaster
      map.setView([selectedDisaster.location.lat, selectedDisaster.location.lng], 8)
      // Open the popup
      selectedMarker.openPopup()
    }
  }, [selectedDisaster, map, markers])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (map) {
        try {
          // Clear markers first
          markers.forEach(marker => {
            try {
              map.removeLayer(marker)
            } catch (e) {
              console.warn('Error removing marker:', e)
            }
          })
          // Remove the map
          map.remove()
        } catch (e) {
          console.warn('Error cleaning up map:', e)
        }
        setMap(null)
        setMarkers([])
      }
    }
  }, []) // Empty dependency array - only run on unmount

  const getDisasterSymbol = (type: string) => {
    switch (type) {
      case 'earthquake':
        return '🏔️'
      case 'wildfire':
        return '🔥'
      case 'flood':
        return '🌊'
      case 'hurricane':
        return '🌀'
      case 'tornado':
        return '🌪️'
      case 'tsunami':
        return '🌊'
      default:
        return '⚠️'
    }
  }

  if (!isClient) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        Loading map...
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{mapError}</p>
          <Button 
            onClick={() => {
              setMapError(null)
              setTimeout(() => loadMap(), 100)
            }} 
            variant="outline" 
            size="sm"
          >
            Retry Loading Map
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <div 
        id={mapContainerId}
        className="w-full h-full disaster-map-container"
        style={{ height: '100%', minHeight: '400px' }}
      />
    </div>
  )
}

export function DisasterMap({ disasters, onRefresh, isLoading = false, selectedDisaster, onDisasterSelect, isVisible = true }: DisasterMapProps) {
  const [localSelectedDisaster, setLocalSelectedDisaster] = useState<Disaster | null>(null)
  const [mapLayer, setMapLayer] = useState("street")

  // Use either external selected disaster or local one
  const currentSelected = selectedDisaster || localSelectedDisaster

  const handleDisasterClick = (disaster: Disaster) => {
    setLocalSelectedDisaster(disaster)
    if (onDisasterSelect) {
      onDisasterSelect(disaster)
    }
  }

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case "earthquake":
        return Mountain
      case "wildfire":
        return Flame
      case "flood":
        return Waves
      case "hurricane":
        return Cloud
      default:
        return MapPin
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getSeverityColorRGB = (severity: string) => {
    switch (severity) {
      case "critical":
        return "rgb(239, 68, 68)"
      case "high":
        return "rgb(249, 115, 22)"
      case "medium":
        return "rgb(234, 179, 8)"
      default:
        return "rgb(34, 197, 94)"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Map */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <div>
                <CardTitle>Live Disaster Map</CardTitle>
                <CardDescription>Interactive map showing real-time disaster locations</CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Layer Controls */}
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Layers className="h-4 w-4 mr-1" />
                Map Style:
              </span>
              <div className="flex space-x-1">
                <Button
                  variant={mapLayer === "street" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapLayer("street")}
                  className={mapLayer === "street" ? "bg-blue-600 text-white" : ""}
                >
                  🗺️ Street
                </Button>
                <Button
                  variant={mapLayer === "satellite" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapLayer("satellite")}
                  className={mapLayer === "satellite" ? "bg-blue-600 text-white" : ""}
                >
                  🛰️ Satellite
                </Button>
                <Button
                  variant={mapLayer === "terrain" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapLayer("terrain")}
                  className={mapLayer === "terrain" ? "bg-blue-600 text-white" : ""}
                >
                  🏔️ Terrain
                </Button>
                <Button
                  variant={mapLayer === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapLayer("dark")}
                  className={mapLayer === "dark" ? "bg-blue-600 text-white" : ""}
                >
                  🌙 Dark
                </Button>
              </div>
            </div>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden border">
            <ErrorBoundary fallback={MapErrorFallback}>
              <InteractiveMap
                disasters={disasters}
                onDisasterClick={handleDisasterClick}
                getSeverityColor={getSeverityColorRGB}
                selectedDisaster={currentSelected}
                isVisible={isVisible}
                mapLayer={mapLayer}
              />
            </ErrorBoundary>
          </div>

          {/* Map Info */}
          {currentSelected && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Selected Incident</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">{currentSelected.title}</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {currentSelected.affected.toLocaleString()} people affected | Magnitude: {currentSelected.magnitude}
              </p>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                <strong>Source:</strong> {currentSelected.source.toUpperCase()}
              </div>
              {currentSelected.url && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-2"
                  onClick={() => window.open(currentSelected.url, '_blank')}
                >
                  View Details →
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disaster Details */}
      <Card>
        <CardHeader>
          <CardTitle>Active Incidents</CardTitle>
          <CardDescription>Click markers for details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {disasters.map((disaster) => {
            const Icon = getDisasterIcon(disaster.type)
            const isSelected = currentSelected?.id === disaster.id
            return (
              <div
                key={disaster.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleDisasterClick(disaster)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(disaster.severity)} flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{disaster.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Magnitude: {disaster.magnitude} | {disaster.affected.toLocaleString()} affected
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={disaster.severity === "critical" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {disaster.severity}
                      </Badge>
                      <span className="text-xs text-gray-400">{new Date(disaster.time).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
