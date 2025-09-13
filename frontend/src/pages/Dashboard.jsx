// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPatients } from "../features/patientsSlice";
import ChartCard from "../components/UI/ChartCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: patients, loading } = useAppSelector((s) => s.patients);

  useEffect(() => {
    dispatch(fetchPatients()); // Load patient data
  }, [dispatch]);

  const total = patients.length;

  // Mark "high risk" patients (example: condition includes 'serious')
  const high = patients.filter((p) =>
    p.condition?.toLowerCase().includes("serious")
  ).length;

  return (
    <div className="p-6">
      {/* ✅ Professional Gradient Title */}
      <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {/* 📊 Dashboard */}
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Patients */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Patients
          </h3>
          <div className="text-3xl font-bold text-green-600">{total}</div>
        </div>

        {/* High Risk Cases */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            High Risk Cases
          </h3>
          <div className="text-3xl font-bold text-red-600">{high}</div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/patients")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
            >
              ➕ Add Patient
            </button>
            <button
              onClick={() => navigate("/Analytics")}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow"
            >
              ⚡ Run Risk Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
