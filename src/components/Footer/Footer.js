
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <a href="#">Contact Us</a>
          <a href="#">Twitter</a>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 Spool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
