import { createPortal } from 'react-dom';
import '../styles/lesson.css';

const VocabPopup = ({ word, definition, onClose }) => {
  const handleOverlayClick = (e) => {
    // Only close if the overlay itself is clicked, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="vocab-popup-overlay" onClick={handleOverlayClick}>
      <div className="vocab-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{word}</h3>
        <p>{definition}</p>
      </div>
    </div>,
    document.body
  );
};

export default VocabPopup;