import requests
import json

def test():
    # First login to get a token
    url = "https://medysa-api.vercel.app/api/auth/register"
    data = {
        "email": "test-stripe-3@example.com",
        "name": "Stripe Tester",
        "password": "password123",
        "plan": "knight"
    }
    
    res = requests.post(url, json=data)
    print("Register Status:", res.status_code)
    try:
        response_data = res.json()
        token = response_data.get('token')
        
        # Now create checkout session
        co_url = "https://medysa-api.vercel.app/api/payments/create-checkout-session"
        headers = {"Authorization": f"Bearer {token}"}
        
        co_res = requests.post(co_url, json={"planId": "knight"}, headers=headers)
        print("Checkout Status:", co_res.status_code)
        
        # To see the success_url, we can't easily see it without parsing the stripe session. 
        # But we can check if it returns a URL.
        print("URL:", co_res.json())
        
    except Exception as e:
        print("Error:", e, res.text)

if __name__ == "__main__":
    test()
