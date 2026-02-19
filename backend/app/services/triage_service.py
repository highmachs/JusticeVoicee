from typing import Dict, List
import re

class TriageService:
    # Rule-Based Keywords (High-precision triggers)
    CRISIS_KEYWORDS = [
        "hit me", "beat me", "kill me", "bleeding", "emergency", "hurt", "pain", 
        "threaten", "scared", "unsafe", "locked", "bathroom", "weapon", "knife", "police"
    ]
    
    ACTION_KEYWORDS = [
        "file complaint", "report", "fir", "police station", "lawyer", "court", 
        "divorce", "maintenance", "money", "dowry", "custody"
    ]

    def classify_urgency(self, text: str) -> Dict[str, str]:
        """
        Classifies input into: 'CRISIS', 'ACTION', or 'INFO'.
        Returns severity level and recommended next step.
        """
        text_lower = text.lower()
        
        # 1. Check Crisis (Highest Priority)
        for keyword in self.CRISIS_KEYWORDS:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                return {
                    "category": "CRISIS",
                    "severity": "HIGH",
                    "recommendation": "IMMEDIATE_SAFETY",
                    "action": "Trigger Panic Mode / Show SOS Button"
                }

        # 2. Check Action (Legal Procedure)
        for keyword in self.ACTION_KEYWORDS:
             if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                return {
                    "category": "ACTION",
                    "severity": "MEDIUM",
                    "recommendation": "LEGAL_FILING",
                    "action": "Offer PWDVA Form Generation"
                }

        # 3. Default to Info (RAG)
        return {
            "category": "INFO",
            "severity": "LOW",
            "recommendation": "EDUCATION",
            "action": "Route to RAG Engine"
        }

triage_service = TriageService()
