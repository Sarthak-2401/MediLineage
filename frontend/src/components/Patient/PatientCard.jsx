// src/components/Patient/PatientCard.jsx
export default function PatientCard({ patient, onDelete, onEdit }) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg">
      <h4 className="font-bold text-lg mb-2">Patient ID: {patient.id}</h4>
      <p>Age: {patient.age}</p>
      <p>Blood Pressure: {patient.blood_pressure}</p>
      <p>BMI: {patient.bmi}</p>
      <p>Glucose: {patient.glucose}</p>
      <p>Insulin: {patient.insulin}</p>
      <p>Skin Thickness: {patient.skin_thickness}</p>
      <p>Outcome: {patient.outcome}</p>
      <p>Probability: {patient.probability.toFixed(4)}</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(patient)}
          className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(patient.id)}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
