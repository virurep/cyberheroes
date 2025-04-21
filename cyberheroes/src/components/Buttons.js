const Buttons = ({ buttons, onClick }) => {
  console.log("in Buttons.js");
  console.log(buttons);

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
        />
      )}
    </div>
  );
};

export default Buttons;