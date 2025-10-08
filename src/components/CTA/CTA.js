
import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-container">
        <p className="cta-badge">🎉 NOW LIVE ON IOS!</p>
        <h2 className="cta-title">Ready to take control?</h2>
        <p className="cta-subtitle">Download Spool today and start building healthier phone habits</p>
        <a href="https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone" className="cta-button" target="_blank" rel="noopener noreferrer">
          Download on the App Store
        </a>
        <div className="cta-social">
          <p>Follow our journey: <a href="https://twitter.com/the_spool_app" target="_blank" rel="noopener noreferrer">@the_spool_app</a></p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
