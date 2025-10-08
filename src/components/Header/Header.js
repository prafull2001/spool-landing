
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
          <Link to="/support">Support</Link>
          <a href="https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone" className="download-button" target="_blank" rel="noopener noreferrer">Download App</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
