import React from "react";
import "../styles/transitions.css";
import Navbar from './NavBar';
import allieImage from '../img/characters/allie.png'; // Make sure this path is correct

const Transition = () => {
    return (
        <div className="transition-container">
            <Navbar />
            <div className="transition-content">
                <div className="transition-layout">
                    <div className="message-side">
                        <div className="message-box">
                            <p className="transition-message">
                                Use what you learned to Defeat Enemy 1 and Help me get back my information!!!
                            </p>
                            <button className='quiz-button'>TAKE THE QUIZ</button>
                        </div>
                    </div>
                    <div className="character-side">
                        <img 
                            src={allieImage}
                            alt="Allie"
                            className="character-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transition;
