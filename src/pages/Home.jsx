import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/backend/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva il token nel localStorage
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Aggiorna lo stato per autenticare l'utente
        onLogin(true);
      } else {
        setError("Credenziali non valide. Riprova.");
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      setError("Errore di connessione al server.");
    }
  };

  return (
    <div className="home-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Accedi</button>
      </form>
    </div>
  );
};


const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSelectionChange = (event) => {
    const choice = event.target.value;
    if (choice && authenticated) {
      navigate(`/${choice.toLowerCase()}`);
    }
  };

  return (
    <div className="home-wrapper"> 
      {!authenticated ? (
        <Login onLogin={setAuthenticated} />
      ) : (
        <>
          <img src="/cosmari-XL.png" alt="Logo Cosmari" className="logo" />
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
        </>
      )}
    </div>
  );
};

export default Home;
