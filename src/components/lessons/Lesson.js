import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import '../../styles/lesson.css';
import Navbar from '../util/NavBar';
import Characters from './Characters';
import Message from './Message';
import { lessonData } from '../../data/planets';
import TextReader from '../util/TextReader';

const backgroundImages = require.context('../../img/backgrounds', false, /\.(png|jpe?g|svg)$/);

const Lesson = () => {
  const { planet } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const textReaderRef = useRef(null);

  const planetData = lessonData[planet];
  const pages = planetData?.pages ?? [];

  const [pageNum, setPageNum] = useState(() => Math.max(0, location.state?.page ?? 0));

  const pageData = pages[pageNum];

  const stopReader = () => {
    if (textReaderRef.current && typeof textReaderRef.current.stopReading === 'function') {
      textReaderRef.current.stopReading();
    }
  };

  const navigateTo = (destination) => {
    stopReader();
    if (typeof destination === 'number') {
      setPageNum(destination);
      return;
    }
    if (destination.startsWith('quiz')) {
      navigate(`/${planet}/transition`, { state: { quizPart: destination } });
    } else if (destination === 'certificate') {
      navigate(`/${planet}/certificate`);
    } else if (destination === 'patrick-defeat') {
      navigate(`/${planet}/patrick-defeat`);
    }
  };

  const handleNext = () => {
    stopReader();
    const to = pageData?.message?.to;
    if (to) {
      navigateTo(to);
    } else {
      setPageNum(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    stopReader();
    setPageNum(prev => prev - 1);
  };

  const handleCharacterClick = (index) => {
    navigateTo(index);
  };

  if (!pageData) return null;

  return (
    <div className={`lesson-container ${planet}-background`}>
      <Navbar />
      <TextReader ref={textReaderRef} />
      <div className={`lesson-content ${pageData.message.style}-container readable-text`}>
        <Characters
          characters={pageData.characters.map(character => ({
            ...character,
            onClick: character.arrow !== undefined ? () => handleCharacterClick(character.arrow) : undefined
          }))}
        />
        <Message
          key={pageNum}
          message={pageData.message}
          onNext={handleNext}
          onPrev={handlePrev}
          onNavigate={navigateTo}
          pageNum={pageNum}
          maxPage={pages.length}
        />
      </div>
    </div>
  );
};

export default Lesson;
