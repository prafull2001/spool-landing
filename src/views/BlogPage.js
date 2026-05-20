"use client";
import React from 'react';
import Logo from '../components/Logo/Logo';
import Footer from '../components/Footer/Footer';
import Link from 'next/link';
import './BlogPage.css';

const AUTHOR_NAME = 'Prafull Sharma';
const AUTHOR_URL = 'https://www.linkedin.com/in/prafull-sharma-363187168/';

const blogPosts = [
  {
    id: 'spool-vs-opal',
    title: 'Spool vs Opal: Which Screen Time App Is Right for You?',
    excerpt: 'A detailed comparison of Spool and Opal - two popular screen time management apps. Discover which approach to digital wellness fits your lifestyle.',
    date: 'February 8, 2026',
    dateISO: '2026-02-08',
    readTime: '7 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-one-sec',
    title: 'Spool vs One Sec: Breaking Phone Addiction in 2026',
    excerpt: 'Compare Spool and One Sec\'s unique approaches to reducing screen time. Learn which app uses the best method to help you scroll less.',
    date: 'February 8, 2026',
    dateISO: '2026-02-08',
    readTime: '6 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-clearspace',
    title: 'Spool vs Clearspace: The Ultimate App Blocker Showdown',
    excerpt: 'Clearspace and Spool both promise to reduce phone addiction, but they work very differently. Find out which one actually helps you change habits.',
    date: 'February 8, 2026',
    dateISO: '2026-02-08',
    readTime: '6 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-brainrot',
    title: 'Spool vs Brainrot: Which App Actually Fixes Your Scrolling Habit?',
    excerpt: 'Brainrot uses a decaying brain avatar to guilt you into stopping. Spool uses voice awareness. Which approach leads to lasting change?',
    date: 'February 8, 2026',
    dateISO: '2026-02-08',
    readTime: '7 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-unrot',
    title: 'Spool vs Unrot: Earn Screen Time or Understand Why You Scroll?',
    excerpt: 'Unrot makes you earn app access through healthy habits. Spool builds self-awareness through voice check-ins. A deep dive into two different philosophies.',
    date: 'February 8, 2026',
    dateISO: '2026-02-08',
    readTime: '7 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'best-apps-stop-doomscrolling-2026',
    title: 'Best Apps to Stop Doomscrolling in 2026 (Honest Comparison)',
    excerpt: 'We tested 10 doomscrolling apps — blockers, friction tools, gamified quitters, and one that makes you explain yourself out loud. Here\'s what actually works.',
    date: 'May 1, 2026',
    dateISO: '2026-05-01',
    readTime: '12 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'how-to-stop-doom-scrolling',
    title: 'How to Stop Doom Scrolling: 10 Proven Strategies That Work',
    excerpt: 'Practical, science-backed techniques to break your doom scrolling habit and reclaim hours of your day. No willpower required.',
    date: 'February 8, 2026',
    dateISO: '2026-02-08',
    readTime: '8 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'doom-scrolling-habit',
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    excerpt: 'Discover how a simple 5-second voice check-in can interrupt your automatic phone habits and help you break free from endless scrolling.',
    date: 'October 9, 2024',
    dateISO: '2024-10-09',
    readTime: '5 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'intentional-screen-time',
    title: 'Transform Screen Time Into Intentional Time',
    excerpt: 'Learn how to turn mindless app usage into conscious choices through voice journaling and personalized insights.',
    date: 'October 9, 2024',
    dateISO: '2024-10-09',
    readTime: '4 min read',
    category: 'Productivity',
  },
  {
    id: 'breaking-phone-addiction',
    title: 'Join Thousands Breaking Free From Phone Addiction',
    excerpt: 'Explore how AI-powered insights and community support can help you reclaim your time from the endless scroll.',
    date: 'October 9, 2024',
    dateISO: '2024-10-09',
    readTime: '6 min read',
    category: 'Mental Health',
  },
];

const TOPICS = [
  'Doomscrolling research & behavioral science',
  'Head-to-head app comparisons (Opal, One Sec, Freedom, ScreenZen, Brainrot, Unrot, Clearspace)',
  'Practical guides for breaking phone-checking habits',
  'What Spool\'s 8,000+ voice check-ins reveal about why people scroll',
];

