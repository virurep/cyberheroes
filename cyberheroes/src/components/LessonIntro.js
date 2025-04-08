import { useParams } from 'react-router-dom';
import '../styles/intro.css';
import lessonIntroData from '../data/lesson_intro.json';
import rocket from '../img/general/rocket.png';

const planetImages = require.context('../img/planets', false, /\.(png|jpe?g|svg)$/);
const introImages = require.context('../img/lesson-intro', false, /\.(png|jpe?g|svg)$/);

const LessonIntro = () => {
  const { planet } = useParams();

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

  const getLessonIntroMessage = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = lessonIntroData.intros.find(
      planet => planet.planet_name.toLowerCase() === formattedPlanetName
    );
    return planetData.intro_text;
  }

  const lessonIntroMessage = getLessonIntroMessage(planet);




  return (
    <div className="lesson-intro-background">
      <div className="lesson-intro-side">
        <img src={rocket} alt="Rocket Ship" className="lesson-intro-rocket" />
        {planetImage && <img src={planetImage} alt={`${planet} Planet`} className="lesson-intro-planet" />}
      </div>
      <div className="lesson-intro-message">
        <h1>You have arrived at {planetData.planet_name}!</h1>
        <p>{lessonIntroMessage}</p>
        <button className="enter-lesson-btn">ENTER {planetData.planet_name.toUpperCase()}</button>
      </div>
    </div>
  );
};

export default LessonIntro;
