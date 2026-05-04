import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/intro.css';
import '../../styles/lesson.css';
import rocket from '../../img/general/rocket.png';
import computer from "../../img/general/computer.png";
import Navbar from '../util/NavBar';
import TextReader from '../util/TextReader';
import VocabPopup from '../util/VocabPopup';
import { processText } from './Message';
import { lessonData } from '../../data/planets';

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

  const handleBackToMap = () => {
    navigate('/exploration-map');
  };

  const handleEnterLesson = () => {
    setShowComputer(true);
  };

  const planetData = lessonData[planet];

  if (!planetData) {
    return (
      <div>
        <Navbar />
        <TextReader />
        <div className="lesson-intro-background readable-text">
          <p>Error: Planet data not found</p>
        </div>
      </div>
    );
  }

  const { name, active, intro } = planetData;

  const getPlanetImage = () => {
    try {
      return planetImages(`./${planet}.png`);
    } catch (err) {
      return null;
    }
  };

  const getComputerIntroImage = () => {
    try {
      return introImages(`./${intro.computer_image}`);
    } catch (err) {
      return null;
    }
  };

  const planetImage = getPlanetImage();
  const computerIntroImage = getComputerIntroImage();
  const lessonIntroMessage = processText(intro.text, handleVocabClick);
  const computerIntroMessage = processText(intro.computer_text, handleVocabClick);

  if (showComputer && active) {
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
  } else if (!active) {
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
            <h1 className="lesson-intro-title">You have arrived at {name}!</h1>
            {lessonIntroMessage}
            <button className="enter-lesson-btn" onClick={handleEnterLesson}>
              ENTER {name.toUpperCase()}
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
