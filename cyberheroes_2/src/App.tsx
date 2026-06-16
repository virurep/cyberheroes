import { HashRouter, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import MapPage from './pages/MapPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import StyleguidePage from './pages/StyleguidePage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/styleguide" element={<StyleguidePage />} />
      </Routes>
    </HashRouter>
  );
}
