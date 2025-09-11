
import React, { useState, useEffect } from 'react';
import './FriendExcuses.css';

const excuses = [
  {
    excuse: 'Just checking messages real quick',
    reactions: ['🤔', '🤨', '👀']
  },
  {
    excuse: 'I need to see this one notification',
    reactions: ['🙄', '🧐', '🤦‍♀️']
  },
  {
    excuse: 'I felt a phantom vibration',
    reactions: ['😂', '🤣', '🤪']
  },
  {
    excuse: 'What if someone needs me?',
    reactions: ['🤷‍♂️', '🤔', '🧐']
  }
];

const FriendExcuses = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % excuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="friend-excuses">
      <div className="friend-excuses-container">
        <h2 className="friend-excuses-title">See what your friends are up to</h2>
        <div className="excuse-card">
          <p className="excuse-text">"{excuses[currentIndex].excuse}"</p>
          <div className="reactions">
            {excuses[currentIndex].reactions.map((reaction, index) => (
              <span key={index} className="reaction">{reaction}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FriendExcuses;
