import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Bell, Instagram, Twitter, Facebook, Youtube, Twitch, Linkedin } from 'lucide-react';
import './ScrollHero.css';

const FloatingIcons = ({ opacity, scale }) => {
    // Position icons at the bottom of the inverted triangle, above the phone
    // Clustered tightly in a narrower formation pointing down
    const distractions = [
        { Icon: Mail, x: -18, y: 0, color: '#EA4335', rotate: -15 },
        { Icon: MessageCircle, x: 18, y: 0, color: '#34A853', rotate: 20 },
        { Icon: Bell, x: -10, y: 4, color: '#FBBC05', rotate: -10 },
        { Icon: Instagram, x: 10, y: 4, color: '#E1306C', rotate: 12 },
        { Icon: Twitter, x: -22, y: 5, color: '#1DA1F2', rotate: -20 },
        { Icon: Facebook, x: 22, y: 5, color: '#1877F2', rotate: 18 },
        { Icon: Youtube, x: -5, y: 8, color: '#FF0000', rotate: -8 },
        { Icon: Twitch, x: 5, y: 8, color: '#9146FF', rotate: 8 },
        { Icon: Linkedin, x: 0, y: 10, color: '#0077B5', rotate: 0 },
    ];

    return (
        <motion.div
            className="floating-icons-layer"
            style={{ opacity, scale }}
        >
            {distractions.map((item, index) => (
                <div
                    key={index}
                    className="floating-icon"
                    style={{
                        top: `calc(72% + ${item.y}%)`,
                        left: `calc(50% + ${item.x}%)`,
                        transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                    }}
                >
                    <item.Icon size={24} color={item.color} />
                    {(index % 3 === 0) && <div className="icon-badge">{index + 1}</div>}
                </div>
            ))}
        </motion.div>
    );
};

export default FloatingIcons;
