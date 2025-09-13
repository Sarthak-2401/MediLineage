// src/features/patientsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/patients"; // backend endpoint

// Fetch all patients
export const fetchPatients = createAsyncThunk("patients/fetch", async () => {
  const res = await axios.get(API_BASE);
  // Convert relevant fields to numbers and provide defaults if missing
  return res.data.map((p) => ({
    id: p.id,
    name: p.name || "",
    age: Number(p.age) || 0,
    gender: p.gender || "",
    condition: p.condition || "",
    blood_pressure: Number(p.blood_pressure) || 0,
    glucose: Number(p.glucose) || 0,
    insulin: Number(p.insulin) || 0,
    bmi: Number(p.bmi) || 0,
    skin_thickness: Number(p.skin_thickness) || 0,
    probability: Number(p.probability) || 0,
  }));
});

// Add new patient
export const addPatient = createAsyncThunk(
  "patients/add",
  async (patient, { dispatch }) => {
    const res = await axios.post(API_BASE, patient);
    dispatch(fetchPatients());
    return res.data;
  }
);

// Update patient
export const updatePatient = createAsyncThunk(
  "patients/update",
  async (patient, { dispatch }) => {
    const res = await axios.put(`${API_BASE}/${patient.id}`, patient);
    dispatch(fetchPatients());
    return res.data;
  }
);

// Delete patient
export const removePatient = createAsyncThunk(
  "patients/delete",
  async (id, { dispatch }) => {
    await axios.delete(`${API_BASE}/${id}`);
    dispatch(fetchPatients());
    return id;
  }
);

const patientsSlice = createSlice({
  name: "patients",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((p) => p.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(removePatient.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default patientsSlice.reducer;
