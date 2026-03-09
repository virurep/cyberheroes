/* Cursor AI was used to keep the many states of the quiz tp be correct and consistent*/

import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import quizData from "../../data/quizzes/privacy_planet_quiz.json"

//shapes included on the answer buttons
import circle from "../../img/quizzes/shapes/circle.png";
import diamond from "../../img/quizzes/shapes/diamond.png";
import square from "../../img/quizzes/shapes/square.png";
import triangle from "../../img/quizzes/shapes/triangle.png";
import checkedSquare from "../../img/quizzes/shapes/checked-square.png";

const Quiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentQuestionIndex = location.state?.questionIndex || 0;
    const [selectedAnswers, setSelectedAnswers] = React.useState([]);

    // Get the current quiz data based on the part
    const currentQuiz = quizData.quizzes.find(quiz => quiz.part === location.state?.part);
    const currentQuestion = currentQuiz?.quiz[currentQuestionIndex];

    //for multiple choice and true false questions
    const handleAnswerClick = (answer) => {
        navigate(`/privacy-planet/quiz/game-answers`, {
            state: {
                selectedAnswer: answer,
                currentQuestion: currentQuestion,
                questionIndex: currentQuestionIndex,
                part: location.state?.part,
                currentQuiz: currentQuiz
            }
        });
    };

    //for multiple select questions
    const handleMultipleAnswerClick = (answer) => {
        setSelectedAnswers(prev => {
            if (prev.includes(answer)) {
                // If answer is already selected, remove it
                return prev.filter(a => a !== answer);
            } else {
                // If answer is not selected, add it
                return [...prev, answer];
            }
        });
    };

    const handleSubmitClick = () => {
        navigate(`/privacy-planet/quiz/game-answers`, {
            state: {
                selectedAnswer: selectedAnswers,
                currentQuestion: currentQuestion,
                questionIndex: currentQuestionIndex,
                part: location.state?.part,
                currentQuiz: currentQuiz
            }
        });
    };

    //multiple choice
    if(currentQuestion.type === "multiple-choice"){
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="quiz-container readable-text">
                    <div className="quiz-question">
                        <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                    </div>
                    <div className="quiz-answers-container">
                        <button className="quiz-answer-btn answer-btn-1" onClick={() => handleAnswerClick(currentQuestion.answers[0])}>
                            <img src={diamond} alt="diamond" className="quiz-answer-shape" />
                            <p> {currentQuestion.answers[0]} </p>
                        </button>
                        <button className="quiz-answer-btn answer-btn-2" onClick={() => handleAnswerClick(currentQuestion.answers[1])}>
                            <img src={circle} alt="circle" className="quiz-answer-shape" />
                            <p> {currentQuestion.answers[1]} </p>
                        </button>
                        <button className="quiz-answer-btn answer-btn-3" onClick={() => handleAnswerClick(currentQuestion.answers[2])}>
                            <img src={triangle} alt="triangle" className="quiz-answer-shape" />
                            <p> {currentQuestion.answers[2]} </p>
                        </button>
                        <button className="quiz-answer-btn answer-btn-4" onClick={() => handleAnswerClick(currentQuestion.answers[3])}>
                            <img src={square} alt="square" className="quiz-answer-shape" />
                            <p> {currentQuestion.answers[3]} </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (currentQuestion.type === "multiple-select"){
        //multiple select
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="quiz-container readable-text">
                    <div className="quiz-question">
                        <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                    </div>
                    <div className="quiz-answers-container multiple-select-answer-container">
                        {currentQuestion.answers.map((answer, index) => (
                            <button
                                key={index}
                                className={`quiz-answer-btn answer-btn-${index + 1}`}
                                onClick={() => handleMultipleAnswerClick(answer)}
                            >
                                <img
                                    src={selectedAnswers.includes(answer) ? checkedSquare : square}
                                    alt="check box"
                                    className="quiz-answer-shape"
                                />
                                <p>{answer}</p>
                            </button>
                        ))}
                    </div>
                    <button
                        className="quiz-submit-btn"
                        onClick={handleSubmitClick}
                        disabled={selectedAnswers.length === 0}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    } else {
        //true or false
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="quiz-container readable-text">
                    <div className="quiz-question">
                        <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                    </div>
                    <div className="quiz-answers-container">
                        <button className="quiz-answer-btn answer-btn-1" onClick={() => handleAnswerClick(currentQuestion.answers[0])}>
                            <img src={diamond} alt="diamond" className="quiz-answer-shape" />
                            <p> {currentQuestion.answers[0]} </p>
                        </button>
                        <button className="quiz-answer-btn answer-btn-2" onClick={() => handleAnswerClick(currentQuestion.answers[1])}>
                            <img src={circle} alt="circle" className="quiz-answer-shape" />
                            <p> {currentQuestion.answers[1]} </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Quiz;