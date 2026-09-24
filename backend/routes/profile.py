from flask import Blueprint, request, jsonify
from database import db
from models import User, UserProfile
from routes.auth import data_from_token

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.route('', methods=['GET'])
def get_profile():
    token = request.headers.get('Authorization', '')
    user_id = data_from_token(token) or request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)
        db.session.commit()

    return jsonify({"profile": profile.to_dict()}), 200


@profile_bp.route('', methods=['PUT', 'POST'])
def update_profile():
    token = request.headers.get('Authorization', '')
    data = request.get_json(silent=True) or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)

    if 'age' in data:
        profile.age = data.get('age')
    if 'phone' in data:
        profile.phone = data.get('phone')
    if 'city' in data:
        profile.city = data.get('city')
    if 'education_level' in data:
        profile.education_level = data.get('education_level')
    if 'specialization' in data:
        profile.specialization = data.get('specialization')
    if 'skills' in data:
        profile.skills = data.get('skills')
    if 'certifications' in data:
        profile.certifications = data.get('certifications')
    if 'cgpa_percentage' in data:
        profile.cgpa_percentage = data.get('cgpa_percentage')
    if 'interests' in data:
        profile.interests = data.get('interests')

    db.session.commit()
    return jsonify({
        "message": "Profile updated successfully!",
        "profile": profile.to_dict()
    }), 200
