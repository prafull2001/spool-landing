"use client";

import React from 'react';
import Link from 'next/link';
import { PRESS_ITEMS } from '../../data/press';
import './PressStrip.css';

const PressStrip = () => {
  return (
    <section className="press-strip">
      <Link href="/press" className="press-strip-link" aria-label="Read Spool press coverage">
        <span className="press-strip-label">As featured in</span>
        <span className="press-strip-outlet">{PRESS_ITEMS[0].outlet}</span>
      </Link>
    </section>
  );
};

export default PressStrip;
