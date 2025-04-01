import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LandingPage from './landing.js'

function App() {
  return (
    <div>
    <Routes>
      <Route index element={<LandingPage />} />
    </Routes>
  </div>
  );
}

export default App;
