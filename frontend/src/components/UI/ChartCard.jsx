// src/components/UI/ChartCard.jsx
export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white bg-opacity-6 p-4 rounded-2xl shadow-lg">
      <h3 className="text-md font-semibold text-white mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
