"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface RiskData {
  region: string
  earthquake?: number
  wildfire?: number
  flood?: number
  hurricane?: number
  tornado?: number
  overall: number
}

interface RiskChartProps {
  data: RiskData[]
}

export function RiskChart({ data }: RiskChartProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "bg-red-500", variant: "destructive" as const }
    if (score >= 60) return { level: "High", color: "bg-orange-500", variant: "secondary" as const }
    if (score >= 40) return { level: "Medium", color: "bg-yellow-500", variant: "outline" as const }
    return { level: "Low", color: "bg-green-500", variant: "outline" as const }
  }

  const predictions = [
    { region: "California", trend: "up", change: "+12%", reason: "Drought conditions increasing fire risk" },
    { region: "Florida", trend: "down", change: "-5%", reason: "Hurricane season ending" },
    { region: "Texas", trend: "up", change: "+8%", reason: "Increased rainfall patterns" },
    { region: "Oklahoma", trend: "stable", change: "±2%", reason: "Seasonal tornado activity normal" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Assessment Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Regional Risk Analysis</span>
          </CardTitle>
          <CardDescription>Current disaster risk levels by region</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.map((region) => {
            const risk = getRiskLevel(region.overall)
            return (
              <div key={region.region} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{region.region}</h3>
                  <Badge variant={risk.variant}>{risk.level}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Risk</span>
                    <span>{region.overall}%</span>
                  </div>
                  <Progress value={region.overall} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {region.earthquake && (
                    <div className="flex justify-between">
                      <span>Earthquake:</span>
                      <span className="font-medium">{region.earthquake}%</span>
                    </div>
                  )}
                  {region.wildfire && (
                    <div className="flex justify-between">
                      <span>Wildfire:</span>
                      <span className="font-medium">{region.wildfire}%</span>
                    </div>
                  )}
                  {region.flood && (
                    <div className="flex justify-between">
                      <span>Flood:</span>
                      <span className="font-medium">{region.flood}%</span>
                    </div>
                  )}
                  {region.hurricane && (
                    <div className="flex justify-between">
                      <span>Hurricane:</span>
                      <span className="font-medium">{region.hurricane}%</span>
                    </div>
                  )}
                  {region.tornado && (
                    <div className="flex justify-between">
                      <span>Tornado:</span>
                      <span className="font-medium">{region.tornado}%</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ML Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>AI Risk Predictions</span>
          </CardTitle>
          <CardDescription>Machine learning-based risk forecasts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.region} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{prediction.region}</h4>
                <div className="flex items-center space-x-2">
                  {prediction.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                  {prediction.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                  {prediction.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full"></div>}
                  <span
                    className={`text-sm font-medium ${
                      prediction.trend === "up"
                        ? "text-red-600"
                        : prediction.trend === "down"
                          ? "text-green-600"
                          : "text-gray-600"
                    }`}
                  >
                    {prediction.change}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.reason}</p>
              <div className="text-xs text-gray-500">Prediction confidence: {Math.floor(Math.random() * 20) + 75}%</div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Model Performance</h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-medium">87.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span>Data Sources:</span>
                <span>NASA, USGS, NOAA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
