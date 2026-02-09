import React from 'react';
import Logo from '../components/Logo/Logo';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const blogPosts = [
  {
    id: 'spool-vs-opal',
    title: 'Spool vs Opal: Which Screen Time App Is Right for You?',
    excerpt: 'A detailed comparison of Spool and Opal - two popular screen time management apps. Discover which approach to digital wellness fits your lifestyle.',
    date: 'February 8, 2026',
    readTime: '7 min read',
    category: 'Comparison',
    isComparison: true
  },
  {
    id: 'spool-vs-one-sec',
    title: 'Spool vs One Sec: Breaking Phone Addiction in 2026',
    excerpt: 'Compare Spool and One Sec\'s unique approaches to reducing screen time. Learn which app uses the best method to help you scroll less.',
    date: 'February 8, 2026',
    readTime: '6 min read',
    category: 'Comparison',
    isComparison: true
  },
  {
    id: 'spool-vs-clearspace',
    title: 'Spool vs Clearspace: The Ultimate App Blocker Showdown',
    excerpt: 'Clearspace and Spool both promise to reduce phone addiction, but they work very differently. Find out which one actually helps you change habits.',
    date: 'February 8, 2026',
    readTime: '6 min read',
    category: 'Comparison',
    isComparison: true
  },
  {
    id: 'how-to-stop-doom-scrolling',
    title: 'How to Stop Doom Scrolling: 10 Proven Strategies That Work',
    excerpt: 'Practical, science-backed techniques to break your doom scrolling habit and reclaim hours of your day. No willpower required.',
    date: 'February 8, 2026',
    readTime: '8 min read',
    category: 'Digital Wellness'
  },
  {
    id: 'doom-scrolling-habit',
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    excerpt: 'Discover how a simple 5-second voice check-in can interrupt your automatic phone habits and help you break free from endless scrolling.',
    date: 'October 9, 2024',
    readTime: '5 min read',
    category: 'Digital Wellness'
  },
  {
    id: 'intentional-screen-time',
    title: 'Transform Screen Time Into Intentional Time',
    excerpt: 'Learn how to turn mindless app usage into conscious choices through voice journaling and personalized insights.',
    date: 'October 9, 2024',
    readTime: '4 min read',
    category: 'Productivity'
  },
  {
    id: 'breaking-phone-addiction',
    title: 'Join Thousands Breaking Free From Phone Addiction',
    excerpt: 'Explore how AI-powered insights and community support can help you reclaim your time from the endless scroll.',
    date: 'October 9, 2024',
    readTime: '6 min read',
    category: 'Mental Health'
  }
];

const BlogPage = () => {
  return (
    <>
      <Logo />
      <div className="blog-container">
        <div className="blog-header">
          <h1>The Spool Blog</h1>
          <p>Expert insights on digital wellness, app comparisons, and breaking phone addiction</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <span className={`blog-category ${post.isComparison ? 'comparison' : ''}`}>
                  {post.category}
                </span>
                <h2>
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                <Link to={`/blog/${post.id}`} className="blog-read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
