from flask import Blueprint, request, jsonify
from services.ml_model import risk_model   # ✅ Import ML model

analysis_bp = Blueprint("analysis", __name__)

# Train ML model once when server starts
@analysis_bp.before_app_request
def train_model():
    risk_model.train()

# API to analyze patient risk using ML model
@analysis_bp.route("/predict", methods=["POST"])
def analyze_patient():
    """
    Expected JSON:
    {
        "patient": { "id": 1, "name": "John", "age": 55, "condition": "Diabetes" },
        "variants": [
            { "gene": "BRCA1", "risk_level": "High" },
            { "gene": "TP53", "risk_level": "Moderate" }
        ]
    }
    """
    data = request.json
    patient = data.get("patient")
    variants = data.get("variants", [])

    if not patient:
        return jsonify({"error": "Missing patient data"}), 400

    # Call ML model for prediction
    result = risk_model.predict(patient, variants)
    return jsonify({"prediction": result}), 200
