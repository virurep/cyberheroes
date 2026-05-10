import React from 'react';
import logo from '../../img/general/logo.png';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Cyberheroes Logo" className="navbar-logo" />
        </Link>
        <Link to="/" className="logo-link">
          <span className="navbar-title">
            <span className="cyber">CYBER</span>
            <span className="heroes">HEROES</span>
          </span>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/about" className={`nav-link${pathname === '/about' ? ' active' : ''}`}>ABOUT</Link>
        <Link to="/exploration-map" className={`nav-link${pathname === '/exploration-map' ? ' active' : ''}`}>HOME</Link>
      </div>
    </nav>
  );
};

export default Navbar;
