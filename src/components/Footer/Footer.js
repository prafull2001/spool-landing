
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Legal</h3>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/support">Contact Us</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="footer-social">
              <a href="https://twitter.com/the_spool_app" target="_blank" rel="noopener noreferrer">
                𝕏 @the_spool_app
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Meet the Founders</h3>
            <div className="footer-founders">
              <a href="https://twitter.com/prafull_truffle" target="_blank" rel="noopener noreferrer">
                Prafull (@prafull_truffle)
              </a>
              <a href="https://twitter.com/whoelsebutns" target="_blank" rel="noopener noreferrer">
                NS (@whoelsebutns)
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Spool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
