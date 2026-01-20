"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.resetError} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Try again</span>
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export function MapErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg">
      <AlertTriangle className="h-8 w-8 text-orange-500 mb-3" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">Map Loading Error</h3>
      <p className="text-gray-600 mb-4 text-center max-w-sm">
        {error?.message?.includes('Map container') 
          ? 'Map container conflict. This usually resolves automatically.'
          : 'Unable to load the interactive map. Please try again.'}
      </p>
      <Button onClick={resetError} size="sm" className="flex items-center space-x-2">
        <RefreshCw className="h-4 w-4" />
        <span>Reload Map</span>
      </Button>
    </div>
  )
}
