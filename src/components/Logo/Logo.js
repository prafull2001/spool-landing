"use client";
import React from 'react';
import Link from 'next/link';
import './Logo.css';

const Logo = () => {
  return (
    <Link href="/" className="standalone-logo">
      <img src="/images/spooli_logo.jpg" alt="Spool Logo" />
    </Link>
  );
};

export default Logo;
