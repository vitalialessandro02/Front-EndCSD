import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Home.css'; // Importa il CSS personalizzato


const Home = () => {
    const navigate = useNavigate();
  
    const handleSelectionChange = (event) => {
      const choice = event.target.value;
      if (choice) {
        navigate(`/${choice.toLowerCase()}`);
      }
    };
  
    return (
      <div className="home-container">
        <h1 className="title">Seleziona un'azienda</h1>
        <select
          defaultValue=""
          onChange={handleSelectionChange}
          className="dropdown"
        >
          <option value="">Seleziona un'opzione</option>
          <option value="dashboard">Axitea</option>
          <option value="bucher">Bucher</option>
        </select>
      </div>
    );
  };
  
  export default Home;