import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LandingPage from './components/landing.js'
import IntroPage from './components/intro.js'

function App() {
  return (
    <div>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/intro" element={<IntroPage />} />
      </Routes>
    </div>
  );
}

export default App;
