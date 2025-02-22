import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js";

const truckIcon = L.icon({
  iconUrl: "/image.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0],
});

const AttivitaDataComponent = ({ data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [map, setMap] = useState(null);
  const [showMapButtons, setShowMapButtons] = useState(false);
  const [showGraphButtons, setShowGraphButtons] = useState(false);

  useEffect(() => {
    const validData = data.filter((item) => item.kmh > 0);
    const uniqueTimeSlots = [
      ...new Set(
        validData.map((item) => {
          const date = new Date(item.datetime);
          const hour = date.getHours();
          const minute = Math.floor(date.getMinutes() / 15) * 15;
          return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        })
      ),
    ].sort();

    setAvailableTimeSlots(uniqueTimeSlots);

    if (uniqueTimeSlots.length > 0) {
      setSelectedTimeSlot(uniqueTimeSlots[0]);
      filterByTimeSlot(uniqueTimeSlots[0], validData);
    }
  }, [data]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const labels = filteredData.map((item) => {
        const date = new Date(item.datetime);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      });

      const barChartData = {
        labels: labels,
        datasets: [
          {
            type: "bar",
            label: "KMH",
            data: filteredData.map((item) => item.kmh),
            backgroundColor: "rgba(255, 159, 64, 0.5)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
          {
            type: "bar",
            label: "Latitude",
            data: filteredData.map((item) => item.latitude),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            type: "bar",
            label: "Longitude",
            data: filteredData.map((item) => item.longitude),
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
          {
            type: "line",
            label: "KMH Trend",
            data: filteredData.map((item) => item.kmh),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            tension: 0.4,
          },
        ],
      };

      setChartData(barChartData);
    }
  }, [filteredData]);

  const filterByTimeSlot = (timeSlot, dataToFilter = data) => {
    const filtered = dataToFilter.filter((item) => {
      const date = new Date(item.datetime);
      const hour = date.getHours();
      const minute = Math.floor(date.getMinutes() / 15) * 15;
      const timeSlotFormatted = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      return timeSlotFormatted === timeSlot && item.kmh > 0;
    });

    setFilteredData(filtered);
    setSelectedTimeSlot(timeSlot);

    if (map) {
      updateMap(filtered);
    }
  };

  const updateMap = (filtered) => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.PolylineDecorator) {
          map.removeLayer(layer);
        }
      });

      const sortedData = filtered.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

      const latLngs = [];
      for (let i = 0; i < sortedData.length; i++) {
        const item = sortedData[i];
        const marker = L.marker([item.latitude, item.longitude], { icon: truckIcon }).addTo(map);

        marker.bindPopup(` 
          <b>Data e Ora:</b> ${new Date(item.datetime).toLocaleString()}<br>
          <b>Latitudine:</b> ${item.latitude}<br>
          <b>Longitudine:</b> ${item.longitude}<br>
          <b>Velocità (KMH):</b> ${item.kmh}
        `);

        latLngs.push([item.latitude, item.longitude]);

        if (i > 0) {
          const line = L.polyline([latLngs[i - 1], latLngs[i]], {
            color: "blue",
            weight: 4,
            opacity: 0.7,
          }).addTo(map);

          const arrow = L.polylineDecorator(line, {
            patterns: [
              {
                offset: "100%",
                repeat: 0,
                symbol: L.Symbol.arrowHead({
                  pixelSize: 15,
                  pathOptions: {
                    fillColor: "blue",
                    weight: 2,
                    opacity: 0.7,
                  },
                }),
              },
            ],
          }).addTo(map);
        }
      }
    }
  };

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

        setMap(newMap);
        updateMap(filteredData);
      }
    } else if (!mapVisible && map) {
      map.remove();
      setMap(null);
    }
  }, [mapVisible, data, filteredData]);

  const handleMapToggle = () => {
    setMapVisible(true); // Mostra la mappa
    setShowGraphButtons(false); // Nascondi il grafico
    setShowMapButtons(true); // Mostra i pulsanti per il tragitto
  };

  const handleGraphToggle = () => {
    setShowGraphButtons(true); // Mostra il grafico
    setShowMapButtons(false); // Nascondi i pulsanti della mappa
    setMapVisible(false); // Nascondi la mappa
  };

  const showFullRoute = () => {
    updateMap(data); // Mostra il tragitto completo
  };

  const showRouteByTimeSlot = () => {
    updateMap(filteredData); // Mostra il tragitto per fascia oraria
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <select
          value={selectedTimeSlot}
          onChange={(e) => filterByTimeSlot(e.target.value)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {availableTimeSlots.map((timeSlot) => (
            <option key={timeSlot} value={timeSlot}>
              {timeSlot}
            </option>
          ))}
        </select>
        <button
          onClick={handleGraphToggle}
          className="px-4 py-2 m-2 bg-green-500 text-white rounded-lg"
        >
          Grafico
        </button>
        <button
          onClick={handleMapToggle}
          className="px-4 py-2 m-2 bg-yellow-500 text-white rounded-lg"
        >
          Mappa
        </button>
      </div>

      {/* Mostra il grafico se il pulsante "Grafico" è stato selezionato */}
      {showGraphButtons && chartData && chartData.datasets[0].data.length > 0 && (
        <Bar data={chartData} options={{ responsive: true }} />
      )}

      {/* Mostra i pulsanti per scegliere il tipo di tragitto quando "Mappa" è selezionato */}
      {showMapButtons && (
        <div className="flex justify-center mt-4">
          <button
            onClick={showFullRoute}
            className="px-4 py-2 bg-green-500 text-white rounded-lg m-2"
          >
            Tragitto Completo
          </button>
          <button
            onClick={showRouteByTimeSlot}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg m-2"
          >
            Tragitto per Fascia Oraria
          </button>
        </div>
      )}

      {/* La mappa */}
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