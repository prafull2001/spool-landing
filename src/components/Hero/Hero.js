
import React from 'react';
import './Hero.css';

import homescreen from '../../assets/homescreen.PNG';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text" data-aos="fade-right" data-aos-delay="100">
          <h1 className="hero-title">Stop Mindless Scrolling With <span className="hero-title-accent">5-Second Voice Check-Ins</span></h1>
          <p className="hero-subtitle">Instead of a daily budget you burn through mindlessly, you actively request a few minutes each time you want to scroll. This turns one big limit into many small, conscious choices.</p>
          <p className="hero-available">📱 NOW AVAILABLE ON THE APP STORE!</p>
          <a href="https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone" className="hero-button" target="_blank" rel="noopener noreferrer">Download Now</a>
        </div>
        <div className="hero-image" data-aos="fade-left" data-aos-delay="300">
          <img src={homescreen} alt="Spool App Homescreen" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
