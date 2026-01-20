# DisasterSense: Global Risk & Response Dashboard

## 📖 Project Title

_DisasterSense: Global Risk & Response Dashboard_  
A real-time, interactive platform for monitoring, analyzing, and responding to natural disasters worldwide.

---

## 📝 Project Description

DisasterSense is designed to provide actionable insights and comprehensive monitoring of natural disasters using live data from trusted sources. The dashboard empowers emergency responders, researchers, and the public with real-time alerts, predictive analytics, and interactive visualizations.

- **Motivation:** To make disaster data accessible, actionable, and visually insightful for everyone.
- **Why:** To help communities, governments, and organizations respond faster and smarter to disasters.
- **Problem Solved:** Aggregates and analyzes global disaster data in one place, making it easy to understand and act upon.
- **What I Learned:** Integrating multiple APIs, handling real-time data, and building user-friendly dashboards.
- **What Makes It Stand Out:** Combines live mapping, AI-powered analytics, and multi-source data in a single, modern UI.

---

## 📚 Table of Contents

- [Project Title](#project-title)
- [Project Description](#project-description)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration & API Keys](#configuration--api-keys)
- [Live Demo](#live-demo)
- [Credits](#credits)
- [License](#license)
- [Badges](#badges)
- [Contributing](#contributing)
- [Tests](#tests)
- [Contact](#contact)

---

## ✨ Features

- 🌍 **Live Disaster Map**: Interactive map with real-time disaster markers and severity-based coloring.
- 🔍 **Location Search**: Search any place globally or use your current location for instant insights.
- ☁️ **Real-Time Weather & AQI**: Fetches current weather and air quality index (AQI) from multiple reliable sources.
- 🛰️ **Satellite Intelligence**: Simulated AI-powered damage heatmaps, predictive paths, and change detection.
- 📰 **News & Alerts**: Aggregates disaster-related news and urgent alerts.
- 📞 **Emergency Contacts**: Country-specific emergency numbers and resources.
- 📱 **Responsive UI**: Optimized for desktop, tablet, and mobile.

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.12+ (for backend)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard.git
cd DisasterSense-Global-Risk-Response-Dashboard
```

### 2. Backend Setup (FastAPI + Python)

```bash
cd backend
pip install -r requirements.txt
```

Configure environment variables in `backend/.env`:
```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=disaster_sense
USGS_ENDPOINT=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
NASA_EVENTS_ENDPOINT=https://eonet.gsfc.nasa.gov/api/v2.1/events
OPENWEATHER_API_KEY=your_key
AQICN_API_KEY=your_key
NEWS_API_KEY=your_key
YOUTUBE_API_KEY=your_key
GOOGLE_GEOCODING_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

### 3. Frontend Setup (Next.js + React)

```bash
cd frontend
npm install
# or
yarn install
```

Configure environment variables in `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```
(Use the Render backend URL for production)

---

## ⚙️ Configuration & API Keys

### Required API Keys

This project uses several external APIs. Set these in your respective `.env` files:

#### Backend (backend/.env)
```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
AQICN_API_KEY=your_aqicn_api_key
NEWS_API_KEY=your_newsapi_key
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_API_KEY=your_google_api_key
MONGO_URL=your_mongodb_atlas_connection_string
```

#### Frontend (frontend/.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

### API Key Sources
- **Google APIs**: https://console.cloud.google.com
- **OpenWeatherMap**: https://openweathermap.org/api
- **AQICN**: https://aqicn.org/api/
- **NewsAPI**: https://newsapi.org
- **YouTube Data API**: https://developers.google.com/youtube/v3
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

**Note:** Do NOT commit `.env` or `.env.local` files. Only `.env.example` is version-controlled.

---

## ▶️ Usage

### Development Mode

**1. Start the Backend (in a terminal):**
```bash
cd backend
python server.py
```
Backend runs on `http://localhost:8001` and starts the APScheduler for real-time data ingestion.

**2. Start the Frontend (in another terminal):**
```bash
cd frontend
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
See [Render Deployment](#deployment) section below.

---

## 🌐 Live Demo

- **Frontend**: [https://disaster-sense-global-risk-response.vercel.app/](https://disaster-sense-global-risk-response.vercel.app/)
- **Backend API**: [https://disastersense-global-risk-response.onrender.com](https://disastersense-global-risk-response.onrender.com)

---

## 🚀 Deployment

### Backend Deployment (Render)

The backend is deployed on Render with the following configuration:

**Build Command:**
```bash
pip install -r backend/requirements.txt
```

**Start Command:**
```bash
gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

**Environment Variables (set in Render dashboard):**
- MONGO_URL (Secret)
- OPENWEATHER_API_KEY (Secret)
- AQICN_API_KEY (Secret)
- NEWS_API_KEY (Secret)
- YOUTUBE_API_KEY (Secret)
- GOOGLE_GEOCODING_API_KEY (Secret)
- GOOGLE_MAPS_API_KEY (Secret)
- GOOGLE_API_KEY (Secret)
- DB_NAME = disaster_sense
- CORS_ORIGINS = *

### Frontend Deployment (Vercel)

Deploy the frontend folder to Vercel:
```bash
npm install -g vercel
cd frontend
vercel
```

Set `NEXT_PUBLIC_BACKEND_URL` in Vercel environment variables to your Render backend URL.

---

## 🙏 Credits

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet.js](https://leafletjs.com/)

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- [Python](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/)
- [APScheduler](https://apscheduler.readthedocs.io/)
- [Pydantic](https://docs.pydantic.dev/)

### Data Sources & APIs
- [OpenWeatherMap](https://openweathermap.org/)
- [AQICN](https://aqicn.org/api/)
- [Google Maps & Air Quality APIs](https://developers.google.com/maps/documentation)
- [NewsAPI](https://newsapi.org/)
- [NASA EONET](https://eonet.gsfc.nasa.gov/)
- [USGS Earthquake API](https://earthquake.usgs.gov/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🏅 Badges

[![GitHub stars](https://img.shields.io/github/stars/ishan22399/DisasterSense-Global-Risk-Response-Dashboard?style=social)](https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ishan22399/DisasterSense-Global-Risk-Response-Dashboard?style=social)](https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard/network/members)
[![GitHub issues](https://img.shields.io/github/issues/ishan22399/DisasterSense-Global-Risk-Response-Dashboard)](https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/ishan22399/DisasterSense-Global-Risk-Response-Dashboard)](https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard/commits/main)

---

## 🤝 Contributing

Contributions are welcome!  
To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'feat: Add new feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## 🧪 Tests

If you have tests, describe how to run them here.  
Example:
```bash
npm run test
```

---

## 📬 Contact

Built with ❤️ by [Ishan Shivankar](https://www.linkedin.com/in/ishan-shivankar/).

- **GitHub**: [ishan22399](https://github.com/ishan22399)
- **LinkedIn**: [Ishan Shivankar](https://www.linkedin.com/in/ishan-shivankar/)
- **Twitter**: [@IshanShivankar](https://twitter.com/IshanShivankar)

---
