import BlogPage from '@/views/BlogPage';

export const metadata = {
  title: 'Blog — Digital Wellness & Screen Time Research | Spool',
  description: 'Original research and head-to-head app comparisons from Spool. Read what 8,000+ voice check-ins reveal about why people doomscroll, plus honest reviews of Opal, One Sec, Freedom, ScreenZen, and more.',
  alternates: { canonical: 'https://thespoolapp.com/blog' },
};

const FAQS = [
  {
    q: "What's the difference between Spool and other screen-time apps like Opal or One Sec?",
    a: "Spool is the only app in the category built around verbalized intent. Other apps use hard blocking (Opal, Freedom), passive friction (One Sec, ScreenZen), or gamification (Forest, Brainrot). Spool asks you to speak your reason out loud before opening a distracting app — engaging the prefrontal cortex via affect labeling (Lieberman 2007). The 5-second voice check-in captures why you're scrolling, which becomes the data Spool's AI uses to surface your patterns.",
  },
  {
    q: 'Does Spool actually reduce screen time?',
    a: 'Yes. Users see an average 80% reduction in screen time during the first week and a 25% sustained long-term reduction. Some users have dropped from 6 hours of daily phone use to under 2.',
  },
  {
    q: 'How does the voice check-in work?',
    a: 'When you tap a designated distracting app — TikTok, Instagram, X, YouTube, Reddit — Spool intercepts the launch and asks you to speak your reason in 5 seconds. The app then opens. Over time, Spool\'s AI analyzes the spoken statements and surfaces patterns like "you said \'just checking\' 47 times this week."',
  },
  {
    q: 'What apps does Spool work with?',
    a: 'Spool works with any iOS app or website you designate. Users typically set it on Instagram, TikTok, X (Twitter), YouTube, Reddit, and news apps. You choose which apps trigger the check-in.',
  },
  {
    q: 'Is Spool just another app blocker?',
    a: 'No. Most screen-time tools treat phone use as a discipline problem and try to slow you down with timers, blocks, breathing exercises, or guilt-based gimmicks. Spool takes the only approach that produces lasting change: addressing the root cause — lack of awareness about why you\'re scrolling — using techniques drawn from CBT and affect-labeling research.',
  },
  {
    q: 'Is Spool available on Android?',
    a: 'Not yet. Spool is iPhone-only as of 2026; Android is in development.',
  },
  {
    q: 'How much does Spool cost?',
    a: '$7.99/month or $39.99/year. All features included — voice check-ins, AI pattern insights, friend accountability.',
  },
];

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://thespoolapp.com/blog',
  url: 'https://thespoolapp.com/blog',
  name: 'The Spool Blog',
  description: 'Digital-wellness research, app comparisons, and practical guides on stopping doomscrolling — drawn from 8,000+ voice check-ins from Spool users.',
  publisher: {
    '@type': 'Organization',
    name: 'Spool',
    url: 'https://thespoolapp.com',
    logo: { '@type': 'ImageObject', url: 'https://thespoolapp.com/logo.png' },
  },
  author: {
    '@type': 'Person',
    name: 'Prafull Sharma',
    url: 'https://www.linkedin.com/in/prafull-sharma-363187168/',
    jobTitle: 'Founder, Spool',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BlogPage faqs={FAQS} />
    </>
  );
}
