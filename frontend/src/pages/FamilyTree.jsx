// src/pages/FamilyTree.jsx
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPatients } from "../features/patientsSlice";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartCard from "../components/UI/ChartCard";

export default function FamilyTree() {
  const dispatch = useAppDispatch();
  const { items: patients, loading } = useAppSelector((state) => state.patients);

  const [childId, setChildId] = useState("");
  const [fatherHasDisease, setFatherHasDisease] = useState("no");
  const [motherHasDisease, setMotherHasDisease] = useState("no");
  const [grandfatherHasDisease, setGrandfatherHasDisease] = useState("no");
  const [grandmotherHasDisease, setGrandmotherHasDisease] = useState("no");

  // Fetch patients on component mount
  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const selectedChild = patients.find((p) => p.id === parseInt(childId));

  // Simple inheritance risk logic
  const computeChildRisk = () => {
    if (!childId) return 0;
    let risk = 0;

    // Parents contribution
    if (fatherHasDisease === "yes" && motherHasDisease === "yes") risk += 40;
    else if (fatherHasDisease === "yes" || motherHasDisease === "yes") risk += 25;

    // Grandparents contribution
    if (grandfatherHasDisease === "yes" || grandmotherHasDisease === "yes") risk += 15;

    // Minimum baseline risk
    risk += 10;

    return risk > 100 ? 100 : risk;
  };

  const childRisk = computeChildRisk();

  const pieData = [
    { name: "Disease Risk", value: childRisk },
    { name: "No Risk", value: 100 - childRisk },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Family Disease Transmission</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select child and family member disease status */}
        <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Select Patient & Family History</h3>

          {/* Child */}
          <div className="mb-4">
            <label className="block mb-1">Child (Patient)</label>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full p-2 rounded bg-gray-100 text-black"
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          {/* Father */}
          <div className="mb-4">
            <span className="block mb-1">Father has diabetes?</span>
            <label className="mr-4">
              <input
                type="radio"
                value="yes"
                checked={fatherHasDisease === "yes"}
                onChange={() => setFatherHasDisease("yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={fatherHasDisease === "no"}
                onChange={() => setFatherHasDisease("no")}
              />{" "}
              No
            </label>
          </div>

          {/* Mother */}
          <div className="mb-4">
            <span className="block mb-1">Mother has diabetes?</span>
            <label className="mr-4">
              <input
                type="radio"
                value="yes"
                checked={motherHasDisease === "yes"}
                onChange={() => setMotherHasDisease("yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={motherHasDisease === "no"}
                onChange={() => setMotherHasDisease("no")}
              />{" "}
              No
            </label>
          </div>

          {/* Grandparents */}
          <div className="mb-4">
            <span className="block mb-1">Grandfather has diabetes?</span>
            <label className="mr-4">
              <input
                type="radio"
                value="yes"
                checked={grandfatherHasDisease === "yes"}
                onChange={() => setGrandfatherHasDisease("yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={grandfatherHasDisease === "no"}
                onChange={() => setGrandfatherHasDisease("no")}
              />{" "}
              No
            </label>
          </div>

          <div className="mb-4">
            <span className="block mb-1">Grandmother has diabetes?</span>
            <label className="mr-4">
              <input
                type="radio"
                value="yes"
                checked={grandmotherHasDisease === "yes"}
                onChange={() => setGrandmotherHasDisease("yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={grandmotherHasDisease === "no"}
                onChange={() => setGrandmotherHasDisease("no")}
              />{" "}
              No
            </label>
          </div>
        </div>

        {/* Child Risk Pie Chart */}
        <ChartCard title="Child Disease Transmission Risk">
          {loading ? (
            <p className="text-gray-400 text-center">Loading patients...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          <p className="mt-4 text-white text-center text-lg">
            Estimated risk for {selectedChild ? selectedChild.name : "child"}:{" "}
            <strong>{childRisk}%</strong>
          </p>
        </ChartCard>
      </div>
    </div>
  );
}
