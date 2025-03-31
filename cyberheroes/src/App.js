import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ExplorationMap from "./components/ExplorationMap";

function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/exploration-map" element={<ExplorationMap />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
