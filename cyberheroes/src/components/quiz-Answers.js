import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import '../styles/quiz.css';
import Allie from '../img/characters/allie.png';
import Enemy from '../img/characters/enemy.png';

const QuizAnswers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedAnswer, currentQuestion, questionIndex, part } = location.state || {};

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

    // Check if the selected answer is correct
    const isCorrect = Array.isArray(selectedAnswer) 
        ? selectedAnswer.length === currentQuestion.correctAnswers.length && 
          currentQuestion.correctAnswers.every(correctIndex => 
            selectedAnswer.includes(currentQuestion.answers[correctIndex]))
        : currentQuestion.correctAnswers.includes(currentQuestion.answers.indexOf(selectedAnswer));

    const handleNextQuestion = () => {
        navigate(`/quiz`, {
            state: {
                questionIndex: questionIndex + 1
            }
        });
    };

    //correct answer
    if(isCorrect){
        return (
            <div className="quiz-background">
                <Navbar />
                <div className="answers-container">
                    <div className="characters-answers-container">
                        <img src={Enemy} alt={"Enemy"} className="characters-answers-img" />
                    </div>
                    <div className="text-answers-container">
                        <h1 className="text-answers-title">
                            {currentQuestion.correctMessage[0]}
                        </h1>
                        <p className="text-answers-text">
                            {currentQuestion.correctMessage[1]}
                        </p>
                        <button className="quiz-next-btn" onClick={handleNextQuestion}>
                            Next Question
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        //incorrect answer
        return (
            <div className="quiz-background">
                <Navbar />
                <div className="answers-container">
                    <div className="characters-answers-container">
                        <img src={Allie} alt={"Allie"} className="characters-answers-img" />
                    </div>
                    <div className="text-answers-container">
                        <h1 className="text-answers-title">
                            {"Incorrect Answer"}
                        </h1>
                        <p className="text-answers-text">
                            {Array.isArray(selectedAnswer) 
                                ? currentQuestion.incorrectMessages[0]
                                : currentQuestion.incorrectMessages[currentQuestion.answers.indexOf(selectedAnswer)]}
                        </p>
                        <p className="text-answers-text answer-hint">
                            {currentQuestion.hint}
                        </p>
                        <button className="quiz-try-again-btn" onClick={() => navigate(`/quiz`, { state: { questionIndex } })}>
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default QuizAnswers;