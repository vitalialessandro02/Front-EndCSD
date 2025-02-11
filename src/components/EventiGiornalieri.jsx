import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const EventiGiornalieri = ({ data }) => {
  if (!data || data.length === 0) return null;
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("Bar");

  useEffect(() => {
    if (data && data.length > 0) {
      // Filtra i dati per rimuovere "targa" e "data"
      const filteredData = Object.keys(data[0])
        .filter((key) => key !== "targa" && key !== "date")
        .map((key) => ({ name: key, value: data[0][key] }));

      setChartData(filteredData);
    }
  }, [data]);
  if (!chartData || chartData.length === 0) return null; // 💡 Blocco il rendering qui
 

  const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#ff6961"];

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Numero di Eventi Giornalieri</h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setChartType("Bar")}
          className="px-4 py-2 m-2 bg-blue-500 text-white rounded-lg"
        >
          Grafico a Barre
        </button>
        <button
          onClick={() => setChartType("Pie")}
          className="px-4 py-2 m-2 bg-green-500 text-white rounded-lg"
        >
          Grafico a Torta
        </button>
      </div>

      {chartType === "Pie" && chartData && chartData.length > 0 && (
  <div className="mb-8">
    <h3 className="text-lg font-semibold">Grafico a Torta</h3>
    <PieChart width={500} height={400}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
)}

{chartType === "Bar" && chartData && chartData.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold">Grafico a Barre</h3>
    <BarChart width={700} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value">
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </div>
)}

{/* Mostra un messaggio se non ci sono dati */}
{chartData && chartData.length === 0 && (
  <p className="text-center text-red-500 text-lg font-semibold">
    Nessun dato disponibile per questa selezione.
  </p>
)}

    </div>
  );
};












export default EventiGiornalieri;
