import requests
import json

url = "https://classes.rutgers.edu/soc/api/courses.json"
params = {"year": 2026, "term": 1, "campus": "NB"}

try:
    print(f"Fetching from {url} with params {params}...")
    r = requests.get(url, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    print(f"Got {len(data)} courses.")
    if len(data) > 0:
        print("First course sample:")
        print(json.dumps(data[0], indent=2))
        
        # Check for a specific course format
        sample_course = next((c for c in data if "198" in c.get("courseString", "")), None)
        if sample_course:
            print("\nSample CS course:")
            print(f"Title: {sample_course.get('title')}")
            print(f"Course String: {sample_course.get('courseString')}")
            print(f"Subject: {sample_course.get('subject')}")
            print(f"Course Number: {sample_course.get('courseNumber')}")
except Exception as e:
    print(f"Error: {e}")
