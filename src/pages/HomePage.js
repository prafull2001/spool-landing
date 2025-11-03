
import React from 'react';
import Hero from '../components/Hero/Hero.js';
import Features from '../components/Features/Features.js';
import CTA from '../components/CTA/CTA.js';
import Footer from '../components/Footer/Footer.js';
import Popup from '../components/Popup/Popup.js';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <CTA />
      <Footer />
      <Popup />
    </>
  );
};

export default HomePage;
