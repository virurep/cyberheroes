import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import { getQuiz, getQuizSlugsForPart } from '../../content/loader';

//shapes included on the answer buttons
import circle from "../../img/quizzes/shapes/circle.png";
import diamond from "../../img/quizzes/shapes/diamond.png";
import square from "../../img/quizzes/shapes/square.png";
import triangle from "../../img/quizzes/shapes/triangle.png";

const Quiz = () => {
    const { planetSlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentQuestionIndex = location.state?.questionIndex || 0;

    // Get the current quiz data based on the part from the content loader
    const part = location.state?.part || 'quiz-1';
    const quizSlugs = getQuizSlugsForPart(planetSlug, part);
    const mcSlug = quizSlugs.find(slug => {
      const q = getQuiz(planetSlug, slug);
      return q && q.type === 'multiple-choice';
    });
    const quizDataLoaded = mcSlug ? getQuiz(planetSlug, mcSlug) : null;
    const currentQuiz = quizDataLoaded ? { ...quizDataLoaded, quiz: quizDataLoaded.questions } : null;
    const currentQuestion = currentQuiz?.quiz[currentQuestionIndex];

    //for multiple choice
    const handleAnswerClick = (answer) => {
        navigate(`/${planetSlug}/quiz/final-quiz/game-answers`, {
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