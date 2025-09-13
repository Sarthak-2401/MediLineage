from flask import Flask
from flask_cors import CORS
from database.db import db
from routes.auth_routes import auth_bp
from routes.patient_routes import patient_bp
from routes.variant_routes import variant_bp
from routes.analysis_routes import analysis_bp

def create_app():
    app = Flask(__name__)

    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///medilineage.db"  # for now, SQLite
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "supersecretkey"  # change in production

    # Init extensions
    db.init_app(app)
    CORS(app, supports_credentials=True)
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(patient_bp, url_prefix="/api/patients")
    app.register_blueprint(variant_bp, url_prefix="/api/variants")
    app.register_blueprint(analysis_bp, url_prefix="/api/analysis")

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "ok", "message": "MediLineage backend running!"}

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()  # creates tables if they don't exist
    app.run(debug=True, host="0.0.0.0", port=5000)
