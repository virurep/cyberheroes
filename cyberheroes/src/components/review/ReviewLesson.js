import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/review.css';
import Navbar from '../NavBar';
import TextReader from '../TextReader';
import { processText } from '../Message';

const ReviewLesson = ({ selectedOption, onClose }) => {
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedVocab, setSelectedVocab] = useState(null);

    const handleBackClick = () => {
        navigate(`/${planet}/transition`, {
            state: {
                quizPart: location.state?.quizPart
            }
        });
    };

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => prev - 1);
    };

    const handleVocabClick = (vocab) => {
        setSelectedVocab(vocab);
    };

    const totalPages = selectedOption.review_lesson.length;
    const currentLesson = selectedOption.review_lesson[currentPage];

    return (
        <div className={`review-container ${planet}-background`}>
            <Navbar />
            <TextReader />
            <div className="computer-screen-review readable-text">
                <div className="computer-content-review">
                    <div className="computer-screen-content-review">
                        <h2 className="computer-title-review">{currentLesson.title}</h2>
                        <div className="computer-message-review">
                            {processText(currentLesson.message, handleVocabClick)}
                        </div>
                        
                        {currentPage < totalPages - 1 ? (
                            <button 
                                className="next-button-review"
                                onClick={handleNextPage}
                            />
                        ) : (
                            <div className="computer-buttons-review">
                                <button 
                                    className="keep-reviewing-button-review"
                                    onClick={onClose}
                                >
                                    Keep Reviewing
                                </button>
                                <button 
                                    className="take-quiz-button-review"
                                    onClick={handleBackClick}
                                >
                                    Take The Quiz
                                </button>
                            </div>
                        )}
                        
                        {currentPage > 0 && (
                            <button 
                                className="prev-button-review"
                                onClick={handlePrevPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewLesson; 