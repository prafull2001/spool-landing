import React from 'react';
import './Screenshots.css';
import homescreen from '../../assets/homescreen.PNG';
import voicenote from '../../assets/voicenote.PNG';
import statsscreen from '../../assets/statsscreen.PNG';
import howspoolworks from '../../assets/howspoolworks.PNG';
import excuseinsights from '../../assets/excuseinsights.PNG';
import friendexcuses from '../../assets/friendsexcuse.PNG';

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