/* Cursor AI was used to smooth out the dragging and dropping functionalities */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import { getQuiz, getQuizSlugsForPart } from '../../content/loader';

const DragDropQuiz = () => {
    const { planetSlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [questionIndex] = useState(location.state?.questionIndex || 0);
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedBox, setSelectedBox] = useState(null);

    // Get the drag-drop quiz data from the content loader
    const part = location.state?.part || 'quiz-1';
    const quizSlugs = getQuizSlugsForPart(planetSlug, part);
    const ddSlug = quizSlugs.find(slug => {
      const q = getQuiz(planetSlug, slug);
      return q && q.type === 'drag-drop';
    });
    const quizData = ddSlug ? getQuiz(planetSlug, ddSlug) : null;
    const currentQuestion = quizData?.questions[questionIndex];

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
        navigate(`/${planetSlug}/drag-drop-quiz/game-answers`, {
                state: {
                isCorrect,
                currentQuestion: {
                    ...currentQuestion,
                    quiz: quizData.questions // Add the full quiz array for length checking
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
                        <h1 className="drag-drop-quiz-title">Click and drag the statement to the correct box</h1>
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