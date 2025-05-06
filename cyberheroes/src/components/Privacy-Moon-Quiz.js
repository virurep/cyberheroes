import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import "../styles/quiz.css";
import circle from "../img/shapes/circle.png";
import diamond from "../img/shapes/diamond.png";
import square from "../img/shapes/square.png";
import triangle from "../img/shapes/triangle.png";
import quizData from "../data/privacy_moon_quiz.json"

const Quiz = () => {
    const navigate = useNavigate();
    // const { part } = useParams();
    const location = useLocation();
    console.log("location: ", location);
    const currentQuestionIndex = location.state?.questionIndex || 0;

    // Get the current quiz data based on the part
    //must change this quiz.part === quiz-1, quiz-2, quiz3 manually for now to see the different quizzes
    const currentQuiz = quizData.quizzes.find(quiz => quiz.part === "quiz-1");
    const currentQuestion = currentQuiz?.quiz[currentQuestionIndex];
   //const currentQuestion = currentQuiz?.quiz[0];

    //for multiple choice
    const handleAnswerClick = (answer) => {
        navigate(`/privacy-moon/quiz/final-quiz/quiz-answers`, {
            state: {
                selectedAnswer: answer,
                currentQuestion: currentQuestion,
                questionIndex: currentQuestionIndex,
                part: location.state?.part,
                currentQuiz: currentQuiz
            }
        });
    };

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

    //multiple choice
    return (
        <div className="privacy-moon-quiz-background">
             <Navbar />
            <div className="quiz-container">
                <div className="quiz-question dark-question">
                    <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                </div>
                <div className="quiz-answers-container">
                    <button className="quiz-answer-btn answer-btn-1" onClick={() => handleAnswerClick(currentQuestion.answers[0])}>
                        <img src={diamond} alt="diamond" className="quiz-answer-shape" />
                        {currentQuestion.answers[0]}
                    </button>
                    <button className="quiz-answer-btn answer-btn-2" onClick={() => handleAnswerClick(currentQuestion.answers[1])}>
                        <img src={circle} alt="circle" className="quiz-answer-shape" />
                        {currentQuestion.answers[1]}
                    </button>
                    <button className="quiz-answer-btn answer-btn-3" onClick={() => handleAnswerClick(currentQuestion.answers[2])}>
                        <img src={triangle} alt="triangle" className="quiz-answer-shape" />
                        {currentQuestion.answers[2]}
                    </button>
                    <button className="quiz-answer-btn answer-btn-4" onClick={() => handleAnswerClick(currentQuestion.answers[3])}>
                        <img src={square} alt="square" className="quiz-answer-shape" />
                        {currentQuestion.answers[3]}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;