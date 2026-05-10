import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import Knight from './util/Knight';
import Navbar from './util/NavBar';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="landing-container">
        <div className="landing-hero">
          <div className="landing-knight">
            <Knight size={120} color="cyan" animate={true} />
          </div>
          <h1 className="landing-title">CYBERHEROES</h1>
          <p className="landing-subtitle">
            A fun way to learn about proper cybersecurity practices!
          </p>
          <button className="start-button" onClick={() => navigate('/intro')}>
            START YOUR ADVENTURE ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
