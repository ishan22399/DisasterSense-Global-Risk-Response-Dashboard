"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Waves,
  Flame,
  Mountain,
  Cloud,
  Users,
  TrendingUp,
  Bell,
  Globe,
  Shield,
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  Sun,
  Moon,
} from "lucide-react"
import { DisasterMap } from "./disaster-map"
import { RiskChart } from "./risk-chart"
import { NewsPanel } from "./news-panel"
import { EmergencyContacts } from "./emergency-contacts"
import dynamic from "next/dynamic"

const SatelliteView = dynamic(() => import("./satellite-view").then((mod) => mod.SatelliteView), { ssr: false })
import { Footer } from "./footer"
import { useDisasterData } from "@/hooks/use-disaster-data"

export function DisasterDashboard() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setActiveTab(hash);
      }
    }
  }, []);
  const [alerts, setAlerts] = useState(3)
  const [selectedDisaster, setSelectedDisaster] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(60) // Changed from 30s to 60s (1 minute)
  const [lastAutoRefresh, setLastAutoRefresh] = useState<Date>(new Date())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected')
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'outdated'>('fresh')
  const { disasters, isLoading, error, lastUpdated, apiStatus, refetch } = useDisasterData()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Real-time auto-refresh system
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    if (isRealTimeEnabled && !isLoading) {
      intervalId = setInterval(() => {
        setLastAutoRefresh(new Date())
        refetch()
      }, refreshInterval * 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRealTimeEnabled, refreshInterval, isLoading, refetch])

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('connected')
      if (isRealTimeEnabled) {
        refetch()
      }
    }
    
    const handleOffline = () => {
      setConnectionStatus('disconnected')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial connection check
    setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected')

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isRealTimeEnabled, refetch])

  // Monitor data freshness (synchronized with 1-minute backend ingestion)
  useEffect(() => {
    if (!lastUpdated) return

    const updateFreshness = () => {
      const now = new Date()
      const timeDiff = now.getTime() - lastUpdated.getTime()
      const secondsDiff = timeDiff / 1000

      // Data freshness: Backend syncs every 1 minute continuously
      if (secondsDiff < 90) {
        // Fresh within 90 seconds (1 min 30s buffer for network)
        setDataFreshness('fresh')
      } else if (secondsDiff < 180) {
        // Stale between 90 seconds and 3 minutes
        setDataFreshness('stale')
      } else {
        // Outdated after 3 minutes (system issue)
        setDataFreshness('outdated')
      }
    }

    updateFreshness()
    // Check freshness every 5 seconds for accurate display
    const freshnessInterval = setInterval(updateFreshness, 5000)

    return () => clearInterval(freshnessInterval)
  }, [lastUpdated])

  // Auto-reconnect when connection is restored
  useEffect(() => {
    if (connectionStatus === 'disconnected' && navigator.onLine) {
      setConnectionStatus('reconnecting')
      setTimeout(() => {
        refetch().then(() => {
          setConnectionStatus('connected')
        }).catch(() => {
          setConnectionStatus('disconnected')
        })
      }, 2000)
    }
  }, [connectionStatus, refetch])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element
        if (!target.closest('.notification-panel') && !target.closest('.notification-button')) {
          setShowNotifications(false)
        }
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Enhanced refresh function with loading states
  const handleManualRefresh = async () => {
    setConnectionStatus('reconnecting')
    try {
      await refetch()
      setLastAutoRefresh(new Date())
      setConnectionStatus('connected')
    } catch (error) {
      setConnectionStatus('disconnected')
    }
  }

  // Toggle real-time updates
  const toggleRealTime = () => {
    setIsRealTimeEnabled(!isRealTimeEnabled)
    if (!isRealTimeEnabled) {
      refetch()
    }
  }

  // Change refresh interval
  const updateRefreshInterval = (newInterval: number) => {
    setRefreshInterval(newInterval)
    if (isRealTimeEnabled) {
      refetch()
    }
  }

  // Get connection status color
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500'
      case 'reconnecting':
        return 'text-yellow-500'
      case 'disconnected':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  // Get data freshness indicator
  const getDataFreshnessIndicator = () => {
    switch (dataFreshness) {
      case 'fresh':
        return { color: 'bg-green-500', text: 'Live' }
      case 'stale':
        return { color: 'bg-yellow-500', text: 'Recent' }
      case 'outdated':
        return { color: 'bg-red-500', text: 'Outdated' }
      default:
        return { color: 'bg-gray-500', text: 'Unknown' }
    }
  }
  const stats = {
    total: disasters.length,
    critical: disasters.filter(d => d.severity === 'critical').length,
    high: disasters.filter(d => d.severity === 'high').length,
    medium: disasters.filter(d => d.severity === 'medium').length,
    totalAffected: disasters.reduce((total, d) => total + d.affected, 0),
    sources: {
      usgs: disasters.filter(d => d.source === 'usgs').length,
      news: disasters.filter(d => d.source === 'news').length,
      weather: disasters.filter(d => d.source === 'weather').length,
      nasa: disasters.filter(d => d.source === 'nasa').length
    }
  }

  // Function to handle clicking on a disaster in the list
  const handleDisasterClick = (disaster: any) => {
    setSelectedDisaster(disaster)
    setActiveTab("map") // Switch to map tab
  }

  // Function to handle tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    // Small delay to ensure tab content is visible before triggering map
    if (newTab === "map") {
      setTimeout(() => {
        // Force a small state update to trigger map re-initialization
        setSelectedDisaster((prev: any) => prev ? {...prev} : null)
      }, 100)
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
      case "storm":
        return Cloud
      case "heatwave":
        return TrendingUp
      case "volcano":
        return Mountain
      case "tornado":
        return Cloud
      default:
        return AlertTriangle
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white dashboard-title truncate">
                  <span className="hidden sm:inline">Global Disaster Monitoring Dashboard</span>
                  <span className="sm:hidden">DisasterSense</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  <span className="hidden md:inline">Real-time natural disaster tracking and emergency response</span>
                  <span className="md:hidden">Real-time disaster tracking</span>
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full sm:w-auto">
              {/* Status & Data Freshness - Hidden on mobile, shown in notification panel */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getDataFreshnessIndicator().color} ${dataFreshness === 'fresh' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-sm font-medium status-text">{getDataFreshnessIndicator().text}</span>
                </div>
                {connectionStatus !== 'connected' && (
                  <span className={`text-xs status-text ${getConnectionStatusColor()}`}>
                    {connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
                  </span>
                )}
              </div>

              {/* Real-time Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRealTimeEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleRealTime}
                  className="flex items-center space-x-1"
                >
                  {isRealTimeEnabled ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  <span className="text-xs hidden sm:inline">
                    {isRealTimeEnabled ? `${refreshInterval}s` : 'Manual'}
                  </span>
                  <span className="text-xs sm:hidden">
                    {isRealTimeEnabled ? 'Live' : 'Off'}
                  </span>
                </Button>

                {isRealTimeEnabled && (
                  <select
                    value={refreshInterval}
                    onChange={(e) => updateRefreshInterval(Number(e.target.value))}
                    className="text-xs border rounded px-2 py-1 bg-white dark:bg-gray-800 h-8 hidden sm:block"
                  >
                    <option value={10}>10s</option>
                    <option value={30}>30s</option>
                    <option value={60}>1m</option>
                    <option value={300}>5m</option>
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleManualRefresh}
                  disabled={isLoading || connectionStatus === 'reconnecting'}
                  title="Refresh Data"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading || connectionStatus === 'reconnecting' ? 'animate-spin' : ''}`} />
                </Button>

                {/* Notification Button with Panel */}
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`notification-button transition-all duration-200 ${showNotifications ? 'bg-blue-100 border-blue-300' : ''}`}
                    title="View Notifications"
                  >
                    <Bell className={`h-4 w-4 ${stats.critical > 0 ? 'text-red-500' : stats.high > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                    <span className="ml-1 text-xs">{stats.critical + stats.high}</span>
                    {(stats.critical > 0 || stats.high > 0) && (
                      <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </Button>
                  
                  {/* Notification Panel */}
                  {showNotifications && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-200"
                        onClick={() => setShowNotifications(false)}
                      />
                      
                      {/* Notification Panel - Responsive */}
                      <div className="notification-panel absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50 animate-in slide-in-from-top-2 duration-300 mx-4 sm:mx-0">
                        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              🔔 Live Notifications
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getDataFreshnessIndicator().color} ${dataFreshness === 'fresh' ? 'animate-pulse' : ''}`}></div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowNotifications(false)}
                                className="h-8 w-8 p-0"
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="hidden sm:inline">
                              {stats.total} active disasters • Live updates every {refreshInterval}s • Last updated {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                            </span>
                            <span className="sm:hidden">
                              {stats.total} active disasters • {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                            </span>
                          </p>
                        </div>
                        
                        <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                          {/* Critical Alerts */}
                          {stats.critical > 0 && (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-950">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-red-800 dark:text-red-200">
                                    🚨 Critical Alert
                                  </h4>
                                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    {stats.critical} critical disasters active affecting {stats.totalAffected.toLocaleString()} people
                                  </p>
                                  <div className="flex space-x-2 mt-3">                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => {
                                      setActiveTab("satellite")
                                      setSelectedDisaster(disasters.find(d => d.severity === 'critical'))
                                      setShowNotifications(false)
                                    }}
                                  >
                                    Satellite View
                                  </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setActiveTab("emergency")
                                        setShowNotifications(false)
                                      }}
                                    >
                                      Emergency
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* High Risk Alerts */}
                          {stats.high > 0 && (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-orange-50 dark:bg-orange-950">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                                    ⚠️ High Risk Alert
                                  </h4>
                                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                    {stats.high} high-risk disasters detected
                                  </p>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => {
                                      setActiveTab("overview")
                                      setShowNotifications(false)
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Recent Disasters */}
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                            <div className="space-y-3">
                              {disasters.slice(0, 3).map((disaster) => {
                                const Icon = getDisasterIcon(disaster.type)
                                return (
                                  <div 
                                    key={disaster.id}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                    onClick={() => {
                                      handleDisasterClick(disaster)
                                      setShowNotifications(false)
                                    }}
                                  >
                                    <div className={`w-6 h-6 rounded-full ${getSeverityColor(disaster.severity)} flex items-center justify-center flex-shrink-0`}>
                                      <Icon className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {disaster.title}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {typeof disaster.location === 'string' ? disaster.location : `${disaster.location.lat}, ${disaster.location.lng}`} • {disaster.affected} affected
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    handleManualRefresh()
                                    setShowNotifications(false)
                                  }}
                                  disabled={isLoading || connectionStatus === 'reconnecting'}
                                  className="flex-1"
                                >
                                  {isLoading || connectionStatus === 'reconnecting' ? (
                                    <>
                                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="h-3 w-3 mr-2" />
                                      Refresh
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant={isRealTimeEnabled ? "default" : "outline"}
                                  onClick={toggleRealTime}
                                  className="flex-1"
                                >
                                  {isRealTimeEnabled ? <Wifi className="h-3 w-3 mr-2" /> : <WifiOff className="h-3 w-3 mr-2" />}
                                  {isRealTimeEnabled ? 'Live' : 'Manual'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center space-x-2"
                title="Toggle Dark Mode"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Last Updated Timestamp */}
              {lastUpdated && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right space-y-0.5">
                  <div>Updated: {lastUpdated.toLocaleString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: true 
                  })}</div>
                  {isRealTimeEnabled && (
                    <div>Next: {new Date(lastAutoRefresh.getTime() + refreshInterval * 1000).toLocaleString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit',
                      hour12: true 
                    })}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Status Alerts */}
        {connectionStatus === 'disconnected' && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
              <WifiOff className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 dark:text-red-200">Connection Lost</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                Unable to connect to disaster data sources. Data may be outdated. Check your internet connection.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {connectionStatus === 'reconnecting' && (
          <div className="mb-6">
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
              <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-200">Reconnecting</AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                Attempting to restore connection to disaster monitoring systems...
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Data Outdated warning removed - backend continuously syncs data every minute */}

        {/* Critical Alerts */}
        {error && (
          <div className="mb-6">
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-200">API Status</AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {stats.critical > 0 && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 dark:text-red-200">Critical Disasters Active</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                {stats.critical} critical disasters requiring immediate attention. {stats.totalAffected.toLocaleString()} people affected.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {disasters.length === 0 && !isLoading && (
          <div className="mb-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-200">All Clear</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                No major disasters detected at this time. System monitoring continues.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* USGS API Down Warning */}
        {!apiStatus.usgs && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 dark:text-red-200">USGS Earthquakes API Unavailable</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                {typeof apiStatus.usgs === "string" && apiStatus.usgs
                  ? <>The USGS Earthquakes data source returned an error: <span className="font-mono">{apiStatus.usgs}</span></>
                  : <>The USGS Earthquakes data source is currently not responding. Earthquake data may be missing or outdated. Please check your network or try again later.</>
                }
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Enhanced Data Source Information */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Live Data Sources</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={isRealTimeEnabled ? "default" : "secondary"} className="text-xs">
                    {isRealTimeEnabled ? `Auto-refresh: ${refreshInterval}s` : 'Manual mode'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getDataFreshnessIndicator().text}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${apiStatus.usgs ? 'bg-green-500' : 'bg-red-500'} ${apiStatus.usgs ? 'animate-pulse' : ''}`}></div>
                    <span className="font-medium">USGS Earthquakes</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stats.sources.usgs} events
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${apiStatus.nasa ? 'bg-green-500' : 'bg-red-500'} ${apiStatus.nasa ? 'animate-pulse' : ''}`}></div>
                    <span className="font-medium">NASA EONET</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stats.sources.nasa} events
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${apiStatus.weather ? 'bg-green-500' : 'bg-gray-400'} ${apiStatus.weather ? 'animate-pulse' : ''}`}></div>
                    <span className="font-medium">Weather Alerts</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stats.sources.weather} alerts
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${apiStatus.news ? 'bg-green-500' : 'bg-gray-400'} ${apiStatus.news ? 'animate-pulse' : ''}`}></div>
                    <span className="font-medium">News Feed</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stats.sources.news} articles
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Disasters</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 metric-value">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.critical} critical, {stats.high} high risk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People Affected</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 metric-value">
                {stats.totalAffected.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {stats.total} active events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold metric-value ${stats.critical > 0 ? 'text-red-600' : stats.high > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {stats.critical > 0 ? 'Critical' : stats.high > 0 ? 'High' : 'Moderate'}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {stats.total} monitored events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 metric-value">
                {Object.values(apiStatus).filter(Boolean).length}/4
              </div>
              <p className="text-xs text-muted-foreground">
                APIs operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Live Map</span>
              <span className="sm:hidden">🗺️</span>
            </TabsTrigger>
            <TabsTrigger value="satellite" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Satellite</span>
              <span className="sm:hidden">🛰️</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Risk Analysis</span>
              <span className="sm:hidden">📈</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Emergency</span>
              <span className="sm:hidden">🚨</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">News & Alerts</span>
              <span className="sm:hidden">📰</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Recent Disasters - Takes 2 columns on desktop */}
              <Card className="lg:col-span-2 h-fit">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Recent Disasters</span>
                  </CardTitle>
                  <CardDescription>Latest reported incidents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                  {disasters.map((disaster) => {
                    const Icon = getDisasterIcon(disaster.type)
                    return (
                      <div
                        key={disaster.id}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                          selectedDisaster?.id === disaster.id 
                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' 
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleDisasterClick(disaster)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div className={`p-2 rounded-full ${getSeverityColor(disaster.severity)}`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate">{disaster.title}</p>
                            <p className="text-xs text-gray-500">
                              {disaster.affected.toLocaleString()} affected
                            </p>
                          </div>
                        </div>
                        <Badge variant={disaster.severity === "critical" ? "destructive" : "secondary"} className="ml-2 text-xs">
                          {disaster.severity}
                        </Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Disaster Statistics - Takes 1 column on desktop */}
              <Card className="h-fit">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Disaster Breakdown</CardTitle>
                  <CardDescription className="text-xs">By type and severity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* By Type */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">By Disaster Type</h4>
                    {Object.entries(
                      disasters.reduce((acc: any, disaster) => {
                        acc[disaster.type] = (acc[disaster.type] || 0) + 1
                        return acc
                      }, {})
                    ).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${getSeverityColor('medium')}`}>
                            {React.createElement(getDisasterIcon(type), { className: "h-3 w-3 text-white" })}
                          </div>
                          <span className="capitalize text-sm">{type}</span>
                        </div>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  {/* By Severity */}
                  <div className="border-t pt-3 space-y-3">
                    <h4 className="font-medium text-sm">By Severity Level</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical</span>
                      <Badge variant="destructive">{stats.critical}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High</span>
                      <Badge variant="secondary">{stats.high}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium</span>
                      <Badge variant="outline">{stats.medium}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <DisasterMap 
              disasters={disasters} 
              onRefresh={handleManualRefresh} 
              isLoading={isLoading}
              selectedDisaster={selectedDisaster}
              onDisasterSelect={setSelectedDisaster}
              isVisible={activeTab === "map"}
            />
          </TabsContent>

          <TabsContent value="satellite">
            <SatelliteView 
              disasters={disasters}
              selectedDisaster={selectedDisaster}
              onDisasterSelect={setSelectedDisaster}
            />
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Disaster Analysis</CardTitle>
                    <CardDescription>Real-time statistical breakdown of current disasters</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getDataFreshnessIndicator().color} ${dataFreshness === 'fresh' ? 'animate-pulse' : ''}`}></div>
                    <span className="text-xs text-gray-500">Live data</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Disaster Types Chart */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Disasters by Type</h3>
                    {Object.entries(
                      disasters.reduce((acc: any, disaster) => {
                        acc[disaster.type] = (acc[disaster.type] || 0) + 1
                        return acc
                      }, {})
                    ).map(([type, count]) => {
                      const percentage = Math.round((count as number / disasters.length) * 100) || 0
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{type}</span>
                            <span>{count as number} ({percentage}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Severity Distribution */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Severity Distribution</h3>
                    {[
                      { label: 'Critical', count: stats.critical, color: 'bg-red-500' },
                      { label: 'High', count: stats.high, color: 'bg-orange-500' },
                      { label: 'Medium', count: stats.medium, color: 'bg-yellow-500' }
                    ].map(({ label, count, color }) => {
                      const percentage = Math.round((count / disasters.length) * 100) || 0
                      return (
                        <div key={label} className="space-y-2">
                          <div className="flex justify-between">
                            <span>{label}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${color}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyContacts />
          </TabsContent>

          <TabsContent value="news">
            <NewsPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
