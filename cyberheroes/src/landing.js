import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import logo from "./img/logo.png";
import hero from "./img/hero.png";

const LandingPage = () => {
    const navigate = useNavigate();

    const startAdventure = () => {
        navigate('/intro');
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
                        <h1 className="tagline">
                        A fun way to learn about proper cybersecurity practices!
                        </h1>
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
