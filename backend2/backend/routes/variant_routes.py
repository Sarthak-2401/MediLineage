from flask import Blueprint, request, jsonify
from database.db import db
from models.variant import Variant
from models.patient import Patient

variant_bp = Blueprint("variants", __name__)

# ✅ Get all variants (with patient info)
@variant_bp.route("/", methods=["GET"])
def get_variants():
    variants = Variant.query.all()
    return jsonify([v.to_dict() for v in variants]), 200


# ✅ Get variants for a specific patient
@variant_bp.route("/patient/<int:patient_id>", methods=["GET"])
def get_patient_variants(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    return jsonify([v.to_dict() for v in patient.variants]), 200


# ✅ Add new variant
@variant_bp.route("/", methods=["POST"])
def add_variant():
    data = request.json
    if not data.get("patient_id") or not data.get("gene") or not data.get("variant_type"):
        return jsonify({"error": "Missing required fields"}), 400

    patient = Patient.query.get(data["patient_id"])
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    variant = Variant(
        patient_id=data["patient_id"],
        gene=data["gene"],
        variant_type=data["variant_type"],
        risk_level=data.get("risk_level", "Unknown"),
        notes=data.get("notes", "")
    )
    db.session.add(variant)
    db.session.commit()
    return jsonify({"message": "Variant added", "variant": variant.to_dict()}), 201


# ✅ Update a variant
@variant_bp.route("/<int:variant_id>", methods=["PUT"])
def update_variant(variant_id):
    variant = Variant.query.get(variant_id)
    if not variant:
        return jsonify({"error": "Variant not found"}), 404

    data = request.json
    variant.gene = data.get("gene", variant.gene)
    variant.variant_type = data.get("variant_type", variant.variant_type)
    variant.risk_level = data.get("risk_level", variant.risk_level)
    variant.notes = data.get("notes", variant.notes)

    db.session.commit()
    return jsonify({"message": "Variant updated", "variant": variant.to_dict()}), 200


# ✅ Delete a variant
@variant_bp.route("/<int:variant_id>", methods=["DELETE"])
def delete_variant(variant_id):
    variant = Variant.query.get(variant_id)
    if not variant:
        return jsonify({"error": "Variant not found"}), 404

    db.session.delete(variant)
    db.session.commit()
    return jsonify({"message": "Variant deleted"}), 200
