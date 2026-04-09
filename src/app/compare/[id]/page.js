import BlogPost from '@/views/BlogPost';

const compareMeta = {
  'spool-vs-opal': {
    title: 'Spool vs Opal: Which Screen Time App Is Right for You?',
    description: 'A detailed comparison of Spool and Opal - two popular screen time management apps. Discover which approach to digital wellness fits your lifestyle.',
  },
  'spool-vs-one-sec': {
    title: 'Spool vs One Sec: Breaking Phone Addiction in 2026',
    description: "Compare Spool and One Sec's unique approaches to reducing screen time. Learn which app uses the best method to help you scroll less.",
  },
  'spool-vs-clearspace': {
    title: 'Spool vs Clearspace: The Ultimate App Blocker Showdown',
    description: 'Clearspace and Spool both promise to reduce phone addiction, but they work very differently. Find out which one actually helps you change habits.',
  },
  'spool-vs-brainrot': {
    title: 'Spool vs Brainrot: Which App Actually Fixes Your Scrolling Habit?',
    description: 'Brainrot uses a decaying brain avatar to guilt you into stopping. Spool uses voice awareness. Which approach leads to lasting change?',
  },
  'spool-vs-unrot': {
    title: 'Spool vs Unrot: Earn Screen Time or Understand Why You Scroll?',
    description: 'Unrot makes you earn app access through healthy habits. Spool builds self-awareness through voice check-ins. A deep dive into two different philosophies.',
  },
};

export async function generateStaticParams() {
  return Object.keys(compareMeta).map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const meta = compareMeta[id];
  if (!meta) {
    return { title: 'Compare | Spool' };
  }
  return {
    title: `${meta.title} | Spool`,
    description: meta.description,
  };
}

export default function Page() {
  return <BlogPost />;
}
