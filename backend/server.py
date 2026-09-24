import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database import ensure_database_exists, db
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.quiz import quiz_bp
from routes.career import career_bp
from routes.chat import chat_bp
from routes.resources import resources_bp
from routes.reviews import reviews_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend integration
CORS(app)

# Ensure MySQL database exists (creates 'pathfinder_db' if not exist) and initialize SQLAlchemy
ensure_database_exists(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(career_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(resources_bp)
app.register_blueprint(reviews_bp)

@app.route("/", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "system": "PathFinder AI Career Counseling Backend",
        "version": "1.0.0",
        "database": app.config.get("SQLALCHEMY_DATABASE_URI", "").split("://")[0]
    }), 200

# --- Machine Learning Model ---
# The trained Random Forest model (ML/career_model.pkl) is integrated in utils/ml_predictor.py.
# Inputs:
#   - "Education Level": str (e.g., "Bachelor's", "Master's", "Intermediate")
#   - "Specialization": str (e.g., "Finance", "Computer Science")
#   - "Skills": str (e.g., "Python, Data Analysis")
#   - "Certifications": str (e.g., "AWS Certified", "None")
#   - "CGPA/Percentage": float (e.g., 85.0)
# Returns: Top 5 unique predictions with confidence scores & details.
# ------------------------------

if __name__ == "__main__":
    print("[Server] Starting PathFinder AI Backend Server...")
    app.run(host="0.0.0.0", port=5000, debug=True)