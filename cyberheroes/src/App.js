import logo from './logo.svg';
import './App.css';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Button from './components/Button';
import PrivacyPlanet from './components/PrivacyPlanet';

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/privacy-planet/*" element={<PrivacyPlanet />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