const BlogPage = ({ faqs = [] }) => {
  return (
    <>
      <Logo />
      <div className="blog-container">
        <div className="blog-header">
          <h1>The Spool Blog: digital-wellness research and honest app comparisons</h1>
          <p>
            Original research, head-to-head app comparisons, and practical guides for people trying to stop doomscrolling. Drawn from 8,000+ voice check-ins users have spoken into Spool — real data about why people open Instagram at 10pm, why &quot;just checking&quot; is the most common excuse, and which screen-time apps actually produce lasting change versus which ones get uninstalled in week two.
          </p>
        </div>

        <div className="blog-intro">
          <blockquote className="blog-stat-callout">
            <strong>85% of Spool users frame their unlock as a first-person want or need.</strong>{' '}
            The interior monologue of compulsive phone use is remarkably uniform — and that&apos;s the data this blog mines.
          </blockquote>

          <h2>What you&apos;ll find here</h2>
          <ul className="blog-topics">
            {TOPICS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <h2 className="blog-section-title">Latest posts</h2>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <span className={`blog-category ${post.isComparison ? 'comparison' : ''}`}>
                  {post.category}
                </span>
                <h2>
                  <Link href={post.isComparison ? `/compare/${post.id}` : `/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-byline">
                    By{' '}
                    <a href={AUTHOR_URL} rel="author" target="_blank">
                      {AUTHOR_NAME}
                    </a>
                  </span>
                  <time dateTime={post.dateISO} className="blog-date">{post.date}</time>
                </div>
                <Link href={post.isComparison ? `/compare/${post.id}` : `/blog/${post.id}`} className="blog-read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {faqs.length > 0 && (
          <section className="blog-faq" aria-labelledby="blog-faq-heading">
            <h2 id="blog-faq-heading">Frequently asked questions about Spool</h2>
            <p className="blog-faq-intro">
              The most common questions we get about how Spool works, who it&apos;s for, and how it compares to other screen-time apps.
            </p>
            <dl>
              {faqs.map((f) => (
                <div key={f.q} className="blog-faq-item">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="blog-research" aria-labelledby="blog-research-heading">
          <h2 id="blog-research-heading">Research foundation</h2>
          <p>
            Spool&apos;s voice check-in mechanism isn&apos;t a UX gimmick. It operationalizes two
            specific bodies of academic research:
          </p>
          <ul className="blog-research-list">
            <li>
              <strong>Lieberman et al. (2007)</strong> — <em>Putting Feelings into Words: Affect
              Labeling Disrupts Amygdala Activity in Response to Affective Stimuli</em>{' '}
              (<cite>Psychological Science</cite>). Lieberman&apos;s UCLA fMRI work showed that{' '}
              <strong>naming an urge out loud reduces its intensity</strong> by engaging the
              prefrontal cortex and dampening amygdala activity. Spool is, in product form, that
              finding turned into a daily intervention.
            </li>
            <li>
              <strong>Allcott, Gentzkow &amp; Song (2022)</strong> — <em>Digital Addiction</em>{' '}
              (<cite>American Economic Review</cite>). Formalized social media as a habit-forming
              good where users systematically underestimate their future usage. Their result that
              brief, well-placed commitment devices produce lasting reductions in use matches the
              regime Spool&apos;s voice check-in occupies.
            </li>
          </ul>
          <p>
            For more on how these papers shape Spool&apos;s design, see <Link href="/about">our
            About page</Link>.
          </p>
        </section>

        <section
          className="blog-author"
          aria-labelledby="blog-author-heading"
          itemScope
          itemType="https://schema.org/Person"
        >
          <h2 id="blog-author-heading">About the author</h2>
          <div className="blog-author-card">
            <div className="blog-author-body">
              <p className="blog-author-name">
                <a
                  href={AUTHOR_URL}
                  rel="author"
                  target="_blank"
                  itemProp="url"
                >
                  <span itemProp="name">Prafull Sharma</span>
                </a>
              </p>
              <p className="blog-author-credentials" itemProp="jobTitle">
                Founder &amp; CEO, Spool
              </p>
              <p className="blog-author-bio" itemProp="description">
                Prafull Sharma is the founder of Spool, the iPhone screen-time app built around
                AI voice check-ins. He leads product and engineering, and writes here about
                digital-wellbeing research, app comparisons, and what 8,000+ user-spoken
                statements reveal about why people doomscroll. Spool&apos;s mechanism draws on
                Matthew Lieberman&apos;s 2007 UCLA work on affect labeling and Allcott, Gentzkow
                &amp; Song&apos;s 2022 <em>Digital Addiction</em> paper in the{' '}
                <em>American Economic Review</em>.
              </p>
              <p className="blog-author-links">
                <a href={AUTHOR_URL} rel="author" target="_blank">LinkedIn</a>
                {' · '}
                <a href="https://github.com/prafull2001" target="_blank" rel="noopener">GitHub</a>
                {' · '}
                <a href="mailto:prafull2001@gmail.com">Email</a>
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
