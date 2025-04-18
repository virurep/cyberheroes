import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/arrival.css";
import Navbar from './NavBar';
import ship from '../img/general/ship.png'
import hero from '../img/characters/cyber-hero.png'
import arrow from '../img/general/arrow.png'

const Arrival = () => {
    // const startLesson = () => {
    //     navigate('/privacy-planet/page1');
    // };

    return (
        <div className="arrival-container">
            <Navbar />
            <main>
                <div className='rocket'>
                    <img src={ship} alt='rocket ship' />
                </div>
                <div className='right-section'>
                    <div className='text-boxes'>
                        <p>YOU HAVE LANDED!</p>
                        <p>click your character to start exploring the planet!</p>
                    </div>
                    <div className='arrow-container'>
                        <img src={arrow} alt='arrow' className='arrow' />
                    </div>
                    <div className='arrival-hero'>
                        <img src={hero} alt='cyberhero' />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Arrival;
