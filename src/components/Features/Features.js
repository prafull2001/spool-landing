
import React from 'react';
import './Features.css';

const features = [
  { 
    icon: '🎙️',
    title: 'Voice Check-ins',
    description: 'A 5-second voice note is all it takes to mindfully open distracting apps.'
  },
  { 
    icon: '🧑‍🤝‍🧑',
    title: 'Friend Accountability',
    description: 'Share your intentions with friends and hold each other accountable.'
  },
  { 
    icon: '📊',
    title: 'Smart Insights',
    description: 'Get personalized insights into your app usage and habits.'
  },
  { 
    icon: '🚫',
    title: 'Flexible Blocking',
    description: 'Customize which apps to block and when.'
  },
  { 
    icon: '🧘',
    title: 'Mindful Pauses',
    description: 'Reduce screen time by an average of 25% with our proven methods.'
  },
  { 
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your data is 100% private and secure. We never share it with anyone.'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title" data-aos="fade-up">Everything you need to build a healthier relationship with your phone.</h2>
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
