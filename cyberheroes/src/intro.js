import React from "react";
import "./style.css";
import logo from "./img/logo.png";
import hero from "./img/hero.png";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
    const navigate = useNavigate();

    const goToMap = () => {
        // TODO: Implement navigation to the game
        
    };

    return (
        <div className="intro-container">
            <header>
                <h1 className="logo">
                    <span className="icon">
                        <img src={logo} alt="CyberHeroes logo" />
                    </span>
                    CyberHeroes
                </h1>
            </header>
            <main>
                <div>
                    <h1 className="intro-text">
                        Your adventure has begun!
                    </h1>
                    <button className="red-button" onClick={goToMap}>
                        Open Exploration Map
                    </button>
                </div>
            </main>
        </div>
    );
};

export default IntroPage;
