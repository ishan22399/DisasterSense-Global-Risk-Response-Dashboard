import { useState, useEffect, useCallback } from 'react'

export interface Disaster {
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
  newsArticle?: any
}

export const useDisasterData = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [apiStatus, setApiStatus] = useState({
    usgs: false,
    news: false,
    weather: false,
    nasa: false
  })

  // Prevent hydration issues by only running on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchDisasters = useCallback(async () => {
    if (!isMounted) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🌍 Fetching disaster data from API...')
      
      const response = await fetch('/api/disasters')
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setDisasters(data.disasters || [])
        setApiStatus(data.apiStatus || {
          usgs: false,
          news: false,
          weather: false,
          nasa: false
        })
        setLastUpdated(new Date(data.lastUpdated))
        console.log(`✅ Successfully loaded ${data.count} disasters from ${data.sources.join(', ')}`)
      } else {
        throw new Error(data.error || 'Failed to fetch disasters')
      }
    } catch (err) {
      console.error('❌ Error fetching disaster data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      
      // Set empty data on error
      setDisasters([])
      setApiStatus({
        usgs: false,
        news: false,
        weather: false,
        nasa: false
      })
    } finally {
      setIsLoading(false)
    }
  }, [isMounted])

  // Fetch data on component mount
  useEffect(() => {
    if (isMounted) {
      fetchDisasters()
    }
  }, [fetchDisasters, isMounted])

  return {
    disasters,
    isLoading,
    error,
    lastUpdated,
    apiStatus,
    refetch: fetchDisasters
  }
}
