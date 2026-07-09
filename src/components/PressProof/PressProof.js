"use client";

import React from 'react';
import Link from 'next/link';
import './PressProof.css';

const PressProof = () => {
  return (
    <section className="press-proof" aria-labelledby="press-proof-title">
      <div className="press-proof-inner">
        <div className="press-proof-meta">
          <span className="press-proof-label">Featured in</span>
          <span className="press-proof-outlet">We Are Founders</span>
        </div>

        <div className="press-proof-copy">
          <h2 id="press-proof-title">
            What 8,667 voice check-ins reveal about the moment people reach for their phones
          </h2>
          <p>
            Chris Kernaghan analyzed Spool's anonymized excuse data and found that phone urges
            often show up as tiny obligations: "I need to check one thing."
          </p>
        </div>

        <div className="press-proof-actions" aria-label="Press coverage summary">
          <div className="press-proof-stat">
            <strong>13k+</strong>
            <span>excuses recorded</span>
          </div>
          <Link href="/press" className="press-proof-link">
            Read coverage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PressProof;
