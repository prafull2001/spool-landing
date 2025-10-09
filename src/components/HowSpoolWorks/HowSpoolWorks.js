import React from 'react';
import './HowSpoolWorks.css';

const steps = [
  {
    icon: '📱',
    title: 'Select Distracting Apps',
    description: 'Choose which social media and entertainment apps trigger your doom scrolling habits.'
  },
  {
    icon: '🚫',
    title: 'Smart Intervention',
    description: 'When you try to open a blocked app, Spool creates a mindful pause before you scroll.'
  },
  {
    icon: '🎙️',
    title: 'Voice Check-In',
    description: 'Record a 5-second voice note asking: "Why am I opening this app right now?"'
  },
  {
    icon: '✅',
    title: 'Intentional Access',
    description: 'After your mindful check-in, you can proceed with conscious app usage.'
  },
  {
    icon: '🧘',
    title: 'Break the Habit',
    description: 'This proven technique reduces screen time by 25% and stops mindless scrolling.'
  }
];

const HowSpoolWorks = () => {
  return (
    <section className="how-spool-works">
      <div className="how-spool-works-container">
        <h2 className="how-spool-works-title" data-aos="fade-up">How to Stop Doom Scrolling in 5 Simple Steps</h2>
        <p className="how-spool-works-subtitle" data-aos="fade-up" data-aos-delay="100">Instead of a daily budget you burn through mindlessly, you actively request a few minutes each time you want to scroll. This turns one big limit into many small, conscious choices.</p>
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li 
              className="step-item" 
              key={index}
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
            >
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
