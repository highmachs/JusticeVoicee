import requests
import time

BASE_URL = "http://127.0.0.1:8001/api/voice"

def test_incoming_call():
    print("\nTesting /incoming...")
    try:
        response = requests.post(f"{BASE_URL}/incoming")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{response.text}")
        if "<Say" in response.text and "<Gather" in response.text:
            print("✅ Incoming call TwiML looks correct.")
        else:
            print("❌ Incoming call TwiML invalid.")
    except Exception as e:
        print(f"Error: {e}")

def test_process_speech():
    print("\nTesting /process with 'Hello'...")
    try:
        # Simulate Twilio form data
        data = {"SpeechResult": "Hello, I need help with health schemes."}
        response = requests.post(f"{BASE_URL}/process", data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{response.text}")
        if "<Say" in response.text:
            print("✅ Process speech TwiML looks correct (contains response).")
        else:
            print("❌ Process speech TwiML invalid.")
    except Exception as e:
        print(f"Error in process_speech: {e}")

if __name__ == "__main__":
    print("Wait for server to start (5s)...")
    time.sleep(5)
    test_incoming_call()
    test_process_speech()
