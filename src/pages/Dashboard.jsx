import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import sampleData from "../data/sample.json";
import AttivitaDataComponent from "../components/AttivitaDataComponent";
import '../styles/Axitea.css';
import EventiGiornalieri from "../components/EventiGiornalieri";
import KmMinutiGiornalieri from "../components/KmMinutiGiornalieri";
import MezziGiornalieriComponent from "../components/MezziGiornalieriComponent.jsx";






const Dashboard = () => {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(sampleData);
  const [selectedOption, setSelectedOption] = useState("Attività di un determinato mezzo con selezione della data");
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

  const [attivitàGiornalieraMezzoData, setAttivitàGiornalieraMezzoData] = useState(null);
  
  const [mezziData, setMezziData] = useState([]); // Stato per la chiamata API mezzi giornalieri
  const [noMezziData, setNoMezziData] = useState(true);

  const [response, setResponse] = useState('');
  let [plates, setPlates] = useState([]);

// useEffect per caricare le targhe da API
useEffect(() => {
  const fetchPlates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/plates/', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      setPlates(data.data.veichles);
    } catch (error) {
      console.error('Errore durante il recupero delle targhe:', error);
    }
  };

  fetchPlates();
}, []);



useEffect(() => {
  const fetchVehicleData = async () => {
    try {
      const dateObj = new Date(selectedDate);

      const datestart = formatDateToYYMMDDHHMMSS(dateObj, 0, 0, 0); // Inizio giornata 00:00:00
      const dateend = formatDateToYYMMDDHHMMSS(dateObj, 23, 59, 59); // Fine giornata 23:59:59

      const response = await fetch('http://localhost:8000/api/vehicle/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plate: selectedTarga,
          datestart: datestart,
          dateend: dateend,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante il recupero dei dati del mezzo');
      }

      const data = await response.json();

      if (data.status === 'success' && data.data.vehicleInfo) {
        setFilteredData(data.data.vehicleInfo);
        setNoData(false);
      } else {
        setFilteredData([]);
        setNoData(true);
      }
    } catch (error) {
      console.error('Errore durante il fetch dei dati attività mezzo:', error);
      setFilteredData([]);
      setNoData(true);
    }
  };

  if (selectedOption === "Attività di un determinato mezzo con selezione della data" && selectedTarga && selectedDate) {
    fetchVehicleData();
  } else {
    setNoData(true); // Di default mostra "No data available"
  }
}, [selectedTarga, selectedDate, selectedOption]);

const formatDateToYYMMDDHHMMSS = (date, hour, minute, second) => {
  const year = String(date.getFullYear()).slice(2); // YY
  const month = String(date.getMonth() + 1).padStart(2, '0'); // MM
  const day = String(date.getDate()).padStart(2, '0'); // DD
  const hh = String(hour).padStart(2, '0'); // HH
  const mm = String(minute).padStart(2, '0'); // MM
  const ss = String(second).padStart(2, '0'); // SS

  return `${year}${month}${day}${hh}${mm}${ss}`;
};



useEffect(() => {
  const fetchVehicleInfoByInterval = async () => {
    try {
      const dateObj = new Date(selectedDate);
      const datestart = formatDateToYYMMDDHHMMSS(dateObj, 0, 0, 0);
      const dateend = formatDateToYYMMDDHHMMSS(dateObj, 23, 59, 59);

      const response = await fetch('http://localhost:8000/api/vehicle_interval/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plate: selectedTarga,
          datestart: datestart,
          dateend: dateend,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante il recupero dei dati del mezzo per intervallo');
      }

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        // Estrai solo i campi richiesti dalla risposta
        const extractedData = {
          totStart: data.data.totStart,
          totStop: data.data.totStop,
          totPForzaOn: data.data.totPForzaOn,
          totPForzaOff: data.data.totPForzaOff,
          totEngineIgnition: data.data.totEngineIgnition,
        };

        setEventiData([extractedData]); // Per mantenere la struttura a array
        setNoEventiData(false);
      } else {
        setEventiData([]);
        setNoEventiData(true);
      }
    } catch (error) {
      console.error('Errore durante il fetch dei dati per intervallo:', error);
      setEventiData([]);
      setNoEventiData(true);
    }
  };

  if (selectedOption === "Numero di eventi giornalieri" && selectedTarga && selectedDate) {
    fetchVehicleInfoByInterval();
  } else {
    setNoEventiData(true);
  }
}, [selectedTarga, selectedDate, selectedOption]);






