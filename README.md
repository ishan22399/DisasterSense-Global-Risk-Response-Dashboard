# DisasterSense: Near-Real-Time Disaster Monitoring System

A production-grade geospatial monitoring system with automated data pipelines, multi-source integration, and rule-based risk assessment for tracking global disaster events.

---

## 📖 Overview

**DisasterSense** is a map-centric operational dashboard for monitoring natural disasters using authoritative data sources. The system features a **backend ingestion pipeline** that runs scheduled data collection, normalization, geospatial validation, and risk scoring—ensuring data quality and temporal consistency.

### What This Project Demonstrates

- **Near-real-time data ingestion** via scheduled background pipelines (10-minute intervals)
- **Multi-source data normalization** from USGS, NASA EONET, and weather APIs
- **Event lifecycle management** with state transitions (CREATED → UPDATED → RESOLVED/EXPIRED)
- **Rule-based geospatial risk scoring** (deterministic, explainable)
- **Geospatial quality validation** (deduplication, clustering, coordinate validation)
- **Temporal consistency checks** with auto-expiry rules
- **Full-stack architecture** (FastAPI backend + Next.js frontend + MongoDB)

> **Note:** This is an engineering-focused project demonstrating system design, not predictive ML. Risk assessment uses multi-factor heuristics, not machine learning.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│     External Data Sources               │
│  (USGS, NASA EONET, OpenWeatherMap)    │
└────────────┬────────────────────────────┘
             │
             v
┌─────────────────────────────────────────┐
│      FastAPI Backend Pipeline           │
│  ┌────────────────────────────────────┐ │
│  │ Background Scheduler (10 min)      │ │
│  │  - Multi-source ingestion          │ │
│  │  - Data normalization              │ │
│  │  - Geospatial validation           │ │
│  │  - Event deduplication             │ │
│  │  - Risk scoring                    │ │
│  │  - Lifecycle management            │ │
│  └────────────────────────────────────┘ │
│               ↓                          │
│  ┌────────────────────────────────────┐ │
│  │    MongoDB (Event Store)           │ │
│  │  - Lifecycle states                │ │
│  │  - Audit trail                     │ │
│  │  - Temporal history                │ │
│  └────────────────────────────────────┘ │
│               ↓                          │
│  ┌────────────────────────────────────┐ │
│  │    REST API Layer                  │ │
│  └────────────────────────────────────┘ │
└────────────┬────────────────────────────┘
             │
             v
┌─────────────────────────────────────────┐
│      Next.js Frontend                   │
│  - Interactive map (Leaflet)            │
│  - Event lifecycle display              │
│  - Risk score visualization             │
│  - Analyst-friendly UI                  │
└─────────────────────────────────────────┘
```

---

## ✨ Key Features

### Backend Pipeline
- **Scheduled Ingestion**: Automated data fetching every 10 minutes
- **Multi-Source Integration**: USGS earthquakes, NASA EONET events, weather alerts
- **Data Normalization**: Unified event schema across different sources
- **Geospatial Validation**: 
  - Duplicate detection (50km radius, 6-hour window)
  - Event clustering (100km radius)
  - Coordinate validation
- **Event Lifecycle**: 
  - State machine: CREATED → UPDATED → RESOLVED/EXPIRED
  - Full audit trail with timestamps
  - Auto-expiry after 7 days of inactivity
- **Rule-Based Risk Scoring**:
  - Multi-factor assessment (severity, population, temporal, recurrence)
  - Deterministic and explainable
  - No black-box ML

### Frontend Dashboard
- **Live Map**: Interactive Leaflet map with real-time markers
- **Event Details**: Severity-based color coding, affected population
- **Lifecycle Visualization**: Display event states and history
- **Risk Assessment Display**: Show calculated risk scores with explanations
- **Responsive Design**: Desktop-first, analyst-friendly interface
- **Real-Time Updates**: Auto-refresh with live data indicators

---

## 🛠️ Technology Stack

**Backend:**
- FastAPI (Python 3.11+)
- MongoDB with Motor (async driver)
- APScheduler (background jobs)
- Requests (HTTP client)

**Frontend:**
- Next.js 15
- React 18
- TypeScript
- Leaflet.js (maps)
- Tailwind CSS
- shadcn/ui components

**Data Sources:**
- USGS Earthquake API (real-time, no key required)
- NASA EONET API (global disasters, no key required)
- OpenWeatherMap API (severe weather, free tier)
- AQICN API (air quality, free tier)

---

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys (optional - USGS and NASA work without keys)

# Run backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The backend will:
- Start the FastAPI server on port 8001
- Initialize background scheduler
- Begin ingesting data every 10 minutes
- Store events in MongoDB

### Frontend Setup

```bash
cd disaster-dashboard
yarn install

