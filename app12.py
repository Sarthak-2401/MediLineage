from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from tensorflow import keras
from flask_cors import CORS
import joblib
import numpy as np
import pymysql
import os

# ------------------------
# FLASK APP SETUP
# ------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # Allow all origins for dev
app.secret_key = "vansh"

# ------------------------
# MYSQL SETTINGS
# ------------------------
MYSQL_USER = "root"
MYSQL_PASSWORD = "qwerty"
MYSQL_HOST = "localhost"
MYSQL_DB = "sih"

# Ensure database exists
conn = pymysql.connect(host=MYSQL_HOST, user=MYSQL_USER, password=MYSQL_PASSWORD, charset='utf8mb4')
with conn.cursor() as cursor:
    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS {MYSQL_DB} "
        f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    )
conn.commit()
conn.close()

# Configure SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ------------------------
# DATABASE MODEL
# ------------------------
class Patient(db.Model):
    __tablename__ = "diabetes_patients"
    id = db.Column(db.Integer, primary_key=True)
    glucose = db.Column(db.Float, nullable=False)
    blood_pressure = db.Column(db.Float, nullable=False)
    skin_thickness = db.Column(db.Float, nullable=False)
    insulin = db.Column(db.Float, nullable=False)
    bmi = db.Column(db.Float, nullable=False)
    age = db.Column(db.Float, nullable=False)
    outcome = db.Column(db.Integer, nullable=False)
    probability = db.Column(db.Float, nullable=False)

with app.app_context():
    db.create_all()

# ------------------------
# LOAD MODEL + SCALER
# ------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "diabetes_model.keras")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.save")


if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
    raise FileNotFoundError("⚠️ Model or scaler not found. Please train first.")

model = keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# ------------------------
# ROUTES
# ------------------------

# 1. Get all patients
@app.route("/patients", methods=["GET"])
def get_patients():
    patients = Patient.query.all()
    return jsonify([
        {
            "id": p.id,
            "glucose": p.glucose,
            "blood_pressure": p.blood_pressure,
            "skin_thickness": p.skin_thickness,
            "insulin": p.insulin,
            "bmi": p.bmi,
            "age": p.age,
            "outcome": p.outcome,
            "probability": p.probability
        }
        for p in patients
    ])

# 2. Add patient (manual or predictive)
@app.route("/patients", methods=["POST"])
def add_patient():
    try:
        data = request.json

        # Extract input values
        glucose = float(data.get("glucose", 0))
        blood_pressure = float(data.get("blood_pressure", 0))
        skin_thickness = float(data.get("skin_thickness", 0))
        insulin = float(data.get("insulin", 0))
        bmi = float(data.get("bmi", 0))
        age = float(data.get("age", 0))

        # If outcome/probability not provided, predict using ML model
        if "outcome" not in data or "probability" not in data:
            features = np.array([[glucose, blood_pressure, skin_thickness, insulin, bmi, age]])
            features_scaled = scaler.transform(features)
            prob = float(model.predict(features_scaled, verbose=0)[0][0] * 100)
            outcome = 1 if prob > 50 else 0
        else:
            outcome = int(data.get("outcome", 0))
            prob = float(data.get("probability", 0))

        # Save to DB
        new_patient = Patient(
            glucose=glucose,
            blood_pressure=blood_pressure,
            skin_thickness=skin_thickness,
            insulin=insulin,
            bmi=bmi,
            age=age,
            outcome=outcome,
            probability=prob
        )
        db.session.add(new_patient)
        db.session.commit()

        return jsonify({
            "id": new_patient.id,
            "outcome": outcome,
            "probability": prob,
            "message": "Patient added successfully"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 3. Predict diabetes (always ML)
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = np.array([[ 
            float(data.get("glucose", 0)),
            float(data.get("blood_pressure", 0)),
            float(data.get("skin_thickness", 0)),
            float(data.get("insulin", 0)),
            float(data.get("bmi", 0)),
            float(data.get("age", 0))
        ]])

        # Scale & predict
        features_scaled = scaler.transform(features)
        prob = float(model.predict(features_scaled, verbose=0)[0][0] * 100)
        outcome = 1 if prob > 50 else 0

        # Save to DB
        new_patient = Patient(
            glucose=features[0][0],
            blood_pressure=features[0][1],
            skin_thickness=features[0][2],
            insulin=features[0][3],
            bmi=features[0][4],
            age=features[0][5],
            outcome=outcome,
            probability=prob
        )
        db.session.add(new_patient)
        db.session.commit()

        return jsonify({
            "id": new_patient.id,
            "outcome": outcome,
            "probability": prob
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 4. Delete a patient
@app.route("/patients/<int:id>", methods=["DELETE"])
def delete_patient(id):
    patient = Patient.query.get_or_404(id)
    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})

# ------------------------
# MAIN
# ------------------------
if __name__ == "__main__":
    app.run(debug=True)
