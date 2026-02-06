import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import NotificationCards from './NotificationCards';
import PhoneMockup from './PhoneMockup';
import BackgroundGlow from './BackgroundGlow';
import { getCurrentURL } from '../../config/appConfig';
import './ScrollHero.css';

import appStoreBadge from '../../assets/app-store-badge.svg';

const ScrollHero = () => {
    const containerRef = useRef(null);
    const scrollProgress = useMotionValue(0);
    const downloadUrl = getCurrentURL();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let rafId;
        let lastProgress = 0;

        const updateScroll = () => {
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const containerHeight = container.offsetHeight;

            // Calculate progress: 0 when top of container at top of viewport
            // 1 when bottom of container reaches top of viewport
            const scrolled = -rect.top;
            const totalScroll = containerHeight - windowHeight;
            const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

            // Only update if changed significantly
            if (Math.abs(progress - lastProgress) > 0.001) {
                lastProgress = progress;
                scrollProgress.set(progress);
            }

            rafId = requestAnimationFrame(updateScroll);
        };

        rafId = requestAnimationFrame(updateScroll);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [scrollProgress]);

    // --- Direct transforms from scroll progress ---

    // Notifications fade and move toward phone
    const notifOpacity = useTransform(scrollProgress, [0, 0.4], [1, 0]);
    const notifY = useTransform(scrollProgress, [0, 0.4], [0, 120]);
    const notifScale = useTransform(scrollProgress, [0, 0.4], [1, 0.6]);

    // Initial content (header + title) fades up and out
    const initialContentOpacity = useTransform(scrollProgress, [0, 0.3], [1, 0]);
    const initialContentY = useTransform(scrollProgress, [0, 0.3], [0, -60]);

    // Phone rises from bottom into view
    const phoneY = useTransform(scrollProgress, [0, 0.7], [0, -300]);
    const phoneScale = useTransform(scrollProgress, [0, 0.7], [0.95, 1]);

    // Final content appears
    const finalContentOpacity = useTransform(scrollProgress, [0.6, 0.85], [0, 1]);

    // Glow intensifies as phone rises
    const glowOpacity = useTransform(scrollProgress, [0.3, 0.7], [0, 0.6]);
    const glowScale = useTransform(scrollProgress, [0.3, 0.7], [0.8, 1.2]);

    return (
        <div ref={containerRef} className="scroll-hero-container">
            <div className="scroll-hero-sticky">

                <BackgroundGlow opacity={glowOpacity} scale={glowScale} />

                {/* Initial Content: Header + Title */}
                <motion.div
                    className="hero-initial-content"
                    style={{
                        opacity: initialContentOpacity,
                        y: initialContentY,
                    }}
                >
                    {/* Header with Logo */}
                    <div className="hero-header">
                        <Link to="/" className="hero-logo-center">
                            <img src="/images/spooli_logo.jpg" alt="Spool Logo" />
                        </Link>
                        <div className="hero-excuses-badge">
                            <span>3,500+ excuses recorded</span>
                        </div>
                    </div>

                    {/* Main Title - Simple and Premium */}
                    <div className="hero-content-layer">
                        <h1 className="hero-title-simple">
                            Unwind wisely 🧵🪡
                        </h1>
                        <a href={downloadUrl} className="app-store-button" target="_blank" rel="noopener noreferrer">
                            <img src={appStoreBadge} alt="Download on the App Store" />
                        </a>
                    </div>
                </motion.div>

                {/* Notification banners and app icons - clustered above phone */}
                <NotificationCards
                    opacity={notifOpacity}
                    y={notifY}
                    scale={notifScale}
                />

                {/* Phone mockup - rises from bottom */}
                <PhoneMockup
                    y={phoneY}
                    scale={phoneScale}
                />

                {/* Final Content - appears after phone rises */}
                <motion.div
                    className="final-content-layer"
                    style={{ opacity: finalContentOpacity }}
                >
                    <h2 className="final-title">Reclaim your focus.</h2>
                    <p className="final-subtitle">Unwind wisely. Download the app.</p>
                    <a href={downloadUrl} className="final-cta" target="_blank" rel="noopener noreferrer">
                        Get Started
                    </a>
                </motion.div>

            </div>
        </div>
    );
};

export default ScrollHero;
