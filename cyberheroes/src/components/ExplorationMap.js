import '../style.css';
import privacyPlanet from '../img/privacyplanet.png';
import privacyMoon from '../img/privacymoon.png';
import passwordPlanet from '../img/passwordsplanet.png';
import safeBrowsingPlanet from '../img/safebrowsing.png';
import onlineSharingPlanet from '../img/onlinesharing.png';
import malwarePlanet from '../img/malware.png';
import { useState, useEffect } from 'react';

const ExplorationMap = () => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const planets = [
    { name: "Privacy Planet", image: privacyPlanet },
    { name: "Privacy Moon", image: privacyMoon },
    { name: "Passwords", image: passwordPlanet },
    { name: "Safe Browsing", image: safeBrowsingPlanet },
    { name: "Online Sharing", image: onlineSharingPlanet },
    { name: "Malware", image: malwarePlanet }
  ];

  const handleScroll = (direction) => {
    const container = document.querySelector('.exploration-container');
    container.scrollBy({
      left: direction * 800,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = document.querySelector('.exploration-container');
    const checkScroll = () => {
      if (container) {
        // Show left button if we're not at the start
        setShowLeftButton(container.scrollLeft > 0);
        
        // Show right button if we're not at the end
        const maxScroll = container.scrollWidth - container.clientWidth;
        setShowRightButton(container.scrollLeft < maxScroll - 10); // -10 for some tolerance
      }
    };

    container.addEventListener('scroll', checkScroll);
    // Initial check
    checkScroll();

    return () => container.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className="exploration-container">
      <h1 className="exploration-heading">Explore the Galaxy Through Various Lessons</h1>
      <div className="planets-map">
        {planets.map((planet, index) => (
          <div key={planet.name} className="planet-container">
            <div className="planet">
              <img src={planet.image} alt={planet.name} className="planet-image" />
              <span className="planet-name">{planet.name}</span>
            </div>
            {index < planets.length - 1 && <div className="planet-connector" />}
          </div>
        ))}
      </div>
      {showLeftButton && (
        <button className="scroll-button scroll-left" onClick={() => handleScroll(-1)}>
          ← Scroll Left
        </button>
      )}
      {showRightButton && (
        <button className="scroll-button scroll-right" onClick={() => handleScroll(1)}>
          Scroll Right →
        </button>
      )}
    </div>
  );
};

export default ExplorationMap;