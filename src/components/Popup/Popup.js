import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('spoolPopupSeen');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('spoolPopupSeen', 'true');
  };

  const handleDownload = () => {
    window.open('https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose}>
          ×
        </button>
        
        <div className="popup-header">
          <div className="popup-emoji">🎉</div>
          <h2>Spool is Now Live!</h2>
        </div>
        
        <div className="popup-body">
          <p>We're excited to announce that Spool is now available on the App Store!</p>
          <p className="popup-subtitle">Start building healthier phone habits with AI-powered voice check-ins.</p>
        </div>
        
        <div className="popup-actions">
          <button className="popup-download-btn" onClick={handleDownload}>
            Download Now
          </button>
          <button className="popup-later-btn" onClick={handleClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;