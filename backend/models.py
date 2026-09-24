from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    profile = db.relationship('UserProfile', backref='user', uselist=False, cascade="all, delete-orphan")
    quiz_submissions = db.relationship('QuizSubmission', backref='user', cascade="all, delete-orphan")
    predictions = db.relationship('CareerPrediction', backref='user', cascade="all, delete-orphan")
    chat_sessions = db.relationship('ChatSession', backref='user', cascade="all, delete-orphan")
    saved_resources = db.relationship('SavedResource', backref='user', cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='user', cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Personal Details
    age = db.Column(db.Integer, nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    
    # Educational Details
    education_level = db.Column(db.String(100), nullable=True)
    specialization = db.Column(db.String(100), nullable=True)
    skills = db.Column(db.Text, nullable=True)
    certifications = db.Column(db.Text, nullable=True)
    cgpa_percentage = db.Column(db.Float, nullable=True)
    interests = db.Column(db.Text, nullable=True)
    
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "age": self.age,
            "phone": self.phone,
            "city": self.city,
            "education_level": self.education_level,
            "specialization": self.specialization,
            "skills": self.skills,
            "certifications": self.certifications,
            "cgpa_percentage": self.cgpa_percentage,
            "interests": self.interests,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class QuizSubmission(db.Model):
    __tablename__ = 'quiz_submissions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    answers_json = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "user_id": self.user_id,
            "answers": json.loads(self.answers_json) if self.answers_json else {},
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None
        }


class CareerPrediction(db.Model):
    __tablename__ = 'career_predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    predictions_json = db.Column(db.Text, nullable=False) # JSON array of top 5 predictions
    selected_career = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "user_id": self.user_id,
            "predictions": json.loads(self.predictions_json) if self.predictions_json else [],
            "selected_career": self.selected_career,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    selected_career = db.Column(db.String(150), nullable=False)
    txt_file_path = db.Column(db.String(500), nullable=False) # Reference to conversation transcript txt file
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "selected_career": self.selected_career,
            "txt_file_path": self.txt_file_path,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None
        }


class Resource(db.Model):
    __tablename__ = 'resources'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    career_tag = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(500), nullable=False)
    provider = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "career_tag": self.career_tag,
            "description": self.description,
            "url": self.url,
            "provider": self.provider
        }


class SavedResource(db.Model):
    __tablename__ = 'saved_resources'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    resource = db.relationship('Resource')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "resource": self.resource.to_dict() if self.resource else None,
            "saved_at": self.saved_at.isoformat() if self.saved_at else None
        }


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.full_name if self.user else "Anonymous",
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
