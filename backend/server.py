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

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'disaster_sense')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

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


@app.on_event("startup")
async def startup_event():
    """Initialize services and start background scheduler"""
    logger.info("Starting DisasterSense Backend...")
    
    # Create indexes for better query performance
    await disasters_collection.create_index([("external_id", 1)])
    await disasters_collection.create_index([("event_time", -1)])
    await disasters_collection.create_index([("lifecycle_state", 1)])
    await disasters_collection.create_index([("severity", 1)])
    await disasters_collection.create_index([("type", 1)])
    await disasters_collection.create_index([("source", 1)])
    
    logger.info("Database indexes created")
    
    # Start scheduler for background ingestion (every 10 minutes)
    scheduler.add_job(
        scheduled_data_ingestion,
        trigger=IntervalTrigger(minutes=10),
        id='data_ingestion',
        name='Multi-source disaster data ingestion',
        replace_existing=True
    )
    
    # Start scheduler for lifecycle expiry checks (every 30 minutes)
    scheduler.add_job(
        scheduled_expiry_check,
        trigger=IntervalTrigger(minutes=30),
        id='expiry_check',
        name='Event lifecycle expiry check',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Background scheduler started (10-minute ingestion interval)")
    
    # Run initial ingestion
    asyncio.create_task(scheduled_data_ingestion())
    logger.info("Initial data ingestion triggered")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    scheduler.shutdown()
    client.close()
    logger.info("DisasterSense Backend shut down")


async def scheduled_data_ingestion():
    """
    Background job: Fetch data from all sources and process.
    Runs every 10 minutes.
    """
    global last_ingestion_time
    
    logger.info("=== Starting scheduled data ingestion ===")
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
        # Fetch from all sources
        new_events = ingestion_service.fetch_all_sources()
        stats['events_fetched'] = len(new_events)
        
        # Get existing active events for deduplication
        existing_events_cursor = disasters_collection.find({
            'lifecycle_state': {'$in': ['created', 'updated']}
        })
        existing_events = []
        async for doc in existing_events_cursor:
            try:
                event = DisasterEvent(**doc)
                existing_events.append(event)
            except Exception as e:
                logger.error(f"Error parsing existing event: {e}")
        
        logger.info(f"Found {len(existing_events)} existing active events")
        
        # Process each new event
        for new_event_data in new_events:
            try:
                # Validate event data
                is_valid, errors = geo_validator.validate_event_data(new_event_data.dict())
                if not is_valid:
                    logger.warning(f"Invalid event data: {errors}")
                    stats['errors'].append(f"Validation failed: {errors[0] if errors else 'Unknown'}")
                    continue
                
                # Create DisasterEvent object
                new_event = DisasterEvent(**new_event_data.dict())
                
                # Check for duplicates
                duplicate_of = geo_validator.find_duplicates(new_event, existing_events)
                
                if duplicate_of:
                    # Handle duplicate - update existing event
                    should_update, changed_fields = geo_validator.should_update_event(
                        new_event.dict(), duplicate_of
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
                        
                        # Save to database
                        await disasters_collection.replace_one(
                            {'id': duplicate_of.id},
                            duplicate_of.dict()
                        )
                        
                        stats['events_updated'] += 1
                        logger.info(f"Updated event {duplicate_of.id}: {changed_fields}")
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
                    
                    # Save to database
                    await disasters_collection.insert_one(new_event.dict())
                    existing_events.append(new_event)  # Add to list for future dedup checks
                    
                    stats['events_created'] += 1
                    logger.info(f"Created new event: {new_event.title} (Risk: {new_event.risk_score.total:.1f})")
            
            except Exception as e:
                logger.error(f"Error processing event: {e}")
                stats['errors'].append(str(e))
                continue
        
        # Save ingestion stats
        end_time = datetime.utcnow()
        stats['duration_seconds'] = (end_time - start_time).total_seconds()
        await ingestion_stats_collection.insert_one(stats)
        
        last_ingestion_time = end_time
        
        logger.info(f"=== Ingestion complete: {stats['events_created']} created, "
                   f"{stats['events_updated']} updated, {stats['events_deduplicated']} duplicates ===")
    
    except Exception as e:
        logger.error(f"Fatal error in scheduled ingestion: {e}")
        stats['errors'].append(f"Fatal error: {str(e)}")


async def scheduled_expiry_check():
    """
    Background job: Check for events that should be expired.
    Runs every 30 minutes.
    """
    logger.info("=== Starting scheduled expiry check ===")
    
    try:
        # Get all active events
        cursor = disasters_collection.find({
            'lifecycle_state': {'$in': ['created', 'updated']}
        })
        
        active_events = []
        async for doc in cursor:
            try:
                event = DisasterEvent(**doc)
                active_events.append(event)
            except Exception as e:
                logger.error(f"Error parsing event for expiry check: {e}")
        
        logger.info(f"Checking {len(active_events)} active events for expiry")
        
        # Check for expiry
        expired_events = lifecycle_manager.bulk_check_expiry(active_events)
        
        # Update expired events in database
        for event in expired_events:
            await disasters_collection.replace_one(
                {'id': event.id},
                event.dict()
            )
        
        logger.info(f"=== Expiry check complete: {len(expired_events)} events expired ===")
    
    except Exception as e:
        logger.error(f"Error in scheduled expiry check: {e}")


# ===== API ENDPOINTS =====

@api_router.get("/health")
async def health_check():
    """System health check"""
    try:
        # Check database connection
        await db.command('ping')
        db_connected = True
    except:
        db_connected = False
    
    # Count active events
    active_count = await disasters_collection.count_documents({
        'lifecycle_state': {'$in': ['created', 'updated']}
    })
    
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
    days: int = Query(30, description="Events from last N days"),
    limit: int = Query(100, description="Maximum number of events to return")
):
    """
    Get disaster events with optional filtering.
    
    Default: Returns active events from last 30 days
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
    
    # Query database
    cursor = disasters_collection.find(query).sort('event_time', -1).limit(limit)
    
    events = []
    async for doc in cursor:
        try:
            event = DisasterEvent(**doc)
            events.append(event)
        except Exception as e:
            logger.error(f"Error parsing event: {e}")
    
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
    async for doc in disasters_collection.aggregate(pipeline):
        result.append({
            'state': doc['_id'],
            'count': doc['count']
        })
    
    return result


@api_router.get("/disasters/stats/overview")
async def get_disaster_stats():
    """Get overview statistics"""
    # Count by severity
    severity_pipeline = [
        {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
        {'$group': {'_id': '$severity', 'count': {'$sum': 1}}}
    ]
    
    severity_stats = {}
    async for doc in disasters_collection.aggregate(severity_pipeline):
        severity_stats[doc['_id']] = doc['count']
    
    # Count by type
    type_pipeline = [
        {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
        {'$group': {'_id': '$type', 'count': {'$sum': 1}}}
    ]
    
    type_stats = {}
    async for doc in disasters_collection.aggregate(type_pipeline):
        type_stats[doc['_id']] = doc['count']
    
    # Total affected population
    affected_pipeline = [
        {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
        {'$group': {'_id': None, 'total': {'$sum': '$affected_population'}}}
    ]
    
    total_affected = 0
    async for doc in disasters_collection.aggregate(affected_pipeline):
        total_affected = doc['total']
    
    # Count by source
    source_pipeline = [
        {'$match': {'lifecycle_state': {'$in': ['created', 'updated']}}},
        {'$group': {'_id': '$source', 'count': {'$sum': 1}}}
    ]
    
    source_stats = {}
    async for doc in disasters_collection.aggregate(source_pipeline):
        source_stats[doc['_id']] = doc['count']
    
    total_active = await disasters_collection.count_documents({
        'lifecycle_state': {'$in': ['created', 'updated']}
    })
    
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
    cursor = ingestion_stats_collection.find().sort('timestamp', -1).limit(limit)
    
    stats = []
    async for doc in cursor:
        # Remove MongoDB _id
        doc.pop('_id', None)
        stats.append(doc)
    
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
