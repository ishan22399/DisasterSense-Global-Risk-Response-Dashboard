import requests
import logging
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import os
from models import (
    DisasterEvent, DisasterEventCreate, DisasterType, SeverityLevel,
    DataSource, Location, IngestionStats
)

logger = logging.getLogger(__name__)


class DataIngestionService:
    """
    Handles fetching disaster data from multiple authoritative sources.
    
    Sources:
    - USGS Earthquake API (no key required)
    - NASA EONET (no key required)
    - OpenWeatherMap (free tier)
    - AQICN (free tier)
    - NewsAPI (optional, free tier)
    """
    
    def __init__(self):
        # API keys from environment
        self.openweather_key = os.getenv('OPENWEATHER_API_KEY')
        self.aqicn_key = os.getenv('AQICN_API_KEY')
        self.news_api_key = os.getenv('NEWS_API_KEY')
        
        # API endpoints
        self.usgs_endpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query"
        self.nasa_endpoint = "https://eonet.gsfc.nasa.gov/api/v3/events"
    
    def fetch_all_sources(self) -> List[DisasterEventCreate]:
        """
        Fetch data from all available sources.
        
        Returns:
            List of DisasterEventCreate objects
        """
        all_events = []
        
        # Fetch from each source
        logger.info("Starting multi-source data ingestion")
        
        try:
            usgs_events = self.fetch_usgs_earthquakes()
            all_events.extend(usgs_events)
            logger.info(f"Fetched {len(usgs_events)} events from USGS")
        except Exception as e:
            logger.error(f"USGS fetch failed: {e}")
        
        try:
            nasa_events = self.fetch_nasa_eonet()
            all_events.extend(nasa_events)
            logger.info(f"Fetched {len(nasa_events)} events from NASA EONET")
        except Exception as e:
            logger.error(f"NASA EONET fetch failed: {e}")
        
        if self.openweather_key:
            try:
                weather_events = self.fetch_weather_alerts()
                all_events.extend(weather_events)
                logger.info(f"Fetched {len(weather_events)} weather alerts")
            except Exception as e:
                logger.error(f"Weather fetch failed: {e}")
        
        logger.info(f"Total events fetched: {len(all_events)}")
        return all_events
    
    def fetch_usgs_earthquakes(self, min_magnitude: float = 4.0, days: int = 7) -> List[DisasterEventCreate]:
        """
        Fetch earthquake data from USGS.
        
        Args:
            min_magnitude: Minimum earthquake magnitude
            days: Number of days to look back
            
        Returns:
            List of earthquake events
        """
        events = []
        
        # Calculate time range
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=days)
        
        params = {
            'format': 'geojson',
            'starttime': start_time.strftime('%Y-%m-%d'),
            'endtime': end_time.strftime('%Y-%m-%d'),
            'minmagnitude': min_magnitude,
            'orderby': 'time'
        }
        
        try:
            response = requests.get(self.usgs_endpoint, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            for feature in data.get('features', []):
                try:
                    props = feature['properties']
                    coords = feature['geometry']['coordinates']
                    
                    # Parse event data
                    magnitude = props.get('mag', 0)
                    event_time_ms = props['time']
                    event_time = datetime.utcfromtimestamp(event_time_ms / 1000)  # Convert from milliseconds, UTC naive
                    
                    # Determine severity based on magnitude
                    if magnitude >= 7.0:
                        severity = SeverityLevel.CRITICAL
                    elif magnitude >= 6.0:
                        severity = SeverityLevel.HIGH
                    elif magnitude >= 5.0:
                        severity = SeverityLevel.MEDIUM
                    else:
                        severity = SeverityLevel.LOW
                    
                    # Estimate affected population (rough heuristic)
                    affected = int(magnitude * 10000) if magnitude >= 5.0 else int(magnitude * 1000)
                    
                    event = DisasterEventCreate(
                        type=DisasterType.EARTHQUAKE,
                        title=props.get('title', f"M{magnitude} Earthquake"),
                        description=props.get('place', ''),
                        location=Location(lat=coords[1], lng=coords[0]),
                        magnitude=magnitude,
                        severity=severity,
                        affected_population=affected,
                        event_time=event_time,
                        source=DataSource.USGS,
                        source_url=props.get('url', ''),
                        external_id=feature['id'],
                        metadata={
                            'depth': coords[2] if len(coords) > 2 else None,
                            'felt': props.get('felt'),
                            'cdi': props.get('cdi'),
                            'mmi': props.get('mmi'),
                            'tsunami': props.get('tsunami', 0) == 1
                        }
                    )
                    events.append(event)
                    
                except Exception as e:
                    logger.error(f"Error parsing USGS event: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"USGS API request failed: {e}")
            raise
        
        return events
    
    def fetch_nasa_eonet(self, days: int = 14, limit: int = 100) -> List[DisasterEventCreate]:
        """
        Fetch natural events from NASA EONET.
        
        Returns:
            List of disaster events
        """
        events = []
        
        params = {
            'status': 'open',
            'limit': limit,
            'days': days
        }
        
        try:
            response = requests.get(self.nasa_endpoint, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            for nasa_event in data.get('events', []):
                try:
                    # Get latest geometry
                    if not nasa_event.get('geometry'):
                        continue
                    
                    geometry = nasa_event['geometry'][-1]  # Most recent geometry
                    coords = geometry['coordinates']
                    
                    # Map NASA categories to our disaster types
                    disaster_type = DisasterType.UNKNOWN
                    severity = SeverityLevel.MEDIUM
                    
                    if nasa_event.get('categories'):
                        category = nasa_event['categories'][0]['title'].lower()
                        
                        if 'wildfire' in category or 'fire' in category:
                            disaster_type = DisasterType.WILDFIRE
                            severity = SeverityLevel.HIGH
                        elif 'volcano' in category:
                            disaster_type = DisasterType.VOLCANO
                            severity = SeverityLevel.CRITICAL
                        elif 'storm' in category or 'cyclone' in category:
                            disaster_type = DisasterType.STORM
                            severity = SeverityLevel.HIGH
                        elif 'flood' in category:
                            disaster_type = DisasterType.FLOOD
                            severity = SeverityLevel.HIGH
                        elif 'drought' in category:
                            disaster_type = DisasterType.DROUGHT
                            severity = SeverityLevel.MEDIUM
                    
                    # Parse event time
                    event_time_str = geometry.get('date', nasa_event.get('geometry')[0]['date'])
                    try:
                        event_time = datetime.fromisoformat(event_time_str.replace('Z', '+00:00'))
                        # Convert to naive datetime (remove timezone info)
                        event_time = event_time.replace(tzinfo=None)
                    except:
                        event_time = datetime.utcnow()
                    
                    # Estimate affected population based on disaster type
                    affected_map = {
                        DisasterType.WILDFIRE: 50000,
                        DisasterType.VOLCANO: 75000,
                        DisasterType.STORM: 100000,
                        DisasterType.FLOOD: 80000,
                        DisasterType.DROUGHT: 200000
                    }
                    affected = affected_map.get(disaster_type, 25000)
                    
                    event = DisasterEventCreate(
                        type=disaster_type,
                        title=nasa_event.get('title', 'Natural Event'),
                        description=nasa_event.get('description') or f"{disaster_type.value.title()} event monitored by NASA",
                        location=Location(lat=coords[1], lng=coords[0]),
                        magnitude=None,
                        severity=severity,
                        affected_population=affected,
                        event_time=event_time,
                        source=DataSource.NASA,
                        source_url=nasa_event.get('sources', [{}])[0].get('url', 'https://eonet.gsfc.nasa.gov/'),
                        external_id=nasa_event['id'],
                        metadata={
                            'categories': [c['title'] for c in nasa_event.get('categories', [])],
                            'sources': nasa_event.get('sources', [])
                        }
                    )
                    events.append(event)
                    
                except Exception as e:
                    logger.error(f"Error parsing NASA EONET event: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"NASA EONET API request failed: {e}")
            raise
        
        return events
    
    def fetch_weather_alerts(self) -> List[DisasterEventCreate]:
        """
        Fetch severe weather alerts from OpenWeatherMap.
        
        Returns:
            List of weather-related disaster events
        """
        events = []
        
        if not self.openweather_key:
            logger.warning("OpenWeatherMap API key not configured")
            return events
        
        # Major cities to monitor for severe weather
        cities = [
            {"name": "Tokyo", "lat": 35.6762, "lon": 139.6503},
            {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
            {"name": "New York", "lat": 40.7128, "lon": -74.0060},
            {"name": "London", "lat": 51.5074, "lon": -0.1278},
            {"name": "Sydney", "lat": -33.8688, "lon": 151.2093},
            {"name": "Beijing", "lat": 39.9042, "lon": 116.4074},
            {"name": "São Paulo", "lat": -23.5505, "lon": -46.6333},
            {"name": "Mexico City", "lat": 19.4326, "lon": -99.1332}
        ]
        
        for city in cities:
            try:
                url = f"https://api.openweathermap.org/data/2.5/weather"
                params = {
                    'lat': city['lat'],
                    'lon': city['lon'],
                    'appid': self.openweather_key,
                    'units': 'metric'
                }
                
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                # Check for severe weather conditions
                weather_main = data['weather'][0]['main']
                wind_speed = data.get('wind', {}).get('speed', 0)
                temp = data.get('main', {}).get('temp', 0)
                
                is_severe = False
                disaster_type = DisasterType.STORM
                severity = SeverityLevel.MEDIUM
                
                # Identify severe conditions
                if weather_main == 'Thunderstorm':
                    is_severe = True
                    disaster_type = DisasterType.STORM
                    severity = SeverityLevel.HIGH if wind_speed > 20 else SeverityLevel.MEDIUM
                elif wind_speed > 25:  # Strong winds (>90 km/h)
                    is_severe = True
                    disaster_type = DisasterType.HURRICANE
                    severity = SeverityLevel.HIGH
                elif temp > 40:  # Extreme heat
                    is_severe = True
                    disaster_type = DisasterType.HEATWAVE
                    severity = SeverityLevel.MEDIUM
                
                if is_severe:
                    event = DisasterEventCreate(
                        type=disaster_type,
                        title=f"Severe Weather Alert - {city['name']}",
                        description=f"{weather_main} - Wind: {wind_speed}m/s, Temp: {temp}°C",
                        location=Location(lat=city['lat'], lng=city['lon']),
                        magnitude=wind_speed,
                        severity=severity,
                        affected_population=50000,
                        event_time=datetime.utcnow(),
                        source=DataSource.WEATHER,
                        source_url="",
                        external_id=f"weather-{city['name']}-{int(datetime.utcnow().timestamp())}",
                        metadata={
                            'city': city['name'],
                            'weather': weather_main,
                            'description': data['weather'][0]['description'],
                            'humidity': data.get('main', {}).get('humidity'),
                            'pressure': data.get('main', {}).get('pressure')
                        }
                    )
                    events.append(event)
            
            except Exception as e:
                logger.error(f"Error fetching weather for {city['name']}: {e}")
                continue
        
        return events
    
    def fetch_aqicn_data(self, cities: List[Tuple[str, float, float]] = None) -> List[Dict]:
        """
        Fetch air quality data from AQICN.
        Note: Not creating disaster events, but can be used for context.
        
        Args:
            cities: List of (name, lat, lon) tuples
            
        Returns:
            List of AQI data dictionaries
        """
        if not self.aqicn_key:
            logger.warning("AQICN API key not configured")
            return []
        
        aqi_data = []
        
        if cities is None:
            cities = [
                ("Delhi", 28.6139, 77.2090),
                ("Beijing", 39.9042, 116.4074),
                ("Mumbai", 19.0760, 72.8777)
            ]
        
        for city_name, lat, lon in cities:
            try:
                url = f"https://api.waqi.info/feed/geo:{lat};{lon}/"
                params = {'token': self.aqicn_key}
                
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                if data.get('status') == 'ok':
                    aqi_data.append({
                        'city': city_name,
                        'aqi': data['data']['aqi'],
                        'dominant_pollutant': data['data'].get('dominentpol', 'unknown'),
                        'location': {'lat': lat, 'lng': lon},
                        'timestamp': datetime.utcnow()
                    })
            
            except Exception as e:
                logger.error(f"Error fetching AQI for {city_name}: {e}")
                continue
        
        return aqi_data
