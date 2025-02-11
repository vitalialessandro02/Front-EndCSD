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


  const [noData, setNoData] = useState(true);  // Stato per "No data available"

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
    }
    else {
      setNoData(true); // Di default mostra "No data available"
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
        setNoData(false);
    } else {
        setEventiData([]);
        setNoData(true);
    }
};


  
  
  
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
         {/* Freccia per tornare indietro */}
         <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="back-icon" />
      </button>
      
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Axitea</h1>

      <FileUploader onUpload={setJsonData} />

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
      {(selectedOption === "Attività di un determinato mezzo con selezione della data"||selectedOption === "Numero di eventi giornalieri" )&& (
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