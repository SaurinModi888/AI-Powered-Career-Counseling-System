import json
from flask import Blueprint, request, jsonify
from database import db
from models import QuizSubmission, CareerPrediction, UserProfile
from utils.ml_predictor import predict_top5_careers
from routes.auth import data_from_token

quiz_bp = Blueprint('quiz', __name__, url_prefix='/api/quiz')

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "What is your highest completed or current level of education?",
        "options": ["High School", "Intermediate", "Bachelor's", "Master's", "Ph.D."],
        "field": "Education Level"
    },
    {
        "id": 2,
        "question": "What is your academic field of specialization or major interest?",
        "options": ["Computer Science", "Finance", "Mechanical Engineering", "Psychology", "Business Administration", "Electrical Engineering", "General Studies"],
        "field": "Specialization"
    },
    {
        "id": 3,
        "question": "What primary programming, analytical, or technical skills do you possess?",
        "options": ["Python, Data Analysis", "Java, C++, Data Structures", "Financial Modeling, Excel", "Figma, UI/UX Prototyping", "AWS, Linux, Networking", "Communication, Operations"],
        "field": "Skills"
    },
    {
        "id": 4,
        "question": "What certifications or external credentials have you earned or are pursuing?",
        "options": ["AWS Certified", "CompTIA Security+", "Google UX Design", "Certified Financial Analyst (CFA)", "None"],
        "field": "Certifications"
    },
    {
        "id": 5,
        "question": "What is your overall CGPA or Percentage in your recent academic program?",
        "options": ["90% or above / 9.0+ CGPA", "80-89% / 8.0-8.9 CGPA", "70-79% / 7.0-7.9 CGPA", "60-69% / 6.0-6.9 CGPA", "Below 60%"],
        "field": "CGPA/Percentage"
    },
    {
        "id": 6,
        "question": "Which work environment appeals most to you?",
        "options": ["Fast-paced tech startup", "Corporate office or financial institution", "Creative studio or agency", "Research lab or academic institution", "Remote / Freelance"]
    },
    {
        "id": 7,
        "question": "How do you prefer solving complex challenges?",
        "options": ["Writing efficient code and algorithms", "Analyzing mathematical datasets and trends", "Designing user interfaces and visual aesthetics", "Managing teams and strategic product vision", "Helping and advising people directly"]
    },
    {
        "id": 8,
        "question": "What area of technology or business excites you most?",
        "options": ["Artificial Intelligence & Machine Learning", "Cybersecurity & Information Security", "Cloud Computing & Systems Architecture", "Financial Markets & Investment Management", "User Research & Interaction Design"]
    },
    {
        "id": 9,
        "question": "What is your comfort level with mathematics and statistics?",
        "options": ["Advanced", "Intermediate", "Basic", "Not preferred"]
    },
    {
        "id": 10,
        "question": "How do you rate your communication and presentation skills?",
        "options": ["Excellent", "Good", "Average", "Need Improvement"]
    },
    {
        "id": 11,
        "question": "Do you enjoy working directly with customers or clients?",
        "options": ["Yes, frequently", "Occasionally", "Prefer working behind the scenes"]
    },
    {
        "id": 12,
        "question": "Which tool or software do you use most comfortably?",
        "options": ["VS Code / PyCharm / IDEs", "Excel / Tableau / Power BI", "Figma / Adobe XD", "Terminal / Bash / Docker", "MS Word / PowerPoint"]
    },
    {
        "id": 13,
        "question": "What drives you most in your professional career?",
        "options": ["Technical innovation and problem solving", "Financial growth and market impact", "Creative expression and user satisfaction", "Security and stability", "Making a direct positive societal impact"]
    },
    {
        "id": 14,
        "question": "How do you handle working on long-term project goals?",
        "options": ["Break down into sprints & agile tasks", "Detailed step-by-step roadmap", "Iterative design and testing", "Collaborative team delegation"]
    },
    {
        "id": 15,
        "question": "Are you interested in continuous learning and learning new tools constantly?",
        "options": ["Extremely interested", "Moderately interested", "Prefer established routines"]
    },
    {
        "id": 16,
        "question": "What is your ideal career growth trajectory in 3 to 5 years?",
        "options": ["Senior Technical Specialist / Architect", "Engineering Lead / Manager", "Principal Researcher / Consultant", "Entrepreneur / Business Leader"]
    }
]

@quiz_bp.route('/questions', methods=['GET'])
def get_quiz_questions():
    return jsonify({
        "total_questions": len(QUIZ_QUESTIONS),
        "questions": QUIZ_QUESTIONS
    }), 200


@quiz_bp.route('/submit', methods=['POST'])
def submit_quiz():
    token = request.headers.get('Authorization', '')
    data = request.get_json(silent=True) or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    answers = data.get('answers', {})
    
    # Save Quiz Submission
    submission = QuizSubmission(
        user_id=user_id,
        answers_json=json.dumps(answers)
    )
    db.session.add(submission)

    # Map quiz answers to model features
    education_level = answers.get("Education Level") or answers.get("1") or "Bachelor's"
    specialization = answers.get("Specialization") or answers.get("2") or "Computer Science"
    skills = answers.get("Skills") or answers.get("3") or "Python, Data Analysis"
    certifications = answers.get("Certifications") or answers.get("4") or "None"
    
    cgpa_raw = answers.get("CGPA/Percentage") or answers.get("5") or "80-89% / 8.0-8.9 CGPA"
    cgpa_val = 85.0
    if isinstance(cgpa_raw, (int, float)):
        cgpa_val = float(cgpa_raw)
    elif "90%" in str(cgpa_raw) or "9.0" in str(cgpa_raw):
        cgpa_val = 92.0
    elif "80" in str(cgpa_raw):
        cgpa_val = 85.0
    elif "70" in str(cgpa_raw):
        cgpa_val = 75.0
    elif "60" in str(cgpa_raw):
        cgpa_val = 65.0

    # Update user profile with quiz answers
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)
    
    profile.education_level = education_level
    profile.specialization = specialization
    profile.skills = skills
    profile.certifications = certifications
    profile.cgpa_percentage = cgpa_val

    db.session.commit()

    # Model input dict
    model_inputs = {
        "Education Level": education_level,
        "Specialization": specialization,
        "Skills": skills,
        "Certifications": certifications,
        "CGPA/Percentage": cgpa_val
    }

    # Get 5 unique career predictions
    top5_predictions = predict_top5_careers(model_inputs)

    # Store prediction record in DB
    prediction_record = CareerPrediction(
        user_id=user_id,
        predictions_json=json.dumps(top5_predictions)
    )
    db.session.add(prediction_record)
    db.session.commit()

    return jsonify({
        "message": "Quiz submitted and 5 predictions generated successfully!",
        "submission_id": submission.id,
        "prediction_id": prediction_record.id,
        "predictions": top5_predictions
    }), 201
