import logo from './logo.svg';
import './App.css';
import Button from './components/Button';

function Lesson() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          CYBERHEROESSSS
        </a>
      </header>
      <Button onClick={() => console.log('Button clicked!')}>Enter Privacy Planet!</Button>
    </div>
  );
}

export default Lesson;
