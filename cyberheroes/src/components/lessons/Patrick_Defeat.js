import {useNavigate} from 'react-router-dom';
import PatrickBoom from '../../img/characters/patrick_defeated.png';
import Poof from '../../img/general/poof.png';
import '../../styles/patrick_defeat.css';
import { useState } from 'react';
import Navbar from '../util/NavBar';

const PatrickDefeat = () => {
    const navigate = useNavigate();
    const [clickCount, setClickCount] = useState(0);
    const [showPoof, setShowPoof] = useState(false);
    const [key, setKey] = useState(0);

    const handlePatrickClick = () => {
        setKey(prev => prev + 1);
        if (clickCount < 2) {
            setClickCount(prev => prev + 1);
        } else {
            setClickCount(3);
            setShowPoof(true);
        }
    };

    const handleClick = () => {
        navigate('/privacy-moon/certificate');
    }

    return (
        <div className="patrick-defeat">
            <Navbar />
            <h1 className={`instruction-text ${showPoof ? 'fade-out' : ''}`}>
                CLICK ON PATRICK TO DEFEAT HIM FOR GOOD!
            </h1>
            {!showPoof && (
                <img 
                    key={key}
                    src={PatrickBoom} 
                    alt="Patrick Defeat" 
                    onClick={handlePatrickClick}
                    className={`patrick-image shake-${clickCount}`}
                />
            )}
            {showPoof && (
                <>
                    <img 
                        src={Poof} 
                        alt="Poof" 
                        className="poof-image"
                    />
                    <button onClick={handleClick} className="continue-button">
                        Continue
                    </button>
                </>
            )}
        </div>
    )
}

export default PatrickDefeat;