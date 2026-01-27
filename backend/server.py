from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import asyncio

# Import our modules
from models import (
    DisasterEvent, DisasterEventCreate, DisasterEventUpdate,
    LifecycleState, SeverityLevel, DisasterType, SystemHealth,
    IngestionStats
)
from ingestion import DataIngestionService
from geospatial import GeospatialValidator
from risk_scorer import RuleBasedRiskScorer
from lifecycle import LifecycleManager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection with SSL/TLS configuration for Render
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'disaster_sense')

# MongoDB connection (clean - no TLS bypass needed)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'disaster_sense')

try:
    client = AsyncIOMotorClient(
        mongo_url,
        serverSelectionTimeoutMS=5000  # 5 second timeout for server selection
    )
    db = client[db_name]
    logger.info("MongoDB connection initialized")
except Exception as e:
    logger.error(f"MongoDB connection setup error: {e}")
    # Continue anyway, connection will retry

# Collections
disasters_collection = db.disasters
ingestion_stats_collection = db.ingestion_stats

# Create the main app
app = FastAPI(title="DisasterSense Backend API", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Global services
ingestion_service = DataIngestionService()
geo_validator = GeospatialValidator()
lifecycle_manager = LifecycleManager()
risk_scorer = RuleBasedRiskScorer()

# Scheduler
scheduler = AsyncIOScheduler()
last_ingestion_time = None


# ===== ROOT HEALTH CHECK ENDPOINTS (for UptimeRobot) =====

@app.get("/")
async def root():
    """Root endpoint - confirms backend is running"""
    return {
        "message": "DisasterSense Global Risk & Response Monitoring Platform",
        "version": "2.0.0",
        "status": "running"
    }


@app.get("/health")
async def root_health_check():
    """Quick health check for monitoring services like UptimeRobot"""
    return {"status": "ok", "service": "DisasterSense Backend"}


@app.on_event("startup")
async def startup_event():
    """Initialize services and start background scheduler"""
    logger.info("Starting DisasterSense Backend...")
    
    # Try to create indexes, but don't block startup if MongoDB is unavailable
    try:
        await asyncio.wait_for(
            disasters_collection.create_index([("external_id", 1)]),
            timeout=2.0
        )
        await asyncio.wait_for(
            disasters_collection.create_index([("event_time", -1)]),
            timeout=2.0
        )
        await asyncio.wait_for(
            disasters_collection.create_index([("lifecycle_state", 1)]),
            timeout=2.0
        )
        await asyncio.wait_for(
            disasters_collection.create_index([("severity", 1)]),
            timeout=2.0
        )
        await asyncio.wait_for(
            disasters_collection.create_index([("type", 1)]),
            timeout=2.0
        )
        await asyncio.wait_for(
            disasters_collection.create_index([("source", 1)]),
            timeout=2.0
        )
        logger.info("Database indexes created")
    except asyncio.TimeoutError:
        logger.warning("Index creation timed out - MongoDB may be slow to connect")
    except Exception as e:
        logger.warning(f"Index creation skipped (non-critical): {type(e).__name__}")

    
    # Start scheduler for background ingestion (every 1 minute for real-time sync)
    scheduler.add_job(
        scheduled_data_ingestion,
        trigger=IntervalTrigger(minutes=1),
        id='data_ingestion',
        name='Multi-source disaster data ingestion',
        replace_existing=True
    )
    
    # Start scheduler for lifecycle expiry checks (every 5 minutes)
    scheduler.add_job(
        scheduled_expiry_check,
        trigger=IntervalTrigger(minutes=5),
        id='expiry_check',
        name='Event lifecycle expiry check',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Background scheduler started (1-minute ingestion interval for real-time sync)")
    logger.info("DisasterSense Backend initialization complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    scheduler.shutdown()
    client.close()
    logger.info("DisasterSense Backend shut down")


async def scheduled_data_ingestion():
    """
    Background job: Fetch data from all sources and process.
    Runs every 1 minute for real-time sync.
    """
    global last_ingestion_time
    
    logger.info("=== Starting scheduled data ingestion (1-minute interval) ===")
    start_time = datetime.utcnow()
    
    stats = {
        'timestamp': start_time,
        'events_fetched': 0,
        'events_created': 0,
        'events_updated': 0,
        'events_deduplicated': 0,
        'errors': []
    }
    
    try:
        # Fetch from all sources (doesn't require DB connection)
        new_events = ingestion_service.fetch_all_sources()
        stats['events_fetched'] = len(new_events)
        
        # Try to get existing events, but don't fail if DB is unavailable
        existing_events = []
        try:
            existing_events_cursor = disasters_collection.find({
                'lifecycle_state': {'$in': ['created', 'updated']}
            })
            async for doc in existing_events_cursor:
                try:
                    event = DisasterEvent(**doc)
                    existing_events.append(event)
                except Exception as e:
                    logger.error(f"Error parsing existing event: {e}")
        except Exception as e:
            logger.warning(f"Could not fetch existing events (DB unavailable): {type(e).__name__}")
            existing_events = []
        
        logger.info(f"Found {len(existing_events)} existing active events")
        
        # Process each new event
        for new_event_data in new_events:
            try:
                # Validate event data
                is_valid, errors = geo_validator.validate_event_data(new_event_data.model_dump())
                if not is_valid:
                    logger.warning(f"Invalid event data: {errors}")
                    stats['errors'].append(f"Validation failed: {errors[0] if errors else 'Unknown'}")
                    continue
                
                # Create DisasterEvent object
                new_event = DisasterEvent(**new_event_data.model_dump())
                
                # Check for duplicates
                duplicate_of = geo_validator.find_duplicates(new_event, existing_events)
                
                if duplicate_of:
                    # Handle duplicate - update existing event
                    should_update, changed_fields = geo_validator.should_update_event(
                        new_event.model_dump(), duplicate_of
                    )
                    
                    if should_update:
                        # Update existing event
                        duplicate_of = lifecycle_manager.transition_to_updated(
                            duplicate_of, changed_fields, "New data from ingestion"
                        )
                        
                        # Update fields
                        for field in changed_fields:
                            setattr(duplicate_of, field, getattr(new_event, field))
                        
                        # Recalculate risk score
                        nearby = geo_validator.find_nearby_events(
                            duplicate_of.location, existing_events, radius_km=100
                        )
                        duplicate_of.risk_score = risk_scorer.calculate_risk_score(
                            duplicate_of, 
                            [{'type': e.type} for e in nearby]
                        )
                        
                        # Try to save to database, but don't fail if unavailable
                        try:
                            await asyncio.wait_for(
                                disasters_collection.replace_one(
                                    {'id': duplicate_of.id},
                                    duplicate_of.model_dump()
                                ),
                                timeout=5.0
                            )
                            stats['events_updated'] += 1
                            logger.info(f"Updated event {duplicate_of.id}: {changed_fields}")
                        except Exception as db_error:
                            logger.warning(f"Could not update event to DB: {type(db_error).__name__}")
                    else:
                        stats['events_deduplicated'] += 1
                        logger.info(f"Duplicate found, no update needed: {new_event.title}")
                else:
                    # New event - create it
                    new_event = lifecycle_manager.transition_to_created(new_event)
                    
                    # Calculate risk score
                    nearby = geo_validator.find_nearby_events(
                        new_event.location, existing_events, radius_km=100
                    )
                    new_event.risk_score = risk_scorer.calculate_risk_score(
                        new_event,
                        [{'type': e.type} for e in nearby]
                    )
                    
                    # Try to save to database, but don't fail if unavailable
                    try:
                        await asyncio.wait_for(
                            disasters_collection.insert_one(new_event.model_dump()),
                            timeout=5.0
                        )
                        existing_events.append(new_event)  # Add to list for future dedup checks
                        stats['events_created'] += 1
                        logger.info(f"Created new event: {new_event.title} (Risk: {new_event.risk_score.total:.1f})")
                    except Exception as db_error:
                        logger.warning(f"Could not insert event to DB: {type(db_error).__name__}")
            
            except Exception as e:
                logger.error(f"Error processing event: {e}")
                stats['errors'].append(str(e))
                continue
        
        # Try to save ingestion stats
        try:
            end_time = datetime.utcnow()
            stats['duration_seconds'] = (end_time - start_time).total_seconds()
            await asyncio.wait_for(
                ingestion_stats_collection.insert_one(stats),
                timeout=5.0
            )
            last_ingestion_time = end_time
        except Exception as e:
            logger.warning(f"Could not save ingestion stats: {type(e).__name__}")
        
        logger.info(f"=== Ingestion complete: {stats['events_created']} created, "
                   f"{stats['events_updated']} updated, {stats['events_deduplicated']} duplicates ===")
    
    except Exception as e:
        logger.error(f"Fatal error in scheduled ingestion: {e}")
        stats['errors'].append(f"Fatal error: {str(e)}")


async def scheduled_expiry_check():
    """
    Background job: Check for events that should be expired.
    Runs every 5 minutes (faster than original 30-minute interval).
    """
    logger.info("=== Starting scheduled expiry check (5-minute interval) ===")
    
    try:
        # Try to get all active events, but don't fail if DB is unavailable
        cursor = None
        try:
            cursor = disasters_collection.find({
                'lifecycle_state': {'$in': ['created', 'updated']}
            })
        except Exception as e:
            logger.warning(f"Could not fetch active events for expiry check: {type(e).__name__}")
            return  # Exit gracefully if DB is unavailable
        
        active_events = []
        try:
            async for doc in cursor:
                try:
                    event = DisasterEvent(**doc)
                    active_events.append(event)
                except Exception as e:
                    logger.error(f"Error parsing event for expiry check: {e}")
        except Exception as e:
            logger.warning(f"Error iterating events: {type(e).__name__}")
            # Continue with partial results
        
        logger.info(f"Checking {len(active_events)} active events for expiry")
        
        # Check for expiry
        expired_events = lifecycle_manager.bulk_check_expiry(active_events)
        
        # Try to update expired events in database, but don't fail if DB is unavailable
        for event in expired_events:
            try:
                await asyncio.wait_for(
                    disasters_collection.replace_one(
                        {'id': event.id},
                        event.model_dump()
                    ),
                    timeout=5.0
                )
            except Exception as e:
                logger.warning(f"Could not update expired event {event.id}: {type(e).__name__}")
        
        logger.info(f"=== Expiry check complete: {len(expired_events)} events expired ===")
    
    except Exception as e:
        logger.error(f"Error in scheduled expiry check: {e}")


# ===== API ENDPOINTS =====

@api_router.get("/health")
async def health_check():
    """System health check"""
    db_connected = False
    active_count = 0
    
    try:
        # Check database connection
        await asyncio.wait_for(db.command('ping'), timeout=3.0)
        db_connected = True
        
        # Count active events (only if DB is connected)
        try:
            active_count = await asyncio.wait_for(
                disasters_collection.count_documents({
                    'lifecycle_state': {'$in': ['created', 'updated']}
                }),
                timeout=3.0
            )
        except asyncio.TimeoutError:
            logger.warning("Count documents timed out")
            active_count = 0
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        db_connected = False
        active_count = 0
    
    # Check data sources (simple check - could be enhanced)
    data_sources = {
        'usgs': True,  # No key required
        'nasa': True,  # No key required
        'weather': bool(os.getenv('OPENWEATHER_API_KEY')),
        'aqicn': bool(os.getenv('AQICN_API_KEY')),
        'news': bool(os.getenv('NEWS_API_KEY'))
    }
    
    health = SystemHealth(
        status="healthy" if db_connected and scheduler.running else "degraded",
        database_connected=db_connected,
        scheduler_running=scheduler.running,
        last_ingestion=last_ingestion_time,
        active_events=active_count,
        data_sources=data_sources
    )
    
    return health


@api_router.get("/disasters", response_model=List[DisasterEvent])
async def get_disasters(
    lifecycle_state: Optional[str] = Query(None, description="Filter by lifecycle state"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    disaster_type: Optional[str] = Query(None, description="Filter by disaster type"),
    source: Optional[str] = Query(None, description="Filter by data source"),
    days: int = Query(7, description="Events from last N days"),
    limit: int = Query(50, description="Maximum number of events to return")
):
    """
    Get disaster events with optional filtering.
    
    Real-time sync: Returns active events updated every 1 minute
    Default: Last 7 days of events, up to 50 records
    """
    # Build query
    query = {}
    
    # Time filter
    if days > 0:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        query['event_time'] = {'$gte': cutoff_date}
    
    # Lifecycle state filter
    if lifecycle_state:
        query['lifecycle_state'] = lifecycle_state
    else:
        # Default: only active events
        query['lifecycle_state'] = {'$in': ['created', 'updated']}
    
    # Severity filter
    if severity:
        query['severity'] = severity
    
    # Type filter
    if disaster_type:
        query['type'] = disaster_type
    
    # Source filter
    if source:
        query['source'] = source
    
    # Query database with error handling
    events = []
    try:
        cursor = disasters_collection.find(query).sort('event_time', -1).limit(limit)
        
        async for doc in cursor:
            try:
                event = DisasterEvent(**doc)
                events.append(event)
            except Exception as e:
                logger.error(f"Error parsing event: {e}")
    except Exception as e:
        logger.warning(f"Database query failed: {e}. Returning empty list.")
        # Return empty list if database is unavailable
        events = []
    
    logger.info(f"Retrieved {len(events)} disasters with filters: {query}")
    return events


@api_router.get("/disasters/{event_id}", response_model=DisasterEvent)
async def get_disaster_by_id(event_id: str):
    """Get a specific disaster event by ID"""
    doc = await disasters_collection.find_one({'id': event_id})
    
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return DisasterEvent(**doc)


@api_router.get("/disasters/lifecycle/summary")
async def get_lifecycle_summary():
    """Get summary of events by lifecycle state"""
    pipeline = [
        {
            '$group': {
                '_id': '$lifecycle_state',
                'count': {'$sum': 1}
            }
        }
    ]
    
    result = []
    try:
        async for doc in disasters_collection.aggregate(pipeline):
            result.append({
                'state': doc['_id'],
                'count': doc['count']
            })
    except Exception as e:
        logger.warning(f"Lifecycle summary query failed: {e}")
        result = []
    
    return result


@api_router.get("/disasters/stats/overview")
async def get_disaster_stats():
    """Get overview statistics"""
    severity_stats = {}
    type_stats = {}
    total_affected = 0
    source_stats = {}
    total_active = 0
    
    try:
        # Count by severity
        severity_pipeline = [
            {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
            {'$group': {'_id': '$severity', 'count': {'$sum': 1}}}
        ]
        
        async for doc in disasters_collection.aggregate(severity_pipeline):
            severity_stats[doc['_id']] = doc['count']
        
        # Count by type
        type_pipeline = [
            {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
            {'$group': {'_id': '$type', 'count': {'$sum': 1}}}
        ]
        
        async for doc in disasters_collection.aggregate(type_pipeline):
            type_stats[doc['_id']] = doc['count']
        
        # Total affected population
        affected_pipeline = [
            {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
            {'$group': {'_id': None, 'total': {'$sum': '$affected_population'}}}
        ]
        
        async for doc in disasters_collection.aggregate(affected_pipeline):
            total_affected = doc['total']
        
        # Count by source
        source_pipeline = [
            {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
            {'$group': {'_id': '$source', 'count': {'$sum': 1}}}
        ]
        
        async for doc in disasters_collection.aggregate(source_pipeline):
            source_stats[doc['_id']] = doc['count']
        
        total_active = await disasters_collection.count_documents({
        'lifecycle_state': {'$in': ['created', 'updated']}
    })
    
    except Exception as e:
        logger.warning(f"Stats query failed: {e}")
        # Return empty stats on database failure
        return {
            'total_active': 0,
            'by_severity': {},
            'by_type': {},
            'by_source': {},
            'total_affected_population': 0,
            'last_updated': datetime.utcnow()
        }
    
    return {
        'total_active': total_active,
        'by_severity': severity_stats,
        'by_type': type_stats,
        'by_source': source_stats,
        'total_affected_population': total_affected,
        'last_updated': datetime.utcnow()
    }


@api_router.post("/disasters/trigger-ingestion")
async def trigger_manual_ingestion():
    """Manually trigger data ingestion (for testing)"""
    asyncio.create_task(scheduled_data_ingestion())
    return {"message": "Ingestion triggered", "timestamp": datetime.utcnow()}


@api_router.get("/ingestion/stats")
async def get_ingestion_stats(limit: int = 10):
    """Get recent ingestion statistics"""
    stats = []
    try:
        cursor = ingestion_stats_collection.find().sort('timestamp', -1).limit(limit)
        
        async for doc in cursor:
            # Remove MongoDB _id
            doc.pop('_id', None)
            stats.append(doc)
    except Exception as e:
        logger.warning(f"Ingestion stats query failed: {e}")
        # Return empty list on database failure
        stats = []
    
    return stats


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
