from flask import Blueprint, request, jsonify
from database import db
from models import User, UserProfile

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    full_name = data.get('full_name', '').strip()

    if not email or not password or not full_name:
        return jsonify({"error": "Email, password, and full name are required."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "An account with this email already exists."}), 400

    new_user = User(email=email, full_name=full_name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    # Create associated empty profile
    profile = UserProfile(user_id=new_user.id)
    db.session.add(profile)
    db.session.commit()

    token = f"user_token_{new_user.id}"

    return jsonify({
        "message": "User registered successfully!",
        "token": token,
        "user": new_user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    token = f"user_token_{user.id}"

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    token = request.headers.get('Authorization', '')
    user_id = data_from_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized or invalid token."}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    profile = UserProfile.query.filter_by(user_id=user.id).first()

    return jsonify({
        "user": user.to_dict(),
        "profile": profile.to_dict() if profile else None
    }), 200


def data_from_token(token):
    if not token:
        return None
    token = token.replace('Bearer ', '').strip()
    if token.startswith('user_token_'):
        try:
            return int(token.split('user_token_')[1])
        except ValueError:
            return None
    return None
