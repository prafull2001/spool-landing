import BlogPost from '@/views/BlogPost';

const compareMeta = {
  'spool-vs-opal': {
    title: 'Spool vs Opal: Which Screen Time App Is Right for You?',
    description: 'A detailed comparison of Spool and Opal - two popular screen time management apps. Discover which approach to digital wellness fits your lifestyle.',
    date: '2026-02-08',
    competitor: 'Opal',
    faq: [
      {
        question: 'What is the main difference between Spool and Opal?',
        answer: 'Spool uses voice check-ins to build self-awareness about why you reach for your phone, capturing excuses as data for AI pattern analysis. Opal uses scheduled blocking sessions to prevent access to distracting apps entirely. Spool addresses root causes; Opal removes temptation.',
      },
      {
        question: 'Is Spool cheaper than Opal?',
        answer: 'Yes. Spool costs $7.99/month or $39.99/year. Opal costs $9.99/month or $99.99/year. Spool is the more affordable option and includes all features: voice check-ins, AI insights, excuse journaling, and friend accountability.',
      },
      {
        question: 'Which is better for long-term habit change, Spool or Opal?',
        answer: 'Spool is generally better for long-term habit change because its awareness-based approach addresses the root causes of compulsive phone use. Studies show that understanding your triggers leads to more sustainable behavior change than restriction alone.',
      },
      {
        question: 'Can I use both Spool and Opal together?',
        answer: 'Yes. Some users use Spool for daily awareness and pattern tracking, and Opal for critical work periods that require guaranteed distraction-free time. They complement each other well.',
      },
    ],
  },
  'spool-vs-one-sec': {
    title: 'Spool vs One Sec: Breaking Phone Addiction in 2026',
    description: "Compare Spool and One Sec's unique approaches to reducing screen time. Learn which app uses the best method to help you scroll less.",
    date: '2026-02-08',
    competitor: 'One Sec',
    faq: [
      {
        question: 'How is Spool different from One Sec?',
        answer: 'Spool asks you to speak your reason for opening an app (voice check-in, ~5 seconds), while One Sec shows a breathing exercise (~10 seconds). Spool captures your excuses as data for AI pattern analysis; One Sec tracks open attempt counts. Spool builds self-awareness; One Sec creates a mindful pause.',
      },
      {
        question: 'Which is better for breaking phone addiction, Spool or One Sec?',
        answer: 'Spool provides deeper self-awareness through voice journaling and AI insights, making it better for lasting habit change. One Sec is better for users who need a completely silent solution in public or work environments where speaking aloud is not possible.',
      },
      {
        question: 'Does One Sec have social features?',
        answer: 'No. One Sec is a solo experience with no social features. Spool includes friend accountability features where you can share your screen time journey with trusted contacts.',
      },
      {
        question: 'Which app gives better insights into phone use habits?',
        answer: 'Spool provides significantly richer insights. Its AI analyzes your voice excuses to identify top triggers, peak distraction times, and emotional patterns. One Sec offers basic statistics like how many times you tried to open each app.',
      },
    ],
  },
  'spool-vs-clearspace': {
    title: 'Spool vs Clearspace: The Ultimate App Blocker Showdown',
    description: 'Clearspace and Spool both promise to reduce phone addiction, but they work very differently. Find out which one actually helps you change habits.',
    date: '2026-02-08',
    competitor: 'Clearspace',
    faq: [
      {
        question: 'How does Spool compare to Clearspace?',
        answer: 'Spool uses a ~5-second voice check-in to build awareness of why you reach for your phone. Clearspace requires completing exercises (30 seconds to 2 minutes) to unlock apps. Spool focuses on self-awareness and pattern recognition; Clearspace focuses on making apps harder to access through friction.',
      },
      {
        question: 'Is Spool or Clearspace better for reducing screen time?',
        answer: 'Spool is better for users who want to understand their phone use patterns and build lasting habits through self-awareness. Clearspace is better for users who need friction-based unlocking to reduce impulsive app opens and respond well to effort-based barriers.',
      },
      {
        question: 'Does Clearspace track why you use your phone?',
        answer: 'No. Clearspace tracks usage time but does not capture the reasons behind your phone use. Spool records your voice excuses and uses AI to identify patterns and emotional triggers in your phone use behavior.',
      },
      {
        question: 'Which app is less disruptive to your workflow?',
        answer: 'Spool is less disruptive — the voice check-in takes about 5 seconds. Clearspace exercises take 30 seconds to 2 minutes, which can feel like a significant interruption, especially during a quick legitimate app check.',
      },
    ],
  },
  'spool-vs-brainrot': {
    title: 'Spool vs Brainrot: Which App Actually Fixes Your Scrolling Habit?',
    description: 'Brainrot uses a decaying brain avatar to guilt you into stopping. Spool uses voice awareness. Which approach leads to lasting change?',
    date: '2026-02-08',
    competitor: 'Brainrot',
    faq: [
      {
        question: 'What is the Brainrot app?',
        answer: 'Brainrot is a screen time app that displays a decaying brain avatar that deteriorates as you spend more time on social media. It uses visual guilt and negative reinforcement to discourage excessive phone use.',
      },
      {
        question: 'Does guilt-based screen time reduction work?',
        answer: 'Guilt-based approaches like Brainrot can create short-term motivation but often lead to shame cycles that increase anxiety. Research on behavior change suggests awareness-based approaches — understanding why you scroll — lead to more sustainable long-term results without negative emotional side effects.',
      },
      {
        question: 'Which reduces screen time more effectively, Spool or Brainrot?',
        answer: 'Spool addresses root causes of phone addiction through voice-based self-awareness and AI pattern analysis. Users understand their specific triggers and patterns. Brainrot uses guilt mechanics that work for some users but can backfire. Spool users report an average 25% reduction in screen time.',
      },
      {
        question: 'Is Spool better than Brainrot for anxiety-prone users?',
        answer: 'Yes. Spool uses a non-judgmental approach focused on self-awareness and understanding. Brainrot\'s guilt and visual decay mechanics can increase anxiety around phone use. Spool helps you understand your patterns without shame.',
      },
    ],
  },
  'spool-vs-unrot': {
    title: 'Spool vs Unrot: Earn Screen Time or Understand Why You Scroll?',
    description: 'Unrot makes you earn app access through healthy habits. Spool builds self-awareness through voice check-ins. A deep dive into two different philosophies.',
    date: '2026-02-08',
    competitor: 'Unrot',
    faq: [
      {
        question: 'How does Unrot work?',
        answer: 'Unrot makes you earn screen time by completing healthy habits like exercise, reading, or meditation. Once you complete these activities, you unlock access to social media and other apps for a set time period.',
      },
      {
        question: 'Spool vs Unrot: which approach is better?',
        answer: 'Spool builds self-awareness through voice check-ins and AI analysis of your usage patterns — you learn why you scroll. Unrot gamifies healthy habits to earn screen time — you replace bad habits with good ones. Spool is better for understanding root causes; Unrot is better for users motivated by earning rewards.',
      },
      {
        question: 'Which app is better for building healthy daily routines?',
        answer: 'Unrot directly rewards healthy behaviors like exercise and reading by unlocking phone access, making it better for building physical and mental health routines. Spool is better for specifically understanding and reducing compulsive phone use patterns.',
      },
      {
        question: 'Does Spool have any habit-building features like Unrot?',
        answer: 'Spool focuses on voice-based check-ins, excuse journaling, and AI pattern analysis rather than habit rewards. The self-awareness Spool builds often naturally leads to healthier routines, but without the explicit earn-to-use mechanic that Unrot offers.',
      },
    ],
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
    alternates: { canonical: `https://thespoolapp.com/compare/${id}` },
    openGraph: {
      title: `${meta.title} | Spool`,
      description: meta.description,
      url: `https://thespoolapp.com/compare/${id}`,
      type: 'article',
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const meta = compareMeta[id];

  const articleSchema = meta
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: meta.title,
        description: meta.description,
        datePublished: meta.date,
        dateModified: meta.date,
        author: {
          '@type': 'Organization',
          name: 'Spool',
          url: 'https://thespoolapp.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Spool',
          url: 'https://thespoolapp.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://thespoolapp.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://thespoolapp.com/compare/${id}`,
        },
        about: [
          {
            '@type': 'SoftwareApplication',
            name: 'Spool',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'iOS',
            offers: {
              '@type': 'Offer',
              price: '7.99',
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '7.99',
                priceCurrency: 'USD',
                unitText: 'MONTH',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '2000',
              bestRating: '5',
            },
          },
          {
            '@type': 'SoftwareApplication',
            name: meta.competitor,
            applicationCategory: 'HealthApplication',
            operatingSystem: 'iOS',
          },
        ],
      }
    : null;

  const faqSchema = meta
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faq.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlogPost />
    </>
  );
}
