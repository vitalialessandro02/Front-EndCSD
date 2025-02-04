import { useState } from "react";
import FileUploader from "../components/FileUploader";
import ChartComponent from "../components/ChartComponent";
import sampleData from "../data/sample.json";  // Importiamo il sample.json


const Dashboard = () => {
  const [jsonData, setJsonData] = useState(sampleData); // Usa il sampleData inizialmente
  const [selectedOption, setSelectedOption] = useState("Mezzi in servizio giornaliero");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Funzione per visualizzare i dati in base alla selezione
  const getDataForSelectedOption = () => {
    switch (selectedOption) {
      case "Mezzi in servizio giornaliero":
        return jsonData; // Puoi applicare logica personalizzata per ogni caso
      case "Km percorsi giornalmente":
        return jsonData; // Modifica in base ai tuoi dati
      case "Attività giornaliera mezzo":
        return jsonData; // Modifica in base ai tuoi dati
      case "Attività di un determinato mezzo con selezione della data":
        return jsonData; // Modifica in base ai tuoi dati
      case "Numero di eventi per data":
        return jsonData; // Modifica in base ai tuoi dati
      case "Minuti di guida in funzione dei km percorsi":
        return jsonData; // Modifica in base ai tuoi dati
      case "Elenco dei mezzi fermi per manutenzione":
        return jsonData; // Modifica in base ai tuoi dati
      default:
        return jsonData;
    }
  };

  const filteredData = getDataForSelectedOption();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <FileUploader onUpload={setJsonData} /> {/* Permette di caricare un nuovo file JSON */}

      {/* Menu a tendina per selezionare l'opzione */}
      <div className="mb-4">
        <label htmlFor="data-selection" className="font-semibold text-xl">
          Seleziona un'opzione:
        </label>
        <select
          id="data-selection"
          value={selectedOption}
          onChange={handleSelectChange}
          className="ml-2 p-2 border rounded-lg"
        >
          <option value="Mezzi in servizio giornaliero">Mezzi in servizio giornaliero</option>
          <option value="Km percorsi giornalmente">Km percorsi giornalmente</option>
          <option value="Attività giornaliera mezzo">Attività giornaliera mezzo</option>
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

      {/* Mostra i grafici solo se ci sono dati */}
      {filteredData.length > 0 && (
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
