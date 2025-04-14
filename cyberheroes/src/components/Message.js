import Buttons from './Buttons';

const Message = ({ message }) => {
  return (
    <div className="text-container">
      {message.speaker && (
        <div className={`speaker-name ${message.speaker_style}`}>
          <p>{message.speaker.toUpperCase()}</p>
        </div>
      )}
      <div className={`message-box ${message.style}`}>
        <p>{message.text}</p>
      </div>
      <Buttons buttons={message.buttons} />
    </div>
  );
};

export default Message;