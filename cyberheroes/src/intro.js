import React from "react";
import "./style.css";
import logo from "./img/logo.png";
import rocket from "./img/rocket.png";
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
                    Hi I'm Cyber Hero. I fly around space and protect those in need from online threats.
                    Let us checkout some new planets and see if anyone needs help.

                    </h1>
                    <button className="red-button" onClick={goToMap}>
                        Open Exploration Map
                    </button>
                </div>
                <div>
                    <img id="rocket-flying" src={rocket} alt="Rocket Flying" />
                </div>
            </main>
        </div>
    );
};

export default IntroPage;
