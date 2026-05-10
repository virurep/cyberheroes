import arrow from '../../img/general/arrow.png';
import Knight from '../util/Knight';

const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);

// Map character names to Knight color presets
const KNIGHT_COLOR_MAP = {
  'allie': 'cyan',
  'al': 'cyan',
  'alejandro': 'purple',
  'enemy': 'red',
  'patrick': 'red',
  'privacy-enemy': 'red',
  'safe': 'green',
  'cyber-hero': 'gold',
};

const Characters = ({ characters }) => {
  return (
    <div className="character-container">
      {characters.map((character) => {
        const imageName = character.name.toLowerCase().replace(/\s+/g, '-');
        const knightColor = KNIGHT_COLOR_MAP[imageName];

        if (character.arrow) {
          const handleClick = () => character.onClick(character.arrow);
          const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClick();
          };
          return (
            <div key={character.name} className={`arrow-character ${character.style}`}>
              <div className="arrow-container">
                <img src={arrow} alt="arrow" className="arrow" />
              </div>
              {knightColor ? (
                <div
                  className={`character character-arrow`}
                  onClick={handleClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  style={{ cursor: 'pointer' }}
                >
                  <Knight size={200} color={knightColor} animate={false} />
                </div>
              ) : (
                <img
                  src={characterImages(`./${imageName}.png`)}
                  alt={character.name}
                  className="character character-arrow"
                  onClick={handleClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>
          );
        }

        if (knightColor) {
          return (
            <div key={character.name} className={`character ${character.style}`}>
              <Knight size={240} color={knightColor} animate={true} />
            </div>
          );
        }

        return (
          <img
            key={character.name}
            src={characterImages(`./${imageName}.png`)}
            alt={character.name}
            className={`character ${character.style}`}
          />
        );
      })}
    </div>
  );
};

export default Characters;
