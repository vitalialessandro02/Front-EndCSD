import { useState } from "react";
import FileUploader from "../components/FileUploader";
import ChartComponent from "../components/ChartComponent";
import sampleData from "../data/sample.json";  // Importiamo il sample.json
import attivitàgiornalieramezzoData from "../data/attivitàgiornalieramezzo.json";  // Importiamo il file delle attività giornaliere
import AttivitaDataComponent from "../components/AttivitaDataComponent";

const Dashboard = () => {
  const [jsonData, setJsonData] = useState(sampleData); // Iniziamo con i dati di esempio
  const [selectedOption, setSelectedOption] = useState("Mezzi in servizio giornaliero");
  const [chartType, setChartType] = useState("Bar"); // Stato per selezionare il tipo di grafico (istogramma o torta)

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleBarChartClick = () => {
    setChartType("Bar"); // Imposta il grafico come istogramma
  };

  const handlePieChartClick = () => {
    setChartType("Pie"); // Imposta il grafico come torta
  };

  // Funzione per caricare i dati corretti in base alla selezione
  const getDataForSelectedOption = () => {
    switch (selectedOption) {
      case "Mezzi in servizio giornaliero":
        return []; // Pagina vuota, niente dati
      case "Km percorsi giornalmente":
        return []; // Pagina vuota, niente dati
      case "Esempio":
        return sampleData;  // Quando selezioni "Esempio", mostra il sample.json
      case "Attività di un determinato mezzo con selezione della data":
        return attivitàgiornalieramezzoData.vehicleInfo; // Quando selezioni questa opzione, carica attivitàgiornalieramezzo.json
      case "Numero di eventi per data":
        return []; // Pagina vuota, niente dati
      case "Minuti di guida in funzione dei km percorsi":
        return []; // Pagina vuota, niente dati
      case "Elenco dei mezzi fermi per manutenzione":
        return []; // Pagina vuota, niente dati
      default:
        return []; // In caso di selezione non definita
    }
  };

  const filteredData = getDataForSelectedOption();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      
      <FileUploader onUpload={setJsonData} /> {/* Permette di caricare un nuovo file JSON */}

      {/* Menu a tendina per selezionare l'opzione */}
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
          <option value="Esempio">Esempio</option>  {/* Opzione aggiornata */}
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


      {/* Mostra i grafici solo se l'opzione selezionata è "Attività di un determinato mezzo con selezione della data" */}
      {selectedOption === "Attività di un determinato mezzo con selezione della data" && filteredData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <AttivitaDataComponent
            data={filteredData}
            label="Temperature1"
            color="red"
            chartType={chartType} // Passiamo il tipo di grafico (istogramma o torta)
          />
        </div>
      )}

      {/* Mostra i grafici solo se l'opzione selezionata è "Esempio" */}
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
    </div>
  );
};

export default Dashboard;

