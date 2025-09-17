
import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2 className="cta-title">Ready to take control?</h2>
        <a href="https://spool-app.vercel.app/" className="cta-button" target="_blank" rel="noopener noreferrer">Join the Waitlist</a>
      </div>
    </section>
  );
};

export default CTA;
