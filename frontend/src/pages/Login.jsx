import { useState } from "react";
import { FaUserMd, FaUserInjured } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("doctor");

  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [patientId, setPatientId] = useState("");

  const navigate = useNavigate();

  // Default credentials for demo
  const doctorCreds = {
    id: "doc123",
    email: "doctor@example.com",
    password: "doctor123",
  };

  const patientCreds = {
    id: "pat123",
    email: "patient@example.com",
    password: "patient123",
  };

  const handleDoctorLogin = (e) => {
    e.preventDefault();
    if (
      doctorId === doctorCreds.id &&
      doctorEmail === doctorCreds.email &&
      doctorPassword === doctorCreds.password
    ) {
      localStorage.setItem("authToken", "doctor_token");
      localStorage.setItem("role", "doctor");
      onLogin(); // lift state to App
      navigate("/");
    } else {
      alert("Invalid Doctor credentials");
    }
  };

  const handlePatientLogin = (e) => {
    e.preventDefault();
    if (
      patientId === patientCreds.id &&
      patientEmail === patientCreds.email &&
      patientPassword === patientCreds.password
    ) {
      localStorage.setItem("authToken", "patient_token");
      localStorage.setItem("role", "patient");
      localStorage.setItem("patientId", patientId); 
      onLogin();
      navigate("/");
    } else {
      alert("Invalid Patient credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-green-100 px-4 py-10">
      <div className="backdrop-blur-md bg-white/80 shadow-2xl rounded-3xl p-8 w-full max-w-lg transition-all duration-500">
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://imgs.search.brave.com/9oM6bebQbJkUo3qgXCE4HX4MuBgMQ7W1UJPzy9jIPQc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE0/ODY2MzA5Ni92ZWN0/b3IvaHVnZ2luZy1o/ZWFydC1pc29sYXRl/ZC1vbi1hLXdoaXRl/LWJhY2tncm91bmQt/aGVhcnQtd2l0aC1o/YW5kcy1yZWQtY29s/b3ItbG92ZS1zeW1i/b2wtaHVnLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1aUnRU/ZXJReE5jZ05Lc2pF/RzFsdWU0Yld4blpW/ZUw1NHZCdjhBX29V/MVJjPQ"
            alt="logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
            AI Health Tracker
          </h1>
          <p className="text-sm text-gray-500">Login as Doctor or Patient</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border rounded-full overflow-hidden shadow-sm">
          <button
            className={`w-1/2 py-2 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "doctor"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
            onClick={() => setActiveTab("doctor")}
          >
            <FaUserMd />
            Doctor
          </button>
          <button
            className={`w-1/2 py-2 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "patient"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-green-100"
            }`}
            onClick={() => setActiveTab("patient")}
          >
            <FaUserInjured />
            Patient
          </button>
        </div>

        {/* Forms */}
        {activeTab === "doctor" ? (
          <form onSubmit={handleDoctorLogin} className="space-y-4">
            <Input label="Doctor ID" value={doctorId} onChange={setDoctorId} />
            <Input
              label="Email"
              type="email"
              value={doctorEmail}
              onChange={setDoctorEmail}
            />
            <Input
              label="Password"
              type="password"
              value={doctorPassword}
              onChange={setDoctorPassword}
            />
            <SubmitButton label="Doctor Login" color="blue" />
          </form>
        ) : (
          <form onSubmit={handlePatientLogin} className="space-y-4">
            <Input label="Patient ID" value={patientId} onChange={setPatientId} />
            <Input
              label="Email"
              type="email"
              value={patientEmail}
              onChange={setPatientEmail}
            />
            <Input
              label="Password"
              type="password"
              value={patientPassword}
              onChange={setPatientPassword}
            />
            <SubmitButton label="Patient Login" color="green" />
          </form>
        )}
      </div>
    </div>
  );
}

// 👇 Reusable Input component
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={`Enter your ${label.toLowerCase()}`}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
      />
    </div>
  );
}

// 👇 Reusable Submit Button
function SubmitButton({ label, color }) {
  const bg =
    color === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-green-600 hover:bg-green-700";
  return (
    <button
      type="submit"
      className={`w-full ${bg} text-white py-2 rounded-lg font-semibold transition-all shadow-md`}
    >
      {label}
    </button>
  );
}
