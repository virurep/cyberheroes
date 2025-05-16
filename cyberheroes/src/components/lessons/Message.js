import { useState } from 'react';
import Buttons from './Buttons';
import VocabPopup from '../util/VocabPopup';
import vocabData from '../../data/lessons/vocab.json';


export const processText = (text, onVocabClick) => {
  return text.split('\n').map((paragraph, index) => {
    // Split the paragraph by asterisks to find text to wrap in spans
    // const parts = paragraph.split(/(\*[^*]+\*)/g);

    const parts = paragraph.split(/(<[^*]+>[^*]+\*\*)/g);

    return (
      <p key={index}>
        {parts.map((part, i) => {

          // check if the part is a vocab word
          if (part.startsWith("<v>") && part.endsWith("**")) {
            const word = part.slice(3, -2);
            const vocab = vocabData.words.find(w => w.word.toLowerCase() === word.toLowerCase());
            if (vocab) {
              return (
                <span
                  key={i}
                  className="vocab-word"
                  onClick={() => onVocabClick(vocab || { word })}
                >
                  {word}
                </span>
              );
            }
            return <span key={i} className="vocab-word">{word}</span>;
          }

          // check if the part is an unordered list
          if (part.startsWith("<ul>") && part.endsWith("**")) {
            const item = part.slice(4, -2);
            const listItems = item.split("<li>");
            return (<ul>
              {listItems.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>)
          }

          // check if the part is an ordered list
          if (part.startsWith("<ol>") && part.endsWith("**")) {
            const item = part.slice(4, -2);
            const listItems = item.split("<li>");
            return (<ol>
              {listItems.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ol>)
          }

          // check if the part should be red
          if (part.startsWith("<red>") && part.endsWith("**")) {
            const text = part.slice(5, -2);
            return <span className="red-text">{text}</span>;
          }

          // check if the part should be gold
          if (part.startsWith("<gold>") && part.endsWith("**")) {
            const text = part.slice(6, -2);
            return <span className="gold-text">{text}</span>;
          }

          // check if the part should be underlined
          if (part.startsWith("<u>") && part.endsWith("**")) {
            const text = part.slice(3, -2);
            return <span className="underline-text">{text}</span>;
          }

          // check if the part should be bold
          if (part.startsWith("<b>") && part.endsWith("**")) {
            const text = part.slice(3, -2);
            return <span className="bold-text">{text}</span>;
          }

          return part;
        })}
      </p>
    );
  });
};

const Message = ({ message, onButtonClick, pageNum }) => {

  console.log("in message.js")
  const [selectedVocab, setSelectedVocab] = useState(null);

  const handleVocabClick = (vocab) => {
    setSelectedVocab(vocab);
  };

  const paragraphs = processText(message.text, handleVocabClick);
  const processedHeader = message.header ? processText(message.header, handleVocabClick) : null;

  console.log("message: ", message)
  console.log("paragraphs: ", paragraphs)

  const componentOutput = (
    <div className="text-container">
      {processedHeader && (
        <div className="text-header">{processedHeader}</div>
      )}
      {message.speaker && (
        <div className={`speaker-name ${message.speaker_style}`}>
          <p>{message.speaker.toUpperCase()}</p>
        </div>
      )}
      <div className={`message-box ${message.style}`}>
        <div className="lesson-text">{paragraphs}</div>
        <Buttons buttons={message.buttons} onClick={onButtonClick} pageNum={pageNum}/>
      </div>
      {selectedVocab && (
        <VocabPopup
          word={selectedVocab.word}
          definition={selectedVocab.definition}
          onClose={() => setSelectedVocab(null)}
        />
      )}
    </div>
  );

  console.log("Complete Message component output structure (React element):", componentOutput);

  return componentOutput;
};

export default Message;