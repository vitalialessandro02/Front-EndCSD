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

  const transformValue = (value) => (value > 100 ? 100 : value);

  const totalDistance = parseFloat(data.reduce((sum, item) => sum + (parseFloat(item.distance) || 0), 0).toFixed(2));
  const totalWorkDist = parseFloat(data.reduce((sum, item) => sum + (parseFloat(item.work_dist) || 0), 0).toFixed(2));
  const avgSpeed = data.length > 0
    ? parseFloat((data.reduce((sum, item) => sum + (parseFloat(item.speed) || 0), 0) / data.length).toFixed(2))
    : 0;

  const fuelStart = data.length > 0 ? parseFloat(data[0].fuel_cons) || 0 : 0;
  const fuelEnd = data.length > 0 ? parseFloat(data[data.length - 1].fuel_cons) || 0 : 0;
  const fuelDaily = parseFloat((fuelEnd - fuelStart).toFixed(2));

  const chartData = [
    {
      Name: "Dati Aggregati",
      Distance: totalDistance,
      WorkDist: totalWorkDist,
      AvgSpeed: avgSpeed,
      FuelCons: fuelDaily,
      TransformedDistance: transformValue(totalDistance),
      TransformedWorkDist: transformValue(totalWorkDist),
      TransformedAvgSpeed: transformValue(avgSpeed),
      TransformedFuelCons: transformValue(fuelDaily),
      OriginalDistance: totalDistance,
      OriginalWorkDist: totalWorkDist,
      OriginalAvgSpeed: avgSpeed,
      OriginalFuelCons: fuelDaily,
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Dati Telemetria</h2>

      {chartType === "Bar" && (
        <div>
          <h3 className="text-lg font-semibold">Dati Aggregati per Targa</h3>
          <BarChart width={600} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Name" />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => (tick === 100 ? "100+" : tick)} />
            <Tooltip formatter={(value, name, props) => props.payload[`Original${props.dataKey.replace("Transformed", "")}`]} />
            <Legend />
            <Bar dataKey="TransformedDistance" fill="#8884d8" name="Distanza Totale (km)" />
            <Bar dataKey="TransformedWorkDist" fill="#82ca9d" name="Distanza Lavoro (km)" />
            <Bar dataKey="TransformedAvgSpeed" fill="#00C49F" name="Velocità Media (km/h)" />
            <Bar dataKey="TransformedFuelCons" fill="#FFBB28" name="Consumo Carburante (L)" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default DatiTelemetria;
