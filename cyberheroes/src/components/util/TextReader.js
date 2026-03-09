/* Cursor AI was used to help with the text reader functionality */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import '../../styles/TextReader.css';
import speaker from '../../img/general/speaker.png';
import pause from '../../img/general/pause.png';
import resume from '../../img/general/play.png';
import stop from '../../img/general/stop.png';
import playNext from '../../img/general/play-next.png';

const TextReader = forwardRef((props, ref) => {
    const [isReading, setIsReading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [lastReadableText, setLastReadableText] = useState('');

    const handleStopReading = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        setIsFirstClick(true);  // Reset to speaker button when stopped
        // Remove all highlights
        document.querySelectorAll('.word-highlight').forEach(el => {
            el.classList.remove('word-highlight');
        });
    };

    // Expose the stop function to parent components
    useImperativeHandle(ref, () => ({
        stopReading: handleStopReading
    }));

    // Watch for changes in readable text content
    useEffect(() => {
        const readableElements = document.getElementsByClassName('readable-text');
        const currentText = Array.from(readableElements).map(el => el.textContent).join('');


        if (currentText !== lastReadableText) {
            handleStopReading();
            setLastReadableText(currentText);
        }
    });

    // Stop reading when component unmounts
    useEffect(() => {
        return () => {
            handleStopReading();
        };
    }, []);

    const handleTextReader = () => {
        if (isFirstClick) {
            setIsFirstClick(false);
        }

        // Get all elements with the readable-text class
        const readableElements = document.getElementsByClassName('readable-text');
        let textToRead = '';
        let wordElements = [];

        // First pass: collect all text and prepare elements
        Array.from(readableElements).forEach(element => {
            // Get all text nodes within the element, including nested ones
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Skip empty text nodes and nodes that are already wrapped
                        if (!node.textContent.trim() || node.parentNode.classList?.contains('word')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );

            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent;
                textToRead += text + ' ';

                // Split text into words while preserving whitespace
                const words = text.split(/(\s+)/);
                words.forEach((word, index) => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.textContent = word;
                        span.className = 'word';
                        node.parentNode.insertBefore(span, node);
                        wordElements.push(span);
                    } else if (word) {
                        // Preserve whitespace
                        const textNode = document.createTextNode(word);
                        node.parentNode.insertBefore(textNode, node);
                    }
                });
                if (node) {
                    node.parentNode.removeChild(node);
                }
            }
        });

        // Create utterance with the combined text
        const utterance = new SpeechSynthesisUtterance(textToRead.trim());

        // Track word boundaries
        let wordIndex = 0;
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                // Remove highlight from previous word
                if (wordIndex > 0) {
                    wordElements[wordIndex - 1]?.classList.remove('word-highlight');
                }
                // Add highlight to current word
                if (wordElements[wordIndex]) {
                    wordElements[wordIndex].classList.add('word-highlight');
                }
                wordIndex++;
            }
        };

        // Reset when speech ends
        utterance.onend = () => {
            setIsReading(false);
            setIsPaused(false);
            setCurrentWordIndex(-1);
            // Change to playNext button after first block
            if (isFirstClick) {
                setIsFirstClick(false);
            }
            // Remove all highlights
            wordElements.forEach(el => el.classList.remove('word-highlight'));
        };

        // Handle pause/resume
        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
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

    return (
        <div style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 1000 }}>
            <div className="text-reader-controls">
                {!isReading && !isPaused && (
                    <button className="text-reader-btn speaker-btn" onClick={handleTextReader}>
                        <img src={isFirstClick ? speaker : playNext} alt="Speaker" className="speaker-icon" />
                    </button>
                )}
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
});

export default TextReader;