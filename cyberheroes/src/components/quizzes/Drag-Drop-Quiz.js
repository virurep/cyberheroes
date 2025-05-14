import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import quizData from "../../data/quizzes/drag_drop_quiz.json";
import Al from "../../img/characters/alejandro.png";

const DragDropQuiz = () => {
    const navigate = useNavigate();
    const { planet } = useParams();
    const location = useLocation();
    const [questionIndex, setQuestionIndex] = useState(location.state?.questionIndex || 0);
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedBox, setSelectedBox] = useState(null);

    // Get the current question data
    const currentQuestion = quizData.quiz[questionIndex];

    useEffect(() => {
        // Reset states when question index changes
        setDraggedItem(null);
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
        const isCorrect = isPrivate === (currentQuestion.correctAnswer === 0);

        setSelectedBox(boxType);
        setDraggedItem(null);

        // Navigate to the answers component instead of showing popup
        navigate(`/privacy-moon/drag-drop-quiz/quiz-answers`, {
            state: {
                isCorrect,
                currentQuestion: {
                    ...currentQuestion,
                    quiz: quizData.quiz // Add the full quiz array for length checking
                },
                questionIndex,
                quizType: 'drag-drop'
            }
        });
    };

    return (
        <div className="privacy-moon-quiz-background">
            <Navbar />
            <TextReader />
            <div className="game-container readable-text">
                <h1 className="drag-drop-quiz-title">Is this Private or Public Information?</h1>

                <div className="drag-drop-question-box"
                    draggable
                    onDragStart={(e) => handleDragStart(e, currentQuestion.question)}
                >
                    <p className="drag-drop-question-text">{currentQuestion.question}</p>
                </div>

                <div className="drag-drop-answer-boxes">
                    <div
                        className="drag-drop-answer-box private"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'private')}
                    >
                        <h2>Private Information</h2>
                    </div>

                    <div
                        className="drag-drop-answer-box public"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'public')}
                    >
                        <h2>Public Information</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DragDropQuiz;