import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import Al from '../../img/characters/al.png';
import redFlag from '../../img/quizzes/redFlag.png'
import greenFlag from '../../img/quizzes/greenFlag.png'
import "../../styles/quiz.css";
import { getQuiz, getQuizSlugsForPart } from '../../content/loader';


const FlagQuiz = () => {
    const { planetSlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentQuestionIndex = location.state?.questionIndex || 0;

    // Get the red-flag-green-flag quiz data from the content loader
    const part = location.state?.part || 'quiz-1';
    const quizSlugs = getQuizSlugsForPart(planetSlug, part);
    const rfgfSlug = quizSlugs.find(slug => {
      const q = getQuiz(planetSlug, slug);
      return q && q.type === 'red-flag-green-flag';
    });
    const gameData = rfgfSlug ? getQuiz(planetSlug, rfgfSlug) : null;
    const currentQuestion = gameData?.questions[currentQuestionIndex];

    const handleAnswerClick = (answer) => {
        const isCorrect = answer === currentQuestion.correctAnswer;
        navigate(`/${planetSlug}/drag-drop-quiz/game-answers`, {
                state: {
                isCorrect,
                currentQuestion: {
                    ...currentQuestion,
                    quiz: gameData.questions
                },
                questionIndex: currentQuestionIndex,
                quizType: 'redflag-greenflag'
                }
            });
    };

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

    return (
       <div className="privacy-moon-quiz-background">
            <Navbar />
            <TextReader />
            <div className="game-container readable-text">
                <h1>
                    Click whether the statement is a green flag or red flag.
                </h1>
                <h2>
                    Green flags are safe and respectful, while red flags are unsafe and disrespectful.
                </h2>
                <div className="quiz-question">
                        <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                </div>
                <div className="flag-container">
                    <img
                        src={redFlag}
                        alt="Red Flag"
                        className="flags"
                        onClick={() => handleAnswerClick(0)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAnswerClick(0); }}
                    />
                    <img
                        src={greenFlag}
                        alt="Green Flag"
                        className="flags"
                        onClick={() => handleAnswerClick(1)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAnswerClick(1); }}
                    />
                </div>
            </div>
                    </div>
    );
}

export default FlagQuiz