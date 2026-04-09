"use client";
import React from 'react';
import './Screenshots.css';
import homescreen from '../../assets/homescreen.webp';
import voicenote from '../../assets/voicenote.webp';
import statsscreen from '../../assets/statsscreen.webp';
import howspoolworks from '../../assets/howspoolworks.webp';
import excuseinsights from '../../assets/excuseinsights.webp';
import friendexcuses from '../../assets/friendsexcuse.webp';

const screenshots = [
  { src: homescreen, alt: 'Spool Homescreen' },
  { src: voicenote, alt: 'Spool Voice Note' },
  { src: statsscreen, alt: 'Spool Stats Screen' },
  { src: howspoolworks, alt: 'How Spool Works' },
  { src: excuseinsights, alt: 'Excuse Insights' },
  { src: friendexcuses, alt: 'Friend Excuses' },
];

const Screenshots = () => {
  return (
    <section className="screenshots">
      <div className="screenshots-container">
        <h2 className="screenshots-title">See Spool in Action</h2>
        <div className="screenshots-grid">
          {screenshots.map((screenshot, index) => (
            <img key={index} src={screenshot.src} alt={screenshot.alt} className="screenshot-image" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Screenshots;
