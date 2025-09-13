import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class RiskModel:
    def __init__(self):
        self.model = None

    def train(self):
        """
        For now: create synthetic training dataset.
        Features: [age, has_diabetes_history, has_brca1, has_tp53]
        Target: 1 = High Risk, 0 = Low Risk
        """
        data = []
        labels = []

        # Generate fake dataset
        for i in range(500):
            age = np.random.randint(20, 80)
            has_diabetes = np.random.choice([0, 1])
            brca1 = np.random.choice([0, 1])
            tp53 = np.random.choice([0, 1])

            # Risk logic for synthetic labels
            risk = 1 if (age > 50 or brca1 == 1 or has_diabetes == 1) else 0

            data.append([age, has_diabetes, brca1, tp53])
            labels.append(risk)

        df = pd.DataFrame(data, columns=["age", "has_diabetes", "brca1", "tp53"])
        X = df.values
        y = np.array(labels)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        self.model = LogisticRegression()
        self.model.fit(X_train, y_train)

        y_pred = self.model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"✅ ML Model trained, accuracy: {acc:.2f}")

    def predict(self, patient, variants):
        if not self.model:
            raise ValueError("Model not trained yet")

        age = patient.get("age", 30)
        has_diabetes = 1 if "diabetes" in patient.get("condition", "").lower() else 0
        brca1 = 1 if any(v.get("gene") == "BRCA1" for v in variants) else 0
        tp53 = 1 if any(v.get("gene") == "TP53" for v in variants) else 0

        features = np.array([[age, has_diabetes, brca1, tp53]])
        pred = self.model.predict(features)[0]
        prob = self.model.predict_proba(features)[0][1]

        return {
            "risk_score": round(prob * 100, 2),
            "category": "High" if pred == 1 else "Low",
            "explanation": {
                "age": age,
                "has_diabetes": has_diabetes,
                "brca1": brca1,
                "tp53": tp53
            }
        }


# Global instance
risk_model = RiskModel()
