import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import sampleData from "../data/sample.json"; // Assicurati che il percorso sia corretto

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const calculateStats = (data, key) => {
  const values = data.map((d) => d[key]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return { max, min, avg };
};

const ChartComponent = ({ data = sampleData, label, color }) => {
  const [chartType, setChartType] = useState("Line"); // Stato per il tipo di grafico
  const stats = calculateStats(data, label.toLowerCase());

  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: label,
        data: data.map((d) => d[label.toLowerCase()]),
        borderColor: color,
        backgroundColor: chartType === "Pie" ? ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"] : color + "33",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
      annotation: chartType === "Line" ? {
        annotations: {
          maxLine: {
            type: "line",
            yMin: stats.max,
            yMax: stats.max,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: `Max: ${stats.max.toFixed(2)}`,
              enabled: true,
              position: "start",
              backgroundColor: "rgba(255,0,0,0.7)",
              color: "white",
            },
          },
          minLine: {
            type: "line",
            yMin: stats.min,
            yMax: stats.min,
            borderColor: "blue",
            borderWidth: 2,
            label: {
              content: `Min: ${stats.min.toFixed(2)}`,
              enabled: true,
              position: "start",
              backgroundColor: "rgba(0,0,255,0.7)",
              color: "white",
            },
          },
          avgLine: {
            type: "line",
            yMin: stats.avg,
            yMax: stats.avg,
            borderColor: "green",
            borderDash: [6, 6],
            borderWidth: 2,
            label: {
              content: `Avg: ${stats.avg.toFixed(2)}`,
              enabled: true,
              position: "start",
              backgroundColor: "rgba(0,128,0,0.7)",
              color: "white",
            },
          },
        },
      } : {},
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return <Bar data={chartData} options={options} />;
      case "Pie":
        return <Pie data={chartData} options={options} />;
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        <button onClick={() => setChartType("Line")} className={`px-4 py-2 mx-2 rounded ${chartType === "Line" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Linea
        </button>
        <button onClick={() => setChartType("Bar")} className={`px-4 py-2 mx-2 rounded ${chartType === "Bar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Istogramma
        </button>
        <button onClick={() => setChartType("Pie")} className={`px-4 py-2 mx-2 rounded ${chartType === "Pie" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Torta
        </button>
      </div>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;

