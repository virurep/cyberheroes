import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import '../../styles/lesson.css';
import Navbar from '../util/NavBar';
import Characters from './Characters';
import Message from './Message';
import lessonData from '../../data/lessons/lesson.json';
import TextReader from '../util/TextReader';

const backgroundImages = require.context('../../img/backgrounds', false, /\.(png|jpe?g|svg)$/);



const Lesson = () => {
  const { planet } = useParams();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(() => {
    // If we're coming from another page with state.page: 1, use that
    if (location.state?.page === 1) {
      return 1;
    }
    // Otherwise, use the maximum of current page and stored page
    return Math.max(1, location.state?.page || 1);
  });

  const navigate = useNavigate();
  const textReaderRef = useRef(null);

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

  let pageData = getPageData();


  // go to the next lesson page, or quiz prompt
  const goToPage = (page) => {
    // Stop the text reader when the lesson page changes
    if (textReaderRef.current && typeof textReaderRef.current.stopReading === 'function') {
      textReaderRef.current.stopReading();
    }

    if (wildcardMatch(page, "quiz*")) {
      navigate(`/${planet}/transition`, {
        state: {
          quizPart: page
        }
      });
    } else if (wildcardMatch(page, "review*")) {
      navigate(`/${planet}/review`);
    } else if (wildcardMatch(page, "outro")) {
      navigate(`/${planet}/outro`);
    } else if (wildcardMatch(page, "certificate")) {
      navigate(`/${planet}/certificate`);
    } else if (wildcardMatch(page, "patrick-defeat")) {
      navigate(`/${planet}/patrick-defeat`);
    } else {
      setPageNum(page);
    }
  }

  // wildcard matching function from GeeksforGeeks
  const wildcardMatch = (text, pattern) => {
    const regexPattern =
        new RegExp('^' + pattern.replace(/\?/g, '.').replace(/\*/g, '.*') + '$');
    return regexPattern.test(text);
  }

  // clickable characters (nav to next page)
  const handleCharacterClick = (page) => {
    goToPage(page);
  }

  return (
    <div className={`lesson-container ${planet}-background`}>
      <Navbar />
      <TextReader ref={textReaderRef} />
      <div className={`lesson-content ${pageData.message.style}-container readable-text`}>
        <Characters
          characters={pageData.characters.map(character => ({
            ...character,
            onClick: character.arrow ? handleCharacterClick : undefined
          }))}
        />
        <Message key={pageNum} message={pageData.message} onButtonClick={goToPage} pageNum={pageNum} maxPage={planetData.pages.length}/>
      </div>
    </div>
  );
};

export default Lesson;