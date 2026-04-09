"use client";

import React from 'react';
import './FriendTransparency.css';

import friendsexcuse from '../../assets/realexcuse.webp';

const FriendTransparency = () => {
  return (
    <section className="friend-transparency">
      <div className="friend-transparency-container">
        <h2 className="friend-transparency-title">Radical Transparency with Friends</h2>
        <p className="friend-transparency-subtitle">Share your journey with friends and hold each other accountable.</p>
        <div className="transparency-image">
          <img src={friendsexcuse.src} alt="Friend Excuses Feed" />
        </div>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🤝</span>
            <p>Build a support network</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">😂</span>
            <p>Gentle, no-judgment accountability</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <p>See a feed of your friends' excuses</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FriendTransparency;
