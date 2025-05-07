import { useState } from 'react';
import Buttons from './Buttons';
import VocabPopup from './VocabPopup';
import vocabData from '../data/lessons/vocab.json';

const Message = ({ message, onButtonClick }) => {
  const [selectedVocab, setSelectedVocab] = useState(null);

  const processText = (text) => {
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
                    onClick={() => setSelectedVocab(vocab)}
                  >
                    {word}
                  </span>
                );
              }
              return <span key={i} className="vocab-word">{word}</span>;
            }

            // check if the part is a list item
            if (part.startsWith("<li>") && part.endsWith("**")) {
              const item = part.slice(4, -2);
              const listItems = item.split("<ul>");
              console.log(item);
              console.log(listItems);
              return listItems.map((item, i) => {
                return <li key={i}>{item}</li>;
              });
            }

            // check if the part should be red
            if (part.startsWith("<red>") && part.endsWith("**")) {
              const text = part.slice(5, -2);
              return <span className="red-text">{text}</span>;
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
      {selectedVocab && (
        <VocabPopup
          word={selectedVocab.word}
          definition={selectedVocab.definition}
          onClose={() => setSelectedVocab(null)}
        />
      )}
    </div>
  );
};

export default Message;