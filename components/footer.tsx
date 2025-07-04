"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Shield,
  Activity,
  Users,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  Satellite,
  AlertTriangle,
  TrendingUp,
  Clock,
  Info
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white mt-8 lg:mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-3 sm:space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">DisasterSense</h3>
                <p className="text-xs sm:text-sm text-slate-400">Global Risk Monitoring</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="hidden sm:inline">
                Real-time disaster intelligence platform providing live alerts, predictive analytics, 
                and actionable insights for emergency response and disaster preparedness worldwide.
              </span>
              <span className="sm:hidden">
                Real-time disaster intelligence platform with live alerts and emergency response insights.
              </span>
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a href="https://github.com/ishan22399" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-white hover:bg-slate-800">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </a>
              <a href="https://twitter.com/IshanShivankar" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-white hover:bg-slate-800">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/ishan-shivankar/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-white hover:bg-slate-800">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </a>
            </div>
          </div>

            {/* Data Sources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Data Sources</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">NASA EONET</span>
                <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Live
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">USGS Earthquakes</span>
                <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Live
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">OpenWeatherMap</span>
                <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  API
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">News API</span>
                <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  Feed
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm mt-3">
                <span>Status:</span>
                <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  All Systems Operational
                </Badge>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              © {currentYear} DisasterSense. Built by{" "}
              <span className="text-blue-400 font-medium">Ishan Shivankar</span>. 
              All rights reserved.
            </div>

            
          </div>
        </div>
      
      </div>
    </footer>
  )
}
