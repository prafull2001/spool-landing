"use client";

import React from 'react';
import Link from 'next/link';
import './Header.css';
import { getCurrentConfig, getCurrentURL } from '../../config/appConfig';

import logo from '../../assets/spooli_logo.png';

const Header = () => {
  const config = getCurrentConfig();
  const url = getCurrentURL();

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-logo">
          <img src="/images/spooli_logo.jpg" alt="Spool Logo" />
        </Link>
        <nav className="header-nav">
          <Link href="/blog">Blog</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/support">Support</Link>
          <a href={url} className="download-button" target="_blank" rel="noopener noreferrer">{config.header_button}</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
