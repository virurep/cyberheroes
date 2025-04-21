import Buttons from './Buttons';

const Message = ({ message, onButtonClick }) => {

  const paragraphs = message.text.split('\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));

  return (
    <div className="text-container">
      {message.speaker && (
        <div className={`speaker-name ${message.speaker_style}`}>
          <p>{message.speaker.toUpperCase()}</p>
        </div>
      )}
      <div className={`message-box ${message.style}`}>
        <div className="lesson-text">{paragraphs}</div>
        <Buttons buttons={message.buttons} onClick={onButtonClick} />
      </div>
      {/* <Buttons buttons={message.buttons} onClick={onButtonClick} /> */}
    </div>
  );
};

export default Message;