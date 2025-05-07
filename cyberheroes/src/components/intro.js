import React from "react";
import "../styles/cyberIntro.css";
import logo from "../img/general/logo.png";
import rocket from "../img/general/rocket.png";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import TextReader from "./TextReader";

const IntroPage = () => {
    const navigate = useNavigate();

    const goToMap = () => {
        // TODO: Implement navigation to the game
        navigate('/exploration-map');
    };

    return (
        <div>
            <Navbar />
            <TextReader />
            <div className="intro-container">
                <main>
                    <div>
                        <h1 className="intro-text">
                            Hi I'm Cyber Hero. I fly around space and protect those in need from online threats.
                            Let us check out some new planets and see if anyone needs help.
                        </h1>
                        <button className="red-button" onClick={goToMap}>
                            Open Exploration Map
                        </button>
                    </div>
                </main>
            </div>
            <div>
                <img id="rocket-flying" src={rocket} alt="Rocket Flying" />
            </div>
        </div>
    );
};

export default IntroPage;
