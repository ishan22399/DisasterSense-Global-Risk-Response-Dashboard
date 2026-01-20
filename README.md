# DisasterSense: Global Risk & Response Dashboard

A real-time, interactive platform for monitoring and responding to natural disasters worldwide. Built with Next.js (frontend) and FastAPI (backend), DisasterSense aggregates data from multiple trusted sources including USGS, NASA, NewsAPI, and weather services.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🌍 **Live Disaster Map** - Real-time markers with severity-based coloring
- 🔍 **Location Search** - Global search or current location insights
- ☁️ **Weather & Air Quality** - Real-time data from OpenWeatherMap and AQICN
- 🛰️ **Satellite Intelligence** - Damage assessment and change detection
- 📰 **News & Alerts** - Aggregated disaster-related news
- 📞 **Emergency Contacts** - Country-specific emergency resources
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.9 + React 18.2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Mapping:** Leaflet.js
- **State Management:** React Hooks

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** MongoDB Atlas
- **Scheduling:** APScheduler (1-minute intervals)
- **Geospatial:** MongoDB geospatial queries
- **Async:** Python asyncio

### Data Sources
- USGS Earthquake API
- NASA EONET Events
- NewsAPI (8 disaster queries)
- OpenWeatherMap
- AQICN (Air Quality)
- YouTube Data API
- Google Geocoding API

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.12+
- MongoDB Atlas account
- API keys (see [Environment Setup](#environment-setup))

### Clone Repository
```bash
git clone https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard.git
cd DisasterSense-Global-Risk-Response-Dashboard
```

---

## ⚙️ Environment Setup

### 1. Backend Configuration

Create `backend/.env`:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=disaster_sense
OPENWEATHER_API_KEY=your_key
AQICN_API_KEY=your_key
NEWS_API_KEY=your_key
YOUTUBE_API_KEY=your_key
GOOGLE_GEOCODING_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

### 2. Frontend Configuration

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

**For production:** Use your Render backend URL

### API Key Sources
| Service | URL |
|---------|-----|
| Google Cloud | https://console.cloud.google.com |
| OpenWeatherMap | https://openweathermap.org/api |
| AQICN | https://aqicn.org/api/ |
| NewsAPI | https://newsapi.org |
| YouTube | https://developers.google.com/youtube/v3 |
| MongoDB | https://www.mongodb.com/cloud/atlas |

---

## 🏃 Running Locally

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```
Backend: `http://localhost:8001`

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:3000`

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel
```
Set environment variable: `NEXT_PUBLIC_BACKEND_URL=your_render_backend_url`

### Backend (Render)

**Build Command:**
```bash
pip install -r backend/requirements.txt
```

**Start Command:**
```bash
gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

**Environment Variables:** Set all API keys in Render dashboard as Secret variables

**Live:** https://disastersense-global-risk-response.onrender.com

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## ⚖️ License

MIT License - See [LICENSE](LICENSE) file

---

## 📬 Contact

Built by [Ishan Shivankar](https://github.com/ishan22399)

- **GitHub:** [ishan22399](https://github.com/ishan22399)
- **LinkedIn:** [Ishan Shivankar](https://www.linkedin.com/in/ishan-shivankar/)
