import Button from './components/Button';
import PrivacyPlanet from './components/PrivacyPlanet';
import ExplorationMap from "./components/ExplorationMap";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';
import LessonIntroPage from './components/LessonIntro';
import Arrival from './components/Arrival.js';


function App() {
  return (
      <div>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          {/* <Route path="/privacy-planet/*" element={<PrivacyPlanet />} /> */}
          <Route path="/exploration-map" element={<ExplorationMap />} />
          <Route path="/:planet/lesson-intro" element={<LessonIntroPage />} />
          <Route path="/arrival" element={<Arrival />} />
        </Routes>
      </div>

  );
}

export default App;
