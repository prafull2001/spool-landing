
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import logo from '../../assets/Spool-Logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src={logo} alt="Spool Logo" />
        </Link>
        <nav className="header-nav">
          <Link to="/privacy">Privacy</Link>
          <a href="#" className="download-button">Download</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
