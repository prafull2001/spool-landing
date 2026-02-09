import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  return (
    <Link to="/" className="standalone-logo">
      <img src="/images/spooli_logo.jpg" alt="Spool Logo" />
    </Link>
  );
};

export default Logo;