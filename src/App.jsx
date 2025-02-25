import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/LoginPage.jsx"
import Home from "../src/pages/HomePage.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import BucherPage from "../src/pages/Bucher.jsx"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bucher" element={<BucherPage />} />
      </Routes>
    </Router>
  );
}

export default App;

