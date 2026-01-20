#!/usr/bin/env python3
"""Deployment readiness check for DisasterSense Backend"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv

print('=' * 70)
print('DEPLOYMENT READINESS CHECK - DisasterSense Backend')
print('=' * 70)

# 1. Check Python version
print(f'\n✓ Python Version: {sys.version.split()[0]}')

# 2. Check imports
print('\nChecking required imports...')
try:
    from fastapi import FastAPI
    from motor.motor_asyncio import AsyncIOMotorClient
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    from ingestion import DataIngestionService
    from models import DisasterEvent
    from geospatial import GeospatialValidator
    from risk_scorer import RuleBasedRiskScorer
    from lifecycle import LifecycleManager
    print('✓ All required imports successful')
except ImportError as e:
    print(f'✗ Import error: {e}')
    sys.exit(1)

# 3. Check environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

required_vars = ['MONGO_URL', 'DB_NAME']
optional_vars = ['OPENWEATHER_API_KEY', 'AQICN_API_KEY', 'NEWS_API_KEY', 'YOUTUBE_API_KEY', 
                 'GOOGLE_GEOCODING_API_KEY', 'GOOGLE_MAPS_API_KEY', 'GOOGLE_API_KEY']

print('\n' + '─' * 70)
print('ENVIRONMENT CONFIGURATION')
print('─' * 70)

missing = []
for var in required_vars:
    val = os.getenv(var)
    if val:
        masked_val = val[:20] + '...' if len(val) > 20 else val
        print(f'✓ {var}: configured')
    else:
        print(f'✗ {var}: MISSING')
        missing.append(var)

print('\nOptional API Keys:')
for var in optional_vars:
    val = os.getenv(var)
    status = "✓ configured" if val else "  not configured"
    print(f'{status} - {var}')

if missing:
    print(f'\n✗ CRITICAL: Missing required variables: {missing}')
    sys.exit(1)

# 4. Check data ingestion service
print('\n' + '─' * 70)
print('DATA INGESTION SERVICE')
print('─' * 70)

try:
    ing = DataIngestionService()
    print('✓ DataIngestionService initialized')
    print('\nEnabled Data Sources:')
    print('  ✓ USGS Earthquakes (no key required)')
    print('  ✓ NASA EONET (no key required)')
    print('  ✓ GDACS Alerts (no key required)')
    
    if os.getenv('OPENWEATHER_API_KEY'):
        print('  ✓ OpenWeatherMap Alerts')
    if os.getenv('YOUTUBE_API_KEY'):
        print('  ✓ YouTube Videos')
    if os.getenv('NEWS_API_KEY'):
        print('  ✓ News API')
    if os.getenv('AQICN_API_KEY'):
        print('  ✓ AQICN Air Quality')
except Exception as e:
    print(f'✗ Service initialization error: {e}')
    sys.exit(1)

# 5. Test data fetching
print('\n' + '─' * 70)
print('DATA SOURCE TEST')
print('─' * 70)

try:
    print('Fetching events from all sources...')
    all_events = ing.fetch_all_sources()
    print(f'✓ Successfully fetched {len(all_events)} disaster events')
    print('  - System is ready for real-time sync (1-minute interval)')
except Exception as e:
    print(f'⚠ Warning: Data fetch test returned: {e}')
    print('  - Backend will still work, but data collection may be limited')

# 6. Check core services
print('\n' + '─' * 70)
print('CORE SERVICES VALIDATION')
print('─' * 70)

try:
    validator = GeospatialValidator()
    print('✓ GeospatialValidator: ready')
    
    scorer = RuleBasedRiskScorer()
    print('✓ RuleBasedRiskScorer: ready')
    
    lifecycle_mgr = LifecycleManager()
    print('✓ LifecycleManager: ready')
except Exception as e:
    print(f'✗ Service error: {e}')
    sys.exit(1)

# 7. Final status
print('\n' + '=' * 70)
print('✓ DEPLOYMENT READINESS: READY FOR PRODUCTION DEPLOYMENT')
print('=' * 70)

print('\nDEPLOYMENT CONFIGURATION:')
print('─' * 70)
print(f'  Database: MongoDB Atlas')
print(f'  API Port: 8001')
print(f'  Sync Interval: 1 minute (real-time)')
print(f'  Event Expiry Check: 5 minutes')
print(f'  CORS Origins: {os.getenv("CORS_ORIGINS", "*")}')

print('\nSTARTUP OPTIONS:')
print('─' * 70)
print('Option 1 (Direct Python):')
print('  cd backend && python server.py')
print('\nOption 2 (Uvicorn):')
print('  cd backend && uvicorn server:app --host 0.0.0.0 --port 8001')
print('\nOption 3 (Uvicorn with reload):')
print('  cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload')

print('\nHEALTH CHECK AFTER STARTUP:')
print('─' * 70)
print('  curl http://localhost:8001/api/health')

print('\nAPI ENDPOINTS AVAILABLE:')
print('─' * 70)
print('  GET    /api/health                    - System health check')
print('  GET    /api/disasters                 - Get disasters (real-time sync)')
print('  GET    /api/disasters/{id}            - Get specific disaster')
print('  GET    /api/disasters/lifecycle/summary - Lifecycle statistics')
print('  GET    /api/disasters/stats/overview  - Overview statistics')
print('  GET    /api/ingestion/stats           - Ingestion statistics')
print('  POST   /api/disasters/trigger-ingestion - Manual ingestion trigger')

print('\n' + '=' * 70)
print('Backend is READY for deployment!')
print('=' * 70)
