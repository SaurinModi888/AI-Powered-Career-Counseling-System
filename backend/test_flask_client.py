import os
import json
import time
from server import app

def run_tests():
    print("=== Testing PathFinder AI Flask Application directly via TestClient ===")
    client = app.test_client()

    # 1. Health check
    res = client.get('/api/health')
    print(f"1. Health Check: Status {res.status_code} -> {res.get_json()}")
    assert res.status_code == 200

    # 2. Register User
    email = f"student_{int(time.time())}@example.com"
    reg_payload = {
        "email": email,
        "password": "SecurePassword123!",
        "full_name": "Saurin Modi"
    }
    res = client.post('/api/auth/register', json=reg_payload)
    print(f"2. User Registration: Status {res.status_code} -> {res.get_json()['message']}")
    assert res.status_code == 201
    token = res.get_json()['token']
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Quiz Questions
    res = client.get('/api/quiz/questions')
    q_data = res.get_json()
    print(f"3. Quiz Questions: Status {res.status_code} -> Total Questions: {q_data['total_questions']}")
    assert res.status_code == 200
    assert q_data['total_questions'] == 16

    # 4. Submit Quiz & Get 5 Predictions
    quiz_answers = {
        "Education Level": "Bachelor's",
        "Specialization": "Computer Science",
        "Skills": "Python, Data Analysis, Machine Learning",
        "Certifications": "AWS Certified",
        "CGPA/Percentage": 88.0
    }
    res = client.post('/api/quiz/submit', json={"answers": quiz_answers}, headers=headers)
    assert res.status_code == 201
    quiz_res = res.get_json()
    predictions = quiz_res.get("predictions", [])
    print(f"4. Quiz Submit & Prediction: Received {len(predictions)} Unique Predictions:")
    for idx, p in enumerate(predictions, 1):
        print(f"   [{idx}] {p['career']} | Score: {p['score']}% | Skills: {', '.join(p['key_skills'])}")
    assert len(predictions) == 5

    # 5. Select 1 Career Path
    selected_career = predictions[0]["career"]
    res = client.post('/api/career/select', json={"selected_career": selected_career}, headers=headers)
    assert res.status_code == 200
    print(f"5. Select Career: Chosen career '{selected_career}' saved successfully.")

    # 6. Start Chat Session
    res = client.post('/api/chat/start', headers=headers)
    assert res.status_code == 200
    chat_start_data = res.get_json()
    txt_file_path = chat_start_data['txt_file_reference']
    print(f"6. Start Chat: Initialized chat session. .txt reference: {txt_file_path}")

    # 7. Send Chat Message (Gemini API integration)
    res = client.post('/api/chat/message', json={"message": "Can you give me a 3-month study roadmap for this career?"}, headers=headers)
    assert res.status_code == 200
    ai_resp = res.get_json()['response']
    print(f"7. Send Message: AI response received:\n{ai_resp[:160]}...")

    # 8. Close Chat Session & Save Transcript to .txt File and update DB
    res = client.post('/api/chat/close', headers=headers)
    assert res.status_code == 200
    print(f"8. Close Chat: {res.get_json()['message']}")
    assert os.path.exists(txt_file_path)
    print(f"   -> Verified conversation .txt file saved at: {txt_file_path}")

    # 9. Log back in / Re-open chat session and verify loaded context from .txt file
    res = client.post('/api/chat/start', headers=headers)
    assert res.status_code == 200
    loaded_transcript = res.get_json().get('past_transcript', '')
    print(f"9. Re-open Chat: Successfully loaded context from .txt file ({len(loaded_transcript)} chars)")
    assert len(loaded_transcript) > 0

    # 10. Educational Resources
    res = client.get('/api/resources')
    assert res.status_code == 200
    print(f"10. Educational Resources: Received {len(res.get_json()['resources'])} curated learning resources.")

    # 11. User Review / Feedback
    res = client.post('/api/reviews', json={"rating": 5, "comment": "Outstanding system! The predictions and chat assistant are top-tier."}, headers=headers)
    assert res.status_code == 201
    print(f"11. Review Submitted: {res.get_json()['message']}")

    print("\n==========================================================")
    print("   ALL PATHFINDER AI BACKEND TESTS PASSED SUCCESSFULLY!   ")
    print("==========================================================")

if __name__ == "__main__":
    run_tests()
