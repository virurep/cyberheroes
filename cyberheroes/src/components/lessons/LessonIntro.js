/* Cursor AI was used to guide the decision making in having 2 frames for the lesson intro */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/intro.css';
import '../../styles/lesson.css';
import { getPlanet } from '../../content/loader';
import rocket from '../../img/general/rocket.png';
import computer from "../../img/general/computer.png";
import Navbar from '../util/NavBar';
import TextReader from '../util/TextReader';
import VocabPopup from '../util/VocabPopup';
import { processTextWithVocab } from './Message';
import { getVocab } from '../../content/loader';

const planetImages = require.context('../../img/planets', false, /\.(png|jpe?g|svg)$/);
const introImages = require.context('../../img/lesson-intro', false, /\.(png|jpe?g|svg)$/);

const LessonIntro = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [showComputer, setShowComputer] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);
  const vocabData = getVocab(planet);
  const vocabWords = vocabData?.words || [];

  const handleVocabClick = (vocab) => {
    setSelectedVocab(vocab);
  };

  const startLesson = () => {
    navigate(`/${planet}/arrival`);
  };

  // Get planet data from the content loader (manifest)
  const manifest = getPlanet(planet);
  const planetData = manifest
    ? { planet_name: manifest.name, active: manifest.active, ...manifest.intro }
    : { planet_name: "Planet Not Found", active: false };

  if (!manifest) {
    console.error(`No data found for planet: ${planet}`);
  }

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
  const lessonIntroMessage = planetData.active && planetData.intro_text
    ? processTextWithVocab(planetData.intro_text, handleVocabClick, vocabWords)
    : null;

  // Get the computer intro image on the second intro screen
  let computerIntroImage = null;
  try {
    if (planetData.computer_image_name) {
      computerIntroImage = introImages(`./${planetData.computer_image_name}`);
    }
  } catch (err) {
    console.error('Computer intro image not found:', err);
  }

  // Get the computer intro message on the second intro screen
  const computerIntroMessage = planetData.computer_text
    ? processTextWithVocab(planetData.computer_text, handleVocabClick, vocabWords)
    : null;

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
