import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const HomePage = () => {
  const navigate = useNavigate();

  // Funzione per gestire il logout (senza chiamata fetch)
  const handleLogout = () => {
    // Reindirizza direttamente alla pagina di login
    navigate("/login");
  };

  const handleSelectionChange = (event) => {
    const choice = event.target.value;
    // Naviga in base alla scelta
    if (choice === "Axitea") {
      navigate("/dashboard");
    } else if (choice === "Bucher") {
      navigate("/bucher");
    }
  };

  return (
    <div className="home-wrapper">
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <img src="/cosmari-XL.png" alt="Logo Cosmari" className="logo" />
      <div className="home-container">
        <h1 className="title">Seleziona un'azienda</h1>
        <select defaultValue="" onChange={handleSelectionChange} className="dropdown">
          <option value="">Seleziona un'opzione</option>
          <option value="Axitea">Axitea</option>
          <option value="Bucher">Bucher</option>
        </select>
      </div>
    </div>
  );
};

export default HomePage;
