import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import L from "leaflet";  // Importiamo Leaflet per la mappa
import "leaflet/dist/leaflet.css";  // Importiamo lo stile CSS di Leaflet
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js"; // Import per polilinee con decoratore (freccia)

// Crea l'icona del camioncino (modifica il percorso in base alla posizione effettiva del file)
const truckIcon = L.icon({
  iconUrl: "/image.png", // Percorso relativo rispetto alla cartella "public"
  iconSize: [32, 32], // Dimensione dell'icona (adatta a seconda delle tue necessità)
  iconAnchor: [16, 32], // Punto di ancoraggio dell'icona (metti la base dell'icona sul punto del marker)
  popupAnchor: [0, 0], // La finestra del popup apparirà sopra l'icona
});

const AttivitaDataComponent = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("Bar");
  const [mapVisible, setMapVisible] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const labels = data.map((item) => new Date(item.datetime).toLocaleTimeString());
      const temperature1 = data.map((item) => item.temperature1);

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
          {
            label: "Temperature2",
            data: data.map((item) => item.temperature2),
            backgroundColor: [
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FF6384",
            ],
            borderColor: "#0000FF",
            borderWidth: 2,
          },
          {
            label: "Latitude",
            data: data.map((item) => item.latitude),
            backgroundColor: [
              "#FF9F40",
              "#FF6384",
              "#36A2EB",
              "#4BC0C0",
              "#9966FF",
              "#FFCE56",
            ],
            borderColor: "#FF5733",
            borderWidth: 2,
          },
          {
            label: "Longitude",
            data: data.map((item) => item.longitude),
            backgroundColor: [
              "#FF9F40",
              "#FF6384",
              "#36A2EB",
              "#4BC0C0",
              "#9966FF",
              "#FFCE56",
            ],
            borderColor: "#34FF57",
            borderWidth: 2,
          },
          {
            label: "KMH",
            data: data.map((item) => item.kmh),
            backgroundColor: [
              "#FF5733",
              "#FF9F40",
              "#36A2EB",
              "#4BC0C0",
              "#9966FF",
              "#FFCE56",
            ],
            borderColor: "#34FF57",
            borderWidth: 2,
          },
        ],
      };

      setChartData({ bar: barChartData, pie: pieChartData });
    }
  }, [data]);

  useEffect(() => {
    if (mapVisible && data && data.length > 0) {
      if (!map) {
        const newMap = L.map("map", {
          scrollWheelZoom: false,
          maxZoom: 18,
          minZoom: 3,
          zoomControl: true,
        }).setView([data[0].latitude, data[0].longitude], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(newMap);

        // Ordina i dati per datetime
        const sortedData = data.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        const latLngs = [];  // Array per memorizzare le coordinate dei punti
        for (let i = 0; i < sortedData.length; i++) {
          const item = sortedData[i];
          const marker = L.marker([item.latitude, item.longitude], { icon: truckIcon }).addTo(newMap);

          marker.bindPopup(` 
            <b>Data e Ora:</b> ${new Date(item.datetime).toLocaleString()}<br>
            <b>Latitudine:</b> ${item.latitude}<br>
            <b>Longitudine:</b> ${item.longitude}<br>
            <b>Velocità (KMH):</b> ${item.kmh}<br>
            <b>Temperatura 1:</b> ${item.temperature1}°C<br>
            <b>Temperatura 2:</b> ${item.temperature2}°C
          `);

          latLngs.push([item.latitude, item.longitude]); // Aggiungi la posizione del marker

          // Aggiungi la linea con la freccia solo tra i punti successivi
          if (i > 0) {
            const previousPoint = sortedData[i - 1];
            const currentPoint = item;

            // Traccia la linea tra i punti
            const line = L.polyline([latLngs[i - 1], latLngs[i]], {
              color: 'blue',
              weight: 4,
              opacity: 0.7,
            }).addTo(newMap);

            // Aggiungi una freccia alla linea
            const arrow = L.polylineDecorator(line, {
              patterns: [
                {
                  offset: '100%',
                  repeat: 0,
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 15,
                    pathOptions: {
                      fillColor: 'blue',
                      weight: 2,
                      opacity: 0.7,
                    },
                  }),
                },
              ],
            }).addTo(newMap);
          }
        }

        setMap(newMap);
      }
    } else if (!mapVisible && map) {
      map.remove();
      setMap(null);
    }
  }, [mapVisible, data, map]);

  const handleChartTypeChange = (type) => {
    setMapVisible(false);
    setChartType(type);
  };

  const handleMapToggle = () => {
    setChartType(null);
    setMapVisible(!mapVisible);
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleChartTypeChange("Bar")}
          className="px-4 py-2 m-2 bg-blue-500 text-white rounded-lg"
        >
          Grafico a Barre
        </button>
        <button
          onClick={() => handleChartTypeChange("Pie")}
          className="px-4 py-2 m-2 bg-green-500 text-white rounded-lg"
        >
          Grafico a Torta
        </button>
        <button
          onClick={handleMapToggle}
          className="px-4 py-2 m-2 bg-yellow-500 text-white rounded-lg"
        >
          Mappa
        </button>
      </div>

      {!mapVisible && chartType === "Bar" && (
        <Bar data={chartData.bar} options={{ responsive: true }} />
      )}

      {!mapVisible && chartType === "Pie" && (
        <Pie data={chartData.pie} />
      )}

      {mapVisible && (
        <div
          id="map"
          style={{
            height: "600px",
            width: "100%",
            marginTop: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        ></div>
      )}
    </div>
  );
};

export default AttivitaDataComponent;

