const API_URL = "http://127.0.0.1:5000";

export async function fetchPatients() {
  const res = await fetch(`${API_URL}/patients`);
  return await res.json();
}

export async function predictPatient(patient) {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
  return await res.json();
}

export async function deletePatient(id) {
  const res = await fetch(`${API_URL}/patients/${id}`, { method: "DELETE" });
  return await res.json();
}
