import sys
import os

# Add backend to path so we can import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.services.triage_service import triage_service
from backend.app.services.directory_service import get_nearby_help
from backend.app.services.form_service import pdf_service

def test_triage():
    print("--- Testing Triage Service ---")
    inputs = [
        "My husband hit me and I am bleeding",
        "I need to file a complaint about dowry",
        "What is the number for women helpline?"
    ]
    for text in inputs:
        result = triage_service.classify_urgency(text)
        print(f"Input: '{text}'\nClassified: {result['category']} | Severity: {result['severity']}\n")

def test_directory():
    print("--- Testing Directory Service (Geo-Connect) ---")
    # Coordinates for Ranchi, Jharkhand
    ranchi_lat, ranchi_lng = 23.3441, 85.3096
    print(f"Searching near Ranchi ({ranchi_lat}, {ranchi_lng})...")
    results = get_nearby_help(ranchi_lat, ranchi_lng)
    
    for i, res in enumerate(results):
        print(f"{i+1}. {res['name']} ({res['type']}) - {res['distance_km']} km away")
    print("")

def test_pdf_generation():
    print("--- Testing PDF Action Service ---")
    victim = "Savitri Devi"
    respondent = "Ramesh Kumar"
    details = "On 18th Feb, respondent physically assaulted victim demanding dowry."
    
    try:
        path = pdf_service.generate_pwdva_form(victim, respondent, details)
        print(f"PDF Generated Successfully at: {path}")
        if os.path.exists(path):
            print("File verification: EXISTS")
    except Exception as e:
        print(f"PDF Generation Failed: {e}")
    print("")

if __name__ == "__main__":
    test_triage()
    test_directory()
    test_pdf_generation()
