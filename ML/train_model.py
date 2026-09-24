import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# 1. Load the dataset
print("Loading dataset...")
df = pd.read_excel('career_dataset_large.xlsx')

# 2. Preprocess
# Fill missing Certifications with 'None'
df['Certifications'] = df['Certifications'].fillna('None')
# Make sure all categoricals are strings
categorical_cols = ['Education Level', 'Specialization', 'Skills', 'Certifications']
for col in categorical_cols:
    df[col] = df[col].astype(str)

# Features and target
X = df[['Education Level', 'Specialization', 'Skills', 'Certifications', 'CGPA/Percentage']]
y = df['Recommended Career']

# 3. Create a preprocessing and training pipeline
print("Building pipeline...")
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
    ],
    remainder='passthrough' # Leave CGPA/Percentage as is
)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# 4. Train the model
print("Training model...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

# 5. Evaluate the model
accuracy = pipeline.score(X_test, y_test)
print(f"Model accuracy on test set: {accuracy:.2f}")

# 6. Export the model
print("Exporting model to career_model.pkl...")
joblib.dump(pipeline, 'career_model.pkl')
print("Done!")
