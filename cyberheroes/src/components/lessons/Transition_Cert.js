import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/transitions.css";
import Navbar from '../util/NavBar';
import TextReader from "../util/TextReader";
import TransitionCertsData from '../../data/lessons/transition_cert.json';

const TransitionCerts = () => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const navigate = useNavigate();

    // Get the correct transition data based on the planet
    const planetName = planet.toLowerCase().replace(/-/g, '_');
    const transitionData = TransitionCertsData.planets[planetName];
    console.log("Transition data:", transitionData);

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

    const currMessage = transitionData.message;
    const characters = transitionData.character;
    console.log("Characters:", characters);

    const imageName = characters.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    const handleCertificate = () => {
        navigate(`/${planet}/certificate`);
    };

    return (
        <div className={`transition-container ${planet}-background`}>
            <Navbar />
            <TextReader />
            <div className="transition-content readable-text">
                <div className="transition-layout">
                    <div className="message-side">
                        <div className="message-box">
                            <p className="transition-message">
                                {currMessage}
                            </p>
                            <div className="button-container">
                                <button className="certificate-button" onClick={handleCertificate}>
                                    VIEW CERTIFICATE
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="character-side">
                        <img
                            src={imagePath}
                            alt={characters}
                            className="character-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransitionCerts;