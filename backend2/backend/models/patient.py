from database.db import db

class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    condition = db.Column(db.String(250))

    # Relationship with Variant (automatic backref created)
    variants = db.relationship("Variant", backref="patient", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "condition": self.condition,
            "variants": [v.to_dict() for v in self.variants] if self.variants else []
        }
