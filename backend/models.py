from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid


class LifecycleState(str, Enum):
    """Event lifecycle states"""
    CREATED = "created"
    UPDATED = "updated"
    RESOLVED = "resolved"
    EXPIRED = "expired"


class DisasterType(str, Enum):
    """Types of disasters"""
    EARTHQUAKE = "earthquake"
    WILDFIRE = "wildfire"
    FLOOD = "flood"
    HURRICANE = "hurricane"
    STORM = "storm"
    TORNADO = "tornado"
    TSUNAMI = "tsunami"
    VOLCANO = "volcano"
    HEATWAVE = "heatwave"
    DROUGHT = "drought"
    LANDSLIDE = "landslide"
    UNKNOWN = "unknown"


class SeverityLevel(str, Enum):
    """Severity levels for disasters"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class DataSource(str, Enum):
    """Data sources for disaster events"""
    USGS = "usgs"
    NASA = "nasa"
    WEATHER = "weather"
    NEWS = "news"
    AQICN = "aqicn"
    LOCAL = "local"


class Location(BaseModel):
    """Geographic location"""
    lat: float = Field(..., description="Latitude")
    lng: float = Field(..., description="Longitude")
    address: Optional[str] = Field(None, description="Human-readable address")


class RiskScore(BaseModel):
    """Rule-based risk scoring"""
    total: float = Field(..., ge=0, le=100, description="Total risk score (0-100)")
    severity_factor: float = Field(..., description="Impact from disaster severity")
    population_factor: float = Field(..., description="Impact from population density")
    recurrence_factor: float = Field(..., description="Impact from historical frequency")
    temporal_factor: float = Field(..., description="Impact from time-based factors")
    explanation: str = Field(..., description="Human-readable explanation of score")


class LifecycleHistory(BaseModel):
    """Audit trail for lifecycle changes"""
    timestamp: datetime
    state: LifecycleState
    reason: Optional[str] = None
    changed_fields: Optional[List[str]] = None


class DisasterEvent(BaseModel):
    """Complete disaster event model with lifecycle"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    external_id: Optional[str] = Field(None, description="Original ID from data source")
    
    # Basic Information
    type: DisasterType
    title: str
    description: Optional[str] = None
    
    # Location
    location: Location
    
    # Severity & Impact
    magnitude: Optional[float] = Field(None, description="Magnitude (earthquake, wind speed, etc.)")
    severity: SeverityLevel
    affected_population: int = Field(0, description="Estimated affected population")
    
    # Risk Assessment
    risk_score: Optional[RiskScore] = None
    
    # Temporal Information
    event_time: datetime = Field(..., description="When the disaster occurred")
    detected_time: datetime = Field(default_factory=datetime.utcnow, description="When we detected it")
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    # Lifecycle Management
    lifecycle_state: LifecycleState = Field(default=LifecycleState.CREATED)
    lifecycle_history: List[LifecycleHistory] = Field(default_factory=list)
    auto_expire_days: int = Field(default=7, description="Days until auto-expiry")
    
    # Data Provenance
    source: DataSource
    source_url: Optional[str] = None
    confidence: float = Field(default=0.8, ge=0, le=1, description="Data confidence score")
    
    # Deduplication & Clustering
    is_duplicate: bool = Field(default=False)
    duplicate_of: Optional[str] = Field(None, description="ID of primary event if this is a duplicate")
    cluster_id: Optional[str] = Field(None, description="ID for event clustering")
    
    # Metadata
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class DisasterEventCreate(BaseModel):
    """Model for creating new disaster events"""
    type: DisasterType
    title: str
    description: Optional[str] = None
    location: Location
    magnitude: Optional[float] = None
    severity: SeverityLevel
    affected_population: int = 0
    event_time: datetime
    source: DataSource
    source_url: Optional[str] = None
    external_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DisasterEventUpdate(BaseModel):
    """Model for updating disaster events"""
    severity: Optional[SeverityLevel] = None
    affected_population: Optional[int] = None
    description: Optional[str] = None
    lifecycle_state: Optional[LifecycleState] = None
    metadata: Optional[Dict[str, Any]] = None


class IngestionStats(BaseModel):
    """Statistics from data ingestion"""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: DataSource
    events_fetched: int = 0
    events_created: int = 0
    events_updated: int = 0
    events_deduplicated: int = 0
    errors: List[str] = Field(default_factory=list)
    duration_seconds: float = 0.0


class SystemHealth(BaseModel):
    """System health status"""
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    database_connected: bool
    scheduler_running: bool
    last_ingestion: Optional[datetime] = None
    active_events: int = 0
    data_sources: Dict[str, bool] = Field(default_factory=dict)
