import os
import time
import requests

BASE_URL = "http://127.0.0.1:5000"

def test_workflow():
    print("=== Testing PathFinder AI Backend Workflow ===")
    
    # 1. Health check
    res = requests.get(f"{BASE_URL}/api/health")
    print(f"1. Health Check: {res.status_code} -> {res.json()}")
    assert res.status_code == 200

    # 2. Register
    email = f"student_{int(time.time())}@example.com"
    reg_payload = {
        "email": email,
        "password": "Password123!",
        "full_name": "Test Student"
    }
    res = requests.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    print(f"2. Register: {res.status_code} -> {res.json()}")
    assert res.status_code == 201
    token = res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Quiz Questions
    res = requests.get(f"{BASE_URL}/api/quiz/questions")
    print(f"3. Quiz Questions: {res.status_code} -> Received {res.json()['total_questions']} questions")
    assert res.status_code == 200

    # 4. Submit Quiz (Get 5 predictions)
    quiz_answers = {
        "Education Level": "Bachelor's",
        "Specialization": "Computer Science",
        "Skills": "Python, Machine Learning, Data Science",
        "Certifications": "AWS Certified",
        "CGPA/Percentage": "85%"
    }
    res = requests.post(f"{BASE_URL}/api/quiz/submit", json={"answers": quiz_answers}, headers=headers)
    print(f"4. Submit Quiz: {res.status_code}")
    quiz_res = res.json()
    predictions = quiz_res.get("predictions", [])
    print(f"   -> Top 5 Unique Predictions Count: {len(predictions)}")
    for idx, p in enumerate(predictions, 1):
        print(f"      [{idx}] {p['career']} (Score: {p['score']}%)")
    assert len(predictions) == 5

    # 5. Select 1 Career
    selected_career = predictions[0]["career"]
    res = requests.post(f"{BASE_URL}/api/career/select", json={"selected_career": selected_career}, headers=headers)
    print(f"5. Select Career '{selected_career}': {res.status_code} -> {res.json()['message']}")
    assert res.status_code == 200

    # 6. Start Chat
    res = requests.post(f"{BASE_URL}/api/chat/start", headers=headers)
    print(f"6. Start Chat: {res.status_code} -> File ref: {res.json().get('txt_file_reference')}")
    assert res.status_code == 200

    # 7. Send Message
    msg_payload = {"message": "What portfolio projects should I build to prepare for this role?"}
    res = requests.post(f"{BASE_URL}/api/chat/message", json=msg_payload, headers=headers)
    print(f"7. Send Chat Message: {res.status_code}")
    print(f"   -> AI Response: {res.json().get('response')[:120]}...")
    assert res.status_code == 200

    # 8. Close Chat (Verifies .txt file save & update)
    res = requests.post(f"{BASE_URL}/api/chat/close", headers=headers)
    print(f"8. Close Chat: {res.status_code} -> {res.json()['message']}")
    txt_path = res.json().get("txt_file_path")
    assert res.status_code == 200
    assert os.path.exists(txt_path)
    print(f"   -> Confirmed .txt log file exists on disk: {txt_path}")

    # 9. User Logs Back In & Starts Chat Again (Verifies loading past context from .txt file)
    res = requests.post(f"{BASE_URL}/api/chat/start", headers=headers)
    past_transcript = res.json().get("past_transcript", "")
    print(f"9. Re-open Chat session: {res.status_code} -> Past transcript loaded ({len(past_transcript)} chars)")
    assert len(past_transcript) > 0

    # 10. Resources & Reviews
    res = requests.get(f"{BASE_URL}/api/resources")
    print(f"10a. Resources Count: {len(res.json()['resources'])}")
    assert res.status_code == 200

    rev_payload = {"rating": 5, "comment": "Amazing career predictions and AI mentor!"}
    res = requests.post(f"{BASE_URL}/api/reviews", json=rev_payload, headers=headers)
    print(f"10b. Submit Review: {res.status_code} -> {res.json()['message']}")
    assert res.status_code == 201

    print("\n=== ALL WORKFLOW VERIFICATION TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_workflow()
