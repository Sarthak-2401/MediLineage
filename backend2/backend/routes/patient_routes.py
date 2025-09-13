from flask import Blueprint, request, jsonify
from database.db import db
from models.patient import Patient

patient_bp = Blueprint("patients", __name__)

# ✅ Get all patients
@patient_bp.route("", methods=["GET"])   # no trailing slash
def get_patients():
    patients = Patient.query.all()
    return jsonify([p.to_dict() for p in patients]), 200


# ✅ Add a new patient
@patient_bp.route("", methods=["POST"])   # no trailing slash
def add_patient():
    data = request.json
    if not data.get("name") or not data.get("age") or not data.get("gender"):
        return jsonify({"error": "Missing fields"}), 400

    patient = Patient(
        name=data["name"],
        age=data["age"],
        gender=data["gender"],
        condition=data.get("condition", "")
    )
    db.session.add(patient)
    db.session.commit()
    return jsonify({"message": "Patient added", "patient": patient.to_dict()}), 201


# ✅ Update a patient
@patient_bp.route("/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    data = request.json
    patient.name = data.get("name", patient.name)
    patient.age = data.get("age", patient.age)
    patient.gender = data.get("gender", patient.gender)
    patient.condition = data.get("condition", patient.condition)

    db.session.commit()
    return jsonify({"message": "Patient updated", "patient": patient.to_dict()}), 200


# ✅ Delete a patient
@patient_bp.route("/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient deleted"}), 200

