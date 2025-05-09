import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../styles/review.css';
import reviewData from '../../data/lessons/review.json';
import ReviewMenu from './ReviewMenu';
import ReviewLesson from './ReviewLesson';

const Review = () => {
    const { planet } = useParams();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState(null);

    // Get the quiz part from location state
    const quizPart = location.state?.quizPart;

    // Get the correct review data based on the planet
    const planetName = planet.toLowerCase().replace(/-/g, '_');
    const planetData = reviewData[planetName];

    if (!planetData) {
        return (
            <div className={`review-container ${planet}-background`}>
                <p>Error: Review data not found for this planet</p>
            </div>
        );
    }

    // If we have a specific quiz part, only show that quiz's options
    const currentQuiz = quizPart ? planetData[quizPart] : null;

    if (!currentQuiz) {
        return (
            <div className={`review-container ${planet}-background`}>
                <p>Error: Quiz review data not found</p>
            </div>
        );
    }

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleCloseLesson = () => {
        setSelectedOption(null);
    };

    if (selectedOption) {
        return (
            <ReviewLesson 
                selectedOption={selectedOption}
                onClose={handleCloseLesson}
            />
        );
    }

    return (
        <ReviewMenu 
            onOptionSelect={handleOptionSelect}
            character={currentQuiz.character}
            options={currentQuiz.options}
        />
    );
};

export default Review;
