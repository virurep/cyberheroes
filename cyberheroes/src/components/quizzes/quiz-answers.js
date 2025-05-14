import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../util/NavBar';
import TextReader from '../util/TextReader';
import '../../styles/quiz.css';
import '../../styles/quiz-answers.css';
import Al from '../../img/characters/alejandro.png';

const QuizAnswers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCorrect, currentQuestion, questionIndex, quizType } = location.state || {};

    const handleNextQuestion = () => {
        const nextIndex = questionIndex + 1;
        if (nextIndex < currentQuestion.quiz.length) {
            navigate(quizType === 'drag-drop' 
                ? `/privacy-moon/quiz/drag-drop`
                : `/privacy-moon/quiz/redflag-greenflag`, {
                state: {
                    questionIndex: nextIndex
                }
            });
        } else {
            navigate(`/privacy-moon/lesson`, {
                state: {
                    page: currentQuestion.lessonPage
                }
            });
        }
    };

    const handleTryAgain = () => {
        navigate(quizType === 'drag-drop'
            ? `/privacy-moon/quiz/drag-drop`
            : `/privacy-moon/quiz/redflag-greenflag`, {
            state: {
                questionIndex: questionIndex
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
                <div className="drag-drop-feedback-popup">
                    <div className="popup-text-container">
                        <h2>{isCorrect ? "Correct!" : "Wrong"}</h2>
                        <p className={!isCorrect ? "incorrect-message" : ""}>
                            {isCorrect ? currentQuestion.correctMessage : currentQuestion.incorrectMessages}
                        </p>
                        {isCorrect ? (
                            <button className="drag-drop-next-button-answers" onClick={handleNextQuestion}>
                                Next Question
                            </button>
                        ) : (
                            <button className="drag-drop-try-again-button-answers" onClick={handleTryAgain}>
                                Try Again
                            </button>
                        )}
                    </div>
                    <img src={Al} alt="Al" className="popup-Al" />
                </div>
            </div>
        </div>
    );
};

export default QuizAnswers; 