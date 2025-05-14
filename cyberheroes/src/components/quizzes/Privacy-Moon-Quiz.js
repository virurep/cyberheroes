import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import quizData from "../../data/quizzes/privacy_moon_quiz.json"

//shapes included on the answer buttons
import circle from "../../img/quizzes/shapes/circle.png";
import diamond from "../../img/quizzes/shapes/diamond.png";
import square from "../../img/quizzes/shapes/square.png";
import triangle from "../../img/quizzes/shapes/triangle.png";

const Quiz = () => {
    const navigate = useNavigate();
    // const { part } = useParams();
    const location = useLocation();
    console.log("location: ", location);
    const currentQuestionIndex = location.state?.questionIndex || 0;

    // Get the current quiz data based on the part
    const currentQuiz = quizData.quizzes.find(quiz => quiz.part === "quiz-1");
    const currentQuestion = currentQuiz?.quiz[currentQuestionIndex];

    //for multiple choice
    const handleAnswerClick = (answer) => {
        navigate(`/privacy-moon/quiz/final-quiz/game-answers`, {
            state: {
                selectedAnswer: answer,
                currentQuestion: currentQuestion,
                questionIndex: currentQuestionIndex,
                part: location.state?.part,
                currentQuiz: currentQuiz
            }
        });
    };

    //multiple choice
    return (
        <div className="privacy-moon-quiz-background">
            <Navbar />
            <TextReader />
            <div className="quiz-container readable-text">
                <div className="quiz-question dark-question">
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
};

export default Quiz;