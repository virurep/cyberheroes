/* Cursor AI was used to help properly navigate to the numerous correct pages */

import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/transitions.css";
import Navbar from '../util/NavBar';
import TextReader from "../util/TextReader";
import Transitions from '../../data/lessons/transitions.json';

const Transition = () => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Get the quiz part from location state
    const quizPart = location.state?.quizPart;

    // Get the correct transition data based on the planet
    const planetName = planet.toLowerCase().replace(/-/g, '_');
    const transitionData = Transitions.planets[planetName];

    if (!transitionData) {
        console.error(`No transition data found for planet: ${planet}`);
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

    // Get the specific quiz transition data
    const currQuiz = transitionData[quizPart];

    if (!currQuiz) {
        console.error(`No transition data found for quiz part: ${quizPart}`);
        return (
            <div className="transition-container">
                <Navbar />
                <TextReader />
                <div className="transition-content">
                    <p>Error: Quiz transition data not found</p>
                </div>
            </div>
        );
    }

    const currMessage = currQuiz.message;
    const characters = currQuiz.character;

    const imageName = characters.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    const handleQuizButtonClick = () => {
        navigate(`/${planet}/quiz`, {
            state: {
                part: quizPart
            }
        });
    };

    const handleLessonButtonClick = () => {
        navigate(`/${planet}/lesson`, {
            state: {
                page: currQuiz.end_page
            }
        });
    };

    const handleReviewButtonClick = () => {
        navigate(`/${planet}/review`, {
            state: {
                quizPart: quizPart
            }
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