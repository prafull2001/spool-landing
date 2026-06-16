"use client";
import React from 'react';
import ScrollHero from '../components/ScrollHero';
import PressProof from '../components/PressProof/PressProof.js';
import Features from '../components/Features/Features.js';
import CTA from '../components/CTA/CTA.js';
import FAQ from '../components/FAQ/FAQ.js';
import Footer from '../components/Footer/Footer.js';
import Popup from '../components/Popup/Popup.js';

const HomePage = () => {
  return (
    <>
      <ScrollHero />
      <PressProof />
      <Features />
      <CTA />
      <FAQ />
      <Footer />
      <Popup />
    </>
  );
};

export default HomePage;
