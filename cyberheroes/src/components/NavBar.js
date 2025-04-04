import React from 'react';
import logo from '../img/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Cyberheroes Logo" className="navbar-logo" />
        <div className="navbar-title">Cyberheroes</div>
      </div>
      <div className="navbar-right">
        <Link to="/exploration-map" className="home-button">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;