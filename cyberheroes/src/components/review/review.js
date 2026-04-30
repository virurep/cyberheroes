/* Cursor AI was used to validate the state that is passed in */

import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../styles/review.css';
import { lessonData } from '../../data/planets';
import ReviewMenu from './ReviewMenu';
import ReviewLesson from './ReviewLesson';

const Review = () => {
    const { planet } = useParams();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState(null);

    const quizPart = location.state?.quizPart;

    const planetReview = lessonData[planet]?.review;
    const currentQuiz = planetReview?.[quizPart];

    if (!currentQuiz) {
        return (
            <div className={`review-container ${planet}-background`}>
                <p>Error: Review data not found</p>
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
