import PrivacyPlanet from './components/PrivacyPlanet';
import ExplorationMap from "./components/ExplorationMap";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';
import LessonIntroPage from './components/LessonIntro';
import LessonPage from './components/Lesson'
// import Quiz from './components/quiz';
// import QuizAnswers from './components/quiz-Answers';
import PrivacyPlanetQuiz from './components/Privacy-Planet-Quiz.js';
import PrivacyPlanetQuizAnswers from './components/Privacy-Planet-Quiz-Answers.js';
import Arrival from './components/arrival.js';
import PrivacyIntro from './components/PrivacyIntro';

function App() {
  return (
      <div>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/exploration-map" element={<ExplorationMap />} />
          <Route path="/:planet/lesson-intro" element={<LessonIntroPage />} />
          <Route path="/:planet/arrival" element={<Arrival />} />
          <Route path="/:planet/lesson" element={<LessonPage />} />

        </Routes>
      </div>
  );
}

export default App;
