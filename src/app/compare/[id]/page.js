import BlogPost from '@/views/BlogPost';
import { PRAFULL } from '@/data/authors';

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
  'spool-vs-apple-screen-time': {
    title: 'Spool vs Apple Screen Time: Why the Built-In iPhone Tool Isn\'t Enough',
    description: 'Apple Screen Time is free and built into every iPhone. So why do millions of people still doomscroll? Compare Apple\'s native tracker with Spool\'s AI voice check-ins.',
    date: '2026-05-21',
    competitor: 'Apple Screen Time',
    faq: [
      {
        question: 'Is Apple Screen Time enough to stop doomscrolling?',
        answer: 'For most people, no. Apple Screen Time tracks how long you spend on each app and lets you set time limits, but it doesn\'t address why you reach for your phone. The "Ignore Limit" button takes one tap to dismiss, and most users learn to dismiss it on autopilot within a week. Spool sits on top of Apple Screen Time using the same API, but instead of just showing time spent, it asks you to verbalize your reason for opening the app — which engages the prefrontal cortex and produces lasting change rather than a passable barrier.',
      },
      {
        question: 'Does Spool replace Apple Screen Time or work alongside it?',
        answer: 'Spool is built on top of Apple\'s Screen Time API, so they work together. You keep Apple\'s app limits and Downtime if you want them. Spool adds the voice check-in layer — when you open a distracting app, Spool asks you to speak your intention before the app loads. The data Spool captures (your spoken reasons) is something Apple Screen Time cannot produce.',
      },
      {
        question: 'Why isn\'t Apple Screen Time working for me?',
        answer: 'Apple Screen Time has two structural problems: (1) the "Ignore Limit" button is one tap away and becomes automatic, and (2) tracking minutes does not address the trigger that opens the app in the first place. Research on behavior change consistently shows that awareness-based interventions outperform restriction-based ones for long-term habit change. Spool addresses both by requiring an active verbal step — you must speak your reason out loud — which interrupts the autopilot dismissal pattern.',
      },
      {
        question: 'Is Spool worth paying for if Apple Screen Time is free?',
        answer: 'If Apple Screen Time has worked for you, no — keep using it. If you have set limits and watched yourself dismiss them daily, the $7.99/month for Spool buys you a different mechanism (active verbalization instead of passive notification) and a different data set (your spoken reasons, analyzed by AI) that Apple does not offer at any price.',
      },
    ],
  },
  'spool-vs-freedom': {
    title: 'Spool vs Freedom: Cross-Device Blocking or Single-Device Awareness?',
    description: 'Freedom blocks distracting apps and websites across your phone, laptop, and tablet. Spool focuses on iPhone with voice-based awareness. Which approach actually changes your habits?',
    date: '2026-05-21',
    competitor: 'Freedom',
    faq: [
      {
        question: 'What\'s the main difference between Spool and Freedom?',
        answer: 'Freedom is a blocker — it makes selected apps and websites completely inaccessible during scheduled sessions across iPhone, Mac, Windows, and Chrome. Spool is an awareness tool — it asks you to speak your reason before opening a distracting app on iPhone, then surfaces patterns in your reasons over time. Freedom restricts; Spool reveals.',
      },
      {
        question: 'Should I use Spool or Freedom for deep work sessions?',
        answer: 'Freedom is the better tool for a scheduled 2-4 hour deep-work block where you need apps completely inaccessible across multiple devices. Spool is the better tool for daily, all-day habit change — when you want to keep apps available but understand and reduce the times you actually open them.',
      },
      {
        question: 'Does Freedom work on iPhone like Spool?',
        answer: 'Freedom has an iOS app, but its strength is cross-device blocking — phone, Mac, Windows, Chrome browser. If you only need iPhone, Freedom\'s extra capability is wasted. Spool is iPhone-only and focuses entirely on the in-the-moment moment of compulsive use.',
      },
      {
        question: 'Can I use Spool and Freedom together?',
        answer: 'Yes. Some users run Freedom for scheduled focus blocks (when apps should be off-limits entirely) and Spool the rest of the day (when apps should be available but used intentionally). They address different parts of the screen-time problem.',
      },
    ],
  },
  'spool-vs-forest': {
    title: 'Spool vs Forest: Grow Trees or Understand Your Scrolling?',
    description: 'Forest gamifies focus sessions with virtual trees. Spool builds self-awareness through voice check-ins. Which approach actually rewires the doomscrolling habit?',
    date: '2026-05-21',
    competitor: 'Forest',
    faq: [
      {
        question: 'How does Forest compare to Spool?',
        answer: 'Forest is a focus timer — you plant a virtual tree, and it grows as long as you don\'t pick up your phone. Use your phone and the tree dies. Spool addresses a different problem: the in-the-moment urge to open a specific distracting app. Forest helps you stay off your phone for a focus session; Spool helps you understand why you reach for it in the first place.',
      },
      {
        question: 'Which app is better for reducing TikTok or Instagram use specifically?',
        answer: 'Spool. Forest treats all phone use as equivalent (the tree dies whether you opened TikTok or your calendar). Spool only intervenes when you open the specific distracting apps you flagged, and captures data about why you opened them. For targeting a specific scrolling habit, Spool is the more precise tool.',
      },
      {
        question: 'Does Forest actually reduce screen time long-term?',
        answer: 'Forest works well for short-term focus sessions, but research on gamification consistently shows diminishing returns — the novelty of growing trees wears off, and the motivation system stops working. Awareness-based interventions like Spool\'s voice check-in produce more durable change because they address the underlying trigger, not just the immediate behavior.',
      },
      {
        question: 'Is Forest cheaper than Spool?',
        answer: 'Yes. Forest is a one-time $3.99 purchase on iOS. Spool is $7.99/month or $39.99/year. Forest is the lower-commitment option; Spool is more expensive but does substantially more — voice capture, AI pattern analysis, friend accountability.',
      },
    ],
  },
  'spool-vs-screenzen': {
    title: 'Spool vs ScreenZen: Delay Timers or Voice Awareness?',
    description: 'ScreenZen adds a customizable wait before opening apps. Spool asks you to speak your reason. Both interrupt automatic phone-checking — but only one captures why you scroll.',
    date: '2026-05-21',
    competitor: 'ScreenZen',
    faq: [
      {
        question: 'How is Spool different from ScreenZen?',
        answer: 'ScreenZen makes you wait a customizable number of seconds before a distracting app opens. Spool asks you to verbalize your reason in those seconds. Both interrupt autopilot, but ScreenZen\'s pause is passive (you can stare at the screen waiting), while Spool\'s pause is active (you must actually speak). Active engagement of the prefrontal cortex during the pause is what produces lasting change, not the wait itself.',
      },
      {
        question: 'Is the ScreenZen wait timer effective?',
        answer: 'Initially yes, but users typically habituate within 1-2 weeks. The wait becomes background noise and the auto-pilot pattern reasserts. Spool\'s voice requirement is harder to habituate to because it requires conscious verbal output every time. You can\'t fake speaking your intention; you can absolutely wait out a timer while still thinking about TikTok.',
      },
      {
        question: 'Which is better for understanding my phone habits, Spool or ScreenZen?',
        answer: 'Spool, by a wide margin. ScreenZen tracks attempts to open apps but produces no qualitative data — you only see "you tried to open Instagram 47 times this week." Spool captures the spoken reason each time, so you see "you opened Instagram 47 times saying \'just checking\' 35 of those times." Knowing the trigger is what enables change.',
      },
      {
        question: 'Is ScreenZen free?',
        answer: 'ScreenZen has a free tier with basic features and a $3.99/month premium. Spool is $7.99/month or $39.99/year with all features included. ScreenZen is cheaper for casual users; Spool is more expensive but does more.',
      },
    ],
  },
  'spool-vs-jomo': {
    title: 'Spool vs Jomo: Two Approaches to Mindful Phone Use',
    description: 'Jomo (Joy of Missing Out) blocks distracting apps with timer-based friction. Spool uses voice check-ins to build awareness. Both reject pure hard-blocking — but which approach lasts?',
    date: '2026-05-21',
    competitor: 'Jomo',
    faq: [
      {
        question: 'How does Spool compare to Jomo?',
        answer: 'Jomo blocks distracting apps and uses a "dopamine reset" framing — schedule mindful breaks, see your stats, build streaks. Spool addresses the moment-of-impulse itself with a voice check-in that captures why you tried to open the app. Jomo manages your relationship with your phone at the session level; Spool manages it at the individual unlock level.',
      },
      {
        question: 'Does Jomo have features Spool doesn\'t?',
        answer: 'Yes. Jomo has scheduled blocking, "phone fasts," mood tracking, and a stronger community/streak emphasis. Spool focuses narrowly on the voice check-in and AI pattern analysis. If you want a full digital-wellness toolkit, Jomo offers more breadth. If you want a single high-leverage intervention at the moment of compulsive use, Spool is more focused.',
      },
      {
        question: 'Which is better for someone who has tried multiple screen-time apps and quit them all?',
        answer: 'Spool, in most cases. Repeat-quitters typically uninstall because the friction becomes annoying and feels punitive. Spool\'s 5-second voice check-in is less punishing than hard blocks or long wait timers, and the data it produces (your spoken reasons) provides positive reinforcement to keep using it — you learn something about yourself each time, instead of just being told "no."',
      },
      {
        question: 'Is Jomo or Spool more expensive?',
        answer: 'Pricing is comparable. Jomo is around $7.99/month or $59.99/year (varies by promo). Spool is $7.99/month or $39.99/year. Spool\'s annual plan is cheaper.',
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
    alternates: { canonical: `https://www.thespoolapp.com/compare/${id}` },
    openGraph: {
      title: `${meta.title} | Spool`,
      description: meta.description,
      url: `https://www.thespoolapp.com/compare/${id}`,
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
          '@type': 'Person',
          name: PRAFULL.name,
          url: PRAFULL.url,
          jobTitle: PRAFULL.jobTitle,
          sameAs: PRAFULL.sameAs,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Spool',
          url: 'https://www.thespoolapp.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.thespoolapp.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.thespoolapp.com/compare/${id}`,
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
