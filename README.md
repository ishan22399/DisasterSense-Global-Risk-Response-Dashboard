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

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ishan22399/DisasterSense-Global-Risk-Response-Dashboard.git
   cd DisasterSense-Global-Risk-Response-Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your API keys (see below).

---

## ⚙️ Configuration & API Keys

This project uses several external APIs. Some require API keys, which must be set as environment variables in `.env.local`:

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key
GOOGLE_API_KEY=your_google_api_key
OPENWEATHER_API_KEY=your_openweathermap_api_key
AQICN_API_KEY=your_aqicn_api_key
NEWS_API_KEY=your_newsapi_key
```

- **Google APIs**: For geocoding, places, and air quality.
- **OpenWeatherMap**: For weather and fallback AQI.
- **AQICN**: For global AQI (especially reliable for India/Asia).
- **NewsAPI**: For disaster-related news.

---

## ▶️ Usage

**Run the development server:**
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**
```bash
npm run build
npm start
```

---

## 🌐 Live Demo

[https://disaster-sense-global-risk-response.vercel.app/](https://disaster-sense-global-risk-response.vercel.app/)

---

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet.js](https://leafletjs.com/)
- [OpenWeatherMap](https://openweathermap.org/)
- [AQICN](https://aqicn.org/api/)
- [Google Maps & Air Quality APIs](https://developers.google.com/maps/documentation)
- [NewsAPI](https://newsapi.org/)
- [NASA EONET](https://eonet.gsfc.nasa.gov/)
- [USGS Earthquake API](https://earthquake.usgs.gov/)

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
