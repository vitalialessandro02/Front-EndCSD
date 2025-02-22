import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Login = ({ onLogin, switchToRegister }) => {
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
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        onLogin(true);
        console.log("Login effettuato con successo");
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
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Accedi</button>
      </form>
      <p>Non hai un account? <button onClick={switchToRegister}>Registrati</button></p>
    </div>
  );
};

const Register = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/backend/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstname, lastname, password }),
      });

      if (response.ok) {
        setSuccess("Registrazione completata! Ora puoi accedere.");
        setError("");
      } else {
        setError("Errore nella registrazione. Riprova.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      setError("Errore di connessione al server.");
    }
  };

  return (
    <div className="home-container">
      <h1>Registrati</h1>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Nome" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
        <input type="text" placeholder="Cognome" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit">Registrati</button>
      </form>
      <p>Hai già un account? <button onClick={switchToLogin}>Accedi</button></p>
    </div>
  );
};

const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
        isRegistering ? (
          <Register switchToLogin={() => setIsRegistering(false)} />
        ) : (
          <Login onLogin={setAuthenticated} switchToRegister={() => setIsRegistering(true)} />
        )
      ) : (
        <>
          <img src="/cosmari-XL.png" alt="Logo Cosmari" className="logo" />
          <div className="home-container">
            <h1 className="title">Seleziona un'azienda</h1>
            <select defaultValue="" onChange={handleSelectionChange} className="dropdown">
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