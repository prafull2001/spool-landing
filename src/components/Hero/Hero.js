
import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import { getCurrentURL } from '../../config/appConfig';

import logo from '../../assets/Spool-Logo.png';
import appBoquet from '../../assets/app_boquet.png';
import appStoreBadge from '../../assets/app-store-badge.svg';

const Hero = () => {
  const url = getCurrentURL();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-header">
          <Link to="/" className="hero-logo-center">
            <img src={logo} alt="Spool Logo" />
            <span className="hero-brand-name">Spool</span>
          </Link>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">Your Screen is stealing your focus.</span><br/>
            <span className="hero-title-accent">Unwind Wisely. 🧵</span>
          </h1>
          <a href={url} className="app-store-button" target="_blank" rel="noopener noreferrer">
            <img src={appStoreBadge} alt="Download on the App Store" />
          </a>
          <div className="hero-image">
            <img src={appBoquet} alt="Spool App Screenshots" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
