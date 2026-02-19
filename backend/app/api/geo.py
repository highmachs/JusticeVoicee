import json
import math
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class Center(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    lat: float
    lng: float
    distance_km: Optional[float] = None

# Load data on startup with absolute path
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_FILE = os.path.join(BASE_DIR, "data", "osc_directory.json")

with open(DATA_FILE, "r") as f:
    OSC_DATA = json.load(f)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("/nearest")
def get_nearest_centers(lat: float, lng: float):
    """
    Finds the nearest One Stop Centres based on user's lat/lng.
    """
    results = []
    for item in OSC_DATA:
        dist = haversine(lat, lng, item["lat"], item["lng"])
        center = item.copy()
        center["distance_km"] = round(dist, 2)
        results.append(center)
    
    # Sort by distance
    results.sort(key=lambda x: x["distance_km"])
    return {"centers": results[:3]} # Return top 3 wrapped in dict
