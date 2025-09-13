from app12 import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from tensorflow import keras
import joblib
import numpy as np

app = Flask(__name__)
app.secret_key = "vansh"

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:qwerty@localhost/sih"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Load model & scaler
model = keras.models.load_model("diabetes_model.keras")
scaler = joblib.load("scaler.save")

# Database table
class Patient(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    Glucose = db.Column(db.Float)
    BloodPressure = db.Column(db.Float)
    SkinThickness = db.Column(db.Float)
    Insulin = db.Column(db.Float)
    BMI = db.Column(db.Float)
    Age = db.Column(db.Float)
    Outcome = db.Column(db.Integer)

# Routes
@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        # Get user input
        glucose = float(request.form["Glucose"])
        blood = float(request.form["BloodPressure"])
        skin = float(request.form["SkinThickness"])
        insulin = float(request.form["Insulin"])
        bmi = float(request.form["BMI"])
        age = float(request.form["Age"])

      
       

        # Prepare features for prediction
        features = np.array([[glucose, blood, skin, insulin, bmi, age]])
        features_scaled = scaler.transform(features)
        prediction_prob = model.predict(features_scaled)[0][0]
        prediction_class = 1 if prediction_prob > 0.5 else 0

        # Save to database
        new_patient = Patient(
            Glucose=glucose,
            BloodPressure=blood,
            SkinThickness=skin,
            Insulin=insulin,
            BMI=bmi,
            Age=age,
            Outcome=prediction_class
        )
        db.session.add(new_patient)
        db.session.commit()

        return render_template("result.html", probability=prediction_prob, outcome=prediction_class)

    return render_template("form.html")

if __name__ == "__main__":
    app.run(debug=True)
