import "../../styles/table-of-contents.css";
import { useParams, useNavigate } from "react-router-dom";
import { lessonData } from "../../data/planets";
import { useState } from 'react';
import tocClose from '../../img/general/toc_close.png';
import tocOpen from '../../img/general/toc_open.png';
import dropdownArrow from '../../img/general/dropdown_right.png';

const TableOfContents = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const planetData = lessonData[planet];
  const toc = planetData?.table_of_contents;

  const handlePartClick = (part) => {
    if (part.part_type === "quiz") {
      navigate(`/${planet}/transition`, {
        state: { quizPart: part.part_style }
      });
    } else {
      navigate(`/${planet}/lesson`, {
        state: { page: part.start_page }
      });
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    toc && (
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
            {toc.parts.map((part, index) => (
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
