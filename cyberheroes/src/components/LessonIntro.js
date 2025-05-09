import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/intro.css';
import lessonIntroData from '../data/lessons/lesson_intro.json';
import rocket from '../img/general/rocket.png';
import computer from "../img/general/computer.png";
import Navbar from './NavBar';
import TextReader from './TextReader';

const planetImages = require.context('../img/planets', false, /\.(png|jpe?g|svg)$/);
const introImages = require.context('../img/lesson-intro', false, /\.(png|jpe?g|svg)$/);

const LessonIntro = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [showComputer, setShowComputer] = useState(false);

  const startLesson = () => {
    navigate(`/${planet}/arrival`);
  };

  const getPlanetData = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );

    if (!planetData) {
      console.error(`No data found for planet: ${planetName}`);
      return {
        title: "Planet Not Found",
        description: "This planet's data could not be loaded."
      };
    }

    return planetData;
  };

  const planetData = getPlanetData(planet);

  const getPlanetImage = (planetName) => {
    try {
      const imageName = planetName.toLowerCase().replace(/\s+/g, '-');
      return planetImages(`./${imageName}.png`);
    } catch (err) {
      console.error('Image not found:', err);
      return null;
    }
  };

  const planetImage = getPlanetImage(planet);

  const getLessonIntroMessage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return planetData.intro_text;
  };

  const lessonIntroMessage = getLessonIntroMessage(planet);
  const paragraphs = lessonIntroMessage.split('\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));

  const getComputerIntroImage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return introImages(`./${planetData.computer_image_name}`);
  };

  const computerIntroImage = getComputerIntroImage(planet);

  const getComputerIntroMessage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return planetData.computer_text;
  };

  const computerIntroMessage = getComputerIntroMessage(planet);

  const handleEnterLesson = () => {
    setShowComputer(true);
  };

  const handleBackToMap = () => {
    navigate('/exploration-map');
  };

  if (showComputer) {
    return (
      <div>
        <Navbar />
        <TextReader />
        <div className="lesson-intro-background readable-text">
          <img src={computer} alt="Computer" className="computer-image" />
          <div className="computer-content">
            <div className="computer-content-top">
              {computerIntroImage && <img src={computerIntroImage} alt="Computer" className="computer-intro-image" />}
              <div className="intro-message">
                <p>{computerIntroMessage}</p>
              </div>
            </div>
            <div className="computer-btn-container">
              <button className="go-back-map-btn" onClick={handleBackToMap}>
                Go Back to Map
              </button>
              <button className="start-lesson-btn" onClick={startLesson}>
                Start Your Adventure
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <TextReader />
      <div className="lesson-intro-background readable-text">
        <div className="lesson-intro-side">
          <img src={rocket} alt="Rocket Ship" className="lesson-intro-rocket" />
          {planetImage && <img src={planetImage} alt={`${planet} Planet`} className="lesson-intro-planet" />}
        </div>
        <div className="lesson-intro-message">
          <h1 className="lesson-intro-title">You have arrived at {planetData.planet_name}!</h1>
          {paragraphs}
          <button className="enter-lesson-btn" onClick={handleEnterLesson}>
            ENTER {planetData.planet_name.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonIntro;
