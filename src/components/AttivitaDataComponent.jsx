import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const AttivitaDataComponent = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("Bar");

  useEffect(() => {
    if (data && data.length > 0) {
      // Etichette con ora:minuti:secondi
      const labels = data.map((item) =>
        new Date(item.datetime).toLocaleTimeString()
      );

      // Dati per temperature1 (usati per il grafico a torta)
      const temperature1 = data.map((item) => item.temperature1);

      // Configuriamo i dati per il grafico a barre
      const barChartData = {
        labels: labels,
        datasets: [
          {
            label: "Temperature1",
            data: temperature1,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Temperature2",
            data: data.map((item) => item.temperature2),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Latitude",
            data: data.map((item) => item.latitude),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Longitude",
            data: data.map((item) => item.longitude),
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
          {
            label: "KMH",
            data: data.map((item) => item.kmh),
            backgroundColor: "rgba(255, 159, 64, 0.5)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      };

      // Configuriamo i dati per il grafico a torta
      const pieChartData = {
        labels: labels,
        datasets: [
          {
            label: "Temperature1",
            data: temperature1,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
            borderColor: "#FF0000",
            borderWidth: 2,
          },
        ],
      };

      setChartData({ bar: barChartData, pie: pieChartData });
    }
  }, [data]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  // Configurazione dei tooltip per il grafico a torta
  const pieOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const timeLabel = data[index].datetime;
            const latitude = data[index].latitude;
            const longitude = data[index].longitude;
            const kmh = data[index].kmh;
            const temperature1 = data[index].temperature1;
            const temperature2 = data[index].temperature2;

            return `${new Date(timeLabel).toLocaleTimeString()}\nLatitude: ${latitude}\nLongitude: ${longitude}\nKMH: ${kmh}\nTemperature1: ${temperature1}\nTemperature2: ${temperature2}`;
          },
        },
      },
    },
  };

  return (
    <div>
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

      {chartType === "Bar" ? (
        <Bar data={chartData.bar} options={{ responsive: true }} />
      ) : (
        <Pie data={chartData.pie} options={pieOptions} />
      )}
    </div>
  );
};

export default AttivitaDataComponent;
