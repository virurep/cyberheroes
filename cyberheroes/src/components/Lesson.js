import { useParams, useNavigate } from 'react-router-dom';
import '../styles/lesson.css';
import Navbar from './NavBar';
import Characters from './Characters';
import Message from './Message';
import lessonData from '../data/lesson.json';

const backgroundImages = require.context('../img/backgrounds', false, /\.(png|jpe?g|svg)$/);

let pageNum = 1;

const Lesson = () => {
  const { planet } = useParams();
  console.log("Planet parameter:", planet);


  const navigate = useNavigate();

  // getting lesson data for a specific planet / lesson
  const getPlanetData = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');

    const planetData = lessonData.planets.find(
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

  // getting data for each specific lesson page
  const getPageData = () => {
    const pageData = planetData.pages.find(
      page => page.page_number === pageNum
    );

    if (!pageData) {
      console.error(`No data found for page number: ${pageNum}`);
      return {
        title: "Page Not Found",
        description: "This page's data could not be loaded."
      };
    }

    return pageData;
  };

  const pageData = getPageData();
  console.log("Page data:", pageData);


  return (
    <div className={`lesson-container ${planet}-background`}>
      <Navbar />
      <div className="lesson-content">
        <Characters characters={pageData.characters} />
        <Message message={pageData.message} />
      </div>
    </div>
  );
};

export default Lesson;