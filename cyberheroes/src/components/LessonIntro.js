import { useParams, useNavigate } from 'react-router-dom';
import '../styles/intro.css';
import lessonIntroData from '../data/lesson_intro.json';
import rocket from '../img/general/rocket.png';
import computer from "../img/general/computer.png";

const planetImages = require.context('../img/planets', false, /\.(png|jpe?g|svg)$/);
const introImages = require.context('../img/lesson-intro', false, /\.(png|jpe?g|svg)$/);

const LessonIntro = () => {
  const { planet } = useParams();
  console.log("Planet parameter:", planet);

  const navigate = useNavigate();

  const startLesson = () => {
    navigate(`/${planet}/lesson`);
  };

  const getPlanetData = (planetName) => {
    // Convert the URL parameter to match the JSON format
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');

    // Find the planet data in the JSON array under the "intros" key
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
  console.log("Planet data:", planetData);

  // getting the image for the right planet
  const getPlanetImage = (planetName) => {
    try {
      // Convert planet name to match your image filename
      const imageName = planetName.toLowerCase().replace(/\s+/g, '-');
      return planetImages(`./${imageName}.png`);
    } catch (err) {
      console.error('Image not found:', err);
      return null;
    }
  };

  const planetImage = getPlanetImage(planet);

  // getting the lesson intro message
  const getLessonIntroMessage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return planetData.intro_text;
  };

  const lessonIntroMessage = getLessonIntroMessage(planet);

  // getting the image on the computer intro screen
  const getComputerIntroImage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    // The path in JSON is already relative to the lesson-intro directory
    return introImages(`./${planetData.computer_image_name}`);
  };

  const computerIntroImage = getComputerIntroImage(planet);

  // getting the message on the computer intro screen
  const getComputerIntroMessage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return planetData.computer_text;
  };

  const computerIntroMessage = getComputerIntroMessage(planet);

  // button that switches from lesson intro to computer intro
  const handleEnterLesson = () => {
    document.querySelector(".enter-lesson-btn").addEventListener("click", () => {
      document.querySelector(".lesson-intro-background").classList.add("hidden");
      document.querySelector(".computer-container").classList.remove("hidden");
    });
  };

  const handleBackToMap = () => {
    navigate('/exploration-map');
  };


  return (
    <>
    {/* Lesson Intro Page */}
      <div className="lesson-intro-background">
        <div className="lesson-intro-side">
          <img src={rocket} alt="Rocket Ship" className="lesson-intro-rocket" />
          {planetImage && <img src={planetImage} alt={`${planet} Planet`} className="lesson-intro-planet" />}
        </div>
        <div className="lesson-intro-message">
          <h1 className="lesson-intro-title">You have arrived at {planetData.planet_name}!</h1>
          <p>{lessonIntroMessage}</p>
          <button className="enter-lesson-btn" onClick={handleEnterLesson}>
            ENTER {planetData.planet_name.toUpperCase()}
          </button>
        </div>
      </div>
      {/* Computer Intro Page */}
      <div className="lesson-intro-background hidden computer-container">
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
        {/* <div className="button-content">
          <button className="to-map-btn" onClick={() => navigate('/exploration-map')}>
            GO BACK TO MAP
          </button>
          <button className="start-lesson-btn" onClick={startLesson}>
            START YOUR ADVENTURE
          </button>
        </div> */}
      </div>
    </>
  );
};

export default LessonIntro;
