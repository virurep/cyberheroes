import ExplorationMap from "./components/ExplorationMap";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';
import LessonIntroPage from './components/LessonIntro';
import LessonPage from './components/Lesson'
import PrivacyPlanetQuiz from './components/Privacy-Planet-Quiz.js';
import PrivacyPlanetQuizAnswers from './components/Privacy-Planet-Quiz-Answers.js';
import RedFlagGreenFlag from "./components/RedFlag-GreenFlag-Quiz.js"

function App() {
  return (
      <div>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/exploration-map" element={<ExplorationMap />} />
          <Route path="/:planet/lesson-intro" element={<LessonIntroPage />} />
          <Route path="/:planet/lesson" element={<LessonPage />} />

          {/* change this to rout to the quiz page of a specific planet */}
          <Route path="/privacy-planet/quiz" element={<PrivacyPlanetQuiz />} />
          <Route path="/privacy-planet/quiz/quiz-answers" element={<PrivacyPlanetQuizAnswers />} />
          <Route path="/privacy-moon/quiz/redflag-greenflag" element={<RedFlagGreenFlag />} />
        </Routes>
        </div>

  );
}

export default App;
