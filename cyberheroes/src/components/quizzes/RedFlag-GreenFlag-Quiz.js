import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import Al from '../../img/characters/al.png';
import redFlag from '../../img/quizzes/redFlag.png'
import greenFlag from '../../img/quizzes/greenFlag.png'
import "../../styles/quiz.css";
import gameData from "../../data/quizzes/redFlag_greenFlag_quiz.json"


const FlagQuiz = () => {
    const navigate = useNavigate();
    const { part } = useParams();
    const location = useLocation();
    const currentQuestionIndex = location.state?.questionIndex || 0;

    // Get the current quiz data based on the part
    const currentQuestion = gameData?.quiz[currentQuestionIndex];

    const handleAnswerClick = (answer) => {
        const isCorrect = answer === currentQuestion.correctAnswer;
        navigate(`/privacy-moon/drag-drop-quiz/game-answers`, {
            state: {
                isCorrect,
                currentQuestion: {
                    ...currentQuestion,
                    quiz: gameData.quiz
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
                    <img src={redFlag} alt="Red Flag" className="flags" onClick={() => handleAnswerClick(0)}/>
                    <img src={greenFlag} alt="Green Flag" className="flags" onClick={() => handleAnswerClick(1)}/>
                </div>
            </div>
        </div>
    );
}

export default FlagQuiz