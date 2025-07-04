# DisasterSense: Global Risk & Response Dashboard

## 🌟 Overview
DisasterSense is a real-time intelligence platform designed to provide actionable insights and comprehensive monitoring of natural disasters worldwide. Leveraging various data sources, it offers live alerts, predictive analytics, and interactive visualizations to enhance emergency response and disaster preparedness.

## ✨ Features

### Interactive Dashboard
- **Live Data Updates**: Real-time data refresh with configurable intervals and manual refresh option.
- **Connection Status**: Visual indicators for API connectivity and data freshness.
- **Critical Alerts**: Prominent display of high-severity disaster warnings.
- **Key Metrics**: Overview of active disasters, affected populations, and overall risk levels.
- **Responsive Design**: Optimized for seamless experience across desktop, tablet, and mobile devices.

### 🗺️ Live Map
- **Dynamic Disaster Markers**: Visual representation of disaster locations with severity-based coloring.
- **Detailed Popups**: Clickable markers reveal comprehensive information about each incident.
- **Map Layer Selection**: Switch between Street, Satellite, Terrain, and Dark map styles.
- **Auto-fitting**: Map adjusts to display all active disaster locations.

### 🛰️ Satellite Intelligence Hub
- **Location Search**: Search for any location worldwide with intelligent suggestions.
- **Current Location Detection**: Automatically pinpoint and display data for your current geographical position.
- **Real-time Local Data**: Fetches current weather conditions and Air Quality Index (AQI) for selected locations.
- **Damage Assessment (Simulated)**: Visualizes potential impact areas with heatmaps.
- **Predictive Paths (Simulated)**: Shows potential future trajectories of certain disasters.
- **Change Detection (Simulated)**: Highlights environmental changes over time.

### 📈 Risk Analysis
- **Regional Risk Breakdown**: Visualizes disaster risk levels by geographical region.
- **AI Risk Predictions (Simulated)**: Forecasts potential risk trends based on machine learning models.
- **Disaster Type & Severity Distribution**: Charts illustrating the breakdown of active incidents.

### 📰 News & Alerts
- **Latest Disaster News**: Aggregates real-time news articles related to natural disasters.
- **Urgency Indicators**: Highlights critical news with "URGENT" badges.
- **Source & Time Tracking**: Displays news source and publication time.

### 📞 Emergency Contacts
- **Country-Specific Contacts**: Provides critical emergency numbers and official agency information based on selected or auto-detected country.
- **Shelter & Resource Availability (Simulated)**: Real-time updates on emergency shelters and resource distribution points.

## 🚀 Technologies Used

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Mapping**: Leaflet.js, React-Leaflet
- **Data Fetching**: Native Fetch API
- **Icons**: Lucide React

## 🔑 API Keys & Setup

This project utilizes several external APIs to fetch real-time data. Some require API keys, which must be configured as environment variables.

1.  **AQICN (World Air Quality Index Project)**
    *   **Purpose**: Provides comprehensive Air Quality Index (AQI) data.
    *   **Setup**:
        *   Visit: [AQICN](https://aqicn.org/api/) to obtain your free API token.
        *   **Environment Variable**: `AQICN_API_KEY`

2.  **OpenWeatherMap API (Optional - for weather data)**
    *   **Purpose**: Fetches current weather conditions (temperature, wind, humidity, etc.).
    *   **Setup**:
        *   Visit: [OpenWeatherMap API](https://openweathermap.org/api)
        *   Sign up for a free account.
        *   Obtain your API key.
    *   **Environment Variable**: `OPENWEATHER_API_KEY`

3.  **NewsAPI (Optional - for disaster news)**
    *   **Purpose**: Aggregates news articles related to disasters.
    *   **Setup**:
        *   Visit: [NewsAPI.org](https://newsapi.org/)
        *   Sign up for a free account (note: free tier has request limits).
        *   Obtain your API key.
    *   **Environment Variable**: `NEWS_API_KEY`

4.  **USGS Earthquake API (No key required)**
    *   **Purpose**: Provides real-time earthquake data worldwide.
    *   **Note**: This API is completely free and does not require any registration or API key.

## 🛠️ Installation & Local Development

To set up the project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard.git
    cd DisasterSense-Global-Risk-Response-Dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    # or
    yarn install --legacy-peer-deps
    ```

3.  **Configure Environment Variables**:
    *   Create a `.env.local` file in the root of your project.
    *   Add your API keys to this file (replace `your_key_here` with your actual keys):
        ```
        AQICN_API_KEY=your_aqicn_key_here
        OPENWEATHER_API_KEY=your_openweathermap_key_here
        NEWS_API_KEY=your_newsapi_key_here
        ```

4.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🌐 Deployment

This application is optimized for deployment on **Vercel**, the platform built by the creators of Next.js.

1.  **Push to Git**: Ensure your project is pushed to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Connect to Vercel**:
    *   Sign up or log in to [Vercel](https://vercel.com/).
    *   Import your Git repository.
    *   Vercel will automatically detect it's a Next.js project.
3.  **Configure Environment Variables on Vercel**:
    *   In your Vercel project settings, navigate to "Environment Variables".
    *   Add `AQICN_API_KEY`, `OPENWEATHER_API_KEY`, and `NEWS_API_KEY` with their respective values.
4.  **Deploy**: Vercel will build and deploy your application. Subsequent pushes to your connected Git branch will trigger automatic redeployments.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, bug fixes, or new features, please feel free to:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

## ⚖️ License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 📧 Contact & Credits

Built with ❤️ by [Ishan Shivankar](https://www.linkedin.com/in/ishan-shivankar/).

- **GitHub**: [ishan22399](https://github.com/ishan22399)
- **LinkedIn**: [Ishan Shivankar](https://www.linkedin.com/in/ishan-shivankar/)
- **Twitter**: [@IshanShivankar](https://twitter.com/IshanShivankar)
