
import React from 'react';
import './Features.css';

const features = [
  { 
    icon: '🎙️',
    title: 'Voice Check-ins',
    description: 'Break mindless scrolling with 5-second voice notes that create awareness before opening distracting apps.'
  },
  { 
    icon: '🧑‍🤝‍🧑',
    title: 'Friend Accountability',
    description: 'Share your digital wellness goals with friends and build supportive habits together.'
  },
  { 
    icon: '📊',
    title: 'Screen Time Insights',
    description: 'Get AI-powered insights into your phone usage patterns and doom scrolling triggers.'
  },
  { 
    icon: '🚫',
    title: 'Smart App Blocking',
    description: 'Flexible blocking system that adapts to your schedule and mindful technology goals.'
  },
  { 
    icon: '🧘',
    title: 'Mindful Pauses',
    description: 'Reduce screen time by 25% with proven mindfulness techniques and intentional phone use.'
  },
  { 
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your digital wellness data stays private and secure. We never share personal information.'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title" data-aos="fade-up">Digital Wellness Features to Break Phone Addiction</h2>
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
