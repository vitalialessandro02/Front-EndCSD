import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const truckIcon = L.icon({
  iconUrl: "/image.png", // Sostituisci con l'URL corretto dell'icona
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MezziGiornalieriComponent = ({ data }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!document.getElementById("map")) return;

    // Controlla se la mappa è già stata inizializzata ed evita il doppio rendering
    if (L.DomUtil.get("map")?._leaflet_id !== undefined) {
      L.DomUtil.get("map")._leaflet_id = null;
    }

    const newMap = L.map("map", {
      scrollWheelZoom: false,
      maxZoom: 18,
      minZoom: 3,
      zoomControl: true,
    }).setView([41.9028, 12.4964], 6); // Centra inizialmente su Roma

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove(); // Rimuove la mappa al dismount del componente
    };
  }, []);

  useEffect(() => {
    if (map && data.length > 0) {
      // Rimuove tutti i marker precedenti
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      data.forEach((mezzo) => {
        const marker = L.marker([mezzo.latitude, mezzo.longitude], { icon: truckIcon }).addTo(map);

        marker.bindPopup(`
          <b>Targa:</b> ${mezzo.plate}<br>
          <b>KM Percorsi:</b> ${mezzo.kmVehicle.toLocaleString()} km
        `);
      });

      map.setView([data[0].latitude, data[0].longitude], 10);
    }
  }, [data, map]);

  return (
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
  );
};

export default MezziGiornalieriComponent;
