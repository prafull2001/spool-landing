import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const blogPosts = [
  {
    id: 'doom-scrolling-habit',
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    excerpt: 'Discover how a simple 5-second voice check-in can interrupt your automatic phone habits and help you break free from endless scrolling.',
    date: 'October 9, 2025',
    readTime: '5 min read',
    category: 'Digital Wellness'
  },
  {
    id: 'intentional-screen-time',
    title: 'Transform Screen Time Into Intentional Time',
    excerpt: 'Learn how to turn mindless app usage into conscious choices through voice journaling and personalized insights.',
    date: 'October 9, 2025',
    readTime: '4 min read',
    category: 'Productivity'
  },
  {
    id: 'breaking-phone-addiction',
    title: 'Join Thousands Breaking Free From Phone Addiction',
    excerpt: 'Explore how AI-powered insights and community support can help you reclaim your time from the endless scroll.',
    date: 'October 9, 2025',
    readTime: '6 min read',
    category: 'Mental Health'
  }
];

const BlogPage = () => {
  return (
    <>
      <Header />
      <div className="blog-container">
        <div className="blog-header">
          <h1>The Spool Blog</h1>
          <p>Expert insights on digital wellness, mindful technology use, and breaking phone addiction</p>
        </div>
        
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <span className="blog-category">{post.category}</span>
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