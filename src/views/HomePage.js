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
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#8a8378',
          margin: '0 0 24px',
        }}
      >
        {/* lowercase `datetime` (not React's `dateTime`) so the SSR HTML
            carries the spec-cased attribute AI-readiness scanners grep for */}
        <time datetime="2026-07-14">Last updated July 14, 2026</time>
      </p>
      <Footer />
      <Popup />
    </>
  );
};

export default HomePage;
