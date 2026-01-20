"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Newspaper, ExternalLink, Clock, AlertTriangle, RefreshCw, Globe } from "lucide-react"

interface NewsArticle {
  source: { name: string }
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
}

export function NewsPanel() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/disasters')
      const data = await response.json()
      
      if (response.ok && data.disasters) {
        // Extract news articles from disaster data
        // Backend stores news as disaster events with source='news'
        const newsArticles = data.disasters
          .filter((disaster: any) => disaster.source === 'news')
          .map((disaster: any) => ({
            source: { name: disaster.source_url ? new URL(disaster.source_url).hostname : 'News' },
            title: disaster.title,
            description: disaster.description || '',
            url: disaster.source_url || '#',
            urlToImage: disaster.image_url,
            publishedAt: disaster.time || disaster.event_time || disaster.detected_time || new Date().toISOString()
          }))
          .slice(0, 15) // Limit to 15 most recent
        
        setArticles(newsArticles)
      } else {
        setError('Failed to load disaster news')
      }
    } catch (err) {
      setError('Error fetching disaster news')
      console.error('News fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return 'Less than 1 hour ago'
    }
  }

  const isDisasterUrgent = (title: string, description: string) => {
    const urgentKeywords = ['evacuation', 'emergency', 'warning', 'critical', 'urgent', 'immediate']
    const content = `${title} ${description}`.toLowerCase()
    return urgentKeywords.some(keyword => content.includes(keyword))
  }

  const getDisasterType = (title: string, description: string) => {
    const content = `${title} ${description}`.toLowerCase()
    if (content.includes('earthquake') || content.includes('quake')) return 'Earthquake'
    if (content.includes('wildfire') || content.includes('fire')) return 'Wildfire'
    if (content.includes('hurricane') || content.includes('typhoon')) return 'Hurricane'
    if (content.includes('flood') || content.includes('flooding')) return 'Flood'
    if (content.includes('tornado')) return 'Tornado'
    if (content.includes('tsunami')) return 'Tsunami'
    if (content.includes('storm') || content.includes('cyclone')) return 'Storm'
    return 'Disaster'
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold">Disaster News</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Status Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}. Some news content may not be available.
          </AlertDescription>
        </Alert>
      )}

      {/* News Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>Latest Disaster News</span>
          </CardTitle>
          <CardDescription>
            Real-time news about natural disasters and emergencies worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No disaster news available at the moment.</p>
              <p className="text-sm mt-2">Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article, index) => {
                const isUrgent = isDisasterUrgent(article.title, article.description || '')
                const disasterType = getDisasterType(article.title, article.description || '')
                
                return (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      isUrgent ? 'border-red-300 bg-red-50 dark:bg-red-950' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
                          {disasterType}
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeSince(article.publishedAt)}
                      </div>
                    </div>

                    <h3 className="font-semibold mb-2 text-sm leading-tight">
                      {article.title}
                    </h3>
                    
                    {article.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {article.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-medium">
                        {article.source.name}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-auto p-2"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>News Disclaimer:</strong> Articles are sourced from various news outlets. 
          For official emergency information, always consult local authorities and emergency services.
        </AlertDescription>
      </Alert>
    </div>
  )
}
