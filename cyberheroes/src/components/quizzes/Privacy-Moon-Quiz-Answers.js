import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../NavBar';
import '../../styles/quiz.css';
import Alejandro from '../../img/characters/alejandro.png';

// Safes for the letter reaveal in the answer
import letter1 from '../../img/quizzes/safes/1-letter.png';
import letter2 from '../../img/quizzes/safes/2-letter.png';
import letter3 from '../../img/quizzes/safes/3-letter.png';
import letter4 from '../../img/quizzes/safes/4-letter.png';
import letter5 from '../../img/quizzes/safes/5-letter.png';

const QuizAnswers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedAnswer, currentQuestion, questionIndex, part, currentQuiz } = location.state || {};
    const [isRevealed, setIsRevealed] = useState(false);

    // Check if the selected answer is correct
    const isCorrect = Array.isArray(selectedAnswer)
        ? selectedAnswer.length === currentQuestion.correctAnswers.length &&
          currentQuestion.correctAnswers.every(correctIndex =>
            selectedAnswer.includes(currentQuestion.answers[correctIndex]))
        : currentQuestion.correctAnswers.includes(currentQuestion.answers.indexOf(selectedAnswer));

    const handleRevealLetter = () => {
        setIsRevealed(true);
    }

    const handleNextQuestion = () => {
        if (currentQuiz.quiz.length === questionIndex + 1) {
            // If this is the last question of quiz-3, go to certificate
            console.log("last question, nav to lesson page #", currentQuestion.lessonPage);
                navigate(`/privacy-moon/certificate`, { //change to lesson page for final quiz
                    state: {
                        page: currentQuestion.lessonPage
                    }
                });
        } else {
            navigate(`/privacy-moon/quiz/final-quiz`, {
                state: {
                    questionIndex: questionIndex + 1,
                    part: part
                }
            });
        }
    };

    if(isRevealed){
        //show safe with letters
        return (
            <div className="privacy-moon-quiz-background">
                <Navbar />
                <div className="answers-container">
                   <img src={
                    currentQuestion.id === 1 ? letter1 :
                    currentQuestion.id === 2 ? letter2 :
                    currentQuestion.id === 3 ? letter3 :
                    currentQuestion.id === 4 ? letter4 :
                    letter5
                   } alt={"Safe With Password"} className="characters-answers-img" />
                   <button className="quiz-next-btn quiz-next-btn-revealed" onClick={handleNextQuestion}>
                            Next Question
                    </button>
                </div>
            </div>
        )
    } else if (isCorrect) {
        //correct answer
        return (
            <div className="privacy-moon-quiz-background">
                <Navbar />
                <div className="answers-container privacy-moon-quiz-answers-container">
                    <div className="text-answers-container dark-answers-container">
                        <h1 className="text-answers-title red-text">
                            Correct!
                        </h1>
                        <p className="text-answers-text red-text">
                            {currentQuestion.correctMessage[0]}
                        </p>
                        <button className="quiz-next-btn reveal-letter-btn" onClick={handleRevealLetter}>
                            Reveal Letter
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        //incorrect answer
        return (
            <div className="privacy-moon-quiz-background">
                <Navbar />
                <div className="answers-container">
                    <div className="characters-answers-container">
                        <img src={Alejandro} alt={"Alejandro"} className="characters-answers-img" />
                    </div>
                    <div className="text-answers-container dark-answers-container">
                        <h1 className="text-answers-title red-text">
                            Incorrect
                        </h1>
                        <p className="text-answers-text red-text">
                            {Array.isArray(selectedAnswer)
                                ? currentQuestion.incorrectMessages[0]
                                : currentQuestion.incorrectMessages[currentQuestion.answers.indexOf(selectedAnswer)]}
                        </p>
                        <p className="text-answers-text answer-hint">
                            {currentQuestion.hint}
                        </p>
                        <button className="quiz-try-again-btn" onClick={() => navigate(`/privacy-moon/quiz/final-quiz`, { state: { questionIndex, part: part } })}>
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default QuizAnswers;