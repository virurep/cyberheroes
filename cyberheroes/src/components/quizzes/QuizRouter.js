/**
 * QuizRouter — Dispatches to the correct quiz component based on the
 * planet's quiz type (read from the content loader).
 *
 * Uses getQuizSlugsForPart to find quiz slugs for the current part,
 * then dispatches based on the quiz type field in the quiz data.
 *
 * For planets with multiple quiz types in a single part (e.g., privacy-moon's
 * quiz-1 has both multiple-choice and red-flag-green-flag), it routes to
 * PrivacyMoonQuizRoute which handles sub-quiz sequencing.
 */
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getQuiz, getQuizSlugsForPart } from '../../content/loader';
import PrivacyPlanetQuiz from './Privacy-Planet-Quiz';
import PrivacyMoonQuizRoute from './Privacy-Moon-Quiz-Route';

const QuizRouter = () => {
  const { planetSlug } = useParams();
  const location = useLocation();
  const part = location.state?.part;

  if (!part) {
    return <div>Error: No quiz part provided for planet: {planetSlug}</div>;
  }

  const quizSlugs = getQuizSlugsForPart(planetSlug, part);

  if (!quizSlugs || quizSlugs.length === 0) {
    return <div>Quiz not found for planet: {planetSlug}, part: {part}</div>;
  }

  // Determine the quiz types available for this part
  const quizTypes = quizSlugs.map(slug => {
    const q = getQuiz(planetSlug, slug);
    return q?.type;
  }).filter(Boolean);

  // If there are multiple quiz types in this part, use the sub-quiz router
  if (quizTypes.length > 1) {
    return <PrivacyMoonQuizRoute />;
  }

  // Single quiz type — dispatch based on type
  const quizType = quizTypes[0];

  switch (quizType) {
    case 'multiple-choice':
      return <PrivacyPlanetQuiz />;
    default:
      return <div>Unknown quiz type: {quizType} for planet: {planetSlug}</div>;
  }
};

export default QuizRouter;
