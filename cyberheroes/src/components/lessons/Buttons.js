import React, { useState } from 'react';

// maxPage used if page change input is in use, error checkng for invalid page num
const Buttons = ({ buttons, onClick, pageNum, maxPage }) => {
  const [inputValue, setInputValue] = useState(pageNum);

  const handleClick = (page) => {
    onClick(page);
  }

  // input for page number
  // not in use, but could be used to navigate to a specific page during dev
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  // same as ^^
  const handleInputKeyPress = (e) => {
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
      {/* input for page number (NOT IN USE) */}
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