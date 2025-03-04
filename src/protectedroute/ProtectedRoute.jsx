import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token); // Imposta lo stato in base al token
  }, []);

  if (isAuthenticated === null) {
    return <div>Caricamento...</div>; // Mostra un caricamento mentre controlla il token
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
