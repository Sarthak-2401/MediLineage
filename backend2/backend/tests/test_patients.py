# backend/tests/test_patients.py
import json
from app12 import create_app

def test_add_patient():
    app = create_app()
    client = app.test_client()

    response = client.post("/api/patients/", json={
        "name": "John Doe",
        "age": 45,
        "condition": "Diabetes"
    })

    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["patient"]["name"] == "John Doe"