# Configure environment
cp .env.example .env.local
# Add API keys if needed

# Run frontend
yarn dev
```

Frontend will be available at http://localhost:3000

---

## ⚙️ Configuration

### API Keys (Optional but Recommended)

```env
# Required for backend
OPENWEATHER_API_KEY=your_key_here
AQICN_API_KEY=your_key_here
NEWS_API_KEY=your_key_here

# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=disaster_sense
```

**Free API Keys:**
- OpenWeatherMap: https://openweathermap.org/api (1000 requests/day)
- AQICN: https://aqicn.org/api/ (free tier available)
- NewsAPI: https://newsapi.org/ (100 requests/day)

**No Keys Required:**
- USGS Earthquake API
- NASA EONET API

---

## 🚀 Usage

### Accessing the Dashboard
Navigate to http://localhost:3000 to view the live dashboard.

### API Endpoints

**Health Check:**
```bash
GET /api/health
```

**Get Disasters:**
```bash
GET /api/disasters?limit=50&severity=high&days=7
```

**Get Disaster by ID:**
```bash
GET /api/disasters/{event_id}
```

**Get Statistics:**
```bash
GET /api/disasters/stats/overview
```

**Manual Ingestion Trigger:**
```bash
POST /api/disasters/trigger-ingestion
```

**Get Ingestion Stats:**
```bash
GET /api/ingestion/stats
```

---

## 📊 Event Lifecycle Management

Events progress through the following states:

1. **CREATED**: New event detected from data sources
2. **UPDATED**: Event data changed (severity, population, etc.)
3. **RESOLVED**: Manually marked as resolved
4. **EXPIRED**: Auto-expired after 7 days of inactivity

Each transition is logged with:
- Timestamp
- Reason for transition
- Changed fields
- Full audit trail

---

## 🎯 Rule-Based Risk Scoring

Risk score is calculated using four weighted factors:

```
Total Risk Score = 
  (Severity × 0.40) + 
  (Population Impact × 0.30) + 
  (Temporal Factor × 0.20) + 
  (Recurrence Factor × 0.10)
```

**Factors:**
- **Severity (40%)**: Based on disaster type and magnitude
- **Population Impact (30%)**: Logarithmic scale of affected population
- **Temporal (20%)**: Recency and ongoing status
- **Recurrence (10%)**: Clustering of similar events in region

**Risk Levels:**
- 80-100: CRITICAL
- 60-79: HIGH  
- 40-59: MODERATE
- 0-39: LOW

---

## 🌐 Data Sources

### USGS Earthquake API
- **Authority**: U.S. Geological Survey
- **Coverage**: Global earthquakes (magnitude 4.0+)
- **Update Frequency**: Real-time
- **API Key**: Not required

### NASA EONET API  
- **Authority**: NASA Earth Observatory
- **Coverage**: Wildfires, volcanoes, storms, floods
- **Update Frequency**: Near-real-time
- **API Key**: Not required

### OpenWeatherMap API
- **Coverage**: Global weather conditions, severe weather alerts
- **Update Frequency**: Hourly
- **API Key**: Required (free tier: 1000 req/day)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### API Testing
```bash
# Health check
curl http://localhost:8001/api/health

# Get disasters
curl http://localhost:8001/api/disasters?limit=10

