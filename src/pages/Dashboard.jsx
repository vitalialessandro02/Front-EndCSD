import { useState } from "react";
import FileUploader from "../components/FileUploader";
import ChartComponent from "../components/ChartComponent";
import sampleData from "../data/sample.json";
import attivitàgiornalieramezzoData from "../data/attivitàgiornalieramezzo.json";
import AttivitaDataComponent from "../components/AttivitaDataComponent";

const Dashboard = () => {
  const [jsonData, setJsonData] = useState(sampleData);
  const [selectedOption, setSelectedOption] = useState("Mezzi in servizio giornaliero");
  const [chartType, setChartType] = useState("Bar");
  const [mapVisible, setMapVisible] = useState(false);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleBarChartClick = () => {
    setChartType("Bar");
  };

  const handlePieChartClick = () => {
    setChartType("Pie");
  };

  const getDataForSelectedOption = () => {
    switch (selectedOption) {
      case "Mezzi in servizio giornaliero":
        return [];
      case "Km percorsi giornalmente":
        return [];
      case "Esempio":
        return sampleData;
      case "Attività di un determinato mezzo con selezione della data":
        return attivitàgiornalieramezzoData.vehicleInfo;
      case "Numero di eventi per data":
        return [];
      case "Minuti di guida in funzione dei km percorsi":
        return [];
      case "Elenco dei mezzi fermi per manutenzione":
        return [];
      default:
        return [];
    }
  };

  const filteredData = getDataForSelectedOption();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      
      <FileUploader onUpload={setJsonData} />

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
          <option value="Km percorsi giornalmente">Km percorsi giornalmente</option>
          <option value="Esempio">Esempio</option>
          <option value="Attività di un determinato mezzo con selezione della data">
            Attività di un determinato mezzo con selezione della data
          </option>
          <option value="Numero di eventi per data">Numero di eventi per data</option>
          <option value="Minuti di guida in funzione dei km percorsi">
            Minuti di guida in funzione dei km percorsi
          </option>
          <option value="Elenco dei mezzi fermi per manutenzione">
            Elenco dei mezzi fermi per manutenzione
          </option>
        </select>
      </div>

      {selectedOption === "Attività di un determinato mezzo con selezione della data" && filteredData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
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

      {selectedOption === "Esempio" && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ChartComponent data={filteredData} label="Temperature" color="red" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ChartComponent data={filteredData} label="Humidity" color="blue" />
          </div>
        </div>
      )}

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
