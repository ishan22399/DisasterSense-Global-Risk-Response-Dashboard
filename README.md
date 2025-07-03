# Disaster Dashboard Setup Guide

## Overview
This disaster dashboard uses legitimate APIs to provide real-time disaster data:

## API Keys Required (All Free)

### 1. OpenWeatherMap API (Optional - for weather alerts)
- Visit: https://openweathermap.org/api
- Sign up for a free account
- Get your API key
- Add to `.env.local`: `NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here`

### 2. NewsAPI (Optional - for disaster news)
- Visit: https://newsapi.org/
- Sign up for a free account (100 requests/day)
- Get your API key
- Add to `.env.local`: `NEXT_PUBLIC_NEWS_API_KEY=your_key_here`

### 3. USGS Earthquake API (No key required)
- This is completely free and doesn't require registration
- Provides real-time earthquake data worldwide
- Already configured in the app

## Data Sources

### Real-time Data:
- **Earthquakes**: USGS Earthquake Hazards Program API
  - Provides real-time earthquake data globally
  - Magnitude 4.0+ earthquakes from the last 7 days
  - Includes location, magnitude, time, and details

### Mock Data (for demonstration):
- **Wildfires**: Simulated data based on common wildfire locations
- **Hurricanes**: Simulated data based on hurricane-prone areas
- **Floods**: Can be extended with real APIs like NOAA

## Features

### Interactive Map
- **Real Leaflet.js map** with OpenStreetMap tiles
- **Disaster markers** with severity-based colors
- **Popup details** for each disaster
- **Auto-fitting** to show all disasters
- **Click handling** for detailed information

### Live Data Updates
- **Auto-refresh** every 5 minutes
- **Manual refresh** button
- **Connection status** indicator
- **Error handling** with fallback to cached data

### API Integration
- **Earthquake data** from USGS (real-time)
- **Weather alerts** from OpenWeatherMap (with API key)
- **News integration** from NewsAPI (with API key)
- **Fallback mock data** when APIs are unavailable

## Installation

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure API keys** (optional):
   - Copy `.env.local.example` to `.env.local`
   - Add your API keys

3. **Run the application**:
   ```bash
   npm run dev
   ```

## Usage

- The app will work immediately with earthquake data (no API key required)
- Add API keys for weather alerts and news integration
- The map shows real earthquake data from the last 7 days
- Click on markers for detailed information
- Use the refresh button to update data manually

## API Endpoints

### Local API Routes:
- `GET /api/disasters` - Fetch all disaster data
- Parameters:
  - `minMagnitude` (default: 4.0)
  - `daysBack` (default: 7)

### External APIs Used:
- **USGS**: `https://earthquake.usgs.gov/fdsnws/event/1/query`
- **OpenWeatherMap**: `https://api.openweathermap.org/data/3.0/onecall`
- **NewsAPI**: `https://newsapi.org/v2/everything`

## Development

The app is built with:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Leaflet.js** for interactive maps
- **shadcn/ui** for UI components
- **Axios** for API requests

## Legal & Ethical

All APIs used are legitimate and free:
- USGS data is public domain
- OpenWeatherMap has a free tier
- NewsAPI has a free tier
- OpenStreetMap is open source

No copyrighted or unauthorized data sources are used.
