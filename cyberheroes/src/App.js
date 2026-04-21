import { Route, Routes } from "react-router-dom";
// Admin
import AdminLayout from './components/admin/AdminLayout';
// Landing pages
import ExplorationMap from "./components/ExplorationMap";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';
import AboutPage from './components/AboutUs.js';

//Lesson pages
import LessonIntroPage from './components/lessons/LessonIntro';
import LessonPage from './components/lessons/Lesson'
import Arrival from './components/lessons/Arrival.js';
import Transition from './components/lessons/Transition';
import Certificate from './components/lessons/Certificate.js';
import Review from './components/review/review.js';
import TransitionCerts from './components/lessons/Transition_Cert.js';
import PatrickLeaving from './components/lessons/Patrick_leaving.js';
import MoonMap from './components/lessons/Moon_Map.js';
import PatrickDefeat from './components/lessons/Patrick_Defeat.js';
//Quiz components
import QuizRouter from './components/quizzes/QuizRouter.js';
import PrivacyPlanetQuizAnswers from './components/quizzes/Privacy-Planet-Quiz-Answers.js';
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
          <Route path="/about" element={<AboutPage />} />

          {/* Lesson pages */}
          <Route path="/:planet/lesson-intro" element={<LessonIntroPage />} />
          <Route path="/:planet/arrival" element={<Arrival />} />
          <Route path="/:planet/lesson" element={<LessonPage />} />
          <Route path="/:planet/review" element={<Review />} />
          <Route path="/:planet/transition-cert" element={<TransitionCerts />} />
          <Route path="/:planet/certificate" element={<Certificate />} />
          <Route path="/:planet/transition" element={<Transition />} />
          <Route path="/:planet/patrick-leaving" element={<PatrickLeaving />} />
          <Route path="/:planet/moon-map" element={<MoonMap />} />
          <Route path="/:planet/patrick-defeat" element={<PatrickDefeat />} />

          {/* Quizzes — dynamic :planetSlug routes */}
          <Route path="/:planetSlug/quiz" element={<QuizRouter />} />
          <Route path="/:planetSlug/quiz/game-answers" element={<PrivacyPlanetQuizAnswers />} />
          <Route path="/:planetSlug/quiz/redflag-greenflag" element={<RedFlagGreenFlag />} />
          <Route path="/:planetSlug/quiz/final-quiz" element={<PrivacyMoonQuiz />} />
          <Route path="/:planetSlug/quiz/final-quiz/game-answers" element={<PrivacyMoonQuizAnswers />} />
          <Route path="/:planetSlug/quiz/drag-drop" element={<DragDropQuiz />} />
          <Route path="/:planetSlug/drag-drop-quiz/game-answers" element={<GameAnswers />} />

          {/* Admin UI */}
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </div>
  );
}

export default App;