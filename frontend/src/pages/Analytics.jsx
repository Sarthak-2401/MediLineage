// src/pages/Analytics.jsx
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPatients } from "../features/patientsSlice";
import ChartCard from "../components/UI/ChartCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Analytics() {
  const dispatch = useAppDispatch();
  const { items: patients, loading } = useAppSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#8b5cf6"];

  const pieData = patients.map((p) => ({
    name: `Patient ${p.id}`,
    value: Number(p.probability) || 0,
  }));

  const barData = patients.map((p) => ({
    id: `Patient ${p.id}`,
    probability: Number(p.probability) || 0,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          📊 Patient Risk Analytics
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-400 text-center">No patient data found.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Pie Chart */}
            <div className="flex-1">
              <ChartCard title="Patient Risk Distribution">
                <div className="w-full h-[350px] flex justify-center items-center">
                  <ResponsiveContainer width="300%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Histogram / Bar Chart */}
            <div className="flex-1">
              <ChartCard title="Patient Risk Histogram">
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="id"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        label={{ value: "Probability", angle: -90, position: "insideLeft", dy: -10 }}
                      />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="probability" fill="#3b82f6" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
