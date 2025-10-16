import React, { useState, useEffect } from 'react';
import './Popup.css';
import { getCurrentConfig, getCurrentURL } from '../../config/appConfig';

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const config = getCurrentConfig();
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
          <div className="popup-emoji">{config.popup_title.split(' ')[0]}</div>
          <h2>{config.popup_title.substring(2)}</h2>
        </div>
        
        <div className="popup-body">
          <p>{config.popup_text}</p>
          <p className="popup-subtitle">Start building healthier phone habits with AI-powered voice check-ins.</p>
        </div>
        
        <div className="popup-actions">
          <button className="popup-download-btn" onClick={handleDownload}>
            {config.popup_button}
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