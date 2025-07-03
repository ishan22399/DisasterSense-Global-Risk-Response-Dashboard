"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

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
}

interface LeafletMapProps {
  disasters: Disaster[]
  onDisasterClick: (disaster: Disaster) => void
  getSeverityColor: (severity: string) => string
}

const LeafletMap = ({ disasters, onDisasterClick, getSeverityColor }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map('disaster-map', {
        center: [20, 0], // Center of the world
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add disaster markers
    disasters.forEach(disaster => {
      if (mapRef.current) {
        const severityColor = getSeverityColor(disaster.severity)
        
        // Create custom icon based on disaster type and severity
        const icon = L.divIcon({
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

        const marker = L.marker([disaster.location.lat, disaster.location.lng], { icon })
          .addTo(mapRef.current)
          .bindPopup(`
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
          .on('click', () => onDisasterClick(disaster))

        markersRef.current.push(marker)
      }
    })

    // Fit map to show all markers if there are any
    if (disasters.length > 0 && mapRef.current) {
      const group = L.featureGroup(markersRef.current)
      mapRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [disasters, onDisasterClick, getSeverityColor])

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

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

  return (
    <div 
      id="disaster-map" 
      className="w-full h-full"
      style={{ height: '100%', minHeight: '400px' }}
    />
  )
}

export default LeafletMap
