/* Cursor AI was used to resolve minor bugs when dropdown menu was open */

import "../../styles/table-of-contents.css";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanet } from '../../content/loader';
import { useState } from 'react';
import tocClose from '../../img/general/toc_close.png';
import tocOpen from '../../img/general/toc_open.png';
import dropdownArrow from '../../img/general/dropdown_right.png';

const TableOfContents = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Get planet manifest from the content loader
  const manifest = getPlanet(planet);

  // Transform manifest parts into the table-of-contents format
  const planetData = manifest ? {
    planet_name: manifest.name,
    lesson_title: manifest.title,
    parts: manifest.parts.map((part) => {
      const isQuiz = part.quiz_slugs && part.quiz_slugs.length > 0;
      return {
        part_name: part.title,
        part_style: part.part_style,
        part_type: isQuiz ? 'quiz' : 'lesson',
        start_page: part.lesson_page_range?.start,
      };
    })
  } : null;

  if (!manifest) {
    console.error(`No data found for planet: ${planet}`);
  }

  const handlePartClick = (part) => {
    if (part.part_type === "quiz") {
      navigate(`/${planet}/transition`, {
        state: {
          quizPart: part.part_style
        }
      });
    } else {
      navigate(`/${planet}/lesson`, {
        state: {
          page: part.start_page
        }
      });
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    planetData && (
      <div className="table-of-contents-container">
        <div className="parts-container">
          <div className="toc-header" onClick={toggleDropdown}>
            <div className="header-content">
              <img
                src={isOpen ? tocOpen : tocClose}
                alt="Table of Contents"
                className="toc-icon"
              />
              <span>Table of Contents</span>
              <img
                src={dropdownArrow}
                alt="Dropdown Arrow"
                className={`dropdown-arrow ${isOpen ? 'right-arrow' : 'down-arrow'}`}
              />
            </div>
          </div>
          <div className={`toc-body ${isOpen ? 'open' : ''}`}>
            {planetData.parts.map((part, index) => (
              <div
                key={index}
                className={`part-item ${part.part_style}`}
                onClick={() => handlePartClick(part)}
              >
                <span className="part-name">{part.part_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default TableOfContents;