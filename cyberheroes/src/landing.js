import React from "react";
import "./landing.css";
import logo from "./img/logo.png";
import hero from "./img/hero.png";

const LandingPage = () => {
    const startAdventure = () => {
        // TODO: Implement navigation to the game
        
    };

    return (
        <div className="landing-container">
            <header>
                <h1 className="logo">
                    <span className="icon">
                        <img src={logo} alt="CyberHeroes logo" />
                    </span>
                    CyberHeroes
                </h1>
            </header>
            <main>
                <div className="hero">
                    <img src={hero} alt="CyberHeroes Mascot" />
                    <div className="hero-content">
                        <p className="tagline">
                        A fun way to learn about proper cybersecurity practices!
                        </p>
                        <button className="start-button" onClick={startAdventure}>
                            START YOUR ADVENTURE
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
