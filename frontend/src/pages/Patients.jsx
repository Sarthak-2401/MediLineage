// src/pages/Patients.jsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPatients, removePatient } from "../features/patientsSlice";
import PatientForm from "../components/Patient/PatientForm";
import PatientCard from "../components/Patient/PatientCard";

export default function Patients() {
  const dispatch = useAppDispatch();
  const { items: patients, loading } = useAppSelector((s) => s.patients);

  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleDelete = (id) => dispatch(removePatient(id));
  const handleEdit = (patient) => setEditingPatient(patient);
  const handleFormClose = () => {
    setEditingPatient(null);
    dispatch(fetchPatients());
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Diabetes Patients</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              {editingPatient ? "Edit Patient" : "Add Patient"}
            </h3>
            <PatientForm patient={editingPatient} onClose={handleFormClose} />
          </div>
        </div>

        {/* Cards Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <div className="text-gray-300">Loading...</div>}

          {patients.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}

          {patients.length === 0 && !loading && (
            <div className="text-gray-300 mt-4">No patients yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
