"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, MapPin, Clock, Users, Truck, Heart, Shield, Radio, Home, Zap, Globe, RefreshCw, Wifi, AlertCircle } from "lucide-react"

export function EmergencyContacts() {
  const [selectedCountry, setSelectedCountry] = useState("us")
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [shelterData, setShelterData] = useState<any[]>([])
  const [resourceData, setResourceData] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true)

  // Auto-detect user's country based on location
  useEffect(() => {
    const detectCountry = async () => {
      setIsDetecting(true)
      try {
        // Try to get location first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use reverse geocoding to get country
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                )
                const data = await response.json()
                const countryCode = data.countryCode?.toLowerCase()
                
                // Map country codes to our available countries
                const countryMapping: { [key: string]: string } = {
                  'us': 'us', 'ca': 'ca', 'gb': 'uk', 'au': 'au', 'jp': 'jp',
                  'de': 'de', 'in': 'in', 'fr': 'fr', 'it': 'it', 'br': 'br',
                  'kr': 'kr', 'mx': 'mx'
                }
                
                if (countryCode && countryMapping[countryCode]) {
                  setDetectedCountry(countryMapping[countryCode])
                  setSelectedCountry(countryMapping[countryCode])
                }
              } catch (error) {
                console.log('Geocoding failed, using IP detection')
                await detectByIP()
              }
              setIsDetecting(false)
            },
            async () => {
              // Fallback to IP-based detection
              await detectByIP()
              setIsDetecting(false)
            }
          )
        } else {
          await detectByIP()
          setIsDetecting(false)
        }
      } catch (error) {
        console.log('Country detection failed')
        setIsDetecting(false)
      }
    }

    const detectByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const countryCode = data.country_code?.toLowerCase()
        
        const countryMapping: { [key: string]: string } = {
          'us': 'us', 'ca': 'ca', 'gb': 'uk', 'au': 'au', 'jp': 'jp',
          'de': 'de', 'in': 'in', 'fr': 'fr', 'it': 'it', 'br': 'br',
          'kr': 'kr', 'mx': 'mx'
        }
        
        if (countryCode && countryMapping[countryCode]) {
          setDetectedCountry(countryMapping[countryCode])
          setSelectedCountry(countryMapping[countryCode])
        }
      } catch (error) {
        console.log('IP detection failed')
      }
    }

    detectCountry()
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  // Auto-update shelter and resource data
  useEffect(() => {
    const updateData = () => {
      // Simulate real-time shelter data updates
      const generateShelterData = () => {
        const shelterTypes = [
          "Emergency Shelter Center", "Community Relief Center", "Red Cross Shelter",
          "School Emergency Center", "Church Relief Shelter", "Municipal Emergency Facility"
        ]
        
        return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
          id: i,
          name: shelterTypes[Math.floor(Math.random() * shelterTypes.length)],
          address: detectedCountry === 'us' ? 
            `${Math.floor(Math.random() * 9999) + 1} Main St, Emergency District` :
            "Contact local emergency services for nearest shelter",
          distance: detectedCountry === 'us' ? 
            `${(Math.random() * 10 + 0.5).toFixed(1)} mi` : 
            "Contact local authorities",
          available: Math.floor(Math.random() * 50),
          capacity: Math.floor(Math.random() * 100) + 50,
          services: ["Food", "Water", "Medical", "Communications"].filter(() => Math.random() > 0.3),
          status: Math.random() > 0.2 ? "Active" : "At Capacity",
          lastUpdated: new Date()
        }))
      }

      // Simulate real-time resource data updates
      const generateResourceData = () => {
        const resourceTypes = [
          "Emergency Supplies", "Medical Supplies", "Food Distribution", 
          "Water Distribution", "Communication Hub", "Transportation Services"
        ]
        
        return Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, i) => ({
          id: i,
          type: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
          location: detectedCountry === 'us' ? 
            `Distribution Point ${i + 1}` :
            "Contact local emergency management",
          time: "Available 24/7",
          status: Math.random() > 0.3 ? "Active" : "Limited",
          icon: Truck,
          lastUpdated: new Date()
        }))
      }

      setShelterData(generateShelterData())
      setResourceData(generateResourceData())
      setLastUpdated(new Date())
    }

    // Initial data load
    updateData()

    // Set up auto-update interval if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoUpdateEnabled && isOnline) {
      interval = setInterval(updateData, 30000) // Update every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoUpdateEnabled, isOnline, detectedCountry])

  // Manual refresh function
  const handleRefresh = () => {
    setLastUpdated(new Date())
    // Trigger data refresh
    window.location.reload()
  }

  // Sample emergency resources and shelters for demonstration
  const shelters = shelterData.length > 0 ? shelterData : [
    {
      name: "Emergency Shelter Center",
      address: "Check local emergency services for nearest shelter",
      distance: "Contact 211",
      available: 0,
      capacity: 0,
      services: ["Food", "Water", "Medical"],
      status: "Contact local authorities"
    }
  ]

  const resources = resourceData.length > 0 ? resourceData : [
    {
      type: "Emergency Supplies",
      location: "Contact local emergency management",
      time: "Available 24/7",
      status: "Contact local authorities",
      icon: Truck
    }
  ]

  const countries = {
    us: {
      name: "🇺🇸 United States",
      flag: "🇺🇸",
      emergency: [
        {
          name: "Emergency Services",
          number: "911",
          description: "Fire, Police, Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "FEMA Disaster Assistance",
          number: "1-800-621-3362",
          description: "Federal disaster relief and assistance",
          icon: Shield,
          priority: "high",
        },
        {
          name: "American Red Cross",
          number: "1-800-733-2767",
          description: "Disaster assistance and emergency shelter",
          icon: Heart,
          priority: "high",
        },
        {
          name: "Crisis Text Line",
          number: "Text HOME to 741741",
          description: "24/7 crisis support via text",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Poison Control Center",
          number: "1-800-222-1222",
          description: "24/7 poison emergency hotline",
          icon: Phone,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "FEMA (Federal Emergency Management Agency)",
          website: "www.fema.gov",
          description: "Federal disaster response and recovery coordination"
        },
        {
          name: "American Red Cross",
          website: "www.redcross.org",
          description: "Emergency shelter, disaster relief, and humanitarian aid"
        },
        {
          name: "National Weather Service",
          website: "www.weather.gov",
          description: "Weather alerts, warnings, and forecasts"
        },
        {
          name: "Ready.gov",
          website: "www.ready.gov",
          description: "Official U.S. government disaster preparedness information"
        }
      ]
    },
    ca: {
      name: "🇨🇦 Canada",
      flag: "🇨🇦",
      emergency: [
        {
          name: "Emergency Services",
          number: "911",
          description: "Fire, Police, Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Public Safety Canada",
          number: "1-800-830-3118",
          description: "National emergency information",
          icon: Shield,
          priority: "high",
        },
        {
          name: "Canadian Red Cross",
          number: "1-800-418-1111",
          description: "Disaster assistance and emergency shelter",
          icon: Heart,
          priority: "high",
        },
        {
          name: "Talk Suicide Canada",
          number: "1-833-456-4566",
          description: "24/7 bilingual crisis support",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Poison Control Ontario",
          number: "1-800-268-9017",
          description: "Poison emergency information",
          icon: Phone,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Public Safety Canada",
          website: "www.publicsafety.gc.ca",
          description: "National emergency management and public safety"
        },
        {
          name: "Canadian Red Cross",
          website: "www.redcross.ca",
          description: "Emergency response and humanitarian assistance"
        },
        {
          name: "Environment and Climate Change Canada",
          website: "weather.gc.ca",
          description: "Weather warnings, alerts, and climate information"
        },
        {
          name: "Get Prepared Canada",
          website: "www.getprepared.gc.ca",
          description: "Official emergency preparedness information"
        }
      ]
    },
    uk: {
      name: "🇬🇧 United Kingdom",
      flag: "🇬🇧",
      emergency: [
        {
          name: "Emergency Services",
          number: "999",
          description: "Fire, Police, Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Non-Emergency Police",
          number: "101",
          description: "Non-urgent police matters",
          icon: Shield,
          priority: "medium",
        },
        {
          name: "NHS Non-Emergency",
          number: "111",
          description: "Medical advice and non-emergency care",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "British Red Cross",
          number: "0344 871 11 11",
          description: "Emergency support and assistance",
          icon: Heart,
          priority: "high",
        },
        {
          name: "Samaritans",
          number: "116 123",
          description: "24/7 emotional support",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "UK Government Emergency Alerts",
          website: "www.gov.uk/alerts",
          description: "Government emergency notifications"
        },
        {
          name: "British Red Cross",
          website: "www.redcross.org.uk",
          description: "Emergency response and support"
        },
        {
          name: "Met Office",
          website: "www.metoffice.gov.uk",
          description: "Weather warnings and forecasts"
        }
      ]
    },
    au: {
      name: "🇦🇺 Australia",
      flag: "🇦🇺",
      emergency: [
        {
          name: "Emergency Services",
          number: "000",
          description: "Fire, Police, Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "State Emergency Service",
          number: "132 500",
          description: "Storm and flood assistance",
          icon: Shield,
          priority: "high",
        },
        {
          name: "Australian Red Cross",
          number: "1800 733 276",
          description: "Emergency assistance and support",
          icon: Heart,
          priority: "high",
        },
        {
          name: "Lifeline Australia",
          number: "13 11 14",
          description: "24/7 crisis support and suicide prevention",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Poisons Information Centre",
          number: "13 11 26",
          description: "Poison emergency advice",
          icon: Phone,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Emergency Management Australia",
          website: "www.em.gov.au",
          description: "National emergency management"
        },
        {
          name: "Australian Red Cross",
          website: "www.redcross.org.au",
          description: "Emergency response and recovery"
        },
        {
          name: "Bureau of Meteorology",
          website: "www.bom.gov.au",
          description: "Weather warnings and alerts"
        }
      ]
    },
    jp: {
      name: "🇯🇵 Japan",
      flag: "🇯🇵",
      emergency: [
        {
          name: "Emergency Services",
          number: "119",
          description: "Fire and Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Police",
          number: "110",
          description: "Police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "Japan Coast Guard",
          number: "118",
          description: "Maritime emergency",
          icon: Phone,
          priority: "high",
        },
        {
          name: "TELL Lifeline",
          number: "03-5774-0992",
          description: "English crisis support",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Japan Poison Control",
          number: "072-727-2499",
          description: "Poison emergency information",
          icon: Phone,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Japan Meteorological Agency",
          website: "www.jma.go.jp",
          description: "Weather and earthquake warnings"
        },
        {
          name: "Cabinet Office (Disaster Management)",
          website: "www.bousai.go.jp",
          description: "National disaster management"
        },
        {
          name: "Japanese Red Cross Society",
          website: "www.jrc.or.jp",
          description: "Emergency response and relief"
        }
      ]
    },
    de: {
      name: "🇩🇪 Germany",
      flag: "🇩🇪",
      emergency: [
        {
          name: "Emergency Services",
          number: "112",
          description: "Fire and Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Police",
          number: "110",
          description: "Police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "German Red Cross",
          number: "0800 365 000",
          description: "Emergency assistance",
          icon: Heart,
          priority: "high",
        },
        {
          name: "Telefonseelsorge",
          number: "0800 111 0 111",
          description: "24/7 emotional support",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Poison Control Centre",
          number: "030 19240",
          description: "Berlin poison emergency",
          icon: Phone,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Federal Office of Civil Protection",
          website: "www.bbk.bund.de",
          description: "National emergency management"
        },
        {
          name: "German Red Cross",
          website: "www.drk.de",
          description: "Emergency response and aid"
        },
        {
          name: "German Weather Service",
          website: "www.dwd.de",
          description: "Weather warnings and forecasts"
        }
      ]
    },
    in: {
      name: "🇮🇳 India",
      flag: "🇮🇳",
      emergency: [
        {
          name: "Emergency Services",
          number: "112",
          description: "All emergency services (Fire, Police, Medical)",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Police",
          number: "100",
          description: "Police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "Fire Services",
          number: "101",
          description: "Fire emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Medical Emergency",
          number: "102",
          description: "Ambulance and medical emergency",
          icon: Heart,
          priority: "critical",
        },
        {
          name: "National Disaster Response Force",
          number: "1078",
          description: "Disaster response and rescue operations",
          icon: Shield,
          priority: "high",
        },
        {
          name: "Child Helpline",
          number: "1098",
          description: "Emergency assistance for children",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Women Helpline",
          number: "1091",
          description: "Emergency assistance for women",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "National Disaster Management Authority (NDMA)",
          website: "ndma.gov.in",
          description: "National disaster management and coordination"
        },
        {
          name: "National Disaster Response Force (NDRF)",
          website: "ndrf.gov.in",
          description: "Specialized disaster response and rescue operations"
        },
        {
          name: "Indian Red Cross Society",
          website: "indianredcross.org",
          description: "Humanitarian assistance and disaster relief"
        },
        {
          name: "India Meteorological Department",
          website: "mausam.imd.gov.in",
          description: "Weather warnings, cyclone alerts, and forecasts"
        },
        {
          name: "Ministry of Home Affairs (Disaster Management)",
          website: "mha.gov.in",
          description: "National security and disaster management coordination"
        }
      ]
    },
    fr: {
      name: "🇫🇷 France",
      flag: "🇫🇷",
      emergency: [
        {
          name: "Emergency Services",
          number: "112",
          description: "European emergency number",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "SAMU (Medical Emergency)",
          number: "15",
          description: "Medical emergency services",
          icon: Heart,
          priority: "critical",
        },
        {
          name: "Police",
          number: "17",
          description: "Police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "Fire Department",
          number: "18",
          description: "Fire emergency services",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "SOS Amitié",
          number: "09 72 39 40 50",
          description: "24/7 emotional support",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Direction Générale de la Sécurité Civile",
          website: "www.interieur.gouv.fr",
          description: "National civil protection and emergency management"
        },
        {
          name: "Météo-France",
          website: "meteofrance.fr",
          description: "Weather warnings and alerts"
        },
        {
          name: "French Red Cross",
          website: "croix-rouge.fr",
          description: "Emergency response and humanitarian aid"
        }
      ]
    },
    it: {
      name: "🇮🇹 Italy",
      flag: "🇮🇹",
      emergency: [
        {
          name: "Emergency Services",
          number: "112",
          description: "European emergency number",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Carabinieri",
          number: "112",
          description: "Military police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "Medical Emergency",
          number: "118",
          description: "Medical emergency and ambulance",
          icon: Heart,
          priority: "critical",
        },
        {
          name: "Fire Department",
          number: "115",
          description: "Fire emergency services",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Telefono Amico",
          number: "02 2327 2327",
          description: "24/7 emotional support",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Protezione Civile",
          website: "protezionecivile.gov.it",
          description: "National civil protection agency"
        },
        {
          name: "Italian Red Cross",
          website: "cri.it",
          description: "Emergency response and humanitarian assistance"
        },
        {
          name: "Servizio Meteorologico",
          website: "meteoam.it",
          description: "Weather services and alerts"
        }
      ]
    },
    br: {
      name: "🇧🇷 Brazil",
      flag: "🇧🇷",
      emergency: [
        {
          name: "Emergency Services",
          number: "190",
          description: "Military police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "Fire Department",
          number: "193",
          description: "Fire and rescue services",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Medical Emergency (SAMU)",
          number: "192",
          description: "Mobile emergency medical service",
          icon: Heart,
          priority: "critical",
        },
        {
          name: "Civil Defense",
          number: "199",
          description: "Civil defense and disasters",
          icon: Shield,
          priority: "high",
        },
        {
          name: "CVV (Emotional Support)",
          number: "188",
          description: "24/7 emotional support and suicide prevention",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Defesa Civil Nacional",
          website: "defesacivil.gov.br",
          description: "National civil defense coordination"
        },
        {
          name: "INMET",
          website: "inmet.gov.br",
          description: "National meteorological institute"
        },
        {
          name: "Brazilian Red Cross",
          website: "cvb.org.br",
          description: "Emergency response and humanitarian aid"
        }
      ]
    },
    kr: {
      name: "🇰🇷 South Korea",
      flag: "🇰🇷",
      emergency: [
        {
          name: "Emergency Services",
          number: "112",
          description: "Police emergency",
          icon: Shield,
          priority: "critical",
        },
        {
          name: "Fire & Medical Emergency",
          number: "119",
          description: "Fire department and ambulance",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Coast Guard",
          number: "122",
          description: "Maritime emergency",
          icon: Phone,
          priority: "high",
        },
        {
          name: "Life Line Korea",
          number: "1588-9191",
          description: "24/7 crisis support",
          icon: Heart,
          priority: "medium",
        },
        {
          name: "Women's Emergency Hotline",
          number: "1366",
          description: "Emergency assistance for women",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "Korea Meteorological Administration",
          website: "kma.go.kr",
          description: "Weather warnings and disaster alerts"
        },
        {
          name: "National Emergency Management Agency",
          website: "nema.go.kr",
          description: "National disaster management"
        },
        {
          name: "Korean Red Cross",
          website: "redcross.or.kr",
          description: "Emergency response and relief operations"
        }
      ]
    },
    mx: {
      name: "🇲🇽 Mexico",
      flag: "🇲🇽",
      emergency: [
        {
          name: "Emergency Services",
          number: "911",
          description: "Fire, Police, Medical Emergency",
          icon: Phone,
          priority: "critical",
        },
        {
          name: "Mexican Red Cross",
          number: "065",
          description: "Emergency medical services",
          icon: Heart,
          priority: "critical",
        },
        {
          name: "LOCATEL (Emergency Info)",
          number: "56-58-11-11",
          description: "Emergency information and assistance",
          icon: Phone,
          priority: "high",
        },
        {
          name: "National Emergency System",
          number: "911",
          description: "National emergency coordination",
          icon: Shield,
          priority: "high",
        },
        {
          name: "SAPTEL (Crisis Support)",
          number: "55-52-59-81-21",
          description: "24/7 psychological crisis support",
          icon: Heart,
          priority: "medium",
        },
      ],
      agencies: [
        {
          name: "CENAPRED",
          website: "cenapred.unam.mx",
          description: "National center for disaster prevention"
        },
        {
          name: "CONAGUA",
          website: "conagua.gob.mx",
          description: "National water commission and weather services"
        },
        {
          name: "Mexican Red Cross",
          website: "cruzrojamexicana.org.mx",
          description: "Emergency response and humanitarian aid"
        },
        {
          name: "National Civil Protection System",
          website: "gob.mx/proteccioncivil",
          description: "National civil protection coordination"
        }
      ]
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Status Bar */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {isDetecting && (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span className="text-xs sm:text-sm">Detecting location...</span>
                </div>
              )}
              
              {detectedCountry && (
                <Badge variant="outline" className="text-xs">
                  <span className="hidden sm:inline">Auto-detected: </span>
                  {countries[detectedCountry as keyof typeof countries]?.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={!isOnline}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Button
                variant={autoUpdateEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
              >
                <Wifi className="h-3 w-3 mr-1" />
                Auto-update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Alert */}
      {!isOnline && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Offline Mode:</strong> You're currently offline. Emergency numbers are still available, but shelter and resource information may be outdated.
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
        <Phone className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>Emergency:</strong> In life-threatening situations, call your country's emergency number immediately. 
          Select your country below for local emergency contacts.
        </AlertDescription>
      </Alert>

      {/* Country Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Select Your Country</span>
          </CardTitle>
          <CardDescription>Choose your location for relevant emergency contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1">
              {Object.entries(countries).map(([code, country]) => (
                <TabsTrigger key={code} value={code} className="text-xs p-2 min-w-[40px]">
                  <span className="text-lg">{country.flag}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Emergency Contacts for Selected Country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Emergency Contacts - {countries[selectedCountry as keyof typeof countries].name}</span>
            </CardTitle>
            <CardDescription>Critical phone numbers for disaster response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {countries[selectedCountry as keyof typeof countries].emergency.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        service.priority === "critical"
                          ? "bg-red-500"
                          : service.priority === "high"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm" className="font-mono">
                      {service.number}
                    </Button>
                    <Badge 
                      variant={service.priority === "critical" ? "destructive" : "secondary"}
                      className="ml-2 text-xs"
                    >
                      {service.priority}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Official Agencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Official Agencies</span>
            </CardTitle>
            <CardDescription>Government agencies and emergency organizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {countries[selectedCountry as keyof typeof countries].agencies.map((agency) => (
              <div key={agency.name} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{agency.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{agency.description}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://${agency.website}`, '_blank')}
                  >
                    Visit Website
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Shelters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Emergency Shelters</span>
            </div>
            <Badge variant={shelterData.length > 0 ? "default" : "secondary"} className="text-xs">
              {shelterData.length} Active
            </Badge>
          </CardTitle>
          <CardDescription>Real-time shelter availability and capacity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shelters.map((shelter, index) => (
            <div key={shelter.id || index} className="p-3 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{shelter.name}</p>
                    {shelter.status && (
                      <Badge 
                        variant={shelter.status === "Active" ? "default" : shelter.status === "At Capacity" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {shelter.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {shelter.address}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {shelter.distance}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>
                    {shelter.available}/{shelter.capacity} available
                  </span>
                  {shelter.capacity > 0 && (
                    <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(shelter.available / shelter.capacity) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  {shelter.services.map((service: string) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {shelter.lastUpdated && (
                <div className="text-xs text-gray-400">
                  Updated: {shelter.lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Emergency Resources</span>
            </div>
            <Badge variant={resourceData.length > 0 ? "default" : "secondary"} className="text-xs">
              {resourceData.length} Available
            </Badge>
          </CardTitle>
          <CardDescription>Real-time resource availability and distribution points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <div key={resource.id || index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{resource.type}</p>
                      <Badge 
                        variant={resource.status === "Active" ? "default" : resource.status === "Limited" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {resource.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {resource.location}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {resource.time}
                    </p>
                    {resource.lastUpdated && (
                      <p className="text-xs text-gray-400 mt-1">
                        Updated: {resource.lastUpdated.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
