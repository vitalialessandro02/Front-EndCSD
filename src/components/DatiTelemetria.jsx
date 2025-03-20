import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const DatiTelemetria = ({ data,selectedTarga,selectedDate }) => {
  const [chartType, setChartType] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  if (!data || Object.keys(data).length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Nessun dato disponibile per questa selezione.
      </p>
    );
  }

  const transformValue = (value) => (value > 100 ? 100 : value);

  const totalDistance = parseFloat(data.totalDistanceSum);
  const totalWorkDist = parseFloat(data.totalWorkDistSum);
  const avgSpeed = parseFloat(data.avgSpeed);
  const fuelDaily = parseFloat(data.totalFuelCons);

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

  const fetchWeeklyData = async () => {
    console.log("Valore aggiornato di plateT:", selectedTarga);
    const payload = { date:selectedDate, serial_number:selectedTarga};
 
    try {
        const response = await fetch("http://localhost:8000/elastic/weekly_report_bucher/", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Errore nella risposta:", errorMessage);
            return;
        }

        const result = await response.json();
        console.log("Dati ricevuti:", result);
        setWeeklyData(result.data);
    } catch (error) {
        console.error("Errore nel recupero dei dati settimanali:", error);
    }
};


  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Dati Telemetria</h2>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${chartType === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setChartType("daily")}
        >
          Dati Giornalieri
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${chartType === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setChartType("weekly");
            fetchWeeklyData();
          }}
        >
          Dati Settimanali
        </button>
      </div>

      {chartType === "daily" && (
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
{chartType === "weekly" && weeklyData && weeklyData.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold">Dati Settimanali</h3>
    <BarChart width={600} height={400} data={weeklyData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="serial_number" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="total_work_time" fill="#8884d8" name="Tempo di Lavoro (min)" />
      <Bar dataKey="sum_work_time" fill="#82ca9d" name="Somma Tempo di Lavoro (min)" />
      <Bar dataKey="avg_speed" fill="#00C49F" name="Velocità Media (km/h)" />
      <Bar dataKey="total_fuel_cons" fill="#FFBB28" name="Consumo Carburante (L)" />
    </BarChart>
  </div>
)}

    </div>
  );
};

export default DatiTelemetria;
