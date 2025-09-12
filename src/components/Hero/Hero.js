
import React from 'react';
import './Hero.css';

import homescreen from '../../assets/homescreen.PNG';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text" data-aos="fade-right" data-aos-delay="100">
          <h1 className="hero-title">🧵 Your focus is like a spool of thread. <span className="hero-title-accent">Don't let it run out.</span></h1>
          <p className="hero-subtitle">Spool helps you build healthier phone habits with 5-second voice check-ins.</p>
          <a href="#" className="hero-button">Download Now</a>
        </div>
        <div className="hero-image" data-aos="fade-left" data-aos-delay="300">
          <img src={homescreen} alt="Spool App Homescreen" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
