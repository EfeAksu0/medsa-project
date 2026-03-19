import requests

def test_auth_me():
    # Login as the test user from earlier
    url = "https://medysa-api.vercel.app/api/auth/login"
    res = requests.post(url, json={
        "email": "test-stripe-3@example.com",
        "password": "password123"
    })
    
    if res.status_code != 200:
        print("Login failed:", res.text)
        return
        
    token = res.json().get('token')
    print("Logged in. Got token.")
    
    # Check /auth/me
    me_url = "https://medysa-api.vercel.app/api/auth/me"
    me_res = requests.get(me_url, headers={"Authorization": f"Bearer {token}"})
    print("Auth/Me Status:", me_res.status_code)
    print("Auth/Me Response:", me_res.text)

if __name__ == "__main__":
    test_auth_me()
