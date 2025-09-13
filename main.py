from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from tensorflow import keras
import joblib
import numpy as np
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from React
app.secret_key = "vansh"

# ---------------- MySQL connection settings ----------------
MYSQL_USER = "root"
MYSQL_PASSWORD = "qwerty"
MYSQL_HOST = "localhost"
MYSQL_DB = "sih"

# Ensure DB exists
conn = pymysql.connect(host=MYSQL_HOST, user=MYSQL_USER, password=MYSQL_PASSWORD, charset='utf8mb4')
with conn.cursor() as cursor:
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
conn.commit()
conn.close()

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ---------------- Patient Model ----------------
class Patient(db.Model):
    __tablename__ = "diabetes_patients"
    id = db.Column(db.Integer, primary_key=True)
    glucose = db.Column(db.Float)
    blood_pressure = db.Column(db.Float)
    skin_thickness = db.Column(db.Float)
    insulin = db.Column(db.Float)
    bmi = db.Column(db.Float)
    age = db.Column(db.Float)
    outcome = db.Column(db.Integer)
    probability = db.Column(db.Float)


with app.app_context():
    db.create_all()


# ---------------- Load ML Model & Scaler ----------------
model = keras.models.load_model("diabetes_model.keras")
scaler = joblib.load("scaler.save")


# ---------------- API Routes ----------------

# 1. Predict & Add new patient
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    glucose = float(data["Glucose"])
    blood = float(data["BloodPressure"])
    skin = float(data["SkinThickness"])
    insulin = float(data["Insulin"])
    bmi = float(data["BMI"])
    age = float(data["Age"])

    # Prepare features
    features = np.array([[glucose, blood, skin, insulin, bmi, age]])
    features_scaled = scaler.transform(features)

    # Predict
    prediction_prob = float(model.predict(features_scaled)[0][0] * 100)
    prediction_class = 1 if prediction_prob > 50 else 0

    # Save patient
    new_patient = Patient(
        glucose=glucose,
        blood_pressure=blood,
        skin_thickness=skin,
        insulin=insulin,
        bmi=bmi,
        age=age,
        outcome=prediction_class,
        probability=prediction_prob
    )
    db.session.add(new_patient)
    db.session.commit()

    return jsonify({
        "id": new_patient.id,
        "probability": prediction_prob,
        "outcome": prediction_class
    })


# 2. Get all patients
@app.route("/patients", methods=["GET"])
def get_patients():
    patients = Patient.query.all()
    data = [
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
    ]
    return jsonify(data)


# 3. Delete a patient
@app.route("/patients/<int:id>", methods=["DELETE"])
def delete_patient(id):
    patient = Patient.query.get_or_404(id)
    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient deleted"})


# 4. Update a patient
@app.route("/patients/<int:id>", methods=["PUT"])
def update_patient(id):
    data = request.json
    patient = Patient.query.get_or_404(id)

    patient.glucose = float(data["Glucose"])
    patient.blood_pressure = float(data["BloodPressure"])
    patient.skin_thickness = float(data["SkinThickness"])
    patient.insulin = float(data["Insulin"])
    patient.bmi = float(data["BMI"])
    patient.age = float(data["Age"])

    db.session.commit()
    return jsonify({"message": "Patient updated"})


# ---------------- Run Server ----------------
if __name__ == "__main__":
    app.run(debug=True)
