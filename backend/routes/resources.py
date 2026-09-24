from flask import Blueprint, request, jsonify
from database import db
from models import Resource, SavedResource
from routes.auth import data_from_token

resources_bp = Blueprint('resources', __name__, url_prefix='/api/resources')

SAMPLE_RESOURCES = [
    {
        "title": "CS50's Introduction to Computer Science",
        "category": "Courses",
        "career_tag": "Software Engineer",
        "description": "An introduction to the intellectual enterprises of computer science and the art of programming from Harvard.",
        "url": "https://www.coursera.org/learn/cs50",
        "provider": "Coursera / Harvard"
    },
    {
        "title": "Machine Learning Specialization by Andrew Ng",
        "category": "Courses",
        "career_tag": "ML Engineer",
        "description": "Master fundamental AI concepts and practical machine learning skills.",
        "url": "https://www.coursera.org/specializations/machine-learning-introduction",
        "provider": "Coursera / DeepLearning.AI"
    },
    {
        "title": "Data Science Professional Certificate",
        "category": "Courses",
        "career_tag": "Data Scientist",
        "description": "Build job-ready skills for an entry-level data scientist role.",
        "url": "https://www.coursera.org/professional-certificates/ibm-data-science",
        "provider": "IBM / Coursera"
    },
    {
        "title": "Financial Markets & Analysis",
        "category": "Courses",
        "career_tag": "Financial Analyst",
        "description": "An overview of the ideas, methods, and institutions that permit human society to manage risks and foster enterprise.",
        "url": "https://www.coursera.org/learn/financial-markets-global",
        "provider": "Yale / Coursera"
    },
    {
        "title": "Google UX Design Professional Certificate",
        "category": "Courses",
        "career_tag": "UI/UX Designer",
        "description": "Learn UX foundations, conduct user research, and create wireframes and prototypes in Figma.",
        "url": "https://www.coursera.org/professional-certificates/google-ux-design",
        "provider": "Google / Coursera"
    }
]

def seed_resources_if_empty():
    if Resource.query.count() == 0:
        for res in SAMPLE_RESOURCES:
            r = Resource(**res)
            db.session.add(r)
        db.session.commit()

@resources_bp.route('', methods=['GET'])
def get_resources():
    seed_resources_if_empty()
    category = request.args.get('category')
    career_tag = request.args.get('career')

    query = Resource.query
    if category:
        query = query.filter_by(category=category)
    if career_tag:
        query = query.filter_by(career_tag=career_tag)

    resources = query.all()
    return jsonify({"resources": [r.to_dict() for r in resources]}), 200


@resources_bp.route('/save', methods=['POST'])
def save_resource():
    token = request.headers.get('Authorization', '')
    data = request.get_json() or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    resource_id = data.get('resource_id')

    if not user_id or not resource_id:
        return jsonify({"error": "user_id and resource_id are required."}), 400

    existing = SavedResource.query.filter_by(user_id=user_id, resource_id=resource_id).first()
    if existing:
        return jsonify({"message": "Resource is already saved.", "saved_resource": existing.to_dict()}), 200

    saved = SavedResource(user_id=user_id, resource_id=resource_id)
    db.session.add(saved)
    db.session.commit()

    return jsonify({"message": "Resource saved successfully!", "saved_resource": saved.to_dict()}), 201


@resources_bp.route('/saved', methods=['GET'])
def get_saved_resources():
    token = request.headers.get('Authorization', '')
    user_id = data_from_token(token) or request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    saved = SavedResource.query.filter_by(user_id=user_id).all()
    return jsonify({"saved_resources": [s.to_dict() for s in saved]}), 200
