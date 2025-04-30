import Buttons from './Buttons';

const Message = ({ message, onButtonClick }) => {
  const processText = (text) => {
    return text.split('\n').map((paragraph, index) => {
      // Split the paragraph by asterisks to find text to wrap in spans
      const parts = paragraph.split(/(\*[^*]+\*)/g);

      return (
        <p key={index}>
          {parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              // Remove the asterisks and wrap in span
              return <span key={i} className="vocab-word">{part.slice(1, -1)}</span>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  const paragraphs = processText(message.text);

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