import React, { useState } from 'react';

const Buttons = ({ buttons, onClick, pageNum }) => {
  const [inputValue, setInputValue] = useState(pageNum);

  console.log(buttons)
  console.log(pageNum)

  const handleClick = (page) => {
    onClick(page);
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleInputKeyPress = (e) => {
    console.log(parseInt(inputValue));
    if (e.key === 'Enter') {
      handleClick(parseInt(inputValue));
    }
  }

  return (
    <div className="button-container">
      {buttons.prev && (
        <button
          className="lesson-button prev-button"
          onClick={() => handleClick(buttons.prev)}
        />
      )}
      {!buttons.none && <input
        className="lesson-page-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
      />}
      {buttons.next && (
        <button
          className="lesson-button next-button"
          onClick={() =>handleClick(buttons.next)}
        />
      )}
      {buttons.continue && (
        <button
          className={buttons.continue.style}
          onClick={() =>handleClick(buttons.continue.next)}
        >
          {buttons.continue.text && buttons.continue.text}
        </button>
      )}
    </div>
  );
};

export default Buttons;