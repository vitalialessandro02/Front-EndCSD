import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import '../styles/Bucher.css';
import DatiMissioni from '../components/DatiMissioni';
import DatiTelemetria from '../components/DatiTelemetria';
const Bucher = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [date, setDate] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [plateT, setLicensePlateT] = useState('');
  const [missioniData, setMissioniData] = useState([]); 
  const [telemetriaData, setTelemetriaData] = useState([]); 
  const licensePlates = [
    "TEBC51AR3RKV08940", "TEBC51AR5RKV08941", "TEBC51AR7RKV08942", "TEBC51AR9RKV08943", 
    "TEBC51AR0RKV08944", "TEBC51AR2RKV08945", "TEBC50AR2RKV10074", "TEBC50AR5RKV10148", 
    "TEBC50AR3RKV10181", "TEBC50AR9RKV10167", "TEBC30AV9PKV00772", "TEBC30CR0RKV00923", 
    "TEBC30CR2RKV00938", "TEBC30CR9RKV00998", "Intera Flotta"
  ];

  useEffect(() => {
    if (selectedOption === "missioni" && date && licensePlate) {
      fetchMissionData();
    }
  }, [selectedOption, date, licensePlate]);

  const fetchMissionData = async () => {
    try {
        const dateObj = new Date(date);
        const starttime = Math.floor(dateObj.setHours(0, 0, 0, 0) / 1000);
        const endtime = Math.floor(dateObj.setHours(23, 59, 59, 999) / 1000);

        const snmachine = licensePlate === "Intera Flotta"
            ? licensePlates.filter(plate => plate !== "Intera Flotta")
            : [licensePlate];

        const queryParams = new URLSearchParams({
            starttime: starttime.toString(),
            endtime: endtime.toString(),
        });

        snmachine.forEach(plate => queryParams.append("snmachine", plate));

        const url = `http://localhost:8000/api/mission/?${queryParams.toString()}`;

        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Errore durante il recupero dei dati missioni: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success' && result.data) {
            
            result.data.forEach(mission => {
                console.log("Dati ricevuti per missione:", mission);  // 🔍 LOG per controllare i valori effettivi
            });

            // Formattiamo i dati ricevuti
            const formattedData = result.data.map(mission => ({
              MissionId: mission.MissionId,
              SnAsset: mission.SnAsset,
              StartMission: new Date(mission.StartMission * 1000).toLocaleString("it-IT"),
              EndMission: new Date(mission.EndMission * 1000).toLocaleString("it-IT"),
              Duration: Number(mission.Duration) || 0,  // 👈 Ora è un numero (niente stringhe)
              WorkTime: Number(mission.WorkTime) || 0,  // 👈 Ora è un numero (niente stringhe)
              TotDistance: Number(mission.TotDistance || 0).toFixed(2),
              WorkDistance: Number(mission.WorkDistance || 0).toFixed(2),
          }));

            setMissioniData(formattedData);
        } else {
            setMissioniData([]); // Se non ci sono dati, resettiamo lo stato
        }
    } catch (error) {
        console.error('Errore durante il fetch dei dati missioni:', error);
        setMissioniData([]); // In caso di errore, mostriamo "No data available"
    }
  };



  useEffect(() => {
    if (selectedOption === "telemetria" && date && licensePlate) {
      
      fetchTelemetriaData();
    }
  }, [selectedOption, date,licensePlate]);

  const fetchTelemetriaData = async () => {
    
    try {
        const dateObj = new Date(date);
        const starttime = Math.floor(dateObj.setHours(0, 0, 0, 0) / 1000);
        const endtime = Math.floor(dateObj.setHours(23, 59, 59, 999) / 1000);

        const snmachine = licensePlate === "Intera Flotta"
            ? licensePlates.filter(plate => plate !== "Intera Flotta")
            : [licensePlate];

        const queryParams = new URLSearchParams({
            starttime: starttime.toString(),
            endtime: endtime.toString(),
        });

        snmachine.forEach(plate => queryParams.append("snmachine", plate));

        const url = `http://localhost:8000/api/assets-tracking/?${queryParams.toString()}`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Errore durante il recupero dei dati telemetria: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success' && result.data) {
            const filteredData = result.data.filter(item => 
                licensePlate === "Intera Flotta" || 
                item.asset.sn.trim().toUpperCase() === licensePlate.trim().toUpperCase()
            ); // qui item.asset.sn platesT

            console.log("Dati filtrati:", filteredData);

            const formattedData = filteredData.map(item => ({
                name: item.asset.name,
                start_time: item.sweeper.start_time,
                work_time: item.sweeper.work_time,
                distance: Number(item.sweeper.distance),
                work_dist: Number(item.sweeper.work_dist),
                fuel_cons: Number(item.sweeper.engine.fuel_cons),
                altitude: Number(item.altitude),
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                speed: Number(item.speed),
                sample_time: item.sample_time,
            }));

            const totalDistanceSum = formattedData.reduce((sum, item) => sum + item.distance, 0).toFixed(2);
            const totalWorkDistSum = formattedData.reduce((sum, item) => sum + item.work_dist, 0).toFixed(2);

            // Calcolo del consumo carburante corretto
            const fuelConsumptionByVehicle = {};
            formattedData.forEach(item => {
                if (!fuelConsumptionByVehicle[item.name]) {
                    fuelConsumptionByVehicle[item.name] = [];
                }
                fuelConsumptionByVehicle[item.name].push(item.fuel_cons);
            });

            let totalFuelCons = 0;
            Object.values(fuelConsumptionByVehicle).forEach(consumptions => {
                const first = Math.min(...consumptions);
                const last = Math.max(...consumptions);
                totalFuelCons += Math.max(0, last - first);
            });
            totalFuelCons = totalFuelCons.toFixed(2);

            const avgSpeed = (formattedData.reduce((sum, item) => sum + item.speed, 0) / formattedData.length).toFixed(2);

            console.log("Somma totale della distanza:", totalDistanceSum);
            console.log("Somma totale della distanza di lavoro:", totalWorkDistSum);
            console.log("Consumo totale di carburante:", totalFuelCons);
            console.log("Velocità media:", avgSpeed);

            setTelemetriaData({
                totalDistanceSum,
                totalWorkDistSum,
                totalFuelCons,
                avgSpeed,
                details: formattedData
            });
        } else {
            setTelemetriaData([]);
        }
    } catch (error) {
        console.error('Errore durante il fetch dei dati telemetria:', error);
        setTelemetriaData([]);
    }
};



  

















  return (
    <div className="dashboard-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="back-icon" />
      </button>
      <h1>Dashboard Bucher</h1>
      
      <div>
        <label>Seleziona un'opzione:</label>
        <select onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="">-- Seleziona --</option>
          <option value="missioni">Dati Missioni</option>
          <option value="telemetria">Dati Telemetria</option>
        </select>
      </div>
      
      {selectedOption && (
        <>
          <div>
            <label>Seleziona la data:</label>
            <input type="date" onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label>Seleziona la targa:</label>
            <select
              onChange={(e) => selectedOption === "telemetria" 
                ? setLicensePlate(e.target.value) 
                : setLicensePlate(e.target.value)
              }
            >
              <option value="">-- Seleziona --</option>
              {selectedOption === "telemetria"
                ? licensePlates.map((plate, index) => (
                    <option key={index} value={plate}>{plate}</option>
                  ))
                : licensePlates.map((plate, index) => (
                    <option key={index} value={plate}>{plate}</option>
                  ))
              }
            </select>
          </div>
        </>
      )}

{selectedOption === "missioni" && (
  missioniData && missioniData.length > 0 ? (
    <DatiMissioni 
      data={missioniData} 
      selectedTarga={licensePlate}  
      selectedDate={date}    
    />
  ) : (
    <p className="no-data-message">Nessun dato disponibile</p>
  )
)}

      
      {selectedOption === "telemetria" && (
    telemetriaData && Object.keys(telemetriaData).length > 0 ? (
      <DatiTelemetria data={telemetriaData} 
        selectedTarga={licensePlate}  
        selectedDate={date}  />
    ) : (
        <p className="no-data-message">Nessun dato disponibile</p>
    )
)}

    </div>
  );
  
};

export default Bucher;