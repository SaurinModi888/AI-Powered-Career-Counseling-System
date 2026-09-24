import json
from flask import Blueprint, request, jsonify
from database import db
from models import CareerPrediction, ChatSession
from routes.auth import data_from_token
from utils.gemini_helper import get_chat_file_path

career_bp = Blueprint('career', __name__, url_prefix='/api/career')

@career_bp.route('/predictions', methods=['GET'])
def get_predictions():
    token = request.headers.get('Authorization', '')
    user_id = data_from_token(token) or request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    prediction_record = CareerPrediction.query.filter_by(user_id=user_id).order_by(CareerPrediction.created_at.desc()).first()
    if not prediction_record:
        return jsonify({"error": "No career predictions found for this user. Please take the quiz first."}), 404

    return jsonify({"prediction": prediction_record.to_dict()}), 200


@career_bp.route('/select', methods=['POST'])
def select_career():
    token = request.headers.get('Authorization', '')
    data = request.get_json(silent=True) or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    selected_career = data.get('selected_career', '').strip()

    if not user_id or not selected_career:
        return jsonify({"error": "User ID and selected_career are required."}), 400

    prediction_record = CareerPrediction.query.filter_by(user_id=user_id).order_by(CareerPrediction.created_at.desc()).first()
    if prediction_record:
        prediction_record.selected_career = selected_career
        db.session.commit()

    # Generate txt file path for chat reference
    txt_path = get_chat_file_path(user_id, selected_career)

    # Check for existing chat session or create a new one
    chat_session = ChatSession.query.filter_by(user_id=user_id, selected_career=selected_career).first()
    if not chat_session:
        chat_session = ChatSession(
            user_id=user_id,
            selected_career=selected_career,
            txt_file_path=txt_path,
            is_active=True
        )
        db.session.add(chat_session)
    else:
        chat_session.is_active = True
        chat_session.txt_file_path = txt_path

    db.session.commit()

    return jsonify({
        "message": f"Career path '{selected_career}' selected successfully!",
        "selected_career": selected_career,
        "chat_session": chat_session.to_dict()
    }), 200
