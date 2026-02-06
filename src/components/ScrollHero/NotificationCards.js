import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Play, Music, Users, Camera, Mail, ShoppingBag } from 'lucide-react';
import './ScrollHero.css';

const NotificationCards = ({ opacity, y, scale }) => {
    // 2 Banner notifications - asymmetric, one higher than other
    const bannerNotifications = [
        {
            app: 'WhatsApp',
            icon: MessageSquare,
            bg: '#25D366',
            desc: 'Notification',
            time: '42m ago',
            x: -16, y: -1, rotate: -12
        },
        {
            app: 'Instagram',
            icon: Camera,
            bg: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
            desc: 'Notification',
            time: '42m ago',
            x: 15, y: 2, rotate: 6
        },
    ];

    // 6 App icons - asymmetric cluster, tighter spread
    const appIcons = [
        { Icon: Play, bg: '#000', color: '#fff', x: -11, y: 5, rotate: -12 }, // X/Twitter
        { Icon: Music, bg: '#000', color: '#25F4EE', x: 2, y: 3, rotate: 8, badge: 5 }, // TikTok
        { Icon: MessageSquare, bg: '#25D366', color: '#fff', x: 10, y: 6, rotate: 3 }, // WhatsApp
        { Icon: Play, bg: '#FF0000', color: '#fff', x: -6, y: 10, rotate: -6, fill: true }, // YouTube
        { Icon: Heart, bg: '#fff', color: '#E1306C', x: 5, y: 9, rotate: 10 }, // Heart
        { Icon: Camera, bg: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', color: '#fff', x: -1, y: 14, rotate: -3 }, // Instagram
    ];

    return (
        <motion.div
            className="notifications-cluster"
            style={{ opacity, y, scale }}
        >
            {/* Banner notifications on the sides */}
            {bannerNotifications.map((notif, index) => (
                <motion.div
                    key={`banner-${index}`}
                    className="notification-banner"
                    style={{
                        left: `calc(50% + ${notif.x}%)`,
                        top: `calc(48% + ${notif.y}%)`,
                        transform: `translateX(-50%) rotate(${notif.rotate}deg)`,
                    }}
                >
                    <div className="banner-icon" style={{ background: notif.bg }}>
                        <notif.icon size={14} color="white" />
                    </div>
                    <div className="banner-content">
                        <span className="banner-title">{notif.app}</span>
                        <span className="banner-desc">{notif.desc}</span>
                    </div>
                    <span className="banner-time">{notif.time}</span>
                </motion.div>
            ))}

            {/* App icons in tight cluster */}
            {appIcons.map((app, index) => (
                <motion.div
                    key={`icon-${index}`}
                    className="app-icon-float"
                    style={{
                        left: `calc(50% + ${app.x}%)`,
                        top: `calc(48% + ${app.y}%)`,
                        transform: `translateX(-50%) rotate(${app.rotate}deg)`,
                        background: app.bg,
                    }}
                >
                    <app.Icon size={22} color={app.color} fill={app.fill ? app.color : 'none'} />
                    {app.badge && <span className="app-icon-badge">{app.badge}</span>}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default NotificationCards;