# Trigger manual ingestion
curl -X POST http://localhost:8001/api/disasters/trigger-ingestion
```

---

## 📈 System Monitoring

### Check Backend Status
```bash
curl http://localhost:8001/api/health
```

**Response includes:**
- Database connection status
- Scheduler running status
- Last ingestion timestamp
- Active events count
- Data source availability

### View Ingestion Logs
```bash
curl http://localhost:8001/api/ingestion/stats
```

---

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check backend logs
tail -f /var/log/supervisor/backend.*.log

# Restart backend
sudo supervisorctl restart backend

# Check MongoDB
mongo --eval "db.disasters.count()"
```

### Frontend Issues
```bash
# Check frontend logs
tail -f /var/log/supervisor/frontend.*.log

# Restart frontend
sudo supervisorctl restart frontend

# Clear Next.js cache
cd disaster-dashboard && rm -rf .next && yarn dev
```

---

## 📝 Project Structure

```
.
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── models.py              # Pydantic models and schemas
│   ├── ingestion.py           # Data fetching from external APIs
│   ├── geospatial.py          # Geospatial validation logic
│   ├── risk_scorer.py         # Rule-based risk assessment
│   ├── lifecycle.py           # Event lifecycle management
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment configuration
│
├── disaster-dashboard/        # Next.js frontend
│   ├── app/
│   │   ├── page.tsx          # Main dashboard page
│   │   └── api/
│   │       └── disasters/
│   │           └── route.ts  # API proxy to backend
│   ├── components/
│   │   ├── disaster-dashboard.tsx
│   │   ├── disaster-map.tsx
│   │   └── [other components]
│   ├── hooks/
│   ├── lib/
│   └── public/
│
└── README.md                  # This file
```

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **System Design**: End-to-end architecture for data-intensive applications
2. **Data Engineering**: ETL pipelines, data normalization, quality validation
3. **Geospatial Processing**: Distance calculations, clustering, deduplication
4. **State Management**: Event lifecycle with temporal consistency
5. **API Design**: RESTful endpoints with proper error handling
6. **Background Processing**: Scheduled jobs with APScheduler
7. **Database Design**: MongoDB schemas with indexes
8. **Frontend Integration**: Next.js API routes, real-time updates
9. **Production Patterns**: Logging, monitoring, health checks

---

## 🤝 Contributing

This project is designed as a portfolio/learning project. Contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## ⚖️ License

MIT License - see LICENSE file for details

---

## 📬 Contact

**Built by:** [Your Name]
- GitHub: [Your GitHub]
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

---

## 🙏 Acknowledgments

- **USGS** for earthquake data
- **NASA EONET** for global disaster events  
- **OpenWeatherMap** for weather data
- **Next.js** and **FastAPI** for excellent frameworks
- **Leaflet.js** for mapping capabilities

---

## 📄 System Requirements

**Minimum:**
- Python 3.11+
- Node.js 18+
- MongoDB 5.0+
- 2 GB RAM
- 1 GB disk space

**Recommended:**
- Python 3.11+
- Node.js 20+
- MongoDB 6.0+
- 4 GB RAM
- 5 GB disk space

---

## 🔐 Security Notes

- API keys should never be committed to version control
- Use environment variables for all sensitive data
- MongoDB should be properly secured in production
- CORS should be configured for specific origins in production
- Rate limiting should be implemented for public APIs

---

## 🚦 Production Deployment

For production deployment, consider:

1. **Backend**:
   - Use Gunicorn/Uvicorn with multiple workers
   - Set up proper logging and monitoring
   - Configure database backups
   - Use environment-specific configs

2. **Frontend**:
   - Build production bundle: `yarn build`
   - Serve with proper web server (Nginx/Caddy)
   - Enable HTTPS
   - Configure CDN for static assets

3. **Infrastructure**:
   - Use Docker containers
   - Set up load balancing
   - Configure auto-scaling
   - Implement proper monitoring (Prometheus, Grafana)

---

> **Note**: This project is built for educational and demonstration purposes. For production disaster monitoring systems, additional features such as real-time streaming, predictive analytics, and integration with emergency response systems would be necessary.
