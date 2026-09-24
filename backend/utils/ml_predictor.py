import os
import joblib
import pandas as pd

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ML', 'career_model.pkl'))

_model = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            print(f"[ML Model] Loading trained model from {MODEL_PATH}...")
            _model = joblib.load(MODEL_PATH)
        else:
            print(f"[ML Model Warning] Model file not found at {MODEL_PATH}")
    return _model

# Pre-defined career descriptions and advice for popular career recommendations
CAREER_DETAILS_MAP = {
    "Software Engineer": {
        "description": "Design, build, test, and maintain software applications and systems.",
        "key_skills": ["Data Structures", "Algorithms", "System Design", "Git", "Clean Code"],
        "recommended_courses": ["CS50 Computer Science", "Full Stack Web Development"]
    },
    "Data Scientist": {
        "description": "Analyze complex data to help organizations make data-driven decisions using machine learning and statistical modeling.",
        "key_skills": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas/NumPy"],
        "recommended_courses": ["Data Science Specialization", "Applied Machine Learning"]
    },
    "ML Engineer": {
        "description": "Build, deploy, and scale machine learning models into production systems.",
        "key_skills": ["Python", "PyTorch/TensorFlow", "MLOps", "Model Deployment", "Algorithms"],
        "recommended_courses": ["Deep Learning Specialization", "MLOps Fundamentals"]
    },
    "Financial Analyst": {
        "description": "Evaluate financial data, analyze market trends, and guide business investment decisions.",
        "key_skills": ["Financial Modeling", "Excel", "Valuation", "Accounting", "Corporate Finance"],
        "recommended_courses": ["Financial Analyst Course", "Corporate Finance Essentials"]
    },
    "Research Scientist": {
        "description": "Conduct basic and applied research to advance technical and scientific knowledge.",
        "key_skills": ["Experimental Design", "Data Analysis", "Academic Writing", "Statistics"],
        "recommended_courses": ["Research Methods", "Advanced Statistical Analysis"]
    },
    "Cybersecurity Analyst": {
        "description": "Protect an organization's computer networks, systems, and data from cyber threats and breaches.",
        "key_skills": ["Network Security", "Ethical Hacking", "SIEM", "Incident Response", "Cryptography"],
        "recommended_courses": ["CompTIA Security+", "Certified Ethical Hacker (CEH)"]
    },
    "Product Manager": {
        "description": "Lead cross-functional teams to build products that solve user problems and drive business goals.",
        "key_skills": ["Product Strategy", "User Research", "Agile/Scrum", "Wireframing", "Roadmapping"],
        "recommended_courses": ["Product Management Fundamentals", "Agile Leadership"]
    },
    "UI/UX Designer": {
        "description": "Craft intuitive, aesthetically pleasing visual interfaces and user experiences for applications.",
        "key_skills": ["Figma", "User Journey Mapping", "Prototyping", "Design Systems", "Usability Testing"],
        "recommended_courses": ["Google UX Design Professional Certificate", "Figma Masterclass"]
    },
    "Cloud Architect": {
        "description": "Oversee enterprise cloud computing strategies, architecture, cloud deployment, and infrastructure.",
        "key_skills": ["AWS/Azure/GCP", "Kubernetes/Docker", "Infrastructure as Code", "Networking"],
        "recommended_courses": ["AWS Solutions Architect", "Google Cloud Professional Architect"]
    },
    "DevOps Engineer": {
        "description": "Bridge development and operations by automating CI/CD pipelines and managing cloud infrastructure.",
        "key_skills": ["CI/CD Pipelines", "Docker", "Kubernetes", "Linux", "Terraform"],
        "recommended_courses": ["Docker & Kubernetes Developer", "DevOps Engineering Bootcamp"]
    },
    "Clerk": {
        "description": "Perform administrative, documentation, record-keeping, and operational support duties.",
        "key_skills": ["Office Administration", "MS Office", "Data Entry", "Communication"],
        "recommended_courses": ["Administrative Assistance", "Business Communication"]
    },
    "School Counselor": {
        "description": "Guide students academically, socially, and career-wise to achieve academic and personal growth.",
        "key_skills": ["Active Listening", "Counseling Psychology", "Career Guidance", "Empathy"],
        "recommended_courses": ["Counseling Foundations", "Educational Psychology"]
    }
}

def predict_top5_careers(input_data):
    """
    Takes user input dict and returns exactly 5 unique top career recommendations with confidence scores.
    """
    model = get_model()

    education_level = str(input_data.get("Education Level", "Bachelor's"))
    specialization = str(input_data.get("Specialization", "Computer Science"))
    skills = str(input_data.get("Skills", "General"))
    certifications = str(input_data.get("Certifications", "None") or "None")
    
    raw_cgpa = input_data.get("CGPA/Percentage", 75)
    try:
        cgpa = float(raw_cgpa)
    except (ValueError, TypeError):
        cgpa = 75.0

    input_df = pd.DataFrame([{
        "Education Level": education_level,
        "Specialization": specialization,
        "Skills": skills,
        "Certifications": certifications,
        "CGPA/Percentage": cgpa
    }])

    predictions = []

    if model is not None:
        try:
            probabilities = model.predict_proba(input_df)[0]
            classes = model.classes_
            
            # Sort indices descending by probability
            sorted_indices = probabilities.argsort()[::-1]

            for idx in sorted_indices:
                career_name = str(classes[idx])
                prob_val = float(probabilities[idx])
                
                details = CAREER_DETAILS_MAP.get(career_name, {
                    "description": f"A specialized career path in {career_name}.",
                    "key_skills": [skills.split(',')[0] if ',' in skills else skills, "Problem Solving"],
                    "recommended_courses": [f"Intro to {career_name}"]
                })

                predictions.append({
                    "career": career_name,
                    "score": round(max(prob_val * 100, 5.0), 1),
                    "description": details["description"],
                    "key_skills": details["key_skills"],
                    "recommended_courses": details["recommended_courses"]
                })

                if len(predictions) >= 5:
                    break

        except Exception as e:
            print(f"[ML Prediction Error] {e}")

    # Fallback to default 5 predictions if model prediction is less than 5
    if len(predictions) < 5:
        fallback_list = [
            ("Software Engineer", 88.5),
            ("Data Scientist", 82.0),
            ("ML Engineer", 75.4),
            ("Cloud Architect", 68.0),
            ("Cybersecurity Analyst", 61.2)
        ]
        existing_names = {p["career"] for p in predictions}
        for name, score in fallback_list:
            if name not in existing_names:
                details = CAREER_DETAILS_MAP.get(name, {
                    "description": f"A specialized career path in {name}.",
                    "key_skills": ["Problem Solving", "Domain Knowledge"],
                    "recommended_courses": [f"Intro to {name}"]
                })
                predictions.append({
                    "career": name,
                    "score": score,
                    "description": details["description"],
                    "key_skills": details["key_skills"],
                    "recommended_courses": details["recommended_courses"]
                })
            if len(predictions) >= 5:
                break

    return predictions[:5]
