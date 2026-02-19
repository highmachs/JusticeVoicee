import json
import math
from typing import List, Dict
import os

DIRECTORY_PATH = "backend/data/ngo_directory.json"

class DirectoryService:
    def __init__(self):
        self.data = self._load_data()

    def _load_data(self) -> List[Dict]:
        path = DIRECTORY_PATH
        if not os.path.exists(path):
            path = "backend/data/ngo_directory.json" # try relative
            if not os.path.exists(path):
                 return []
        
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _haversine(self, lat1, lon1, lat2, lon2):
        R = 6371  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
            math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
            math.sin(dlon / 2) * math.sin(dlon / 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def find_nearest(self, lat: float, lng: float, limit: int = 3) -> List[Dict]:
        """
        Finds the nearest NGOs/Centers based on Haversine distance.
        """
        results = []
        for entry in self.data:
            dist = self._haversine(lat, lng, entry['lat'], entry['lng'])
            entry['distance_km'] = round(dist, 2)
            results.append(entry)
        
        # Sort by distance
        results.sort(key=lambda x: x['distance_km'])
        return results[:limit]

directory_service = DirectoryService()

def get_nearby_help(lat: float, lng: float):
    return directory_service.find_nearest(lat, lng)
