const Message = ({ message }) => {
  console.log("in Message.js");
  console.log(message);
  return (
    <div className="text-container">
    <div className={`speaker-name ${message.speaker_style}`}>
      <p>{message.speaker.toUpperCase()}</p>
    </div>
    <div className={`message-box ${message.style}`}>
      <p>{message.text}</p>
    </div>
  </div>
  );
};

export default Message;