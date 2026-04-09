import React from 'react';

// maxPage used if page change input is in use, error checkng for invalid page num
const Buttons = ({ buttons, onClick, pageNum, maxPage }) => {
  const handleClick = (page) => {
    onClick(page);
  }

  return (
    <div className="button-container">
      {buttons.prev && (
        <button
          className="lesson-button prev-button"
          onClick={() => handleClick(buttons.prev)}
        />
      )}
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