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
        # API keys from environment only
        self.openweather_key = os.getenv('OPENWEATHER_API_KEY')
        self.aqicn_key = os.getenv('AQICN_API_KEY')
        self.news_api_key = os.getenv('NEWS_API_KEY')
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        
        # API endpoints
        self.usgs_endpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query"
        self.nasa_endpoint = "https://eonet.gsfc.nasa.gov/api/v3/events"
        self.gdacs_endpoint = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH"
    
    def fetch_all_sources(self) -> List[DisasterEventCreate]:
        """
        Fetch data from all available sources:
        - USGS Earthquakes (free)
        - NASA EONET (free)
        - GDACS Crisis Alerts (free)
        - ReliefWeb Disasters (free)
        - OpenWeatherMap Alerts (free tier)
        - AQICN Air Quality (free tier)
        - NewsAPI Articles (free tier)
        - YouTube Videos (free tier with API key)
        - Web scraped news
        
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
        
        try:
            gdacs_events = self.fetch_gdacs_alerts()
            all_events.extend(gdacs_events)
            logger.info(f"Fetched {len(gdacs_events)} events from GDACS")
        except Exception as e:
            logger.error(f"GDACS fetch failed: {e}")
        
        try:
            reliefweb_events = self.fetch_reliefweb_disasters()
            all_events.extend(reliefweb_events)
            logger.info(f"Fetched {len(reliefweb_events)} events from ReliefWeb")
        except Exception as e:
            logger.error(f"ReliefWeb fetch failed: {e}")
        
        if self.openweather_key:
            try:
                weather_events = self.fetch_weather_alerts()
                all_events.extend(weather_events)
                logger.info(f"Fetched {len(weather_events)} weather alerts")
            except Exception as e:
                logger.error(f"Weather fetch failed: {e}")
        
        if self.news_api_key:
            try:
                news_events = self.fetch_newsapi_articles()
                all_events.extend(news_events)
                logger.info(f"Fetched {len(news_events)} articles from NewsAPI")
            except Exception as e:
                logger.error(f"NewsAPI fetch failed: {e}")
        
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
        Fetch severe weather alerts from OpenWeatherMap (optional/non-blocking).
        Uses short timeout to prevent blocking other data sources.
        
        Returns:
            List of weather-related disaster events (may be empty if API slow/unavailable)
        """
        events = []
        
        if not self.openweather_key:
            logger.debug("OpenWeatherMap API key not configured, skipping weather alerts")
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
                
                # Short timeout (3 seconds) to prevent blocking other data sources
                response = requests.get(url, params=params, timeout=3)
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
            
            except requests.Timeout:
                logger.debug(f"Weather API timeout for {city['name']}: skipping (non-critical source)")
                continue
            except requests.ConnectionError:
                logger.debug(f"Weather API connection error for {city['name']}: skipping (non-critical source)")
                continue
            except Exception as e:
                logger.debug(f"Weather API error for {city['name']}: {e}")
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
                
                response = requests.get(url, params=params, timeout=5)
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
    
    def fetch_gdacs_alerts(self) -> List[DisasterEventCreate]:
        """
        Fetch global disaster alerts from GDACS (Global Disaster Alert and Coordination System).
        Uses the official GDACS API endpoints (no API key required).
        
        Returns:
            List of DisasterEventCreate objects from GDACS API
        """
        events = []
        try:
            # GDACS API endpoint for listing disaster events
            # Supports filtering by event type, date range, and alert level
            params = {
                'eventlist': 'EQ,FL,TC,TS,VO,DR',  # All disaster types
                'alertlevel': 'red,orange,green',   # All alert levels
                'pagesize': 100,
                'pagenumber': 1
            }
            
            response = requests.get(self.gdacs_endpoint, params=params, timeout=8)
            response.raise_for_status()
            
            data = response.json()
            
            # GDACS returns events in 'events' array
            for crisis in data.get('events', []):
                try:
                    # Map GDACS event types to our DisasterType enum
                    event_type = crisis.get('eventtype', 'OT').upper()
                    
                    type_mapping = {
                        'EQ': 'EARTHQUAKE',
                        'FL': 'FLOOD',
                        'DR': 'DROUGHT',
                        'VO': 'VOLCANO',
                        'TC': 'CYCLONE',
                        'TS': 'TSUNAMI',
                        'WI': 'WILDFIRE',
                        'OT': 'OTHER'
                    }
                    
                    disaster_type = type_mapping.get(event_type, 'OTHER')
                    
                    # Extract location
                    lon = crisis.get('longitude')
                    lat = crisis.get('latitude')
                    
                    if lon is None or lat is None:
                        continue
                    
                    # Map GDACS alert levels to our severity
                    alert_level = crisis.get('alertlevel', 'green').lower()
                    severity_map = {
                        'red': 'CRITICAL',
                        'orange': 'SEVERE',
                        'green': 'MODERATE',
                        'yellow': 'MODERATE'
                    }
                    severity = severity_map.get(alert_level, 'MODERATE')
                    
                    # Extract event details
                    name = crisis.get('name', f"GDACS {event_type} Event")
                    description = crisis.get('description', name)
                    
                    # Parse event date
                    try:
                        event_date = crisis.get('date')
                        if event_date:
                            timestamp = datetime.fromisoformat(event_date.replace('Z', '+00:00')).replace(tzinfo=None)
                        else:
                            timestamp = datetime.utcnow()
                    except:
                        timestamp = datetime.utcnow()
                    
                    affected_population = crisis.get('affectedpopulation')
                    
                    event = DisasterEventCreate(
                        name=name,
                        description=description,
                        location={'lat': float(lat), 'lng': float(lon)},
                        disaster_type=disaster_type,
                        severity=severity,
                        source='GDACS',
                        timestamp=timestamp,
                        affected_population=affected_population
                    )
                    events.append(event)
                
                except Exception as e:
                    logger.warning(f"Error processing GDACS event {crisis.get('eventid')}: {e}")
                    continue
            
            logger.info(f"Successfully fetched {len(events)} events from GDACS")
        
        except Exception as e:
            logger.debug(f"GDACS API error: {e}")
        
        return events
    
    def fetch_reliefweb_disasters(self) -> List[DisasterEventCreate]:
        """
        Fetch disaster reports from ReliefWeb API (UN OCHA).
        Uses the ReliefWeb reports endpoint which is more stable.
        
        Returns:
            List of DisasterEventCreate objects from ReliefWeb
        """
        events = []
        try:
            # Use ReliefWeb reports endpoint which works better
            url = "https://reliefweb.int/api/v1/reports"
            params = {
                'appname': 'DisasterSense',
                'filter[report_type]': 'Situation Report',
                'filter[status]': 'open',
                'limit': 30,
                'sort': '-date.created'
            }
            headers = {'User-Agent': 'DisasterSense/1.0'}
            
            response = requests.get(url, params=params, headers=headers, timeout=8)
            response.raise_for_status()
            
            try:
                data = response.json()
            except ValueError as e:
                logger.warning(f"ReliefWeb returned non-JSON response")
                return events
            
            for report in data.get('data', []):
                try:
                    fields = report.get('fields', {})
                    
                    name = fields.get('title', 'Unknown Report')
                    
                    # Extract primary country/location
                    countries = fields.get('country', [])
                    if not countries:
                        continue
                    
                    primary_country = countries[0]
                    location_name = primary_country.get('name', 'Unknown')
                    
                    # Get coordinates - ReliefWeb provides them differently
                    lat = primary_country.get('location', {}).get('lat', 0)
                    lon = primary_country.get('location', {}).get('lon', 0)
                    
                    if lat == 0 and lon == 0:
                        continue
                    
                    # Determine disaster type from report content/theme
                    themes = fields.get('theme', [])
                    disaster_type = 'OTHER'
                    
                    theme_map = {
                        'Earthquakes': 'EARTHQUAKE',
                        'Floods': 'FLOOD',
                        'Droughts': 'DROUGHT',
                        'Wildfires': 'WILDFIRE',
                        'Storms': 'CYCLONE',
                        'Cyclones': 'CYCLONE',
                        'Tsunamis': 'TSUNAMI',
                        'Epidemics': 'EPIDEMIC',
                        'Disease': 'EPIDEMIC'
                    }
                    
                    for theme in themes:
                        theme_name = theme.get('name', '')
                        if theme_name in theme_map:
                            disaster_type = theme_map[theme_name]
                            break
                    
                    # Base severity on report type
                    severity = 'MODERATE'  # Most reports are moderate priority
                    
                    description = fields.get('body', name)[:500] if fields.get('body') else name
                    
                    # Extract date
                    date_str = fields.get('date', {}).get('changed')
                    try:
                        timestamp = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(tzinfo=None) if date_str else datetime.utcnow()
                    except:
                        timestamp = datetime.utcnow()
                    
                    event = DisasterEventCreate(
                        name=name,
                        description=description,
                        location={'lat': float(lat), 'lng': float(lon)},
                        disaster_type=disaster_type,
                        severity=severity,
                        source='ReliefWeb',
                        timestamp=timestamp,
                        affected_population=None
                    )
                    events.append(event)
                
                except Exception as e:
                    logger.debug(f"Error processing ReliefWeb report: {e}")
                    continue
            
            logger.info(f"Successfully fetched {len(events)} reports from ReliefWeb")
        
        except Exception as e:
            logger.debug(f"ReliefWeb reports endpoint: {e}")
        
        return events
    
    def fetch_newsapi_articles(self) -> List[DisasterEventCreate]:
        """
        Fetch disaster-related news from NewsAPI.
        
        Returns:
            List of news-based disaster events
        """
        events = []
        
        if not self.news_api_key:
            logger.debug("NewsAPI key not configured, skipping NewsAPI fetch")
            return events
        
        try:
            url = "https://newsapi.org/v2/everything"
            
            # Search for disaster-related news
            search_queries = [
                'earthquake disaster',
                'wildfire alert emergency',
                'flood warning evacuation',
                'hurricane typhoon storm',
                'volcano volcanic eruption',
                'tsunami warning',
                'tornado alert',
                'natural disaster emergency'
            ]
            
            for query in search_queries:
                try:
                    params = {
                        'q': query,
                        'sortBy': 'publishedAt',
                        'apiKey': self.news_api_key,
                        'pageSize': 10,
                        'language': 'en'
                    }
                    
                    response = requests.get(url, params=params, timeout=15)
                    response.raise_for_status()
                    data = response.json()
                    
                    if data.get('status') != 'ok':
                        logger.warning(f"NewsAPI error: {data.get('message')}")
                        continue
                    
                    for article in data.get('articles', [])[:5]:  # Limit to 5 per query
                        try:
                            # Parse news article as disaster event
                            title = article.get('title', 'News Update')
                            description = article.get('description', '')
                            source_name = article.get('source', {}).get('name', 'News')
                            pub_date_str = article.get('publishedAt', '')
                            
                            # Parse timestamp
                            try:
                                event_time = datetime.fromisoformat(pub_date_str.replace('Z', '+00:00'))
                                # Convert to naive datetime (remove timezone info for consistency)
                                event_time = event_time.replace(tzinfo=None)
                            except:
                                event_time = datetime.utcnow()
                            
                            # Determine disaster type from content
                            content = (title + description).lower()
                            if 'earthquake' in content or 'quake' in content:
                                disaster_type = DisasterType.EARTHQUAKE
                                severity = SeverityLevel.HIGH
                                affected_pop = 5000
                            elif 'wildfire' in content or 'fire' in content:
                                disaster_type = DisasterType.WILDFIRE
                                severity = SeverityLevel.HIGH
                                affected_pop = 10000
                            elif 'flood' in content:
                                disaster_type = DisasterType.FLOOD
                                severity = SeverityLevel.MEDIUM
                                affected_pop = 8000
                            elif 'hurricane' in content or 'typhoon' in content or 'cyclone' in content:
                                disaster_type = DisasterType.HURRICANE
                                severity = SeverityLevel.HIGH
                                affected_pop = 20000
                            elif 'volcano' in content or 'eruption' in content:
                                disaster_type = DisasterType.VOLCANO
                                severity = SeverityLevel.CRITICAL
                                affected_pop = 15000
                            elif 'tornado' in content:
                                disaster_type = DisasterType.TORNADO
                                severity = SeverityLevel.HIGH
                                affected_pop = 3000
                            elif 'tsunami' in content:
                                disaster_type = DisasterType.TSUNAMI
                                severity = SeverityLevel.CRITICAL
                                affected_pop = 25000
                            else:
                                disaster_type = DisasterType.UNKNOWN
                                severity = SeverityLevel.LOW
                                affected_pop = 1000
                            
                            # Extract location from article (simple heuristic)
                            location_text = article.get('author', 'Global') or 'Global'
                            
                            event = DisasterEventCreate(
                                title=title[:200],
                                description=description[:500],
                                type=disaster_type,
                                severity=severity,
                                affected_population=affected_pop,
                                source=DataSource.NEWS,
                                location=Location(
                                    lat=0.0,
                                    lng=0.0,
                                    address=location_text[:100]
                                ),
                                event_time=event_time,
                                source_url=article.get('url'),
                                metadata={
                                    'news_source': source_name,
                                    'image_url': article.get('urlToImage'),
                                    'content': article.get('content', description)
                                }
                            )
                            
                            events.append(event)
                        
                        except Exception as e:
                            logger.debug(f"Error parsing NewsAPI article: {e}")
                            continue
                
                except requests.exceptions.Timeout:
                    logger.warning(f"NewsAPI timeout for query: {query}")
                    continue
                except Exception as e:
                    logger.warning(f"Error fetching from NewsAPI for '{query}': {e}")
                    continue
            
            logger.info(f"Fetched {len(events)} articles from NewsAPI")
        
        except Exception as e:
            logger.warning(f"NewsAPI fetch failed: {e}")
        
        return events
    
    def fetch_news_scrape(self) -> List[Dict]:
        """
        Scrape disaster-related news from major news sources.
        Note: Creates news article objects, not disaster events.
        
        Returns:
            List of news article dictionaries
        """
        news_articles = []
        
        try:
            from bs4 import BeautifulSoup
        except ImportError:
            logger.warning("BeautifulSoup not installed, skipping news scraping")
            return news_articles
        
        # Target news sources with disaster sections
        news_sources = [
            {
                'name': 'BBC News - Emergencies',
                'url': 'https://www.bbc.com/news/emergencies',
                'article_selector': 'h3, h2'
            },
            {
                'name': 'Reuters - Disasters',
                'url': 'https://www.reuters.com/world/crisis',
                'article_selector': 'h3[data-testid]'
            }
        ]
        
        for source in news_sources:
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
                
                response = requests.get(source['url'], headers=headers, timeout=5)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract articles based on selector
                articles = soup.select(source['article_selector'])[:10]  # Limit to 10 per source
                
                for article in articles:
                    try:
                        title = article.get_text(strip=True)[:200]
                        
                        # Find associated link
                        link_elem = article.find_parent('a') or article.find('a')
                        link = link_elem.get('href', '') if link_elem else ''
                        
                        if title and link:
                            # Make absolute URL if relative
                            if link.startswith('/'):
                                link = source['url'].split('//', 1)[0] + '//' + source['url'].split('/', 3)[2] + link
                            
                            news_articles.append({
                                'title': title,
                                'url': link,
                                'source': source['name'],
                                'timestamp': datetime.utcnow(),
                                'description': title
                            })
                    
                    except Exception as e:
                        logger.debug(f"Error parsing article from {source['name']}: {e}")
                        continue
                
                logger.info(f"Scraped {len(articles)} articles from {source['name']}")
            
            except Exception as e:
                logger.warning(f"Error scraping news from {source['name']}: {e}")
                continue
        
        return news_articles
    
    def fetch_youtube_videos(self) -> List[Dict]:
        """
        Fetch disaster-related videos from YouTube.
        Requires YOUTUBE_API_KEY environment variable.
        
        Returns:
            List of video metadata dictionaries
        """
        videos = []
        
        if not self.youtube_api_key:
            logger.debug("YouTube API key not configured, skipping video fetch")
            return videos
        
        try:
            from googleapiclient.discovery import build
        except ImportError:
            logger.warning("google-api-client not installed, skipping YouTube videos")
            return videos
        
        try:
            youtube = build('youtube', 'v3', developerKey=self.youtube_api_key)
            
            # Search for recent disaster videos
            search_queries = [
                'earthquake today',
                'wildfire alert',
                'flood warning',
                'hurricane latest',
                'volcanic eruption',
                'disaster news'
            ]
            
            for query in search_queries:
                try:
                    request = youtube.search().list(
                        q=query,
                        type='video',
                        part='snippet',
                        maxResults=5,
                        order='date',
                        relevanceLanguage='en'
                    )
                    response = request.execute()
                    
                    for item in response.get('items', []):
                        try:
                            snippet = item['snippet']
                            video = {
                                'title': snippet['title'][:200],
                                'video_id': item['id']['videoId'],
                                'channel': snippet['channelTitle'],
                                'published_at': snippet['publishedAt'],
                                'thumbnail': snippet['thumbnails'].get('medium', {}).get('url'),
                                'description': snippet['description'][:500],
                                'source': 'YouTube',
                                'timestamp': datetime.utcnow(),
                                'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                            }
                            videos.append(video)
                        
                        except Exception as e:
                            logger.debug(f"Error processing YouTube video: {e}")
                            continue
                    
                    logger.debug(f"Fetched {len(response.get('items', []))} videos for query: {query}")
                
                except Exception as e:
                    logger.warning(f"Error searching YouTube for '{query}': {e}")
                    continue
            
            logger.info(f"Successfully fetched {len(videos)} videos from YouTube")
        
        except Exception as e:
            logger.error(f"Error fetching YouTube videos: {e}")
        
        return videos
