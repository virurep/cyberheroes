import React from "react";
import "../styles/lesson.css";

const characterImages = require.context('../img/characters', false, /\.(png|jpe?g|svg)$/);


const Characters = ({ characters }) => {
  console.log("in Characters.js");
  console.log(characters);

  return (
    <div className="character-container">
      {characters.map((character) => {
        // Convert character name to match your image filename
        const imageName = character.name.toLowerCase().replace(/\s+/g, '-');
        const imagePath = characterImages(`./${imageName}.png`);

        return (
          <img src={imagePath} alt={character.name} className={character.style} />
        );
      })}
    </div>
  );
};

export default Characters;