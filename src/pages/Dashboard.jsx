import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import ChartComponent from "../components/ChartComponent";
import sampleData from "../data/sample.json";
import attivitàgiornalieramezzoData from "../data/attivitàgiornalieramezzo.json";
import targheData from "../data/targhe.json";
import AttivitaDataComponent from "../components/AttivitaDataComponent";
import '../styles/Axitea.css';
import numeroEventiGiornalieriData from "../data/numeroeventigiornalieri.json";
import EventiGiornalieri from "../components/EventiGiornalieri";
import KmMinutiGiornalieri from "../components/KmMinutiGiornalieri";
import numeroKmMinutiGiornalieriData from "../data/kmminutidiguidamezzo.json";

import { getAccessToken } from "../utils/authUtils";
const Dashboard = () => {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(sampleData);
  const [selectedOption, setSelectedOption] = useState("Mezzi in servizio giornaliero");
  const [chartType, setChartType] = useState("Bar");
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedTarga, setSelectedTarga] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [eventiData, setEventiData] = useState([]);
  const [kmMinutiData, setKmMinutiData] = useState([]);

  const [noData, setNoData] = useState(true);  // Stato per "No data available"
  const [noEventiData, setNoEventiData] = useState(true);
  const [noKmMinutiData, setNoKmMinutiData] = useState(true);
  const [error, setError] = useState(null);
  const [showToken, setShowToken] = useState(false); // Stato per mostrare/nascondere il token
  const [token, setToken] = useState("");




  const [response, setResponse] = useState('');

  const fetchToken = async () => {
 try {
            const response = await fetch('http://127.0.0.1:8000/api/plates/', {
                method: 'POST',
                credentials: 'include', // Includi i cookie nella richiesta
            });
            const data = await response.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Errore durante il recupero delle targhe:', error);
        }
};







  useEffect(() => {
    if (selectedOption === "Attività di un determinato mezzo con selezione della data" && selectedTarga && selectedDate) {
      filterData();
    } else {
      setNoData(true); // Di default mostra "No data available"
    }
  }, [selectedTarga, selectedDate, selectedOption]);

  useEffect(() => {
    if (selectedOption === "Esempio") {
      setFilteredData(sampleData);
      setNoData(false);
    }
  }, [selectedOption]);
  useEffect(() => {
    if (selectedOption === "Numero di eventi giornalieri" && selectedTarga && selectedDate) {
      filterEventiData();
    } else {
      setNoEventiData(true); // Imposta solo il nuovo stato, senza interferire con `noData`
    }
  }, [selectedTarga, selectedDate, selectedOption]);

  useEffect(() => {
    if (selectedOption === "Minuti di guida in funzione dei km percorsi" && selectedTarga && selectedDate) {
      filterKmMinutiData();
    } else {
      setNoKmMinutiData(true);
    }
}, [selectedTarga, selectedDate, selectedOption]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTargaChange = (event) => {
    setSelectedTarga(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filterData = () => {
    if (!selectedTarga || !selectedDate) return;

    const selectedDateFormatted = new Date(selectedDate).toISOString().split("T")[0];

    const foundActivity = attivitàgiornalieramezzoData.vehicleInfo.filter(
      (entry) =>
        entry.datetime.startsWith(selectedDateFormatted) &&
        attivitàgiornalieramezzoData.targa === selectedTarga
    );

    if (foundActivity.length > 0) {
      setFilteredData(foundActivity);
      setNoData(false);
    } else {
      setFilteredData([]);
      setNoData(true);
    }
  };


  const filterEventiData = () => {
    if (!selectedTarga || !selectedDate) return;

    // Formattiamo la data selezionata nel formato YYYY-MM-DD
    const selectedDateFormatted = new Date(selectedDate).toISOString().split("T")[0];

    // Log per debug
    console.log("Selected date formatted:", selectedDateFormatted);

    // Convertiamo la data del JSON "250205" in formato "YYYY-MM-DD"
    const jsonYear = "20" + numeroEventiGiornalieriData.date.substring(0, 2); // "2025"
    const jsonMonth = numeroEventiGiornalieriData.date.substring(2, 4); // "02"
    const jsonDay = numeroEventiGiornalieriData.date.substring(4, 6); // "05"
    const jsonDateFormatted = `${jsonYear}-${jsonMonth}-${jsonDay}`; // "2025-02-05"

    // Log per debug
    console.log("JSON date formatted:", jsonDateFormatted);
    console.log("JSON targa:", numeroEventiGiornalieriData.targa);
    console.log("Selected targa:", selectedTarga);

    // Filtriamo se la targa e la data coincidono
    const foundEvent =
        numeroEventiGiornalieriData.targa === selectedTarga &&
        jsonDateFormatted === selectedDateFormatted;

    console.log("Match trovato:", foundEvent);

    if (foundEvent) {
        setEventiData([numeroEventiGiornalieriData]); // Convertito in array per uniformità
        setNoEventiData(false);
    } else {
        setEventiData([]);
        setNoEventiData(true);
    }
};

const filterKmMinutiData = () => {
  if (!selectedTarga || !selectedDate) return;

  const selectedDateFormatted = new Date(selectedDate).toISOString().split("T")[0];
  console.log("Selected Date Formatted:", selectedDateFormatted);

  const jsonDate = numeroKmMinutiGiornalieriData.date;
  const jsonYear = "20" + jsonDate.substring(0, 2);
  const jsonMonth = jsonDate.substring(2, 4);
  const jsonDay = jsonDate.substring(4, 6);



  const jsonDateFormatted = `${jsonYear}-${jsonMonth}-${jsonDay}`;

  console.log("JSON Date Formatted:", jsonDateFormatted);

  const foundKmMinuti =
    numeroKmMinutiGiornalieriData.targa === selectedTarga &&
    jsonDateFormatted === selectedDateFormatted;

  console.log("Found KmMinutiData:", foundKmMinuti);

  if (foundKmMinuti) {
    // Estrai solo i dati che ti servono
    const filterData = {
      totKmInterval: numeroKmMinutiGiornalieriData.totKmInterval,
      totDriveTime: numeroKmMinutiGiornalieriData.totDriveTime
    };

    setKmMinutiData([filterData]);
    setNoKmMinutiData(false);
  } else {
    setKmMinutiData([]);
    setNoKmMinutiData(true);
  }
};





  return (












    <div className="min-h-screen bg-gray-100 p-8">
     <div>
        <h1>Dashboard</h1>
        <button onClick={fetchToken}>Richiedi Token</button>

        {token && (
          <p style={{ marginTop: '10px' }}>
            <strong>Token ricevuto:</strong> {token}
          </p>
        )}

        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            Errore: {error}
          </p>
        )}
      </div>






         {/* Freccia per tornare indietro */}
         <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="back-icon" />
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Axitea</h1>



      {/* Selettore Opzioni */}
      <div className="mb-4 text-center">
        <label htmlFor="data-selection" className="font-semibold text-xl mr-2">
          Seleziona un'opzione:
        </label>
        <select
          id="data-selection"
          value={selectedOption}
          onChange={handleSelectChange}
          className="p-2 border rounded-lg"
        >
          <option value="Mezzi in servizio giornaliero">Mezzi in servizio giornaliero</option>
          <option value="Esempio">Esempio</option>
          <option value="Attività di un determinato mezzo con selezione della data">
            Attività di un determinato mezzo con selezione della data
          </option>
          <option value="Numero di eventi giornalieri">Numero di eventi per data</option>
          <option value="Minuti di guida in funzione dei km percorsi">
            Minuti di guida in funzione dei km percorsi
          </option>
          <option value="Elenco dei mezzi fermi per manutenzione">
            Elenco dei mezzi fermi per manutenzione
          </option>
        </select>
      </div>

      {/* Selezione targa e data */}
      {(selectedOption === "Attività di un determinato mezzo con selezione della data"||selectedOption === "Numero di eventi giornalieri" || selectedOption === "Minuti di guida in funzione dei km percorsi" )&& (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-lg font-semibold mb-2">Seleziona una targa:</label>
          <select value={selectedTarga} onChange={handleTargaChange} className="p-2 border rounded-lg w-full mb-4">
            <option value="">Seleziona una targa</option>
            {targheData.veichles.map((targa, index) => (
              <option key={index} value={targa}>{targa}</option>
            ))}
          </select>

          <label className="block text-lg font-semibold mb-2">Seleziona una data:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="p-2 border rounded-lg w-full mb-4"
          />

          {noData ? (
            <p className="text-center text-red-500 text-lg font-semibold">No data available</p>

          ) : (
            <div className="chart-section">
            <AttivitaDataComponent
              data={filteredData}
              label="Temperature1"
              color="red"
              chartType={chartType}
              mapVisible={mapVisible}
              setMapVisible={setMapVisible}
            />
            </div>
          )}
        </div>
      )}

      {/* Sezione per "Esempio" */}
      {selectedOption === "Esempio" && (
        <div className="chart-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ChartComponent data={filteredData} label="Temperature" color="red" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ChartComponent data={filteredData} label="Humidity" color="blue" />
          </div>
        </div>
        </div>
      )}
{selectedOption === "Numero di eventi giornalieri" && eventiData && eventiData.length > 0 && (
  <div className="chart-section">
    <EventiGiornalieri data={eventiData} />
  </div>
)}

{selectedOption === "Minuti di guida in funzione dei km percorsi" && kmMinutiData && kmMinutiData.length > 0 && (
  <div className="chart-section">
    <KmMinutiGiornalieri data={kmMinutiData} />
  </div>
)}


      {/* Mappa */}
      {mapVisible && (
        <div
          id="map"
          style={{
            height: "400px",
            width: "100%",
            marginTop: "20px",
            position: "relative",
          }}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
