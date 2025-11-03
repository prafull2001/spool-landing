
import React from 'react';
import './Features.css';

const features = [
  { 
    icon: '📊',
    title: 'Track your usage',
    description: 'See exactly how much time you waste on social media'
  },
  { 
    icon: '⏰',
    title: 'Set limits',
    description: 'Create boundaries for healthier digital habits'
  },
  { 
    icon: '🧠',
    title: 'Focus mode',
    description: 'Block distractions when you need to concentrate'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title" data-aos="fade-up">Ready to take control</h2>
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
