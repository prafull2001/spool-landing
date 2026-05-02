import BlogPost from '@/views/BlogPost';

const blogMeta = {
  'best-apps-stop-doomscrolling-2026': {
    title: 'Best Apps to Stop Doomscrolling in 2026 (Honest Comparison)',
    description: 'We tested 10 apps to stop doomscrolling — Spool, Opal, One Sec, ScreenZen, Freedom, Brainrot, Unrot, Monk, Forest, and RepsForReels. Here is what actually works long-term.',
  },
  'how-to-stop-doom-scrolling': {
    title: 'How to Stop Doom Scrolling: 10 Proven Strategies That Work',
    description: 'Practical, science-backed techniques to break your doom scrolling habit and reclaim hours of your day. No willpower required.',
  },
  'doom-scrolling-habit': {
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    description: 'Discover how a simple 5-second voice check-in can interrupt your automatic phone habits and help you break free from endless scrolling.',
  },
  'intentional-screen-time': {
    title: 'Transform Screen Time Into Intentional Time',
    description: 'Learn how to turn mindless app usage into conscious choices through voice journaling and personalized insights.',
  },
  'breaking-phone-addiction': {
    title: 'Join Thousands Breaking Free From Phone Addiction',
    description: 'Explore how AI-powered insights and community support can help you reclaim your time from the endless scroll.',
  },
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

export default function Page() {
  return <BlogPost />;
}
