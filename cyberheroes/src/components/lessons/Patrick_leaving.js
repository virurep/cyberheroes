import React from "react";
import "../../styles/transitions.css";
import rocket from "../../img/characters/patrick_leaving.png";
import moon from "../../img/planets/privacy-moon.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";

const IntroPage = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/privacy-moon/moon-map');
    };

    return (
        <div className="patrick-leaving">
            <Navbar />
            <TextReader />
            <img id="moon" src={moon} alt="Moon" />
            <img id="rocket-flying" src={rocket} alt="Rocket Flying" />
            <div className="bottom-content readable-text">
                <h1 className="leaving-text">
                    OH NO! Patrick is getting away!
                </h1>
                <button className="continue-button-leaving" onClick={handleContinue}>
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default IntroPage;
