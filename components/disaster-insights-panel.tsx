"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Youtube, Bot } from "lucide-react";

interface Disaster {
  id: string;
  type: string;
  title: string;
  location: { lat: number; lng: number };
  magnitude: number;
  time: string;
  severity: string;
  affected: number;
  description?: string;
  url?: string;
  source: 'usgs' | 'news' | 'weather' | 'nasa';
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

interface DisasterInsightsPanelProps {
  selectedDisaster: Disaster | null;
}

export function DisasterInsightsPanel({ selectedDisaster }: DisasterInsightsPanelProps) {
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (selectedDisaster) {
      // Fetch YouTube videos
      setLoadingVideos(true);
      fetch(`/api/youtube/search?q=${encodeURIComponent(selectedDisaster.title)} ${selectedDisaster.type} disaster`) // Added type and disaster for better search results
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setYoutubeVideos(data);
          } else {
            console.error("Failed to fetch YouTube videos:", data);
            setYoutubeVideos([]);
          }
        })
        .catch(error => {
          console.error("Error fetching YouTube videos:", error);
          setYoutubeVideos([]);
        })
        .finally(() => setLoadingVideos(false));

      // Placeholder for AI Insights (replace with actual API call)
      setLoadingInsights(true);
      setTimeout(() => {
        setAiInsights(`AI analysis for ${selectedDisaster.title} (${selectedDisaster.type}):\n\nThis disaster, with a magnitude of ${selectedDisaster.magnitude} and affecting approximately ${selectedDisaster.affected.toLocaleString()} people, indicates a ${selectedDisaster.severity} level of impact. Further analysis suggests potential secondary effects such as infrastructure damage and displacement. Real-time satellite imagery could provide more granular details on affected areas and aid in resource allocation.`);
        setLoadingInsights(false);
      }, 1500); // Simulate API call

    } else {
      setYoutubeVideos([]);
      setAiInsights(null);
    }
  }, [selectedDisaster]);

  if (!selectedDisaster) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center"><Bot className="h-5 w-5 mr-2" />Disaster Insights</CardTitle>
          <CardDescription>Select a disaster on the map to view AI-driven insights and related videos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No disaster selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center"><Bot className="h-5 w-5 mr-2" />Disaster Insights</CardTitle>
        <CardDescription>AI-driven analysis and related media for the selected disaster.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Insights */}
        <div>
          <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
          {loadingInsights ? (
            <p className="text-sm text-gray-500">Generating insights...</p>
          ) : aiInsights ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiInsights}</p>
          ) : (
            <p className="text-sm text-gray-500">No AI insights available for this disaster.</p>
          )}
        </div>

        <Separator />

        {/* YouTube Videos */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center"><Youtube className="h-5 w-5 mr-2 text-red-600" />Related Videos</h3>
          {loadingVideos ? (
            <p className="text-sm text-gray-500">Loading videos...</p>
          ) : youtubeVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {youtubeVideos.map(video => (
                <div key={video.id} className="flex items-center space-x-3">
                  <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-1"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                    >
                      Watch Video →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No related videos found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
