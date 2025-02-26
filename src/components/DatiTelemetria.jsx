import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const DatiTelemetria = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Nessun dato disponibile per questa selezione.
      </p>
    );
  }

  const [chartType, setChartType] = useState("Bar");

  // Calcola dati aggregati in modo più accurato
  const totalDistance = data.reduce((sum, item) => sum + (parseFloat(item.distance) || 0), 0).toFixed(2);
  const totalWorkDist = data.reduce((sum, item) => sum + (parseFloat(item.work_dist) || 0), 0).toFixed(2);
  const avgSpeed = data.length > 0
    ? (data.reduce((sum, item) => sum + (parseFloat(item.speed) || 0), 0) / data.length).toFixed(2)
    : 0;

  // Consumo giornaliero di carburante = ultimo valore - primo valore
  const fuelStart = data.length > 0 ? parseFloat(data[0].fuel_cons) || 0 : 0;
  const fuelEnd = data.length > 0 ? parseFloat(data[data.length - 1].fuel_cons) || 0 : 0;
  const fuelDaily = (fuelEnd - fuelStart).toFixed(2);

  // Dati da mostrare nel grafico
  const chartData = [
    {
      Name: "Dati Aggregati",
      Distance: totalDistance,
      WorkDist: totalWorkDist,
      AvgSpeed: avgSpeed,
      FuelCons: fuelDaily,
    }
  ];

  // Dati aggregati per il grafico riassuntivo
  const totalData = [
    {
      Name: "Totale",
      Distance: totalDistance,
      WorkDist: totalWorkDist,
      FuelCons: fuelDaily,
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
    <h2 className="text-xl font-bold mb-4">Dati Telemetria</h2>

    <div className="button-container">
      <button
        onClick={() => setChartType("Bar")}
        className="button button-a-barre"
      >
        Grafico a Barre
      </button>
    </div>

    {/* Grafico a Barre con dati aggregati */}
    {chartType === "Bar" && (
      <div>
        <h3 className="text-lg font-semibold">Dati Aggregati per Targa</h3>
        <BarChart width={600} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Distance" fill="#8884d8" name="Distanza Totale (km)" />
          <Bar dataKey="WorkDist" fill="#82ca9d" name="Distanza Lavoro (km)" />
          <Bar dataKey="AvgSpeed" fill="#00C49F" name="Velocità Media (km/h)" />
          <Bar dataKey="FuelCons" fill="#FFBB28" name="Consumo Carburante (L)" />
        </BarChart>
      </div>
    )}
  </div>
  );
};

export default DatiTelemetria;