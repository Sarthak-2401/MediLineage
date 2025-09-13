from flask import Blueprint, request, jsonify
from database.db import db
from models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not data.get("username") or not data.get("password") or not data.get("email"):
        return jsonify({"error": "Missing fields"}), 400
    
    user = User(username=data["username"], email=data["email"], role=data.get("role", "patient"))
    user.set_password(data["password"])
    
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get("username")).first()
    if user and user.check_password(data.get("password")):
        return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
    return jsonify({"error": "Invalid credentials"}), 401
