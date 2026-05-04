import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/transitions.css";
import Navbar from '../util/NavBar';
import TextReader from "../util/TextReader";
import { lessonData } from '../../data/planets';

const Transition = () => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const quizPart = location.state?.quizPart;

    const planetData = lessonData[planet];
    const transitionData = planetData?.quiz_transitions?.[quizPart];

    if (!transitionData) {
        return (
            <div className="transition-container">
                <Navbar />
                <TextReader />
                <div className="transition-content">
                    <p>Error: Transition data not found</p>
                </div>
            </div>
        );
    }

    const currMessage = transitionData.message;
    const characters = transitionData.character;

    const imageName = characters.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    const pages = planetData?.pages ?? [];
    const triggerIndex = pages.findIndex(p => p.message?.to === quizPart);
    const resumeIndex = triggerIndex >= 0 ? triggerIndex + 1 : 0;

    const handleQuizButtonClick = () => {
        navigate(`/${planet}/quiz`, {
            state: { part: quizPart, resumeIndex }
        });
    };

    const handleLessonButtonClick = () => {
        navigate(`/${planet}/lesson`, {
            state: { page: resumeIndex }
        });
    };

    const handleReviewButtonClick = () => {
        navigate(`/${planet}/review`, {
            state: { quizPart: quizPart }
        });
    };

    return (
        <div className={`transition-container ${planet}-background`}>
            <Navbar />
            <TextReader />
            <div className="transition-content readable-text">
                <div className="transition-layout">
                    <div className="message-side-transition">
                        <div className="transition-message-box">
                            <p className="transition-message">
                                {currMessage}
                            </p>
                            <div className="button-container-transition">
                                <button className='quiz-button' onClick={handleQuizButtonClick}>TAKE THE QUIZ</button>
                                <button className='quiz-button' onClick={handleLessonButtonClick}>GO BACK TO LESSON</button>
                                <button className='review-button' onClick={handleReviewButtonClick}>GO BACK TO REVIEW</button>
                            </div>
                        </div>
                    </div>
                    <div className="character-side-transition">
                        <img
                            src={imagePath}
                            alt={characters}
                            className="character-image-transition"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transition;
