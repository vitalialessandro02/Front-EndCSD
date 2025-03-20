import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "../styles/Missioni.css";

const DatiMissioni = ({ data, selectedTarga, selectedDate }) => {
  if (!data || data.length === 0) return null;

  // Stati per i grafici
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState(null); // "Bar" oppure "Total"
  const [dataType, setDataType] = useState(null); // "daily" oppure "weekly"
  const [weeklyData, setWeeklyData] = useState(null);

  // Gestione dati giornalieri: quando si seleziona "daily", si usa la logica esistente
  useEffect(() => {
    if (dataType === "daily" && data.length > 0) {
      const filteredData = Object.keys(data[0] || {})
        .filter((key) => key !== "targa" && key !== "date")
        .map((key) => ({ name: key, value: data[0][key] }));
      setChartData(filteredData);
    }
  }, [dataType, data]);

  // Funzione per formattare il tempo (in secondi) in hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const transformValue = (value) => (value > 100 ? 100 : value);

  // Logica per i dati giornalieri: singola missione e missioni multiple
  const chartData1 = data.map((mission) => ({
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
      Duration: transformValue(chartData1.reduce((sum, item) => sum + item.OriginalDuration, 0)),
      WorkTime: transformValue(chartData1.reduce((sum, item) => sum + item.OriginalWorkTime, 0)),
      TotDistance: transformValue(chartData1.reduce((sum, item) => sum + item.OriginalTotDistance, 0)),
      WorkDistance: transformValue(chartData1.reduce((sum, item) => sum + item.OriginalWorkDistance, 0)),
      OriginalDuration: chartData1.reduce((sum, item) => sum + item.OriginalDuration, 0),
      OriginalWorkTime: chartData1.reduce((sum, item) => sum + item.OriginalWorkTime, 0),
      OriginalTotDistance: chartData1.reduce((sum, item) => sum + item.OriginalTotDistance, 0),
      OriginalWorkDistance: chartData1.reduce((sum, item) => sum + item.OriginalWorkDistance, 0),
    },
  ];

  // Funzione per eseguire la fetch dei dati settimanali
  const fetchWeeklyData = async () => {
    console.log("Valore aggiornato di selectedTarga:", selectedTarga);
    const payload = { date: selectedDate, serial_number: selectedTarga };
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
      // Prendi solo i campi richiesti e rinominali:
      const transformedData = [
        { name: "Distanza Lavoro", value: result.data.total_work_distance_mission },
        { name: "Tempo Totale", value: result.data.total_duration_mission },
        { name: "Tempo Lavoro", value: result.data.total_work_time_mission },
        { name: "Distanza Totale", value: result.data.total_tot_distance_mission },
      ];
      setWeeklyData(transformedData);
    } catch (error) {
      console.error("Errore nel recupero dei dati settimanali:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Dati Missioni</h2>

      {/* Bottoni per selezionare il tipo di dati */}
      <div className="button-container">
        <button
          onClick={() => { setDataType("daily"); setChartType(null); setWeeklyData(null); }}
          className={`button button-daily ${dataType === "daily" ? "active" : ""}`}
        >
          Dati Giornalieri
        </button>
        <button
          onClick={() => { setDataType("weekly"); fetchWeeklyData(); setChartType("Total"); }}
          className={`button button-weekly ${dataType === "weekly" ? "active" : ""}`}
        >
          Dati Settimanali
        </button>
      </div>

      {/* Se i dati giornalieri sono selezionati, mostra i bottoni per il tipo di grafico */}
      {dataType === "daily" && (
        <div className="button-container mt-4">
          <button
            onClick={() => setChartType("Bar")}
            className={`button button-a-barre ${chartType === "Bar" ? "active" : ""}`}
          >
            Grafico per Singola Missione
          </button>
          <button
            onClick={() => setChartType("Total")}
            className={`button button-a-barre ${chartType === "Total" ? "active" : ""}`}
          >
            Grafico Missioni Multiple
          </button>
        </div>
      )}

      {/* Grafico per i dati giornalieri: Singola Missione */}
      {chartType === "Bar" && dataType === "daily" && chartData1.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Grafico a Barre</h3>
          <BarChart width={800} height={400} data={chartData1}>
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

      {/* Grafico per i dati giornalieri: Missioni Multiple */}
      {chartType === "Total" && dataType === "daily" && (
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

      {/* Grafico per i dati settimanali */}
      {dataType === "weekly" && weeklyData && weeklyData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Grafico Dati Settimanali</h3>
          <BarChart width={600} height={400} data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />  {/* Usa il nome dei campi trasformati */}           
            <YAxis />
                   <Tooltip />
                    <Legend />           
                    <Bar dataKey="value" fill="#8884d8" />
                              </BarChart>        
                              </div>     )}
                                 </div> );};
 export default DatiMissioni;
