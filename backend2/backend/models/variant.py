from database.db import db

class Variant(db.Model):
    __tablename__ = "variants"

    id = db.Column(db.Integer, primary_key=True)
    gene = db.Column(db.String(120), nullable=False)
    mutation = db.Column(db.String(120), nullable=False)
    risk_level = db.Column(db.String(50), default="Unknown")

    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "gene": self.gene,
            "mutation": self.mutation,
            "risk_level": self.risk_level,
            "patient_id": self.patient_id,
        }
