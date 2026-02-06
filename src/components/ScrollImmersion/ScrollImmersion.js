import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MessageCircle, Bell, Instagram, Twitter, Facebook, Youtube, Twitch, Linkedin } from 'lucide-react';
import './ScrollImmersion.css';
import appBoquet from '../../assets/app_boquet.png';
import appStoreBadge from '../../assets/app-store-badge.svg';
import { getCurrentURL } from '../../config/appConfig';

const ScrollImmersion = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const downloadUrl = getCurrentURL();

    // --- Animation Transforms ---

    // 1. Explosion Phase (0 - 0.25)
    // Icons move outwards and fade out
    const explosionOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const explosionScale = useTransform(scrollYProgress, [0, 0.2], [1, 3]);

    // 2. Focus Phase (0.2 - 0.6)
    // The app image comes into focus or stays consistent
    const appScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0.8, 1, 1.1, 1]);
    const appOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]); // Fade in initially

    // 3. Narrative Text Fades
    // Text 1: "Doomscrolling is stealing your life."
    const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0, 0.2], ["-50%", "-150%"]);

    // Text 2: "Unwind Wisely."
    const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
    const text2Scale = useTransform(scrollYProgress, [0.25, 0.35], [0.9, 1]);

    // Text 3: "Reclaim your focus." (Final call to action)
    const text3Opacity = useTransform(scrollYProgress, [0.55, 0.7, 0.9], [0, 1, 1]);

    // Generate random positions for distraction icons
    const distractions = [
        { Icon: Mail, x: -20, y: -30, color: '#EA4335' },
        { Icon: MessageCircle, x: 30, y: -20, color: '#34A853' },
        { Icon: Bell, x: -10, y: 30, color: '#FBBC05' },
        { Icon: Instagram, x: 40, y: 10, color: '#E1306C' },
        { Icon: Twitter, x: -40, y: -10, color: '#1DA1F2' },
        { Icon: Facebook, x: 20, y: 40, color: '#1877F2' },
        { Icon: Youtube, x: -30, y: 20, color: '#FF0000' },
        { Icon: Twitch, x: 10, y: -40, color: '#9146FF' },
        { Icon: Linkedin, x: -25, y: 15, color: '#0077B5' },
    ];

    return (
        <div ref={containerRef} className="scroll-immersion-container">
            <div className="scroll-immersion-sticky">

                {/* Distraction Layer */}
                <motion.div
                    className="distraction-layer"
                    style={{ opacity: explosionOpacity, scale: explosionScale }}
                >
                    {distractions.map((item, index) => (
                        <div
                            key={index}
                            className="distraction-icon"
                            style={{
                                top: `calc(50% + ${item.y}%)`,
                                left: `calc(50% + ${item.x}%)`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <item.Icon size={48} color={item.color} />
                        </div>
                    ))}
                </motion.div>

                {/* Focus Layer (Central App) */}
                <div className="focus-layer">
                    <motion.div style={{ scale: appScale, opacity: appOpacity }}>
                        <div className="hero-logo-center">
                            <img src="/images/spooli_logo.jpg" alt="Spool Logo" />
                            <span className="hero-brand-name">Spool</span>
                        </div>
                        <img src={appBoquet} alt="Spool App" className="spool-hero-image" />
                    </motion.div>

                    {/* Download Button (Appears at end) */}
                    <motion.div style={{ opacity: text3Opacity }}>
                        <a href={downloadUrl} className="app-store-button" target="_blank" rel="noopener noreferrer">
                            <img src={appStoreBadge} alt="Download on the App Store" />
                        </a>
                    </motion.div>
                </div>

                {/* Narrative Layer (Text overlays) */}
                <div className="narrative-layer">
                    {/* Text 1 */}
                    <motion.h1
                        className="narrative-text"
                        style={{
                            opacity: text1Opacity,
                            y: text1Y,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            x: '-50%',
                            width: '100%'
                        }}
                    >
                        Doomscrolling is stealing your life.
                    </motion.h1>

                    {/* Text 2 */}
                    <motion.h1
                        className="narrative-text"
                        style={{
                            opacity: text2Opacity,
                            scale: text2Scale,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            x: '-50%',
                            y: '-50%',
                            width: '100%'
                        }}
                    >
                        Unwind Wisely. 🧵
                    </motion.h1>

                    {/* Text 3 */}
                    <motion.h1
                        className="narrative-text"
                        style={{
                            opacity: text3Opacity,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            x: '-50%',
                            y: '-200%', /* Position above the button */
                            width: '100%'
                        }}
                    >
                        Reclaim your focus.
                    </motion.h1>
                </div>

            </div>
        </div>
    );
};

export default ScrollImmersion;
