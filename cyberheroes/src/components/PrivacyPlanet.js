import '../styles/intro.css';
import { useNavigate, useLocation } from "react-router-dom";
import rocket from "../img/general/rocket.png";
import privacyplanet from "../img/planets/privacyplanet.png";
import PrivacyIntro from "./PrivacyIntro";

const PrivacyPlanet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isIntroPage = location.pathname === '/privacy-planet/intro';

  const enterPlanet = () => {
    navigate('/privacy-planet/intro');
  };

  return (
    <>
      {isIntroPage ? (
        <PrivacyIntro />
      ) : (
        <div className="lesson-intro-background">
          <div className="lesson-intro-side">
            <img src={rocket} alt="Rocket Ship" className="lesson-intro-rocket" />
            <img src={privacyplanet} alt="Privacy Planet" className="lesson-intro-planet" />
          </div>
          <div className="intro-message">
            <h1 className="arrivalTitle">You have arrived at Privacy Planet</h1>
            <p>Welcome to Privacy Planet. Life here is generally peaceful, and people usually have nothing much to worry about. However, over the last few years, Privacy Planet is becoming less and less private. Investigate the cause for the issue and help the people on the planet.</p>
            <button className="enter-planet-btn" onClick={enterPlanet}>
              ENTER PRIVACY PLANET
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyPlanet;