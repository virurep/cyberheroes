import React from "react";
import "../styles/transitions.css";
import Navbar from './NavBar';
import Transitions from '../data/transitions.json';

const Transition = () => {
    const characterImages = require.context('../img/characters', false, /\.(png|jpe?g|svg)$/);

    const transitionData = Transitions.privacy_planet;
    console.log(transitionData);

    const currQuiz = transitionData['quiz-3'];
    console.log(currQuiz);

    const currMessage = currQuiz.message;

    const characters = currQuiz.character;
    console.log(characters);

    const imageName = characters.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

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
                            <button className='quiz-button'>TAKE THE QUIZ</button>
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
