import { useState } from 'react';
import '../styles/TextReader.css';

const TextReader = () => {
    const [isReading, setIsReading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const handleTextReader = () => {
        const textToRead = document.body.innerText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
        setIsPaused(false);
    };

    const handlePauseReading = () => {
        if (isReading) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        }
    };

    const handleResumeReading = () => {
        if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        }
    };

    const handleStopReading = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setIsPaused(false);
    };

    return (
        <div>
            <button onClick={handleTextReader}>Read Text</button>
            <button onClick={handlePauseReading}>Pause</button>
            <button onClick={handleResumeReading}>Resume</button>
            <button onClick={handleStopReading}>Stop</button>
        </div>
    );
}

export default TextReader;