import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
const HomePage = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

  const handleSelectionChange = (event) => {
    const value = event.target.value;
    setSelectedCompany(value);

    if (value === "axitea") {
      navigate("/dashboard");
    } else if (value === "bucher") {
      navigate("/bucher");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Benvenuto</h1>
      <label htmlFor="company-selection" className="text-xl mb-2">
        Seleziona un'opzione:
      </label>
      <select
        id="company-selection"
        value={selectedCompany}
        onChange={handleSelectionChange}
        className="p-2 border rounded-lg"
      >
        <option value="">-- Seleziona --</option>
        <option value="axitea">Axitea</option>
        <option value="bucher">Bucher</option>
      </select>
    </div>
  );
};

export default HomePage;
