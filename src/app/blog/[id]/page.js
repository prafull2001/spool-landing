import BlogPost from '@/views/BlogPost';

const AUTHOR = {
  name: 'Prafull Sharma',
  url: 'https://www.linkedin.com/in/prafull-sharma-363187168/',
  jobTitle: 'Founder, Spool',
  sameAs: [
    'https://www.linkedin.com/in/prafull-sharma-363187168/',
    'https://github.com/prafull2001',
  ],
};

const blogMeta = {
  'best-apps-stop-doomscrolling-2026': {
    title: 'Best Apps to Stop Doomscrolling in 2026 (Honest Comparison)',
    description: 'We tested 10 apps to stop doomscrolling — Spool, Opal, One Sec, ScreenZen, Freedom, Brainrot, Unrot, Monk, Forest, and RepsForReels. Here is what actually works long-term.',
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
    alternates: { canonical: `https://thespoolapp.com/blog/${id}` },
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
      logo: { '@type': 'ImageObject', url: 'https://thespoolapp.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://thespoolapp.com/blog/${id}` },
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
