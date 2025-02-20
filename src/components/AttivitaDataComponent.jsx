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
            tension: 0.4, // Smoothed curve effect
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
  };

  const toggleMapVisibility = () => {
    setMapVisible((prevState) => !prevState);
  };

  useEffect(() => {
    if (mapVisible) {
      const map = L.map("map").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      filteredData.forEach((item) => {
        L.marker([item.latitude, item.longitude], { icon: truckIcon })
          .addTo(map)
          .bindPopup(`<b>KMH:</b> ${item.kmh}<br/><b>Latitude:</b> ${item.latitude}<br/><b>Longitude:</b> ${item.longitude}`);
      });

      return () => {
        map.remove();
      };
    }
  }, [mapVisible, filteredData]);

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
      </div>

      {!mapVisible && chartData && chartData.datasets[0].data.length > 0 && (
        <Bar data={chartData} options={{ responsive: true }} />
      )}

      <div className="flex justify-center mb-4">
        <button
          onClick={toggleMapVisibility}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          {mapVisible ? "Hide Map" : "Show Map"}
        </button>
      </div>

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
