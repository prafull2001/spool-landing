
import React from 'react';
import './CTA.css';
import { getCurrentURL, APP_CONFIG } from '../../config/appConfig';
import appStoreBadge from '../../assets/app-store-badge.svg';

const CTA = () => {
  const url = getCurrentURL();

  return (
    <section className="cta">
      <div className="cta-container">
        <p className="cta-badge">{APP_CONFIG.IS_APP_LIVE ? "🎉 NOW LIVE ON IOS!" : "🧵 COMING SOON!"}</p>
        <h2 className="cta-title">Ready to take control?</h2>
        <a href={url} className="app-store-cta-button" target="_blank" rel="noopener noreferrer">
          <img src={appStoreBadge} alt="Download on the App Store" />
        </a>
      </div>
    </section>
  );
};

export default CTA;
