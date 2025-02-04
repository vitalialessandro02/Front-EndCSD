import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";  // Importa gli stili globali

import React from "react";
import ChartComponent from "./components/ChartComponent";
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
    <Dashboard />
  </div>
  )
}

export default App





