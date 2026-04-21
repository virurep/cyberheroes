/* CursorAI was used to help with the processText function and the export of it */

import { useRef, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Buttons from './Buttons';
import VocabPopup from '../util/VocabPopup';
import { getVocab } from '../../content/loader';

// Global fallback vocab used when processText is called outside a component context
// (e.g., from LessonIntro). Callers should prefer processTextWithVocab when possible.
let _fallbackVocab = null;

/**
 * Process text with an explicit vocab list (no dependency on useParams).
 */
export const processTextWithVocab = (text, onVocabClick, vocabWords) => {
  return text.split('\n').map((paragraph, index) => {

    const parts = paragraph.split(/(<[^*]+>[^*]+\*\*)/g);

    return (
      <p key={index}>
        {parts.map((part, i) => {

          // check if the part is a vocab word
          if (part.startsWith("<v>") && part.endsWith("**")) {
            const word = part.slice(3, -2);
            const vocab = vocabWords
              ? vocabWords.find(w => w.word.toLowerCase() === word.toLowerCase())
              : null;
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

/**
 * Backward-compatible processText that uses the fallback vocab.
 * Callers that need planet-specific vocab should use processTextWithVocab directly.
 */
export const processText = (text, onVocabClick) => {
  return processTextWithVocab(text, onVocabClick, _fallbackVocab);
};

/**
 * Set the fallback vocab words for processText calls outside of component context.
 * Called by Message component with planet-specific vocab.
 */
export const setFallbackVocab = (words) => {
  _fallbackVocab = words;
};

const Message = ({ message, onButtonClick, pageNum, maxPage }) => {
  const { planet } = useParams();
  const vocabData = getVocab(planet);
  const vocabWords = vocabData?.words || [];

  // Update fallback vocab so processText calls from other components use this planet's vocab
  _fallbackVocab = vocabWords;

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

  const paragraphs = processTextWithVocab(message.text, handleVocabClick, vocabWords);
  const processedHeader = message.header ? processTextWithVocab(message.header, handleVocabClick, vocabWords) : null;

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