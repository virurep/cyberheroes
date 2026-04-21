import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const PrivacyMoonQuizRoute = () => {
  const { planetSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const quizPart = location.state?.part;

  useEffect(() => {
    if (!quizPart) {
      console.error("No quiz part provided");
      return;
    }

    switch (quizPart) {
      case 'quiz-1':
        navigate(`/${planetSlug}/quiz/drag-drop`);
        break;
      case 'quiz-2':
        navigate(`/${planetSlug}/quiz/redflag-greenflag`);
        break;
      case 'quiz-3':
        navigate(`/${planetSlug}/quiz/final-quiz`);
        break;
      default:
        console.error("Invalid quiz part:", quizPart);
    }
  }, [quizPart, navigate, planetSlug]);

  if (!quizPart) {
    return <div>Error: No quiz part provided</div>;
  }

  return null;
};

export default PrivacyMoonQuizRoute;
