const Buttons = ({ buttons }) => {
  console.log("in Buttons.js");
  console.log(buttons);

  return (
    <div className="button-container">
      {buttons.prev && (
        <button className="lesson-button prev-button"></button>
      )}
      {buttons.next && (
        <button className="lesson-button next-button"></button>
      )}
    </div>
  );
};

export default Buttons;