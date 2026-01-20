from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import math
from models import DisasterEvent, Location
import logging

logger = logging.getLogger(__name__)


class GeospatialValidator:
    """
    Geospatial quality validation for disaster events.
    
    Features:
    - Deduplication of nearby events
    - Event clustering
    - Distance calculations
    - Temporal consistency checks
    """
    
    # Configuration
    DUPLICATE_DISTANCE_KM = 50  # Events within 50km are considered potential duplicates
    CLUSTER_DISTANCE_KM = 100   # Events within 100km are clustered
    MIN_TIME_BETWEEN_SAME_EVENTS = timedelta(hours=6)  # Minimum time between duplicate events
    
    @staticmethod
    def calculate_distance(loc1: Location, loc2: Location) -> float:
        """
        Calculate distance between two locations using Haversine formula.
        
        Returns:
            Distance in kilometers
        """
        R = 6371  # Earth's radius in kilometers
        
        lat1, lon1 = math.radians(loc1.lat), math.radians(loc1.lng)
        lat2, lon2 = math.radians(loc2.lat), math.radians(loc2.lng)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c
    
    @classmethod
    def find_duplicates(cls, new_event: DisasterEvent, existing_events: List[DisasterEvent]) -> Optional[DisasterEvent]:
        """
        Find if the new event is a duplicate of an existing event.
        
        Criteria for duplicate:
        1. Same disaster type
        2. Within DUPLICATE_DISTANCE_KM
        3. Within time window
        
        Returns:
            The existing event if duplicate found, None otherwise
        """
        for existing in existing_events:
            # Must be same type
            if existing.type != new_event.type:
                continue
            
            # Check distance
            distance = cls.calculate_distance(new_event.location, existing.location)
            if distance > cls.DUPLICATE_DISTANCE_KM:
                continue
            
            # Check time proximity
            time_diff = abs((new_event.event_time - existing.event_time).total_seconds())
            if time_diff > cls.MIN_TIME_BETWEEN_SAME_EVENTS.total_seconds():
                continue
            
            # Found a duplicate
            logger.info(f"Duplicate found: {new_event.title} matches {existing.id} (distance: {distance:.1f}km)")
            return existing
        
        return None
    
    @classmethod
    def should_update_event(cls, new_data: Dict, existing_event: DisasterEvent) -> Tuple[bool, List[str]]:
        """
        Determine if an existing event should be updated with new data.
        
        Returns:
            (should_update: bool, changed_fields: List[str])
        """
        changed_fields = []
        
        # Check severity change
        if 'severity' in new_data and new_data['severity'] != existing_event.severity:
            changed_fields.append('severity')
        
        # Check affected population change (significant if >10% difference)
        if 'affected_population' in new_data:
            new_affected = new_data['affected_population']
            old_affected = existing_event.affected_population
            if old_affected > 0:
                change_percent = abs(new_affected - old_affected) / old_affected
                if change_percent > 0.1:  # 10% change threshold
                    changed_fields.append('affected_population')
            elif new_affected > 0:
                changed_fields.append('affected_population')
        
        # Check description enrichment
        if 'description' in new_data and new_data['description']:
            if not existing_event.description or len(new_data['description']) > len(existing_event.description):
                changed_fields.append('description')
        
        # Check magnitude change
        if 'magnitude' in new_data and new_data['magnitude']:
            if not existing_event.magnitude or abs(new_data['magnitude'] - existing_event.magnitude) > 0.1:
                changed_fields.append('magnitude')
        
        should_update = len(changed_fields) > 0
        
        return should_update, changed_fields
    
    @classmethod
    def cluster_events(cls, events: List[DisasterEvent]) -> Dict[str, List[str]]:
        """
        Group nearby events into clusters.
        
        Returns:
            Dict mapping cluster_id to list of event IDs
        """
        clusters = {}
        processed = set()
        
        for i, event in enumerate(events):
            if event.id in processed:
                continue
            
            # Start a new cluster
            cluster_id = f"cluster_{i}_{event.type}"
            cluster = [event.id]
            processed.add(event.id)
            
            # Find nearby events of same type
            for other in events:
                if other.id in processed:
                    continue
                
                if other.type == event.type:
                    distance = cls.calculate_distance(event.location, other.location)
                    if distance <= cls.CLUSTER_DISTANCE_KM:
                        cluster.append(other.id)
                        processed.add(other.id)
            
            if len(cluster) > 1:
                clusters[cluster_id] = cluster
                logger.info(f"Created cluster {cluster_id} with {len(cluster)} events")
        
        return clusters
    
    @classmethod
    def validate_event_data(cls, event_data: Dict) -> Tuple[bool, List[str]]:
        """
        Validate event data quality.
        
        Returns:
            (is_valid: bool, errors: List[str])
        """
        errors = []
        
        # Validate coordinates
        if 'location' in event_data:
            loc = event_data['location']
            if not isinstance(loc, dict) or 'lat' not in loc or 'lng' not in loc:
                errors.append("Invalid location format")
            else:
                lat, lng = loc['lat'], loc['lng']
                if not (-90 <= lat <= 90):
                    errors.append(f"Invalid latitude: {lat}")
                if not (-180 <= lng <= 180):
                    errors.append(f"Invalid longitude: {lng}")
                # Allow (0,0) for non-geospatial events like news articles
                # News events don't have specific coordinates
                # if lat == 0 and lng == 0:
                #     errors.append("Coordinates at (0,0) - likely invalid data")
        else:
            errors.append("Missing location data")
        
        # Validate time
        if 'event_time' in event_data:
            event_time = event_data['event_time']
            if isinstance(event_time, datetime):
                # Event shouldn't be in the future
                if event_time > datetime.utcnow() + timedelta(hours=1):  # Allow 1hr clock skew
                    errors.append("Event time is in the future")
                # Event shouldn't be too old (>1 year)
                if event_time < datetime.utcnow() - timedelta(days=365):
                    errors.append("Event time is more than 1 year old")
        
        # Validate affected population
        if 'affected_population' in event_data:
            affected = event_data['affected_population']
            if affected < 0:
                errors.append("Affected population cannot be negative")
            if affected > 10_000_000:  # Sanity check
                logger.warning(f"Very large affected population: {affected}")
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    @classmethod
    def find_nearby_events(cls, location: Location, events: List[DisasterEvent], 
                          radius_km: float = 100, max_results: int = 10) -> List[DisasterEvent]:
        """
        Find events near a given location.
        
        Args:
            location: Center location
            events: List of all events
            radius_km: Search radius in kilometers
            max_results: Maximum number of results
            
        Returns:
            List of nearby events, sorted by distance
        """
        nearby = []
        
        for event in events:
            distance = cls.calculate_distance(location, event.location)
            if distance <= radius_km:
                nearby.append((distance, event))
        
        # Sort by distance and return events
        nearby.sort(key=lambda x: x[0])
        return [event for _, event in nearby[:max_results]]
