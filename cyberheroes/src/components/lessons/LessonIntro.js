import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/intro.css';
import '../../styles/lesson.css';
import lessonIntroData from '../../data/lessons/lesson_intro.json';
import rocket from '../../img/general/rocket.png';
import computer from "../../img/general/computer.png";
import Navbar from '../util/NavBar';
import TextReader from '../util/TextReader';
import VocabPopup from '../util/VocabPopup';
import { processText } from './Message';

const planetImages = require.context('../../img/planets', false, /\.(png|jpe?g|svg)$/);
const introImages = require.context('../../img/lesson-intro', false, /\.(png|jpe?g|svg)$/);

const LessonIntro = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [showComputer, setShowComputer] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);

  const handleVocabClick = (vocab) => {
    setSelectedVocab(vocab);
  };

  const startLesson = () => {
    navigate(`/${planet}/arrival`);
  };

  // Get the planet data from the lessonIntroData.intros array
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

  // Get the planet's image on first intro screen
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

  // Get the intro message on the first intro screen
  const getLessonIntroMessage = (planetName) => {
    if (planetData.active) {
      const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
      const planetData = lessonIntroData.intros.find(
        planet => planet.planet_name.toLowerCase() === formattedPlanetName
      );
      return processText(planetData.intro_text, handleVocabClick);
    }
  };

  const lessonIntroMessage = getLessonIntroMessage(planet);

  // Get the computer intro image on the second intro screen
  const getComputerIntroImage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return introImages(`./${planetData.computer_image_name}`);
  };

  const computerIntroImage = getComputerIntroImage(planet);

  // Get the computer intro message on the second intro screen
  const getComputerIntroMessage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return processText(planetData.computer_text, handleVocabClick);
  };

  const computerIntroMessage = getComputerIntroMessage(planet);

  const handleEnterLesson = () => {
    setShowComputer(true);
  };

  const handleBackToMap = () => {
    navigate('/exploration-map');
  };

  // if else renders either the first or second intro screen
  if (showComputer && planetData.active) {
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
                {computerIntroMessage}
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
        {selectedVocab && (
          <VocabPopup
            word={selectedVocab.word}
            definition={selectedVocab.definition}
            onClose={() => setSelectedVocab(null)}
          />
        )}
      </div>
    );
  } else if (!planetData.active) {
    return (
      <div>
        <Navbar />
      <TextReader />
      <div className="lesson-intro-background readable-text">
          <img src={computer} alt="Computer" className="computer-image" />
          <div className="computer-content">
            <div className="computer-content-top">
              <div className="coming-soon-message">
                <h1>🪐 Coming Soon! 🪐</h1>
                <p> Oops! Our satellite couldn't reach this planet—it's not ready for visitors yet. </p>
                <p>This planet is still being built by CyberHeroes. Check back soon for more adventures!</p>
              </div>
            </div>
            <div className="computer-btn-container">
              <button className="go-back-map-btn" onClick={handleBackToMap}>
                Go Back to Map
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
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
        {lessonIntroMessage}
        <button className="enter-lesson-btn" onClick={handleEnterLesson}>
          ENTER {planetData.planet_name.toUpperCase()}
        </button>
      </div>
    </div>
    {selectedVocab && (
      <VocabPopup
        word={selectedVocab.word}
        definition={selectedVocab.definition}
        onClose={() => setSelectedVocab(null)}
      />
      )}
    </div>
  );
  }
};

export default LessonIntro;
