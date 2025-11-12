import React, { useState, useEffect } from 'react';
import './Popup.css';
import { getCurrentURL } from '../../config/appConfig';
import appStoreBadge from '../../assets/app-store-badge.svg';

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const url = getCurrentURL();

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
    window.open(url, '_blank');
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
          <div className="popup-spoolie">
            <img src="/images/spooli_jumping.png" alt="Spoolie" />
          </div>
        </div>
        
        <div className="popup-text">
          <p>Download on iOS</p>
        </div>
        
        <div className="popup-actions">
          <img src={appStoreBadge} alt="Download on the App Store" className="popup-app-store-badge" onClick={handleDownload} />
        </div>
      </div>
    </div>
  );
};

export default Popup;