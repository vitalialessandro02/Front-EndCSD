import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";



const Login = ({ onLogin, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ La password è gestita in uno stato sicuro
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/backend/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        navigate("/home");
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
      <form onSubmit={handleLogin} className="login-form">
        <input 
          type="email" 
          className="login-input"
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          autoComplete="email" // ✅ Suggerimento sicuro per il browser
        />
        <div className="password-container">
          <input 
            type={showPassword ? "text" : "password"} 
            className="login-input"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            autoComplete="current-password" // ✅ Risolve il warning nel browser
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Accedi</button>
      </form>
      <p>Non hai un account? <button className="switch-button" onClick={switchToRegister}>Registrati</button></p>
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
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/backend/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <form onSubmit={handleRegister} className="register-form">
        <input 
          type="email" 
          className="register-input"
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          className="register-input"
          placeholder="Nome" 
          value={firstname} 
          onChange={(e) => setFirstname(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          className="register-input"
          placeholder="Cognome" 
          value={lastname} 
          onChange={(e) => setLastname(e.target.value)} 
          required 
        />
        <div className="password-container">
          <input 
            type={showPassword ? "text" : "password"} 
            className="register-input"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="register-button">Registrati</button>
      </form>
      <p>Hai già un account? <button className="switch-button" onClick={switchToLogin}>Accedi</button></p>
    </div>
  );
};

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="home-wrapper">
      {isRegistering ? (
        <Register switchToLogin={() => setIsRegistering(false)} />
      ) : (
        <Login onLogin={() => {}} switchToRegister={() => setIsRegistering(true)} />
      )}
    </div>
  );
};

export default LoginPage;
