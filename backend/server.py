from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({
        "message": "Hello from Flask"
    })

# --- Machine Learning Model ---
# To use the trained Random Forest model (ML/career_model.pkl), you will need to:
# 1. Load the model using joblib:
#    import joblib
#    model = joblib.load('../ML/career_model.pkl')
# 2. Receive the following required inputs from the user (e.g., via a POST request JSON):
#    - "Education Level": str (e.g., "Bachelor's", "Master's", "Intermediate")
#    - "Specialization": str (e.g., "Finance", "Computer Science")
#    - "Skills": str (e.g., "Python, Data Analysis")
#    - "Certifications": str (e.g., "AWS Certified", or "None" if empty)
#    - "CGPA/Percentage": int or float (e.g., 75, 8.5)
# 3. Create a pandas DataFrame with exactly these columns:
#    import pandas as pd
#    input_df = pd.DataFrame([{
#        "Education Level": request.json.get("Education Level"),
#        "Specialization": request.json.get("Specialization"),
#        "Skills": request.json.get("Skills"),
#        "Certifications": request.json.get("Certifications", "None"),
#        "CGPA/Percentage": request.json.get("CGPA/Percentage")
#    }])
# 4. Predict the career path:
#    prediction = model.predict(input_df)[0]
# ------------------------------


if __name__ == "__main__":
    app.run(debug=True)