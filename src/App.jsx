import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import BucherPage from "../src/pages/Bucher.jsx"; // Pagina vuota per ora

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bucher" element={<BucherPage />} />
      </Routes>
    </Router>
  );
}

export default App;

