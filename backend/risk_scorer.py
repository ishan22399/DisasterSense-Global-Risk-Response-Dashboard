from datetime import datetime, timedelta
from typing import Dict, Any
import math
from models import DisasterEvent, RiskScore, SeverityLevel, DisasterType


class RuleBasedRiskScorer:
    """
    Rule-based, deterministic risk scoring system.
    No ML - just clear, explainable logic suitable for operational use.
    
    Risk factors:
    1. Disaster severity (40%)
    2. Estimated population impact (30%)
    3. Temporal factors (recency, duration) (20%)
    4. Event recurrence/clustering (10%)
    """
    
    # Severity weights
    SEVERITY_WEIGHTS = {
        SeverityLevel.LOW: 10,
        SeverityLevel.MEDIUM: 30,
        SeverityLevel.HIGH: 60,
        SeverityLevel.CRITICAL: 100
    }
    
    # Disaster type base risk multipliers
    TYPE_MULTIPLIERS = {
        DisasterType.TSUNAMI: 1.3,
        DisasterType.EARTHQUAKE: 1.2,
        DisasterType.VOLCANO: 1.2,
        DisasterType.HURRICANE: 1.15,
        DisasterType.TORNADO: 1.1,
        DisasterType.WILDFIRE: 1.0,
        DisasterType.FLOOD: 1.0,
        DisasterType.STORM: 0.9,
        DisasterType.HEATWAVE: 0.85,
        DisasterType.DROUGHT: 0.7,
        DisasterType.LANDSLIDE: 0.95,
        DisasterType.UNKNOWN: 0.5
    }
    
    @classmethod
    def calculate_risk_score(cls, event: DisasterEvent, nearby_events: list = None) -> RiskScore:
        """
        Calculate comprehensive risk score for an event.
        
        Args:
            event: The disaster event to score
            nearby_events: List of nearby events in same region (for recurrence factor)
            
        Returns:
            RiskScore object with breakdown
        """
        # 1. Severity Factor (40% weight)
        severity_factor = cls._calculate_severity_factor(event)
        
        # 2. Population Impact Factor (30% weight)
        population_factor = cls._calculate_population_factor(event)
        
        # 3. Temporal Factor (20% weight)
        temporal_factor = cls._calculate_temporal_factor(event)
        
        # 4. Recurrence Factor (10% weight)
        recurrence_factor = cls._calculate_recurrence_factor(event, nearby_events or [])
        
        # Calculate weighted total
        total = (
            severity_factor * 0.40 +
            population_factor * 0.30 +
            temporal_factor * 0.20 +
            recurrence_factor * 0.10
        )
        
        # Apply type multiplier
        type_multiplier = cls.TYPE_MULTIPLIERS.get(event.type, 1.0)
        total = min(total * type_multiplier, 100.0)  # Cap at 100
        
        # Generate explanation
        explanation = cls._generate_explanation(total, event, severity_factor, population_factor, temporal_factor, recurrence_factor)
        
        return RiskScore(
            total=round(total, 2),
            severity_factor=round(severity_factor, 2),
            population_factor=round(population_factor, 2),
            temporal_factor=round(temporal_factor, 2),
            recurrence_factor=round(recurrence_factor, 2),
            explanation=explanation
        )
    
    @classmethod
    def _calculate_severity_factor(cls, event: DisasterEvent) -> float:
        """
        Calculate risk from disaster severity.
        Returns: 0-100
        """
        base_score = cls.SEVERITY_WEIGHTS.get(event.severity, 50)
        
        # Adjust by magnitude if available
        if event.magnitude:
            if event.type == DisasterType.EARTHQUAKE:
                # Richter scale: 3-9 range
                magnitude_bonus = min((event.magnitude - 3) * 8, 30)
                base_score = min(base_score + magnitude_bonus, 100)
            elif event.type in [DisasterType.HURRICANE, DisasterType.STORM]:
                # Wind speed: 0-200+ km/h
                if event.magnitude > 150:
                    base_score = min(base_score + 20, 100)
                elif event.magnitude > 100:
                    base_score = min(base_score + 10, 100)
        
        return base_score
    
    @classmethod
    def _calculate_population_factor(cls, event: DisasterEvent) -> float:
        """
        Calculate risk from affected population.
        Returns: 0-100
        """
        affected = event.affected_population
        
        # Logarithmic scale for population impact
        if affected == 0:
            return 10.0  # Unknown population, assume moderate
        elif affected < 1000:
            return 20.0
        elif affected < 10000:
            return 40.0
        elif affected < 50000:
            return 60.0
        elif affected < 100000:
            return 75.0
        elif affected < 500000:
            return 85.0
        else:
            # Over 500k affected
            return min(90.0 + math.log10(affected / 500000) * 10, 100.0)
    
    @classmethod
    def _calculate_temporal_factor(cls, event: DisasterEvent) -> float:
        """
        Calculate risk from time-based factors (recency, ongoing status).
        Returns: 0-100
        """
        now = datetime.utcnow()
        # Ensure event_time is naive UTC for safe comparison
        event_time = event.event_time.replace(tzinfo=None) if event.event_time.tzinfo else event.event_time
        event_age = now - event_time
        
        # Recency factor: newer events are higher risk
        if event_age < timedelta(hours=6):
            recency_score = 100.0
        elif event_age < timedelta(hours=24):
            recency_score = 85.0
        elif event_age < timedelta(days=3):
            recency_score = 70.0
        elif event_age < timedelta(days=7):
            recency_score = 50.0
        else:
            # Decay after 7 days
            days_old = event_age.days
            recency_score = max(50.0 - (days_old - 7) * 3, 10.0)
        
        return recency_score
    
    @classmethod
    def _calculate_recurrence_factor(cls, event: DisasterEvent, nearby_events: list) -> float:
        """
        Calculate risk from event clustering/recurrence.
        Multiple events in same area increase risk.
        Returns: 0-100
        """
        if not nearby_events:
            return 50.0  # Baseline
        
        # Count recent events of same type nearby
        same_type_count = sum(1 for e in nearby_events if e.get('type') == event.type)
        
        if same_type_count == 0:
            return 50.0
        elif same_type_count == 1:
            return 60.0
        elif same_type_count == 2:
            return 75.0
        else:
            # Multiple recurring events - high risk
            return min(75.0 + (same_type_count - 2) * 10, 100.0)
    
    @classmethod
    def _generate_explanation(cls, total: float, event: DisasterEvent, 
                            severity_factor: float, population_factor: float,
                            temporal_factor: float, recurrence_factor: float) -> str:
        """
        Generate human-readable explanation of risk score.
        """
        risk_level = "CRITICAL" if total >= 80 else "HIGH" if total >= 60 else "MODERATE" if total >= 40 else "LOW"
        
        explanation = f"Risk Level: {risk_level} ({total:.1f}/100). "
        
        # Add key contributing factors
        factors = []
        if severity_factor >= 70:
            factors.append(f"{event.severity.upper()} severity event")
        if population_factor >= 70:
            factors.append(f"{event.affected_population:,}+ people affected")
        if temporal_factor >= 85:
            factors.append("ongoing/recent event")
        if recurrence_factor >= 70:
            factors.append("recurring in region")
        
        if factors:
            explanation += "Key factors: " + ", ".join(factors) + "."
        else:
            explanation += "Standard risk assessment based on event characteristics."
        
        return explanation
