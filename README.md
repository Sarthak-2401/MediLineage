# 🩺 Diabetes & Asthma Prediction System

This project is a **full-stack web application** that uses **Machine Learning (TensorFlow/Keras + Scikit-learn)** and a **Flask backend** with a **React (Vite) frontend** to predict the likelihood of **Diabetes** or **Asthma** in patients based on their medical data.  
All predictions are stored in a **MySQL database** for further analysis.

---

## 🚀 Features
- 🔬 **ML Models**:  
  - Diabetes prediction (`diabetes_model.keras`)  
  - Asthma prediction (`asthama.py`)  
- 📊 **Preprocessing** with `StandardScaler`  
- 🖥 **Flask API** (`main.py`)  
  - `/predict` → Predict & save patient data  
  - `/patients` → Fetch all patients  
  - `/patients/<id>` → Update/Delete patient  
- 💾 **MySQL Database** integration using SQLAlchemy  
- 🌐 **Frontend** built with **React + Vite**  
- 🔄 **CORS enabled** → Smooth API integration  

---

## 🛠 Tech Stack
**Backend**
- Python 3.11
- Flask
- TensorFlow / Keras
- Scikit-learn
- SQLAlchemy + PyMySQL

**Frontend**
- React + Vite
- Axios (for API calls)
- TailwindCSS / ShadCN (if used)

**Database**
- MySQL

---

## 📂 Project Structure
