import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../NavBar';
import '../../styles/quiz.css';
import Allie from '../../img/characters/allie.png';
import Enemy from '../../img/characters/enemy.png';
import DeadEnemy from '../../img/characters/privacy-enemy-dead.png';
import TextReader from '../TextReader';

const QuizAnswers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedAnswer, currentQuestion, questionIndex, part, currentQuiz } = location.state || {};


    // Check if the selected answer is correct
    const isCorrect = Array.isArray(selectedAnswer)
        ? selectedAnswer.length === currentQuestion.correctAnswers.length &&
          currentQuestion.correctAnswers.every(correctIndex =>
            selectedAnswer.includes(currentQuestion.answers[correctIndex]))
        : currentQuestion.correctAnswers.includes(currentQuestion.answers.indexOf(selectedAnswer));

    const handleNextQuestion = () => {
        if (currentQuiz.quiz.length === questionIndex + 1) {
            // If this is the last question of quiz-3, go to certificate
            if (part === 'quiz-3') {
                navigate(`/privacy-planet/certificate`);
            } else {
                // For quizzes parts 1 and 2, go back to lesson
                console.log("last question, nav to lesson page #", currentQuestion.lessonPage);
                navigate(`/privacy-planet/lesson`, {
                    state: {
                        page: currentQuestion.lessonPage
                    }
                });
            }
        } else {
            navigate(`/privacy-planet/quiz`, {
                state: {
                    questionIndex: questionIndex + 1,
                    part: part
                }
            });
        }
    };

    //correct answer
    if (isCorrect) {
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="answers-container">
                    <div className="characters-answers-container">
                        <p className="health-bar-label">Health Bar</p>
                        <div className="privacy-planet-health-bar">
                            <progress className="privacy-planet-health-bar-progress" value={currentQuestion.healthBar} max="1"></progress>
                        </div>
                        <img 
                            src={currentQuestion.healthBar != 0 ? Enemy : DeadEnemy}    
                            alt={currentQuestion.healthBar != 0 ? "Enemy" : "Dead Enemy"} 
                            className="characters-answers-img" />
                    </div>
                    <div className="text-answers-container">
                        <h1 className="text-answers-title">
                            {currentQuestion.correctMessage[0]}
                        </h1>
                        <p className="text-answers-text">
                            {currentQuestion.correctMessage[1]}
                        </p>
                        <button className="quiz-next-btn" onClick={handleNextQuestion}>
                            {currentQuestion.healthBar == 0
                                ? "Return to Lesson"
                                : "Next Question"}
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        //incorrect answer
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
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
                        <button className="quiz-try-again-btn" onClick={() => navigate(`/privacy-planet/quiz`, { state: { questionIndex, part: part } })}>
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default QuizAnswers;