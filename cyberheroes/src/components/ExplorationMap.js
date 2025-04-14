import '../styles/map.css';

import privacyPlanet from '../img/planets/privacy-planet.png';
import privacyMoon from '../img/planets/privacy-moon.png';
import phishingPlanet from '../img/planets/phishing-planet.png';

import safeBrowsingPlanet from '../img/planets/safebrowsing.png';
import onlineSharingPlanet from '../img/planets/onlinesharing.png';
import malwarePlanet from '../img/planets/malware.png';
import jet from '../img/general/jet.png';
import Navbar from './NavBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ExplorationMap = () => {
  const navigate = useNavigate();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const planets = [
    {
      name: "Privacy Planet",
      image: privacyPlanet,
      route: "privacy-planet",
      moon: { name: "Privacy Moon", image: privacyMoon, route: "privacy-moon" }
    },
    { name: "Phishing", image: phishingPlanet, route: "phishing-planet"},
    { name: "Malware", image: malwarePlanet, route: "malware"},
    { name: "Safe Browsing", image: safeBrowsingPlanet, route: "safe-browsing"},
    { name: "Online Sharing", image: onlineSharingPlanet, route: "online-sharing"}
  ];

  // goes to lesson intro of each planet
  const handlePlanetClick = (planetRoute) => {
    navigate(`/${planetRoute}/lesson-intro`);
  };

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
    <div>
      <Navbar />
      <div className="exploration-container">
        <h1 className="exploration-heading">Explore the Galaxy Through Various Lessons</h1>
        <div className="planets-map">
          <div className="jet-container">
            <img src={jet} alt="Jet" className="jet-image" />
          </div>
          {planets.map((planet, index) => (
            <div key={planet.name} className="planet-container">
              <div className="planet" onClick={() => handlePlanetClick(planet.route)}>
                <img src={planet.image} alt={planet.name} className="planet-image" />
                <span className="planet-name">{planet.name}</span>
              </div>
              {planet.moon && (
                <div className="moon-container">
                  <div className="moon" onClick={() => handlePlanetClick(planet.moon.route)}>
                    <img src={planet.moon.image} alt={planet.moon.name} className="moon-image" />
                    <span className="moon-name">{planet.moon.name}</span>
                  </div>
                  <div className="moon-connector"></div>
                </div>
              )}
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
    </div>
  );
};

export default ExplorationMap;