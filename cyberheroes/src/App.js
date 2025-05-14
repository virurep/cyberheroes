import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
// Landing pages
import ExplorationMap from "./components/ExplorationMap";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';

//Lesson pages
import LessonIntroPage from './components/lessons/LessonIntro';
import LessonPage from './components/lessons/Lesson'
import Arrival from './components/lessons/Arrival.js';
import Transition from './components/lessons/Transition';
import Certificate from './components/lessons/Certificate.js';
import Review from './components/review/review.js';
//Privacy planet quizzes
import PrivacyPlanetQuiz from './components/quizzes/Privacy-Planet-Quiz.js';
import PrivacyPlanetQuizAnswers from './components/quizzes/Privacy-Planet-Quiz-Answers.js';

//Privacy moon quizzes
import PrivacyMoonQuizRoute from './components/quizzes/Privacy-Moon-Quiz-Route.js';
import PrivacyMoonQuiz from './components/quizzes/Privacy-Moon-Quiz.js';
import PrivacyMoonQuizAnswers from './components/quizzes/Privacy-Moon-Quiz-Answers.js';
import DragDropQuiz from './components/quizzes/Drag-Drop-Quiz.js';
import RedFlagGreenFlag from "./components/quizzes/RedFlag-GreenFlag-Quiz.js"
import GameAnswers from "./components/quizzes/game-answers.js"

function App() {
  return (
      <div>
        <Routes>
          {/* Landing page */}
          <Route index element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/exploration-map" element={<ExplorationMap />} />

          {/* Lesson pages */}
          <Route path="/:planet/lesson-intro" element={<LessonIntroPage />} />
          <Route path="/:planet/arrival" element={<Arrival />} />
          <Route path="/:planet/lesson" element={<LessonPage />} />
          <Route path="/:planet/review" element={<Review />} />
          <Route path="/:planet/certificate" element={<Certificate />} />
          <Route path="/:planet/transition" element={<Transition />} />

          {/* Quizzes */}
          <Route path="/privacy-planet/quiz" element={<PrivacyPlanetQuiz />} />
          <Route path="/privacy-planet/quiz/game-answers" element={<PrivacyPlanetQuizAnswers />} />
          <Route path="/privacy-moon/quiz" element={<PrivacyMoonQuizRoute />} />
          <Route path="/privacy-moon/quiz/redflag-greenflag" element={<RedFlagGreenFlag />} />
          <Route path="/privacy-moon/quiz/final-quiz" element={<PrivacyMoonQuiz />} />
          <Route path="/privacy-moon/quiz/final-quiz/game-answers" element={<PrivacyMoonQuizAnswers />} />
          <Route path="/privacy-moon/quiz/drag-drop" element={<DragDropQuiz />} />
          <Route path="/privacy-moon/drag-drop-quiz/game-answers" element={<GameAnswers />} />
        </Routes>
      </div>
  );
}

export default App;
