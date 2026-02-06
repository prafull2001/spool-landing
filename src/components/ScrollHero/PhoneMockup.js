import React from 'react';
import { motion } from 'framer-motion';
import './ScrollHero.css';
import spoolWelcome from '../../assets/spool_welcome_screen.png';

const PhoneMockup = ({ y, scale }) => {
    return (
        <motion.div
            className="phone-mockup-layer"
            style={{ y, scale }}
        >
            <div className="phone-frame">
                <img src={spoolWelcome} alt="Spool App" className="phone-screen" />
            </div>
        </motion.div>
    );
};

export default PhoneMockup;
