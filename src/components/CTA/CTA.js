
import React from 'react';
import './CTA.css';
import { getCurrentConfig, getCurrentURL, APP_CONFIG } from '../../config/appConfig';

const CTA = () => {
  const config = getCurrentConfig();
  const url = getCurrentURL();

  return (
    <section className="cta">
      <div className="cta-container">
        <p className="cta-badge">{APP_CONFIG.IS_APP_LIVE ? "🎉 NOW LIVE ON IOS!" : "🧵 COMING SOON!"}</p>
        <h2 className="cta-title">Ready to take control?</h2>
        <p className="cta-subtitle">{APP_CONFIG.IS_APP_LIVE ? "Download Spool today and start building healthier phone habits" : "Join the waitlist and be first to experience mindful phone use"}</p>
        <a href={url} className="cta-button" target="_blank" rel="noopener noreferrer">
          {config.cta_button}
        </a>
        <div className="cta-social">
          <p>Follow our journey: <a href="https://twitter.com/the_spool_app" target="_blank" rel="noopener noreferrer">@the_spool_app</a></p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
