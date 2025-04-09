import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import logo from "../img/general/logo.png";
import hero from "../img/characters/hero.png";
import Navbar from './NavBar';


const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Add landing-page class to body when component mounts
        document.body.classList.add('landing-page');
        
        // Cleanup function to remove the class when component unmounts
        return () => {
            document.body.classList.remove('landing-page');
        };
    }, []);

    const startAdventure = () => {
        navigate('/intro');
    };

    return (
        <div>
            <Navbar />
            <div className="landing-container">
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
        </div>
    );
};

export default LandingPage;
