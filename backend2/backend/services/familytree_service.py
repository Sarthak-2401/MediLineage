# backend/services/familytree_service.py
from models.patient import Patient
from database.db import db

def add_relationship(parent_id, child_id):
    """Link parent and child in DB"""
    parent = Patient.query.get(parent_id)
    child = Patient.query.get(child_id)
    
    if not parent or not child:
        return {"error": "Invalid patient IDs"}
    
    child.parent_id = parent.id
    db.session.commit()
    return {"message": f"{parent.name} linked as parent of {child.name}"}


def get_family_tree(patient_id):
    """Build family tree starting from patient"""
    patient = Patient.query.get(patient_id)
    if not patient:
        return {"error": "Patient not found"}

    def build_tree(p):
        children = Patient.query.filter_by(parent_id=p.id).all()
        return {
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "condition": p.condition,
            "children": [build_tree(c) for c in children]
        }

    return build_tree(patient)
