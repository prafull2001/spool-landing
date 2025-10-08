
import React from 'react';
import Header from '../components/Header/Header.js';
import Hero from '../components/Hero/Hero.js';
import Features from '../components/Features/Features.js';
import Screenshots from '../components/Screenshots/Screenshots.js';
import FriendExcuses from '../components/FriendExcuses/FriendExcuses.js';
import HowSpoolWorks from '../components/HowSpoolWorks/HowSpoolWorks.js';
import FriendTransparency from '../components/FriendTransparency/FriendTransparency.js';
import AIInsights from '../components/AIInsights/AIInsights.js';
import Stats from '../components/Stats/Stats.js';
import CTA from '../components/CTA/CTA.js';
import Footer from '../components/Footer/Footer.js';
import Popup from '../components/Popup/Popup.js';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <HowSpoolWorks />
      <AIInsights />
      <FriendTransparency />
      <Stats />
      <CTA />
      <Footer />
      <Popup />
    </>
  );
};

export default HomePage;
