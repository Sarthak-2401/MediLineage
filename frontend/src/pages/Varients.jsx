// src/pages/Variants.jsx
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPatients } from "../features/patientsSlice";
import ChartCard from "../components/UI/ChartCard";

export default function Variants() {
  const dispatch = useAppDispatch();
  const { items: patients, loading } = useAppSelector((state) => state.patients);

  const [variantsList, setVariantsList] = useState([]);

  useEffect(() => {
    // Fetch patients
    dispatch(fetchPatients());
  }, [dispatch]);

  useEffect(() => {
    // Extract unique variants from patient condition field
    const allVariants = patients
      .flatMap((p) => p.condition?.split(",") || []) // handle multiple comma-separated variants
      .map((v) => v.trim())
      .filter((v) => v); // remove empty strings

    const uniqueVariants = Array.from(new Set(allVariants));
    setVariantsList(uniqueVariants);
  }, [patients]);

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">🧬 Variants & Diabetes Types</h2>

      {/* Variant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center">Loading...</p>
        ) : variantsList.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No variants found.</p>
        ) : (
          variantsList.map((variant, idx) => (
            <ChartCard key={idx} title={variant}>
              <p className="text-gray-700 mb-1">
                Type: {variant.includes("BRCA") ? "Breast Cancer" : "Other Genetic Variant"}
              </p>
              <p className="text-gray-600 text-sm">
                {variant.includes("BRCA")
                  ? "BRCA1 & BRCA2 variants are linked to hereditary breast and ovarian cancer."
                  : "Other variants may be linked to different genetic risks."}
              </p>
            </ChartCard>
          ))
        )}
      </div>

      {/* Diabetes Info */}
      <div className="mt-8">
        <ChartCard title="Diabetes Types Overview">
          <div className="text-gray-700 space-y-4">
            <p>
              <span className="font-semibold">Type 1 Diabetes:</span> An autoimmune condition where the pancreas produces little or no insulin. Usually develops in childhood or adolescence.
            </p>
            <p>
              <span className="font-semibold">Type 2 Diabetes:</span> A metabolic disorder where the body becomes resistant to insulin or doesn't produce enough. Often linked to lifestyle, obesity, and genetics.
            </p>
            <p className="text-gray-500 text-sm">
              ⚠️ Monitoring blood glucose, BMI, and other risk factors is essential for early detection and management.
            </p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
