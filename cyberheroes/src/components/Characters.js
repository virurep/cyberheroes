import arrow from '../img/general/arrow.png'
const characterImages = require.context('../img/characters', false, /\.(png|jpe?g|svg)$/);



const Characters = ({ characters }) => {
  return (
    <div className="character-container">
      {characters.map((character) => {
        // Convert character name to match your image filename
        const imageName = character.name.toLowerCase().replace(/\s+/g, '-');
        const imagePath = characterImages(`./${imageName}.png`);

        if (character.arrow) {
          console.log("arrow");
          return (
            <div className={`arrow-character ${character.style}`}>
              <div className='arrow-container'>
                  <img src={arrow} alt='arrow' className='arrow' />
              </div>
              <img src={imagePath} alt={character.name} className={`character character-arrow`}  />
            </div>
          );
        }

        return (
          <img src={imagePath} alt={character.name} className={`character ${character.style}`} />
        );
      })}
    </div>
  );
};

export default Characters;