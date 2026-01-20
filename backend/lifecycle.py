from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
from models import DisasterEvent, LifecycleState, LifecycleHistory

logger = logging.getLogger(__name__)


class LifecycleManager:
    """
    Manages disaster event lifecycle transitions.
    
    Lifecycle States:
    - CREATED: New event detected
    - UPDATED: Event data changed (severity, population, etc.)
    - RESOLVED: Event no longer active
    - EXPIRED: Event auto-expired after inactivity period
    """
    
    @staticmethod
    def transition_to_created(event: DisasterEvent) -> DisasterEvent:
        """
        Initialize a new event in CREATED state.
        """
        event.lifecycle_state = LifecycleState.CREATED
        event.lifecycle_history.append(
            LifecycleHistory(
                timestamp=datetime.utcnow(),
                state=LifecycleState.CREATED,
                reason="Initial event detection"
            )
        )
        logger.info(f"Event {event.id} transitioned to CREATED")
        return event
    
    @staticmethod
    def transition_to_updated(event: DisasterEvent, changed_fields: List[str], reason: str = None) -> DisasterEvent:
        """
        Transition event to UPDATED state when data changes.
        
        Args:
            event: The event to update
            changed_fields: List of fields that changed
            reason: Optional reason for update
        """
        event.lifecycle_state = LifecycleState.UPDATED
        event.last_updated = datetime.utcnow()
        
        update_reason = reason or f"Updated fields: {', '.join(changed_fields)}"
        
        event.lifecycle_history.append(
            LifecycleHistory(
                timestamp=datetime.utcnow(),
                state=LifecycleState.UPDATED,
                reason=update_reason,
                changed_fields=changed_fields
            )
        )
        
        logger.info(f"Event {event.id} transitioned to UPDATED: {update_reason}")
        return event
    
    @staticmethod
    def transition_to_resolved(event: DisasterEvent, reason: str = "Event resolved") -> DisasterEvent:
        """
        Mark event as RESOLVED when it's no longer active.
        
        Args:
            event: The event to resolve
            reason: Reason for resolution
        """
        event.lifecycle_state = LifecycleState.RESOLVED
        event.last_updated = datetime.utcnow()
        
        event.lifecycle_history.append(
            LifecycleHistory(
                timestamp=datetime.utcnow(),
                state=LifecycleState.RESOLVED,
                reason=reason
            )
        )
        
        logger.info(f"Event {event.id} transitioned to RESOLVED: {reason}")
        return event
    
    @staticmethod
    def transition_to_expired(event: DisasterEvent) -> DisasterEvent:
        """
        Auto-expire event after inactivity period.
        
        Args:
            event: The event to expire
        """
        event.lifecycle_state = LifecycleState.EXPIRED
        event.last_updated = datetime.utcnow()
        
        # Ensure event_time is naive UTC for safe comparison
        event_time = event.event_time.replace(tzinfo=None) if event.event_time.tzinfo else event.event_time
        days_since_event = (datetime.utcnow() - event_time).days
        
        event.lifecycle_history.append(
            LifecycleHistory(
                timestamp=datetime.utcnow(),
                state=LifecycleState.EXPIRED,
                reason=f"Auto-expired after {days_since_event} days of inactivity"
            )
        )
        
        logger.info(f"Event {event.id} transitioned to EXPIRED after {days_since_event} days")
        return event
    
    @classmethod
    def check_for_expiry(cls, event: DisasterEvent) -> Optional[DisasterEvent]:
        """
        Check if event should be expired based on age and last update.
        
        Args:
            event: Event to check
            
        Returns:
            Updated event if expired, None otherwise
        """
        # Don't expire already resolved or expired events
        if event.lifecycle_state in [LifecycleState.RESOLVED, LifecycleState.EXPIRED]:
            return None
        
        now = datetime.utcnow()
        
        # Ensure datetimes are naive UTC for safe comparison
        event_time = event.event_time.replace(tzinfo=None) if event.event_time.tzinfo else event.event_time
        last_updated = event.last_updated.replace(tzinfo=None) if event.last_updated.tzinfo else event.last_updated
        
        # Check if event is older than auto_expire_days
        days_since_event = (now - event_time).days
        days_since_update = (now - last_updated).days
        
        # Expire if:
        # 1. Event is older than auto_expire_days AND
        # 2. No updates in the last auto_expire_days
        if days_since_event >= event.auto_expire_days and days_since_update >= event.auto_expire_days:
            return cls.transition_to_expired(event)
        
        return None
    
    @classmethod
    def bulk_check_expiry(cls, events: List[DisasterEvent]) -> List[DisasterEvent]:
        """
        Check multiple events for expiry.
        
        Args:
            events: List of events to check
            
        Returns:
            List of events that were expired
        """
        expired_events = []
        
        for event in events:
            updated_event = cls.check_for_expiry(event)
            if updated_event:
                expired_events.append(updated_event)
        
        if expired_events:
            logger.info(f"Expired {len(expired_events)} events")
        
        return expired_events
    
    @staticmethod
    def get_lifecycle_summary(event: DisasterEvent) -> Dict[str, Any]:
        """
        Get a summary of the event's lifecycle.
        
        Returns:
            Dictionary with lifecycle information
        """
        # Ensure event_time is naive UTC for safe comparison
        event_time = event.event_time.replace(tzinfo=None) if event.event_time.tzinfo else event.event_time
        
        return {
            'current_state': event.lifecycle_state,
            'created_at': event.detected_time,
            'last_updated': event.last_updated,
            'age_days': (datetime.utcnow() - event_time).days,
            'updates_count': len([h for h in event.lifecycle_history if h.state == LifecycleState.UPDATED]),
            'history': [
                {
                    'timestamp': h.timestamp,
                    'state': h.state,
                    'reason': h.reason,
                    'changed_fields': h.changed_fields
                }
                for h in event.lifecycle_history
            ]
        }
