import requests
import json

url = "https://classes.rutgers.edu/soc/api/courses.json"
params = {"year": 2026, "term": 1, "campus": "NB"}

print(f"Fetching data from {url}...")
try:
    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()
    print(f"Total courses fetched: {len(data)}")
    
    target_subject = "375"
    target_number = "101"
    
    found = False
    for course in data:
        # Check types
        subj = course.get("subject")
        num = course.get("courseNumber")
        
        if str(subj) == target_subject and str(num) == target_number:
            print("\nFOUND COURSE!")
            print(f"Title: {course.get('title')}")
            print(f"Course String: {course.get('courseString')}")
            print(f"Subject (raw): {subj} (type: {type(subj)})")
            print(f"Number (raw): {num} (type: {type(num)})")
            print(f"Sections count: {len(course.get('sections', []))}")
            found = True
            break
            
    if not found:
        print(f"\nCourse {target_subject}:{target_number} NOT FOUND in API response.")
        
except Exception as e:
    print(f"Error: {e}")
