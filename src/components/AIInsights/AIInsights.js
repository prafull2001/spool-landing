
import React from 'react';
import './AIInsights.css';
import croppedinsights1 from '../../assets/croppedinsights1.PNG';
import croppedinsights2 from '../../assets/croppedinsights2.PNG';

const insights = [
  {
    icon: '💡',
    title: 'Emotional Triggers',
    description: 'Discover patterns like opening Instagram when you feel lonely.'
  },
  {
    icon: '📈',
    title: 'Usage Trends',
    description: 'Beautiful charts show your daily, weekly, and monthly progress.'
  },
  {
    icon: '🎯',
    title: 'Personalized Recommendations',
    description: 'Get actionable advice to break your specific habits.'
  }
];

const AIInsights = () => {
  return (
    <section className="ai-insights">
      <div className="ai-insights-container">
        <h2 className="ai-insights-title" data-aos="fade-up">AI-Powered Insights</h2>
        <p className="ai-insights-subtitle" data-aos="fade-up" data-aos-delay="100">Spool's AI analyzes your voice patterns to give you a deeper understanding of your habits.</p>
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div 
              className="insight-card" 
              key={index}
              data-aos="flip-left"
              data-aos-delay={index * 150}
            >
              <div className="insight-icon">{insight.icon}</div>
              <h3 className="insight-title">{insight.title}</h3>
              <p className="insight-description">{insight.description}</p>
            </div>
          ))}
        </div>
        <div className="insight-images">
          <img src={croppedinsights1} alt="Excuse Insights 1" data-aos="zoom-in" data-aos-delay="300" />
          <img src={croppedinsights2} alt="Excuse Insights 2" data-aos="zoom-in" data-aos-delay="400" />
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
