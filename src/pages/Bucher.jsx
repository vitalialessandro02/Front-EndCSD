import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import '../styles/Bucher.css'; // Importa il CSS personalizzato

const Bucher = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 relative">
      {/* Freccia per tornare indietro */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="back-icon" />
      </button>
      
      <h1 className="text-3xl font-bold mb-6">Dashboard Bucher</h1>
    </div>
  );
};

export default Bucher;
