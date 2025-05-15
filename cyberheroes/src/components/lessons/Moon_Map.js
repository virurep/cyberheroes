import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/transitions.css';
import Allie from '../../img/characters/allie.png';
import Polaroid from '../../img/characters/al-photo.png';
import Navbar from '../util/NavBar';
import TextReader from '../util/TextReader';

const MoonMap = () => {
    const navigate = useNavigate();

    // Get the quiz part from location state

    const handleToMap = () => {
        navigate(`/exploration-map`);
    };

    const onToMoon = () => {
        navigate(`/privacy-moon/lesson-intro`);
    };



    return (
        <div className={`transition-container privacy-planet-background`}>
            <Navbar />
            <TextReader />
            <div className="transition-content readable-text">
                <div className="transition-layout">
                    <div className="message-side">
                        <div className="message-box">
                            <p className="transition-message">
                                Oh no Patrick just escaped to the moon. My brother, Alejandro, is there right now. Can you help him out?
                            </p>
                            <div className="button-container">
                                <button className='moon-button' onClick={onToMoon}>GO TO THE MOON</button>
                                <span className="or-text">OR</span>
                                <button className='review-button' onClick={handleToMap}>GO BACK TO THE MAP</button>
                            </div>
                        </div>
                    </div>
                    <div className="character-side">
                        <img
                            src={Allie}
                            alt='allie'
                            className="character-image"
                        />
                    </div>
                    <div className="polaroid">
                        <img
                            src={Polaroid}
                            alt='Al Polaroid'
                            className="polarioid"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonMap;