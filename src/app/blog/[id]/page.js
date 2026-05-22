import BlogPost from '@/views/BlogPost';
import { PRAFULL } from '@/data/authors';

const AUTHOR = {
  name: PRAFULL.name,
  url: PRAFULL.url,
  jobTitle: PRAFULL.jobTitle,
  sameAs: PRAFULL.sameAs,
};

const blogMeta = {
  'best-apps-stop-doomscrolling-2026': {
    title: 'Best Apps to Stop Doomscrolling in 2026 (Honest Comparison of 10 Apps)',
    description: 'We tested 10 doomscrolling apps in 2026: Spool (voice check-ins · awareness-based), Opal, One Sec, ScreenZen, Freedom, Brainrot, Unrot, Monk, Forest, RepsForReels. Spool wins for understanding why you scroll; Opal wins for hard blocking.',
    datePublished: '2026-05-01',
    dateModified: '2026-05-19',
  },
  'how-to-stop-doom-scrolling': {
    title: 'How to Stop Doom Scrolling: 10 Proven Strategies That Work',
    description: 'Practical, science-backed techniques to break your doom scrolling habit and reclaim hours of your day. No willpower required.',
    datePublished: '2026-02-08',
    dateModified: '2026-02-08',
  },
  'doom-scrolling-habit': {
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    description: 'Discover how a simple 5-second voice check-in can interrupt your automatic phone habits and help you break free from endless scrolling.',
    datePublished: '2024-10-09',
    dateModified: '2024-10-09',
  },
  'intentional-screen-time': {
    title: 'Transform Screen Time Into Intentional Time',
    description: 'Learn how to turn mindless app usage into conscious choices through voice journaling and personalized insights.',
    datePublished: '2024-10-09',
    dateModified: '2024-10-09',
  },
  'breaking-phone-addiction': {
    title: 'Join Thousands Breaking Free From Phone Addiction',
    description: 'Explore how AI-powered insights and community support can help you reclaim your time from the endless scroll.',
    datePublished: '2024-10-09',
    dateModified: '2024-10-09',
  },
  'how-to-stop-doomscrolling-on-tiktok': {
    title: 'How to Stop Doomscrolling on TikTok (2026 Guide)',
    description: 'TikTok is the hardest app on your phone to put down — and it isn\'t your willpower. A 2026 guide to what actually works, grounded in behavioral research.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'how-to-stop-doomscrolling-on-instagram-reels': {
    title: 'How to Stop Doomscrolling on Instagram Reels (Without Quitting Instagram)',
    description: 'Keep the Instagram you use and lose the Reels habit. Tactical guide to interrupting the autopilot swipe into Reels using voice check-ins and feed controls.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'how-to-stop-doomscrolling-on-youtube-shorts': {
    title: 'How to Stop Doomscrolling on YouTube Shorts',
    description: 'YouTube Shorts is harder to quit than TikTok because it piggybacks on legitimate YouTube use. Here\'s how to stop the Shorts spiral without losing YouTube.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'how-to-stop-doomscrolling-on-twitter-x': {
    title: 'How to Stop Doomscrolling on X (Formerly Twitter)',
    description: 'X scrolling feels intellectually justified — "I need to stay informed." It usually isn\'t. How to interrupt the news-anxiety doomscroll loop.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'how-to-stop-doomscrolling-on-reddit': {
    title: 'How to Stop Doomscrolling on Reddit (Without Quitting It)',
    description: 'Keep the subreddits you actually value, lose the front-page time sink. How to separate intentional Reddit use from compulsive Reddit scrolling.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'why-cant-i-put-my-phone-down': {
    title: 'Why Can\'t I Put My Phone Down? The Behavioral Science Answer',
    description: 'Two answers run in parallel — psychological and technological. Why willpower fails, what the research actually says, and what works instead.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'is-doomscrolling-an-addiction': {
    title: 'Is Doomscrolling an Addiction? What the Clinical Research Says',
    description: 'Clinically: not formally yet. Neurologically: yes. Functionally: yes. What the DSM-5 says, what the neuroscience says, and why it matters for intervention.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'how-much-screen-time-is-too-much-2026': {
    title: 'How Much Screen Time Is Too Much in 2026? The Honest Answer',
    description: 'The "X hours per day" question is the wrong question. The right question is what percentage of your phone use is intentional. Here\'s how to tell.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'does-grayscale-mode-work': {
    title: 'Does Grayscale Mode Actually Reduce Phone Use? The Real Answer',
    description: 'Grayscale mode works — about 15-20% reduction in the Trinity College Dublin study, fading after 1-3 weeks. Here\'s when to try it and when not to.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
  'why-do-i-scroll-when-anxious': {
    title: 'Why Do I Scroll When I\'m Anxious? The Connection Between Anxiety and Phone Use',
    description: 'Anxiety scrolling is regulation, not resolution. The behavioral science of why your phone use spikes when you\'re stressed — and what actually breaks the loop.',
    datePublished: '2026-05-21',
    dateModified: '2026-05-21',
  },
};

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Stop Doomscrolling: 10 Proven Strategies',
  description: 'Ten science-backed steps to break the doom scrolling habit, from understanding triggers to building accountability.',
  totalTime: 'PT2W',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Understand why you doom scroll', text: 'Identify your triggers — boredom, anxiety, FOMO, habit, avoidance — before trying to change the behavior.' },
    { '@type': 'HowToStep', position: 2, name: 'Create friction before opening apps', text: 'Add a pause between urge and action. Move social apps off your home screen, log out after each session, or use a voice-check-in app like Spool.' },
    { '@type': 'HowToStep', position: 3, name: 'Set specific phone-free times', text: 'Designate periods as phone-free — first hour after waking, meals, last hour before bed, focused work.' },
    { '@type': 'HowToStep', position: 4, name: 'Replace scrolling with intentional activities', text: 'Have ready alternatives — a book for boredom, breathing for anxiety, direct messages for connection.' },
    { '@type': 'HowToStep', position: 5, name: 'Use grayscale mode', text: 'Switch your phone to grayscale in accessibility settings. Color is a major attention driver; removing it reduces app appeal.' },
    { '@type': 'HowToStep', position: 6, name: 'Turn off non-essential notifications', text: 'Keep only calls and texts from close contacts. Disable social and news app alerts entirely.' },
    { '@type': 'HowToStep', position: 7, name: 'Practice one-more-scroll awareness', text: 'When you catch yourself scrolling, pause and ask: "What am I looking for?" Usually nothing — that\'s the loop.' },
    { '@type': 'HowToStep', position: 8, name: 'Set smart time limits', text: 'Start with generous app limits, review usage weekly, focus on specific apps, celebrate reductions over punishing overages.' },
    { '@type': 'HowToStep', position: 9, name: 'Find accountability', text: 'Share goals with a friend, use accountability features in screen-time apps, or join a digital-wellness community.' },
    { '@type': 'HowToStep', position: 10, name: 'Be compassionate with yourself', text: 'Don\'t catastrophize setbacks. Notice patterns without judgment. Apps are engineered to be addictive — struggling is normal.' },
  ],
};

export async function generateStaticParams() {
  return Object.keys(blogMeta).map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const meta = blogMeta[id];
  if (!meta) {
    return { title: 'Blog | Spool' };
  }
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://www.thespoolapp.com/blog/${id}` },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const meta = blogMeta[id];

  const articleSchema = meta && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
      jobTitle: AUTHOR.jobTitle,
      sameAs: AUTHOR.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spool',
      logo: { '@type': 'ImageObject', url: 'https://www.thespoolapp.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.thespoolapp.com/blog/${id}` },
  };

  const includeHowTo = id === 'how-to-stop-doom-scrolling';

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {includeHowTo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }}
        />
      )}
      <BlogPost />
    </>
  );
}
