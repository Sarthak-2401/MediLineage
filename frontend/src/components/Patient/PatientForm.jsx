// src/components/Patient/PatientForm.jsx
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addPatient, updatePatient } from "../../features/patientsSlice";

export default function PatientForm({ patient, onClose }) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    age: "",
    blood_pressure: "",
    glucose: "",
    insulin: "",
    bmi: "",
    skin_thickness: "",
  });

  useEffect(() => {
    if (patient) {
      setForm(patient);
    } else {
      setForm({
        name: "",
        age: "",
        blood_pressure: "",
        glucose: "",
        insulin: "",
        bmi: "",
        skin_thickness: "",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patient) {
      dispatch(updatePatient({ ...form, id: patient.id }));
      onClose();
    } else {
      dispatch(addPatient(form));
      setForm({
        name: "",
        age: "",
        blood_pressure: "",
        glucose: "",
        insulin: "",
        bmi: "",
        skin_thickness: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg text-white"
    >
      {/* Heading with gradient text */}
      <h3 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        {patient ? "Edit Patient" : "Add Patient"}
      </h3>

      {/* Grid for Name and Age */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          min={0}
          max={120}
          required
        />
      </div>

      {/* Grid for Blood Pressure and Glucose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="blood_pressure"
          value={form.blood_pressure}
          onChange={handleChange}
          placeholder="Blood Pressure (mmHg)"
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          min={0}
          max={300}
          step={0.1}
          required
        />

        <input
          type="number"
          name="glucose"
          value={form.glucose}
          onChange={handleChange}
          placeholder="Glucose (mg/dL)"
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          min={0}
          max={500}
          step={0.1}
          required
        />
      </div>

      {/* Grid for Insulin and BMI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="insulin"
          value={form.insulin}
          onChange={handleChange}
          placeholder="Insulin (μU/mL)"
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          min={0}
          max={1000}
          step={0.1}
          required
        />

        <input
          type="number"
          name="bmi"
          value={form.bmi}
          onChange={handleChange}
          placeholder="BMI"
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          min={0}
          max={100}
          step={0.1}
          required
        />
      </div>

      {/* Skin Thickness */}
      <input
        type="number"
        name="skin_thickness"
        value={form.skin_thickness}
        onChange={handleChange}
        placeholder="Skin Thickness (mm)"
        className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        min={0}
        max={100}
        step={0.1}
        required
      />

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-semibold transition text-white"
        >
          {patient ? "Update Patient" : "Add Patient"}
        </button>

        {patient && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
