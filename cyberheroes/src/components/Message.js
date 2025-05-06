import { useState } from 'react';
import Buttons from './Buttons';
import VocabPopup from './VocabPopup';
import vocabData from '../data/lessons/vocab.json';

const Message = ({ message, onButtonClick }) => {
  const [selectedVocab, setSelectedVocab] = useState(null);

  const processText = (text) => {
    return text.split('\n').map((paragraph, index) => {
      // Split the paragraph by asterisks to find text to wrap in spans
      const parts = paragraph.split(/(\*[^*]+\*)/g);

      return (
        <p key={index}>
          {parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              const word = part.slice(1, -1);
              const vocab = vocabData.words.find(w => w.word.toLowerCase() === word.toLowerCase());
              if (vocab) {
                return (
                  <span
                    key={i}
                    className="highlight vocab-word"
                    onClick={() => setSelectedVocab(vocab)}
                  >
                    {word}
                  </span>
                );
              }
              return <span key={i} className="highlight">{word}</span>;
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