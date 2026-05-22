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
    id: 'how-to-stop-doomscrolling-on-tiktok',
    title: 'How to Stop Doomscrolling on TikTok (2026 Guide)',
    excerpt: 'TikTok is the hardest app on your phone to put down — and it isn\'t your willpower. A 2026 guide to what actually works, grounded in behavioral research.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '8 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'how-to-stop-doomscrolling-on-instagram-reels',
    title: 'How to Stop Doomscrolling on Instagram Reels (Without Quitting Instagram)',
    excerpt: 'Keep the Instagram you use and lose the Reels habit. Tactical guide to interrupting the autopilot swipe into Reels.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'how-to-stop-doomscrolling-on-youtube-shorts',
    title: 'How to Stop Doomscrolling on YouTube Shorts',
    excerpt: 'YouTube Shorts is harder to quit than TikTok because it piggybacks on legitimate YouTube use. Here\'s how to stop the Shorts spiral.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '6 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'how-to-stop-doomscrolling-on-twitter-x',
    title: 'How to Stop Doomscrolling on X (Formerly Twitter)',
    excerpt: 'X scrolling feels intellectually justified — "I need to stay informed." It usually isn\'t. How to interrupt the news-anxiety loop.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'how-to-stop-doomscrolling-on-reddit',
    title: 'How to Stop Doomscrolling on Reddit (Without Quitting It)',
    excerpt: 'Keep the subreddits you actually value, lose the front-page time sink. Separate intentional Reddit from compulsive Reddit.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'why-cant-i-put-my-phone-down',
    title: 'Why Can\'t I Put My Phone Down? The Behavioral Science Answer',
    excerpt: 'Two answers run in parallel — psychological and technological. Why willpower fails and what works instead.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'is-doomscrolling-an-addiction',
    title: 'Is Doomscrolling an Addiction? What the Clinical Research Says',
    excerpt: 'Clinically: not formally yet. Neurologically: yes. Functionally: yes. What the DSM-5 says vs. what the neuroscience says.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '8 min read',
    category: 'Mental Health',
  },
  {
    id: 'how-much-screen-time-is-too-much-2026',
    title: 'How Much Screen Time Is Too Much in 2026? The Honest Answer',
    excerpt: 'The "X hours per day" question is the wrong question. The right question is what percentage of your phone use is intentional.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'does-grayscale-mode-work',
    title: 'Does Grayscale Mode Actually Reduce Phone Use? The Real Answer',
    excerpt: 'Grayscale works — modestly, for some people, in the short term. The research, the habituation problem, and when it\'s worth trying.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '5 min read',
    category: 'Digital Wellness',
  },
  {
    id: 'why-do-i-scroll-when-anxious',
    title: 'Why Do I Scroll When I\'m Anxious? The Anxiety-Phone Connection',
    excerpt: 'Anxiety scrolling is regulation, not resolution. The behavioral science of why phone use spikes when you\'re stressed — and what breaks the loop.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Mental Health',
  },
  {
    id: 'spool-vs-apple-screen-time',
    title: 'Spool vs Apple Screen Time: Why the Built-In iPhone Tool Isn\'t Enough',
    excerpt: 'Apple Screen Time is free, native, and dismissible in one tap. Spool adds the active voice check-in Apple won\'t.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '8 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-freedom',
    title: 'Spool vs Freedom: Cross-Device Blocking or Single-Device Awareness?',
    excerpt: 'Freedom blocks across devices for scheduled sessions. Spool builds all-day awareness on iPhone. Different problems, different mechanisms.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-forest',
    title: 'Spool vs Forest: Grow Trees or Understand Your Scrolling?',
    excerpt: 'Forest gamifies focus sessions. Spool intervenes at the moment of impulse. Which actually rewires the doomscrolling habit?',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '6 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-screenzen',
    title: 'Spool vs ScreenZen: Delay Timers or Voice Awareness?',
    excerpt: 'ScreenZen\'s passive timer habituates within 1-2 weeks. Spool\'s active voice check-in doesn\'t.',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '6 min read',
    category: 'Comparison',
    isComparison: true,
  },
  {
    id: 'spool-vs-jomo',
    title: 'Spool vs Jomo: Two Approaches to Mindful Phone Use',
    excerpt: 'Jomo is a digital-wellness program. Spool is a single intervention at the moment of impulse. Which fits your style?',
    date: 'May 21, 2026',
    dateISO: '2026-05-21',
    readTime: '7 min read',
    category: 'Comparison',
    isComparison: true,
  },
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
