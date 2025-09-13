// src/pages/PatientDashboard.jsx
import { useState } from "react";
import { useAppSelector } from "../store/hooks";

export default function PatientDashboard() {
  const { items: patients } = useAppSelector((state) => state.patients);
  const [patientIdInput, setPatientIdInput] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchId = parseInt(patientIdInput.trim()); // convert input to number
    const patient = patients.find((p) => p.id === patientIdInput);
    if (patient) {
      setPatientData(patient);
      setShowForm(false); // hide input after search
    } else {
      alert("No patient found with this ID");
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Enter Your Patient ID</h1>
        <form onSubmit={handleSearch} className="flex flex-col items-center gap-4">
          <input
            type="number"
            placeholder="Enter numeric Patient ID"
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  // Show patient data if found
  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Welcome, {patientData.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Your Risk Data</h2>
        <p><strong>Patient ID:</strong> {patientData.id}</p>
        <p><strong>Blood Pressure:</strong> {patientData.blood_pressure}</p>
        <p><strong>Insulin:</strong> {patientData.insulin}</p>
        <p><strong>Glucose:</strong> {patientData.glucose}</p>
        <p><strong>BMI:</strong> {patientData.bmi}</p>
        <p><strong>BMI:</strong> {patientData.bmi}</p>
        <p><strong>Risk Probability:</strong> {patientData.probability}%</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
