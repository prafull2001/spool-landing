import React from 'react';
import ScrollHero from '../components/ScrollHero';
import Features from '../components/Features/Features.js';
import CTA from '../components/CTA/CTA.js';
import Footer from '../components/Footer/Footer.js';
import Popup from '../components/Popup/Popup.js';

const HomePage = () => {
  return (
    <>
      <ScrollHero />
      <Features />
      <CTA />
      <Footer />
      <Popup />
    </>
  );
};

export default HomePage;
