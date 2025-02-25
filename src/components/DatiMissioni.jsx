import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "../styles/Missioni.css"

const DatiMissioni = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Nessun dato disponibile per questa selezione.
      </p>
    );
  }

  const [chartType, setChartType] = useState("Bar");

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const transformValue = (value) => (value > 100 ? 100 : value);

  const chartData = data.map((mission) => ({
    MissionId: mission.MissionId,
    Duration: transformValue(Number(mission.Duration) || 0),
    WorkTime: transformValue(Number(mission.WorkTime) || 0),
    TotDistance: transformValue(Number(mission.TotDistance || 0)),
    WorkDistance: transformValue(Number(mission.WorkDistance || 0)),
    OriginalDuration: Number(mission.Duration) || 0,
    OriginalWorkTime: Number(mission.WorkTime) || 0,
    OriginalTotDistance: Number(mission.TotDistance || 0),
    OriginalWorkDistance: Number(mission.WorkDistance || 0),
  }));

  const totalData = [
    {
      MissionId: "Totale",
      Duration: transformValue(chartData.reduce((sum, item) => sum + item.OriginalDuration, 0)),
      WorkTime: transformValue(chartData.reduce((sum, item) => sum + item.OriginalWorkTime, 0)),
      TotDistance: transformValue(chartData.reduce((sum, item) => sum + item.OriginalTotDistance, 0)),
      WorkDistance: transformValue(chartData.reduce((sum, item) => sum + item.OriginalWorkDistance, 0)),
      OriginalDuration: chartData.reduce((sum, item) => sum + item.OriginalDuration, 0),
      OriginalWorkTime: chartData.reduce((sum, item) => sum + item.OriginalWorkTime, 0),
      OriginalTotDistance: chartData.reduce((sum, item) => sum + item.OriginalTotDistance, 0),
      OriginalWorkDistance: chartData.reduce((sum, item) => sum + item.OriginalWorkDistance, 0),
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Dati Missioni</h2>

      <div className="button-container">
        <button
          onClick={() => setChartType("Bar")}
          className="button button-a-barre"
        >
          Grafico per Singola Missione
        </button>
        <button
          onClick={() => setChartType("Total")}
          className="button button-a-barre"
        >
          Grafico Missioni Multiple
        </button>
      </div>

      {chartType === "Bar" && chartData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Grafico a Barre</h3>
          <BarChart width={800} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="MissionId" />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => (tick === 100 ? "100+" : tick)} />
            <Tooltip formatter={(value, name, props) =>
              name.includes("Durata") || name.includes("Tempo di Lavoro")
                ? formatTime(props.payload[`Original${props.dataKey}`])
                : props.payload[`Original${props.dataKey}`]
            } />
            <Legend />
            <Bar dataKey="Duration" fill="#8884d8" name="Durata (hh:mm:ss)" />
            <Bar dataKey="WorkTime" fill="#82ca9d" name="Tempo di Lavoro (hh:mm:ss)" />
            <Bar dataKey="TotDistance" fill="#FFBB28" name="Distanza Totale (km)" />
            <Bar dataKey="WorkDistance" fill="#FF8042" name="Distanza Lavoro (km)" />
          </BarChart>
        </div>
      )}

      {chartType === "Total" && (
        <div>
          <h3 className="text-lg font-semibold">Grafico Missioni Multiple</h3>
          <BarChart width={600} height={400} data={totalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="MissionId" />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => (tick === 100 ? "100+" : tick)} />
            <Tooltip formatter={(value, name, props) =>
              name.includes("Durata") || name.includes("Tempo di Lavoro")
                ? formatTime(props.payload[`Original${props.dataKey}`])
                : props.payload[`Original${props.dataKey}`]
            } />
            <Legend />
            <Bar dataKey="Duration" fill="#8884d8" name="Durata Totale (hh:mm:ss)" />
            <Bar dataKey="WorkTime" fill="#82ca9d" name="Tempo di Lavoro Totale (hh:mm:ss)" />
            <Bar dataKey="TotDistance" fill="#FFBB28" name="Distanza Totale (km)" />
            <Bar dataKey="WorkDistance" fill="#FF8042" name="Distanza Lavoro Totale (km)" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default DatiMissioni;