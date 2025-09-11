import React from 'react';
import './HowSpoolWorks.css';

const steps = [
  {
    icon: '📱',
    title: 'Select Your Apps',
    description: 'Choose which distracting apps you want Spool to monitor.'
  },
  {
    icon: '🚫',
    title: 'Spool Intervenes',
    description: 'When you open a blocked app, Spool steps in before it launches.'
  },
  {
    icon: '🎙️',
    title: 'Record Your Intention',
    description: 'A 5-second voice note asks: "Why am I opening this app?"'
  },
  {
    icon: '✅',
    title: 'Access Granted',
    description: 'After your voice check-in, you get access to the app.'
  },
  {
    icon: '🧘',
    title: 'Mindful Reflection',
    description: 'This simple pause is proven to reduce mindless scrolling by 25%.'
  }
];

const HowSpoolWorks = () => {
  return (
    <section className="how-spool-works">
      <div className="how-spool-works-container">
        <h2 className="how-spool-works-title">The Spool Flow</h2>
        <p className="how-spool-works-subtitle">A simple 5-step process that transforms your relationship with technology</p>
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li className="step-item" key={index}>
              <div className="step-number">{index + 1}</div>
              <div className="step-emoji">{step.icon}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowSpoolWorks;
