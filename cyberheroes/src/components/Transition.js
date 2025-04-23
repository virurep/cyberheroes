import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/transitions.css";
import Navbar from './NavBar';
import Transitions from '../data/transitions.json';

const Transition = () => {
    const characterImages = require.context('../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Get the quiz part from location state
    const quizPart = location.state?.quizPart;
    console.log("Quiz part:", quizPart);

    // Get the correct transition data based on the planet
    const planetName = planet.toLowerCase().replace(/-/g, '_');
    const transitionData = Transitions[planetName];
    
    if (!transitionData) {
        console.error(`No transition data found for planet: ${planet}`);
        return (
            <div className="transition-container">
                <Navbar />
                <div className="transition-content">
                    <p>Error: Transition data not found</p>
                </div>
            </div>
        );
    }

    // Get the specific quiz transition data
    const currQuiz = transitionData[quizPart];
    console.log("Current quiz data:", currQuiz);

    if (!currQuiz) {
        console.error(`No transition data found for quiz part: ${quizPart}`);
        return (
            <div className="transition-container">
                <Navbar />
                <div className="transition-content">
                    <p>Error: Quiz transition data not found</p>
                </div>
            </div>
        );
    }

    const currMessage = currQuiz.message;
    const characters = currQuiz.character;
    console.log("Characters:", characters);

    const imageName = characters.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    const handleQuizButtonClick = () => {
        // Handle different quiz types based on planet and quiz part
        if (planet === 'privacy-planet') {
            navigate(`/${planet}/quiz`, {
                state: {
                    part: quizPart
                }
            });
        } else if (planet === 'privacy-moon' && quizPart === 'redflag-greenflag') {
            navigate(`/${planet}/quiz/redflag-greenflag`);
        } else {
            console.error(`No quiz route found for planet: ${planet}, quiz part: ${quizPart}`);
            // Fallback to a default route or show an error
            navigate(`/${planet}/quiz`);
        }
    };

    return (
        <div className="transition-container">
            <Navbar />
            <div className="transition-content">
                <div className="transition-layout">
                    <div className="message-side">
                        <div className="message-box">
                            <p className="transition-message">
                                {currMessage}
                            </p>
                            <button className='quiz-button' onClick={handleQuizButtonClick}>TAKE THE QUIZ</button>
                        </div>
                    </div>
                    <div className="character-side">
                        <img 
                            src={imagePath}
                            alt= {characters}
                            className="character-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transition;
