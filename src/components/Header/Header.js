
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { getCurrentConfig, getCurrentURL } from '../../config/appConfig';

import logo from '../../assets/Spool-Logo.png';

const Header = () => {
  const config = getCurrentConfig();
  const url = getCurrentURL();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/images/spooli_logo.jpg" alt="Spool Logo" />
        </Link>
        <nav className="header-nav">
          <Link to="/blog">Blog</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/support">Support</Link>
          <a href={url} className="download-button" target="_blank" rel="noopener noreferrer">{config.header_button}</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
