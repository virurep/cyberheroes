import ExplorationMap from "./components/ExplorationMap";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';
import LessonIntroPage from './components/LessonIntro';
import LessonPage from './components/Lesson'
import Quiz from './components/quiz';
import QuizAnswers from './components/quiz-Answers';

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
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-answers" element={<QuizAnswers />} />
          </Routes>
        </div>

  );
}

export default App;
