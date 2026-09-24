from flask import Blueprint, request, jsonify
from database import db
from models import Review
from routes.auth import data_from_token

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

@reviews_bp.route('', methods=['GET'])
def get_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify({"reviews": [r.to_dict() for r in reviews]}), 200


@reviews_bp.route('', methods=['POST'])
def submit_review():
    token = request.headers.get('Authorization', '')
    data = request.get_json() or {}
    
    user_id = data_from_token(token) or data.get('user_id')
    rating = data.get('rating')
    comment = data.get('comment', '').strip()

    if not user_id or not rating or not comment:
        return jsonify({"error": "User ID, rating (1-5), and comment are required."}), 400

    try:
        rating = int(rating)
        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be between 1 and 5."}), 400
    except ValueError:
        return jsonify({"error": "Rating must be an integer."}), 400

    review = Review(
        user_id=user_id,
        rating=rating,
        comment=comment
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "message": "Thank you for your feedback!",
        "review": review.to_dict()
    }), 201
