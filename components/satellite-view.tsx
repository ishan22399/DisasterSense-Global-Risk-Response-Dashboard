
"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { 
  Satellite, MapPin, RefreshCw, Search, Globe, AlertCircle, Bot, Route, Building2, Calendar as CalendarIconLucide, Sparkles,
  Thermometer, Cloud, Wind, Droplets, AirVent // Added new icons
} from "lucide-react"
import { DisasterInsightsPanel } from "./disaster-insights-panel"
import type { LatLngExpression, LatLngTuple } from "leaflet"
import { TileLayer, Marker, Popup, Circle, useMapEvents, Polyline } from "react-leaflet"
import "leaflet.heat"
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

// --- TYPE DEFINITIONS ---
interface SatelliteViewProps {
  disasters: any[]
  selectedDisaster?: any
  onDisasterSelect?: (disaster: any) => void
}

interface Suggestion {
    id: number;
    name: string;
    country: string;
    state: string;
    city: string;
    postcode: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    displayName: string;
}

interface RealTimeData {
  geocoding: {
    display_name: string;
    // Add other geocoding properties if available
  };
  weather: {
    temperature: number;
    wind_speed: number;
    humidity: number;
    aqi: number;
    description: string;
    icon: string;
    // Add other weather properties as needed
  };
}

interface ChangeDetectionResult {
  summary: string
  changes: { location: { lat: number; lng: number }; type: string; severity: number; area: number }[]
}

interface PredictivePathResult {
  disasterId: string
  predictedPath: { lat: number; lng: number; timestamp: string }[]
  confidence: number
}

interface DamageAssessmentResult {
  disasterId: string
  heatmap: [number, number, number][]
  summary: { totalArea: number; highDamage: number; mediumDamage: number; lowDamage: number }
}

// --- API HELPER FUNCTIONS ---
async function fetchApi(url: string, options?: RequestInit) {
  console.log(`Fetching API: ${url}`);
  const response = await fetch(url, options)
  if (!response.ok) {
    let errorDetail = `API request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorDetail = errorData.error || errorDetail;
    } catch (e) {
      errorDetail = `API request failed: ${response.status} ${response.statusText}. Could not parse error response as JSON.`;
      try {
        const textError = await response.text();
        if (textError) errorDetail += ` Response: ${textError}`;
      } catch (eText) {
        // Ignore if text parsing also fails
      }
    }
    throw new Error(errorDetail);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const textResponse = await response.text();
    throw new Error(`API returned non-JSON response: ${textResponse.substring(0, 200)}`); // Truncate for brevity
  }
}

const fetchRealTimeData = (lat: number, lon: number) => fetchApi(`/api/satellite/real-time?lat=${lat}&lon=${lon}`)
const fetchChangeDetection = (lat: number, lon: number, date1: string, date2: string) => fetchApi(`/api/satellite/change-detection?lat=${lat}&lon=${lon}&date1=${date1}&date2=${date2}`)
const fetchPredictivePath = (disaster: any) => fetchApi(`/api/satellite/predictive-path`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(disaster) })
const fetchDamageAssessment = (disaster: any) => fetchApi(`/api/satellite/damage-assessment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(disaster) })
const fetchGeocodeSuggestions = (query: string) => fetchApi(`/api/satellite/geocode-suggest?q=${query}`)

// --- LEAFLET & MAP HELPERS ---
const setupLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
};

function MapEventsHandler({ onMapClick }: any) {
  useMapEvents({ click: onMapClick });
  return null;
}

