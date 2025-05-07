import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../NavBar";
import TextReader from "../TextReader";
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
    const [selectedAnswer, setSelectedAnswers] = React.useState([]);

    // Get the current quiz data based on the part
    const currentQuestion = gameData?.quiz[currentQuestionIndex];

    const handleAnswerClick = (answer) => {
        setSelectedAnswers(answer);
        // Show popup
        document.querySelector(".answer-popup-container").classList.remove("hidden");
    };

    const handleNextClick = () => {
        // Hide popup
        document.querySelector(".answer-popup-container").classList.add("hidden");
        // Move to next question
        // navigate(`/privacy-moon/quiz/redflag-greenflag`, {
        //     state: { questionIndex: currentQuestionIndex + 1 }
        // });
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < gameData.quiz.length) {
            navigate(`/privacy-moon/quiz/redflag-greenflag`, {
                state: { questionIndex: nextIndex }
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
        // Hide popup
        document.querySelector(".answer-popup-container").classList.add("hidden");
    };

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

    return (
       <div className="privacy-moon-quiz-background">
            <Navbar />
            <TextReader />
            <div className="game-container">
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
                    <img src={redFlag} alt={"Green Flag"} className="flags" onClick={() => handleAnswerClick(0)}/>
                    <img src={greenFlag} alt={"Red Flag"} className="flags" onClick={() => handleAnswerClick(1)}/>
                </div>

            </div>

            <div className="answer-popup-container hidden">
                <div className="popup-text-container">
                    <div>
                        <h1>{selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}</h1>
                        <p>{selectedAnswer === currentQuestion.correctAnswer
                            ? currentQuestion.correctMessage
                            : currentQuestion.incorrectMessages}</p>
                    </div>

                    {selectedAnswer === currentQuestion.correctAnswer ? (
                        <button className="quiz-next-btn" onClick={handleNextClick}>
                            Next
                        </button>
                    ) : (
                        <button className="quiz-try-again-btn" onClick={handleTryAgain}>
                            Try Again
                        </button>
                    )}
                </div>
                <img src={Al} alt={"Al"} className="popup-Al"/>
            </div>


       </div>

    )
}

export default FlagQuiz