import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const KmDriveTimeGiornalieri = ({ data }) => {
  if (!data || data.length === 0) return null;
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("Bar");
  const [dataType, setDataType] = useState(null); // "daily" or "weekly"

  useEffect(() => {
    if (dataType === "daily" && data.length > 0) {
      const filteredData = Object.keys(data[0])
        .filter((key) => key !== "targa" && key !== "date")
        .map((key) => ({ name: key, value: data[0][key] }));
      setChartData(filteredData);
    }
  }, [dataType, data]);

  useEffect(() => {
    if (dataType === "weekly" && data.length > 0) {
      const aggregatedData = {};
      let count = 0;

      data.forEach((entry) => {
        if (!entry.date) return;
        const dayOfWeek = new Date(entry.date).getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 7) { // Considera solo da lunedì a domenica
          count++;
          Object.keys(entry).forEach((key) => {
            if (key !== "targa" && key !== "date") {
              aggregatedData[key] = (aggregatedData[key] || 0) + entry[key];
            }
          });
        }
      });

      if (count > 0) {
        const averagedData = Object.keys(aggregatedData).map((key) => ({
          name: key,
          value: aggregatedData[key] / count,
        }));
        setChartData(averagedData);
      } else {
        setChartData([]);
      }
    }
  }, [dataType, data]);

  const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#ff6961"];

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Km e Tempo di Guida</h2>

      <div className="button-container">
        <button onClick={() => setDataType("daily")} className="button button-daily">Dati Giornalieri</button>
        <button onClick={() => setDataType("weekly")} className="button button-weekly">Dati Settimanali</button>
      </div>

      {dataType && (
        <div className="button-container mt-4">
          <button onClick={() => setChartType("Bar")} className="button button-a-barre">Grafico a Barre</button>
          <button onClick={() => setChartType("Pie")} className="button button-a-torta">Grafico a Torta</button>
        </div>
      )}

      {chartData.length > 0 ? (
        <>
          {chartType === "Pie" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Grafico a Torta</h3>
              <PieChart width={500} height={400}>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          )}

          {chartType === "Bar" && (
            <div className="mt-6">
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
        </>
      ) : (
        dataType && <p className="text-center text-red-500 text-lg font-semibold">Nessun dato disponibile per questa selezione.</p>
      )}
    </div>
  );
};

export default KmDriveTimeGiornalieri;

