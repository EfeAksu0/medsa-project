import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

# First, log in and get a token
API_URL = "https://medysa-api.vercel.app/api"

# Test with our backend's JWT
import jwt as pyjwt
import datetime

JWT_SECRET = os.environ.get("JWT_SECRET", "dev_secret_change_me_in_prod")

# Get the first user from the DB to test with
from utils.validateEnv import *

# We'll test by hitting the AI endpoint with the backend token
# First generate a test token for the user
try:
    from prisma import Prisma
    import asyncio
    
    async def test():
        db = Prisma()
        await db.connect()
        
        user = await db.user.find_first(where={"tier": "MEDYSA_AI"})
        if not user:
            user = await db.user.find_first()
        
        print(f"Testing with user: {user.email if user else 'No user found'}")
        print(f"User tier: {user.tier if user else 'N/A'}")
        
        if user:
            token = pyjwt.encode({"userId": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, JWT_SECRET, algorithm="HS256")
            
            response = requests.post(f"{API_URL}/ai/chat", 
                json={"message": "hey"},
                headers={"Authorization": f"Bearer {token}"}
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
        
        await db.disconnect()
    
    asyncio.run(test())
except Exception as e:
    print(f"Error: {e}")
    # Fallback: just test with a direct HTTP call
    import subprocess
    # Just call the API with a fake token to see the error
    response = requests.post(f"{API_URL}/ai/chat",
        json={"message": "hey"},
        headers={"Authorization": "Bearer test"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
