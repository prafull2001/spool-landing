
import React from 'react';
import { motion } from 'framer-motion';
import './ScrollHero.css';

const BackgroundGlow = ({ opacity, scale }) => {
    return (
        <motion.div
            className="background-glow"
            style={{ opacity, scale }}
        />
    );
};

export default BackgroundGlow;