// --- MAIN COMPONENT ---
export function SatelliteView({ disasters, selectedDisaster, onDisasterSelect }: SatelliteViewProps) {
  // --- STATE MANAGEMENT ---
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
  const [changeDetectionResult, setChangeDetectionResult] = useState<ChangeDetectionResult | null>(null)
  const [predictivePath, setPredictivePath] = useState<PredictivePathResult | null>(null)
  const [damageAssessment, setDamageAssessment] = useState<DamageAssessmentResult | null>(null)

  const [mapCenter, setMapCenter] = useState<LatLngExpression>([20, 0])
  const [mapZoom, setMapZoom] = useState(3)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = useState(false);

  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())

  const mapRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING & SIDE EFFECTS ---
  useEffect(() => {
    setIsMounted(true)
    setupLeafletIcons()

    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsSuggestionsVisible(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  useEffect(() => {
    if (selectedDisaster && typeof selectedDisaster.location === 'object') {
      const { lat, lng } = selectedDisaster.location
      setMapCenter([lat, lng])
      setMapZoom(8)
      handleRunAllAnalyses(selectedDisaster)
    }
  }, [selectedDisaster])

  useEffect(() => {
    if (damageAssessment?.heatmap && mapRef.current) {
        const L = require('leaflet')
        if (heatLayerRef.current) {
            mapRef.current.removeLayer(heatLayerRef.current)
        }
        heatLayerRef.current = L.heatLayer(damageAssessment.heatmap, { radius: 25, blur: 15, maxZoom: 12 }).addTo(mapRef.current)
    } else if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
    }
  }, [damageAssessment])

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
        debounceFetchSuggestions(query);
        setIsSuggestionsVisible(true);
    } else {
        setSuggestions([]);
        setIsSuggestionsVisible(false);
    }
  };

  const debounceFetchSuggestions = useCallback(
    debounce((query: string) => {
        fetchAndSetSuggestions(query);
    }, 300), 
    []
  );

  const fetchAndSetSuggestions = async (query: string) => {
    setIsSuggestionsLoading(true);
    setSuggestionsError(null);
    try {
      const data = await fetchGeocodeSuggestions(query);
      if (data.status === 'ZERO_RESULTS') {
        setSuggestionsError('No results found for your search. Please try a different query.');
        setSuggestions([]);
      } else {
        setSuggestions(data);
      }
    } catch (err: any) {
      setSuggestionsError(err.message);
      setSuggestions([]); // Clear suggestions on error
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleApiCall = async (apiCall: () => Promise<any>, setter: (data: any) => void) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiCall()
      setter(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunAllAnalyses = async (disaster: any) => {
    handleApiCall(() => fetchPredictivePath(disaster), setPredictivePath)
    handleApiCall(() => fetchDamageAssessment(disaster), setDamageAssessment)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.displayName);
    setSuggestions([]);
    setIsSuggestionsVisible(false);
    const { lat, lng } = suggestion.coordinates;
    setMapCenter([lat, lng]);
    setMapZoom(12);
    handleApiCall(() => fetchRealTimeData(lat, lng), setRealTimeData);
  };

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng
    console.log(`Map clicked at Lat: ${lat}, Lng: ${lng}`);
    handleApiCall(() => fetchRealTimeData(lat, lng), setRealTimeData)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingCurrentLocation(true);
      setSuggestionsError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
          handleApiCall(() => fetchRealTimeData(latitude, longitude), setRealTimeData);
          setIsFetchingCurrentLocation(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setSuggestionsError(`Error getting location: ${error.message}`);
          setIsFetchingCurrentLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setSuggestionsError("Geolocation is not supported by your browser.");
    }
  };

  const handleRunChangeDetection = () => {
    if (dateFrom && dateTo) {
      const center = mapRef.current?.getCenter()
      if (center) {
        const changeDetectCall = () => fetchChangeDetection(center.lat, center.lng, format(dateFrom, 'yyyy-MM-dd'), format(dateTo, 'yyyy-MM-dd'))
        handleApiCall(changeDetectCall, setChangeDetectionResult)
      }
    }
  }

  // --- UI & RENDER LOGIC ---
  if (!isMounted) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg"><Satellite className="h-6 w-6 text-white" /></div>
                <div>
                    <CardTitle>Enhanced Satellite Intelligence Hub</CardTitle>
              
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div ref={searchContainerRef} className="relative max-w-md">
                <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <Input 
                            id="location-search"
                            placeholder="Search location..." 
                            value={searchQuery} 
                            onChange={handleSearchQueryChange}
                            onFocus={() => setIsSuggestionsVisible(true)}
                            className="pr-12"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleUseCurrentLocation}
                      disabled={isFetchingCurrentLocation}
                      title="Use Current Location"
                    >
                      {isFetchingCurrentLocation ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                </div>
                {isSuggestionsVisible && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg bg-opacity-95">
                        {isSuggestionsLoading && (
                            <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                Loading suggestions...
                            </div>
                        )}
                        {suggestionsError && (
                            <div className="p-3 text-center text-sm text-red-500 dark:text-red-400">
                                Error: {suggestionsError}
                            </div>
                        )}
                        {!isSuggestionsLoading && !suggestionsError && suggestions.length === 0 && searchQuery.length > 2 && (
                            <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                No results found.
                            </div>
                        )}
                        {!isSuggestionsLoading && !suggestionsError && suggestions.length > 0 && (
                            <ul className="py-1">
                                {suggestions.map((suggestion) => (
                                    <li 
                                        key={suggestion.id} 
                                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion.displayName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {error && <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            {realTimeData && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location Details: {realTimeData.geocoding?.display_name || 'N/A'}
                  </CardTitle>
                  <CardDescription>Real-time weather and air quality information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {realTimeData.weather?.temperature && (
                      <Badge variant="secondary" className="flex items-center gap-2 p-2">
                        <Thermometer className="h-4 w-4" />
                        <span>Temperature: {realTimeData.weather.temperature}°C</span>
                      </Badge>
                    )}
                    {realTimeData.weather?.description && (
                      <Badge variant="secondary" className="flex items-center gap-2 p-2">
                        <Cloud className="h-4 w-4" />
                        <span>Conditions: {realTimeData.weather.description}</span>
                        {realTimeData.weather?.icon && (
                          <img src={`http://openweathermap.org/img/wn/${realTimeData.weather.icon}.png`} alt="Weather icon" className="inline-block w-6 h-6" />
                        )}
                      </Badge>
                    )}
                    {realTimeData.weather?.wind_speed && (
                      <Badge variant="secondary" className="flex items-center gap-2 p-2">
                        <Wind className="h-4 w-4" />
                        <span>Wind Speed: {realTimeData.weather.wind_speed} m/s</span>
                      </Badge>
                    )}
                    {realTimeData.weather?.humidity && (
                      <Badge variant="secondary" className="flex items-center gap-2 p-2">
                        <Droplets className="h-4 w-4" />
                        <span>Humidity: {realTimeData.weather.humidity}%</span>
                      </Badge>
                    )}
                    {realTimeData.weather?.aqi && (
                      <Badge variant="secondary" className="flex items-center gap-2 p-2">
                        <AirVent className="h-4 w-4" />
                        <span>AQI: {realTimeData.weather.aqi}</span>
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
            }
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Globe className="h-5 w-5 mr-2" />Interactive Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg overflow-hidden border">
                  <MapContainer center={mapCenter} zoom={mapZoom} ref={mapRef} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='Esri, Maxar, GeoEye' />
                      <MapEventsHandler onMapClick={handleMapClick} />
                      {disasters.map((dis, idx) => (
                          dis.location && <Marker key={idx} position={[dis.location.lat, dis.location.lng]} eventHandlers={{ click: () => onDisasterSelect && onDisasterSelect(dis) }}><Popup>{dis.title}</Popup></Marker>
                      ))}
                      {selectedDisaster && selectedDisaster.location && (
                          <Circle center={[selectedDisaster.location.lat, selectedDisaster.location.lng]} radius={selectedDisaster.radius || 20000} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.2 }} />
                      )}
                      {predictivePath && <Polyline positions={predictivePath.predictedPath.map(p => [p.lat, p.lng] as LatLngTuple)} pathOptions={{ color: '#ff00ff', weight: 3, dashArray: '5, 10' }} />}
                      {changeDetectionResult && changeDetectionResult.changes.map((change, idx) => (
                          <Circle key={idx} center={[change.location.lat, change.location.lng]} radius={change.area * 500} pathOptions={{ color: '#00FFFF', weight: 2 }}>
                              <Popup><b>{change.type.replace('_', ' ')}</b><br/>Severity: {change.severity.toFixed(2)}</Popup>
                          </Circle>
                      ))}
                  </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <DisasterInsightsPanel selectedDisaster={selectedDisaster} />
          
        </div>
      </div>
    </div>
  )
}

function DatePicker({ date, setDate }: { date?: Date, setDate: (date?: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIconLucide className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise(resolve => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
}
