import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Controlla se l'utente è autenticato all'avvio
    fetch("http://localhost:8000/backend/check-auth/", {
      method: "GET",
      credentials: "include", // ⚠️ Necessario per inviare il cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Autenticato") {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
