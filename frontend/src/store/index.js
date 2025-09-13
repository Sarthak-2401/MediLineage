// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import patientsReducer from "../features/patientsSlice";

 const store = configureStore({
  reducer: {
    patients: patientsReducer,
    // future: variants, family, analytics...
  },
});
export default store;
