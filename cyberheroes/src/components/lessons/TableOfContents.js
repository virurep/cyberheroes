import "../../styles/table-of-contents.css";
import { useParams, useNavigate } from "react-router-dom";
import tableOfContentsData from "../../data/lessons/table_of_contents.json"
import { useState } from 'react';
import tocClose from '../../img/general/toc_close.png';
import tocOpen from '../../img/general/toc_open.png';
import dropdownArrow from '../../img/general/dropdown_right.png';

const TableOfContents = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const getPlanetData = (planetName) => {
    const formattedPlanetName = planetName.toLowerCase().replace(/-/g, ' ');
    const planetData = tableOfContentsData.table_of_contents.find(
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
  console.log("Table of Contents data:", planetData);

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