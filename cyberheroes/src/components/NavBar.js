import React from 'react';
import logo from '../img/logo.png';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Cyberheroes Logo" className="navbar-logo" />
        </Link>
        <Link to="/" className="title-link">
          <div className="navbar-title">Cyberheroes</div>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/exploration-map" className="home-button">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;