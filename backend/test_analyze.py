import cv2
import numpy as np
import base64
import requests
import json

def test_analyze():
    # Create a very dark image (brightness ~5)
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    img[:] = [5, 5, 5] 
    
    _, buffer = cv2.imencode('.jpg', img)
    img_str = base64.b64encode(buffer).decode('utf-8')
    
    payload = {
        'image': img_str,
        'phone': '9999999999',
        'full_name': 'Test User'
    }
    
    try:
        r = requests.post('http://127.0.0.1:8000/analyze', json=payload)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            analysis = data.get("analysis", {})
            is_low_quality = analysis.get("is_low_quality")
            confidence_score = analysis.get("confidence_score")
            print(f"is_low_quality: {is_low_quality}")
            print(f"confidence_score: {confidence_score}")
        else:
            print(f"Error: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analyze()
