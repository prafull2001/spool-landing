
import React from 'react';
import './Stats.css';
import croppedstats from '../../assets/croppedstats.PNG';

const Stats = () => {
  return (
    <section className="stats">
      <div className="stats-container">
        <h2 className="stats-title">Your Progress, Visualized</h2>
        <p className="stats-subtitle">Spool provides detailed statistics and analytics to help you understand and improve your phone habits.</p>
        <div className="stats-image">
          <img src={croppedstats} alt="Spool Statistics" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
