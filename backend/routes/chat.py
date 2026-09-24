import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from models import ChatSession, CareerPrediction
from routes.auth import data_from_token
from utils.gemini_helper import (
    get_chat_file_path,
    read_chat_transcript,
    update_chat_transcript_file,
    generate_career_guidance_response
)

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

# In-memory session message cache (flushed & saved to txt file when chat closes or on update)
_active_chat_buffers = {}

@chat_bp.route('/start', methods=['POST'])
def start_chat():
    """
    Called when user starts chat or logs back in to chat again.
    Loads past conversation context from the .txt file referenced in the MySQL database.
    """
    token = request.headers.get('Authorization', '')
    data = request.get_json(silent=True) or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    # Find selected career path
    pred = CareerPrediction.query.filter_by(user_id=user_id).order_by(CareerPrediction.created_at.desc()).first()
    selected_career = pred.selected_career if (pred and pred.selected_career) else "Software Engineer"

    # Find or create ChatSession in database
    chat_session = ChatSession.query.filter_by(user_id=user_id, selected_career=selected_career).first()
    txt_path = get_chat_file_path(user_id, selected_career)

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
        chat_session.last_updated = datetime.utcnow()

    db.session.commit()

    # Read past transcript context from the database-referenced .txt file
    past_transcript = read_chat_transcript(txt_path)
    
    # Initialize message buffer
    session_key = f"user_{user_id}_career_{selected_career}"
    _active_chat_buffers[session_key] = []

    return jsonify({
        "message": "Chat session started.",
        "chat_session": chat_session.to_dict(),
        "selected_career": selected_career,
        "past_transcript": past_transcript,
        "txt_file_reference": txt_path
    }), 200


@chat_bp.route('/message', methods=['POST'])
def send_message():
    """
    Sends a message to the Gemini API using the loaded .txt file context.
    """
    token = request.headers.get('Authorization', '')
    data = request.get_json(silent=True) or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    user_message = data.get('message', '').strip()

    if not user_id or not user_message:
        return jsonify({"error": "User ID and message content are required."}), 400

    # Get user's selected career
    pred = CareerPrediction.query.filter_by(user_id=user_id).order_by(CareerPrediction.created_at.desc()).first()
    selected_career = pred.selected_career if (pred and pred.selected_career) else "Software Engineer"

    # Get ChatSession from DB
    chat_session = ChatSession.query.filter_by(user_id=user_id, selected_career=selected_career).first()
    txt_path = chat_session.txt_file_path if chat_session else get_chat_file_path(user_id, selected_career)

    # Read past context from .txt file
    transcript_context = read_chat_transcript(txt_path)

    # Call Gemini API
    ai_response = generate_career_guidance_response(
        user_message=user_message,
        selected_career=selected_career,
        transcript_context=transcript_context
    )

    now_str = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    
    session_key = f"user_{user_id}_career_{selected_career}"
    if session_key not in _active_chat_buffers:
        _active_chat_buffers[session_key] = []

    _active_chat_buffers[session_key].append({"role": "user", "content": user_message, "timestamp": now_str})
    _active_chat_buffers[session_key].append({"role": "assistant", "content": ai_response, "timestamp": now_str})

    return jsonify({
        "response": ai_response,
        "selected_career": selected_career,
        "timestamp": now_str
    }), 200


@chat_bp.route('/close', methods=['POST'])
def close_chat():
    """
    Called when the user closes the chat.
    Saves and updates the .txt conversation transcript file,
    and updates the database reference and timestamp.
    """
    token = request.headers.get('Authorization', '')
    data = request.get_json(silent=True) or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    pred = CareerPrediction.query.filter_by(user_id=user_id).order_by(CareerPrediction.created_at.desc()).first()
    selected_career = pred.selected_career if (pred and pred.selected_career) else "Software Engineer"

    chat_session = ChatSession.query.filter_by(user_id=user_id, selected_career=selected_career).first()
    if not chat_session:
        txt_path = get_chat_file_path(user_id, selected_career)
        chat_session = ChatSession(
            user_id=user_id,
            selected_career=selected_career,
            txt_file_path=txt_path,
            is_active=False
        )
        db.session.add(chat_session)
    else:
        txt_path = chat_session.txt_file_path

    session_key = f"user_{user_id}_career_{selected_career}"
    current_buffer = _active_chat_buffers.get(session_key, [])

    # If payload includes full messages array, use it
    payload_messages = data.get('messages')
    if payload_messages and isinstance(payload_messages, list):
        current_buffer = payload_messages

    if current_buffer:
        # Update the .txt file with the transcript
        update_chat_transcript_file(txt_path, current_buffer)
        _active_chat_buffers.pop(session_key, None)

    chat_session.is_active = False
    chat_session.last_updated = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "message": "Chat closed successfully. Conversation saved to .txt file and DB reference updated.",
        "chat_session": chat_session.to_dict(),
        "txt_file_path": txt_path
    }), 200


@chat_bp.route('/history', methods=['GET'])
def get_chat_history():
    token = request.headers.get('Authorization', '')
    user_id = data_from_token(token) or request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({"error": "Unauthorized or missing user_id."}), 401

    pred = CareerPrediction.query.filter_by(user_id=user_id).order_by(CareerPrediction.created_at.desc()).first()
    selected_career = pred.selected_career if (pred and pred.selected_career) else "Software Engineer"

    chat_session = ChatSession.query.filter_by(user_id=user_id, selected_career=selected_career).first()
    txt_path = chat_session.txt_file_path if chat_session else get_chat_file_path(user_id, selected_career)

    transcript = read_chat_transcript(txt_path)

    return jsonify({
        "selected_career": selected_career,
        "txt_file_path": txt_path,
        "transcript": transcript
    }), 200
