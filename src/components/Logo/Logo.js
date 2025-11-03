import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';
import logo from '../../assets/Spool-Logo.png';

const Logo = () => {
  return (
    <Link to="/" className="standalone-logo">
      <img src={logo} alt="Spool Logo" />
    </Link>
  );
};

export default Logo;