useEffect(() => {
  const fetchKmDriveTimeByInterval = async () => {
    try {
      const dateObj = new Date(selectedDate);
      const datestart = formatDateToYYMMDDHHMMSS(dateObj, 0, 0, 0);
      const dateend = formatDateToYYMMDDHHMMSS(dateObj, 23, 59, 59);

      const response = await fetch('http://localhost:8000/api/vehicle_interval/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plate: selectedTarga,
          datestart: datestart,
          dateend: dateend,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante il recupero dei dati del mezzo per km e minuti di guida');
      }

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        // Estrai solo i campi richiesti dalla risposta
        const extractedData = {
          totKmInterval: data.data.totKmInterval,
          totDriveTime: data.data.totDriveTime,
        };

        setKmMinutiData([extractedData]); // Per mantenere la struttura a array
        setNoKmMinutiData(false);
      } else {
        setKmMinutiData([]);
        setNoKmMinutiData(true);


      }
    } catch (error) {
      console.error('Errore durante il fetch dei dati km e minuti:', error);
      setKmMinutiData([]);
      setNoKmMinutiData(true);
    }
  };

  if (selectedOption === "Minuti di guida in funzione dei km percorsi" && selectedTarga && selectedDate) {
    fetchKmDriveTimeByInterval();
  } else {
    setNoKmMinutiData(true);
  }
}, [selectedTarga, selectedDate, selectedOption]);






        






useEffect(() => {
  if (selectedOption === "Mezzi in servizio giornaliero") {
    const fetchMezziGiornalieri = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/vehicles/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero dei mezzi giornalieri");
        }

        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.data.vehicleInfo)) {
          setMezziData(data.data.vehicleInfo);
          setNoMezziData(data.data.vehicleInfo.length === 0);
        } else {
          setMezziData([]);
          setNoMezziData(true);
        }
      } catch (error) {
        console.error("Errore durante il fetch dei mezzi giornalieri:", error);
        setMezziData([]);
        setNoMezziData(true);
      }
    };
    fetchMezziGiornalieri();
  }
}, [selectedOption]);

const handleOptionChange = (event) => {
  setSelectedOption(event.target.value);
};




  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTargaChange = (event) => {
    setSelectedTarga(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };











  return (

    <div className="min-h-screen bg-gray-100 p-8">
    






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
          <option value="Attività di un determinato mezzo con selezione della data">
            Attività di un determinato mezzo con selezione della data
          </option>
          <option value="Numero di eventi giornalieri">Numero di eventi per data</option>
          <option value="Minuti di guida in funzione dei km percorsi">
            Minuti di guida in funzione dei km percorsi
          </option>
        </select>
      </div>

      {/* Selezione targa e data */}
      {(selectedOption === "Attività di un determinato mezzo con selezione della data"||selectedOption === "Numero di eventi giornalieri" || selectedOption === "Minuti di guida in funzione dei km percorsi" )&& (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-lg font-semibold mb-2">Seleziona una targa:</label>
          <select value={selectedTarga} onChange={handleTargaChange} className="p-2 border rounded-lg w-full mb-4">
           <option value="">Seleziona una targa</option>
              {plates.map((targa, index) => (
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

      {selectedOption === "Mezzi in servizio giornaliero" && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {noMezziData ? (
            <p className="text-center text-red-500 text-lg font-semibold">No data available</p>
          ) : (
            <div className="chart-section">
              <MezziGiornalieriComponent data={mezziData} />
            </div>
          )}
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
