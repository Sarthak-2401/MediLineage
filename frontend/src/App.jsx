import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { useState, useEffect } from "react";
import store from "./store/index";

import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Varients from "./pages/Varients";
import FamilyTree from "./pages/FamilyTree";
import Analytics from "./pages/Analytics";  
import LoginPage from "./pages/Login";
import PatientDashboard from "./pages/patient_dashboard"; // updated

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(""); // "doctor" or "patient"

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedRole = localStorage.getItem("role");
    if (token && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
  }, []);

  const handleLogin = () => {
    const savedRole = localStorage.getItem("role");
    setIsAuthenticated(true);
    setRole(savedRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("patientId"); // remove patient ID on logout
    setIsAuthenticated(false);
    setRole("");
  };

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          {/* Doctor Protected Routes */}
          {isAuthenticated && role === "doctor" && (
            <Route
              path="/*"
              element={
                <Layout onLogout={handleLogout}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/variants" element={<Varients />} />
                    <Route path="/family" element={<FamilyTree />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              }
            />
          )}

          {/* Patient Protected Route */}
          {isAuthenticated && role === "patient" && (
            <>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="*" element={<Navigate to="/patient_dashboard" />} />
            </>
          )}

          {/* Redirect unknown routes if not authenticated */}
          {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
