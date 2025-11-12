
import React from 'react';
import './Features.css';

const features = [
  { 
    icon: '/images/spooli_block.png',
    title: 'Block distractions',
    description: 'Stop mindless scrolling with smart app blocking when you need focus'
  },
  { 
    icon: '/images/spooli_brain.png',
    title: 'Understand your triggers',
    description: 'Discover what drives your phone usage and build awareness'
  },
  { 
    icon: '/images/spooli_point.png',
    title: 'Get daily insights',
    description: 'Track progress with personalized analytics on your digital habits'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title" data-aos="fade-up">Take control today</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className="feature-card" 
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="feature-icon">
                <img src={feature.icon} alt={feature.title} />
              </div>
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
