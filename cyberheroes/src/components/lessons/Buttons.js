import React, { useState } from 'react';

const Buttons = ({ noButtons, button, onNext, onPrev, onNavigate, pageNum, maxPage }) => {
  const [inputValue, setInputValue] = useState(pageNum + 1);

  if (noButtons) return <div className="button-container" />;

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      const target = parseInt(inputValue);
      if (!isNaN(target)) onNavigate(target - 1);
    }
  };

  return (
    <div className="button-container">
      {pageNum > 0 && (
        <button className="lesson-button prev-button" onClick={onPrev} />
      )}
      <input
        className="lesson-page-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleInputKeyPress}
      />
      {button ? (
        <button className={button.style} onClick={() => onNavigate(button.to)}>
          {button.text}
        </button>
      ) : (
        pageNum < maxPage - 1 && (
          <button className="lesson-button next-button" onClick={onNext} />
        )
      )}
    </div>
  );
};

export default Buttons;
