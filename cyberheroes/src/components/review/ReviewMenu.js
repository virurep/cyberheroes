import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/review.css';
import Navbar from '../NavBar';

const ReviewMenu = ({ onOptionSelect, character, options }) => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Get the quiz part from location state
    const quizPart = location.state?.quizPart;

    const handleBackClick = () => {
        navigate(`/${planet}/transition`, {
            state: {
                quizPart: quizPart
            }
        });
    };

    // Get character image
    const imageName = character.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

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
                                    {options.map((option) => (
                                        <button
                                            key={option.id}
                                            className="option-button-review"
                                            onClick={() => onOptionSelect(option)}
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

export default ReviewMenu; 