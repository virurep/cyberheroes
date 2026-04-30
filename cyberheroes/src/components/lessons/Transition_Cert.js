import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/transitions.css";
import Navbar from '../util/NavBar';
import TextReader from "../util/TextReader";
import { lessonData } from '../../data/planets';

const TransitionCerts = () => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const navigate = useNavigate();

    const transitionData = lessonData[planet]?.cert_transition;

    if (!transitionData) {
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
