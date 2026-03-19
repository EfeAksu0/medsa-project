import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def test_gemini():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("No GEMINI_API_KEY found in .env")
        return
    
    # Trim the key just in case it has \r\n
    api_key = api_key.strip()
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [{"text": "Hello, this is a test from Medysa."}]
        }]
    }
    
    print(f"Testing with key ending in: ...{api_key[-5:]}")
    res = requests.post(url, headers={"Content-Type": "application/json"}, json=payload)
    
    print("Status Code:", res.status_code)
    try:
        print("Response JSON:", res.json())
    except Exception as e:
        print("Response Text:", res.text)
        
if __name__ == "__main__":
    test_gemini()
