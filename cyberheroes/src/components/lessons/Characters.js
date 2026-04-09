import arrow from '../../img/general/arrow.png'
const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);


const Characters = ({ characters }) => {
  return (
    <div className="character-container">
      {characters.map((character) => {
        // Convert character name to match your image filename
        const imageName = character.name.toLowerCase().replace(/\s+/g, '-');
        const imagePath = characterImages(`./${imageName}.png`);


        if (character.arrow) {
          // clickable character to go to the next page
          const handleClick = (page) => {
            character.onClick(page);
          }
          const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(character.arrow);
            }
          };
          return (
            <div key={character.name} className={`arrow-character ${character.style}`}>
              <div className='arrow-container'>
                  <img src={arrow} alt='arrow' className='arrow' />
              </div>
              <img
                src={imagePath}
                alt={character.name}
                className={`character character-arrow`}
                onClick={() => handleClick(character.arrow)}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
              />
            </div>
          );
        }

        return (
          <img key={character.name} src={imagePath} alt={character.name} className={`character ${character.style}`} />
        );
      })}
    </div>
  );
};

export default Characters;