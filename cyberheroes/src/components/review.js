import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/review.css';
import Navbar from './NavBar';
import reviewData from '../data/lessons/review.json';

const Review = () => {
    const characterImages = require.context('../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Get the quiz part from location state
    const quizPart = location.state?.quizPart;

    // Get the correct review data based on the planet
    const planetName = planet.toLowerCase().replace(/-/g, '_');
    const planetData = reviewData[planetName];

    if (!planetData) {
        return (
            <div className={`review-container ${planet}-background`}>
                <Navbar />
                <div className="review-content">
                    <p>Error: Review data not found for this planet</p>
                </div>
            </div>
        );
    }

    // If we have a specific quiz part, only show that quiz's options
    const currentQuiz = quizPart ? planetData[quizPart] : null;

    if (!currentQuiz) {
        return (
            <div className={`review-container ${planet}-background`}>
                <Navbar />
                <div className="review-content">
                    <p>Error: Quiz review data not found</p>
                </div>
            </div>
        );
    }

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setCurrentPage(0);
    };

    const handleBackClick = () => {
        navigate(`/${planet}/transition`, {
            state: {
                quizPart: quizPart
            }
        });
    };

    const handleCloseComputer = () => {
        setSelectedOption(null);
        setCurrentPage(0);
    };

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => prev - 1);
    };

    // Get character image
    const character = currentQuiz.character;
    const imageName = character.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    if (selectedOption) {
        const totalPages = selectedOption.review_lesson.length;
        const currentLesson = selectedOption.review_lesson[currentPage];

        return (
            <div className="computer-screen-review">
                <div className="computer-content-review">
                    <div className="computer-screen-content-review">
                        <h2 className="computer-title-review">{selectedOption.title}</h2>
                        <div className="computer-message-review">
                            <p>{currentLesson.message}</p>
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
                                    onClick={handleCloseComputer}
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
        );
    }

    return (
        <div className={`review-container ${planet}-background`}>
            <Navbar />
            <div className="review-content">
                <div className="review-layout">
                    <div className="character-side-review">
                        <img 
                            src={imagePath}
                            alt={character}
                            className="character-image-review"
                        />
                    </div>
                    <div className="review-main-review">
                        <div className="review-box-review">
                            <div className="review-content-scroll-review">
                                <h1 className="review-title-review">What Do You Want to Review?</h1>
                                
                                {/* Options Display */}
                                <div className="options-container-review">
                                    {currentQuiz.options.map((option) => (
                                        <button
                                            key={option.id}
                                            className={`option-button-review ${selectedOption?.id === option.id ? 'selected' : ''}`}
                                            onClick={() => handleOptionSelect(option)}
                                        >
                                            {option.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Back Link */}
                            <span 
                                className="back-link-review"
                                onClick={handleBackClick}
                            >
                                Back to Quiz
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;
