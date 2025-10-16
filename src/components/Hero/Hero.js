
import React from 'react';
import './Hero.css';
import { getCurrentConfig, getCurrentURL } from '../../config/appConfig';

import homescreen from '../../assets/homescreen.PNG';

const Hero = () => {
  const config = getCurrentConfig();
  const url = getCurrentURL();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text" data-aos="fade-right" data-aos-delay="100">
          <h1 className="hero-title">Your Screen is stealing your focus.<span className="hero-title-accent">Unwind Wisely. 🧵</span></h1>
          <p>Reduce your screen usage using AI voice journals. Turn a mindless act into small conscious decisions.</p>
          <p className="hero-available">{config.hero_status}</p>
          <a href={url} className="hero-button" target="_blank" rel="noopener noreferrer">{config.hero_button}</a>
        </div>
        <div className="hero-image" data-aos="fade-left" data-aos-delay="300">
          <img src={homescreen} alt="Spool App Homescreen" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
