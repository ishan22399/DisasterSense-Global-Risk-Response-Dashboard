"use client"

import { NewsPanel } from "@/components/news-panel"

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            News & Alerts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time disaster news and emergency alerts from around the world
          </p>
        </div>
        
        <NewsPanel />
      </div>
    </div>
  )
}