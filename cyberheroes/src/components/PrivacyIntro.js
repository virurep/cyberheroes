// import '../style.css';
import '../styles/intro.css';
import { useNavigate } from "react-router-dom";
import computer from "../img/general/computer.png";
import patrick from "../img/characters/patrick-wanted.png";

const PrivacyIntro = () => {

  const navigate = useNavigate();

  const enterLesson = () => {
    // TODO: Enter lesson
  };

  return (
    <div className="privacy-intro-container">
      <div className="computer-container">
        <img src={computer} alt="Computer" className="computer-image" />
        <div className="computer-content">
          <img src={patrick} alt="Patrick Wanted Picture" className="patrick-image" />
          <div className="intro-message">
            <p>Hello Cyber Hero!  We are told that Patrick the Predatorus is keeping something very valuable that he stole. We need your help to find what he stole and bring it back to us. This journey will be dangerous, be very careful about ANYONE that you meet on Privacy Planet!</p>
            <button className="enter-lesson-btn" onClick={enterLesson}>START YOUR ADVENTURE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyIntro;