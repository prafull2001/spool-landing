
import React from 'react';
import './Features.css';

const features = [
  { 
    icon: '🚫',
    title: 'Block Distraction',
    description: 'Prevent mindless scrolling by blocking distracting apps when you need to focus.'
  },
  { 
    icon: '🧠',
    title: 'Understand Your Triggers',
    description: 'Discover what drives your phone usage and learn to recognize patterns.'
  },
  { 
    icon: '📊',
    title: 'Get Daily Insights',
    description: 'Receive personalized insights about your digital habits and progress.'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title" data-aos="fade-up">Start Unwinding Wisely 🪡</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className="feature-card" 
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
