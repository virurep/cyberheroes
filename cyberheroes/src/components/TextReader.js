import { useState, useEffect } from 'react';
import '../styles/TextReader.css';
import speaker from '../img/general/speaker.png';
import pause from '../img/general/pause.png';
import resume from '../img/general/play.png';
import stop from '../img/general/stop.png';

const TextReader = () => {
    const [isReading, setIsReading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Stop reading when component unmounts
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            setIsReading(false);
            setIsPaused(false);
        };
    }, []);

    const handleTextReader = () => {
        // Get all elements with the readable-text class
        const readableElements = document.getElementsByClassName('readable-text');
        let textToRead = '';

        // Combine text from all readable elements
        Array.from(readableElements).forEach(element => {
            textToRead += element.textContent + ' ';
        });

        const utterance = new SpeechSynthesisUtterance(textToRead.trim());

        // Hide buttons when speech ends
        utterance.onend = () => {
            setIsReading(false);
            setIsPaused(false);
        };

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
        <div style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 1000 }}>
        {/* // <div> */}
            <div className="text-reader-controls">
                <button className="text-reader-btn speaker-btn" onClick={handleTextReader}>
                    <img src={speaker} alt="Speaker" className="speaker-icon" />
                </button>
                {isReading && !isPaused && (
                    <button className="text-reader-btn pause-btn" onClick={handlePauseReading}>
                        <img src={pause} alt="Pause" className="pause-icon" />
                    </button>
                )}
                {isPaused && (
                    <button className="text-reader-btn resume-btn" onClick={handleResumeReading}>
                        <img src={resume} alt="Resume" className="resume-icon" />
                    </button>
                )}
                {(isReading || isPaused) && (
                    <button className="text-reader-btn stop-btn" onClick={handleStopReading}>
                        <img src={stop} alt="Stop" className="stop-icon" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default TextReader;