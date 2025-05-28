/* CursorAI was used to help with the processText function and the export of it */

import { useRef, useLayoutEffect, useState } from 'react';
import Buttons from './Buttons';
import VocabPopup from '../util/VocabPopup';
import vocabData from '../../data/lessons/vocab.json';


export const processText = (text, onVocabClick) => {
  return text.split('\n').map((paragraph, index) => {

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

const Message = ({ message, onButtonClick, pageNum, maxPage }) => {
  const messageRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    if (messageRef.current) {
      const height = messageRef.current.offsetHeight;
      setOffset(height);
    }
  }, [message]);

  const [selectedVocab, setSelectedVocab] = useState(null);

  const handleVocabClick = (vocab) => {
    setSelectedVocab(vocab);
  };

  const paragraphs = processText(message.text, handleVocabClick);
  const processedHeader = message.header ? processText(message.header, handleVocabClick) : null;

  const componentOutput = (
    <div className="text-container">
      {processedHeader && (
        <div className="text-header">{processedHeader}</div>
      )}
      {message.speaker && (
        <div
          className={`speaker-name ${message.speaker_style}`}
          style={{
            position: "absolute",
            bottom: `${offset}px`,
          }}
        >
          <p>{message.speaker.toUpperCase()}</p>
        </div>
      )}
      <div
        ref={messageRef}
        className={`message-box ${message.style}`}
      >
        <div className="lesson-text">{paragraphs}</div>
        <Buttons buttons={message.buttons} onClick={onButtonClick} pageNum={pageNum} maxPage={maxPage}/>
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

  return componentOutput;
};

export default Message;