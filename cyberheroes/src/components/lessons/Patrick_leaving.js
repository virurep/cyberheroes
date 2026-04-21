import React from "react";
import "../../styles/transitions.css";
import rocket from "../../img/characters/patrick_leaving.png";
import moon from "../../img/planets/privacy-moon.png";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import { getNextPlanet } from '../../content/loader';

const PatrickLeaving = () => {
    const { planet } = useParams();
    const navigate = useNavigate();
    const nextPlanet = getNextPlanet(planet);

    const handleContinue = () => {
        if (nextPlanet) {
            navigate(`/${nextPlanet.slug}/moon-map`);
        } else {
            navigate('/exploration-map');
        }
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

export default PatrickLeaving;
