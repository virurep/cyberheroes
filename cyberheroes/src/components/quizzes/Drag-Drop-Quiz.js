import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../NavBar";
import TextReader from "../TextReader";
import "../../styles/quiz.css";
import quizData from "../../data/quizzes/drag_drop_quiz.json";
import Al from "../../img/characters/al.png";

const DragDropQuiz = () => {
    const navigate = useNavigate();
    const { planet } = useParams();
    const location = useLocation();
    const [questionIndex, setQuestionIndex] = useState(location.state?.questionIndex || 0);
    const [draggedItem, setDraggedItem] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);

    // Get the current question data
    const currentQuestion = quizData.quiz[questionIndex];

    useEffect(() => {
        // Reset states when question index changes
        setDraggedItem(null);
        setShowFeedback(false);
        setSelectedBox(null);
    }, [questionIndex]);

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, boxType) => {
        e.preventDefault();
        if (!draggedItem) return;

        const isPrivate = boxType === 'private';
        const isCorrectAnswer = isPrivate === (currentQuestion.correctAnswer === 0);

        setSelectedBox(boxType);
        setIsCorrect(isCorrectAnswer);
        setShowFeedback(true);
        setDraggedItem(null);
    };

    const handleNextQuestion = () => {
        const nextIndex = questionIndex + 1;
        if (nextIndex < quizData.quiz.length) {
            setQuestionIndex(nextIndex);
        } else {
            navigate(`/privacy-moon/lesson`, {
                state: {
                    page: currentQuestion.lessonPage
                }
            });
        }
    };

    const handleTryAgain = () => {
        setShowFeedback(false);
        setSelectedBox(null);
        setDraggedItem(null);
    };

    return (
        <div className="privacy-moon-quiz-background">
            <Navbar />
            <TextReader />
            <div className="game-container readable-text">
                {!showFeedback ? (
                    <>
                        <h1 className="drag-drop-quiz-title">Is this Private or Public Information?</h1>

                        <div className="drag-drop-question-box"
                            draggable
                            onDragStart={(e) => handleDragStart(e, currentQuestion.question)}
                        >
                            <p className="drag-drop-question-text">{currentQuestion.question}</p>
                        </div>

                        <div className="drag-drop-answer-boxes">
                            <div
                                className={`drag-drop-answer-box private ${selectedBox === 'private' ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, 'private')}
                            >
                                <h2>Private Information</h2>
                            </div>

                            <div
                                className={`drag-drop-answer-box public ${selectedBox === 'public' ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, 'public')}
                            >
                                <h2>Public Information</h2>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="drag-drop-feedback-popup readable-text">
                        <div className="popup-text-container">
                            <h2>{isCorrect ? "Correct!" : "Wrong"}</h2>
                            <p className={!isCorrect ? "incorrect-message" : ""}>
                                {isCorrect ? currentQuestion.correctMessage : currentQuestion.incorrectMessages}
                            </p>
                            {isCorrect ? (
                                <button className="drag-drop-next-button" onClick={handleNextQuestion}>
                                    Next Question
                                </button>
                            ) : (
                                <button className="drag-drop-try-again-button" onClick={handleTryAgain}>
                                    Try Again
                                </button>
                            )}
                        </div>
                        <img src={Al} alt="Al" className="popup-Al" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DragDropQuiz;