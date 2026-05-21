import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import Footer from '@/components/Footer/Footer';
import '@/views/BlogPost.css';
import { PRAFULL } from '@/data/authors';

export const metadata = {
  title: 'Prafull Sharma — Founder of Spool',
  description:
    'Prafull Sharma is the founder of Spool, an iPhone app that uses AI voice check-ins to help people stop doomscrolling. He has analyzed 8,000+ first-person statements captured at the moment of compulsive phone use.',
  alternates: { canonical: PRAFULL.url },
};

const POSTS_BY_PRAFULL = [
  {
    slug: 'best-apps-stop-doomscrolling-2026',
    title: 'Best Apps to Stop Doomscrolling in 2026 (Honest Comparison)',
    date: 'May 1, 2026',
  },
  {
    slug: 'how-to-stop-doom-scrolling',
    title: 'How to Stop Doom Scrolling: 10 Proven Strategies That Work',
    date: 'February 8, 2026',
  },
  {
    slug: 'doom-scrolling-habit',
    title: 'How Spool Breaks Your Doom Scrolling Habit',
    date: 'October 9, 2024',
  },
  {
    slug: 'intentional-screen-time',
    title: 'Transform Screen Time Into Intentional Time',
    date: 'October 9, 2024',
  },
  {
    slug: 'breaking-phone-addiction',
    title: 'Join Thousands Breaking Free From Phone Addiction',
    date: 'October 9, 2024',
  },
];

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PRAFULL.name,
  jobTitle: PRAFULL.jobTitle,
  url: PRAFULL.url,
  email: `mailto:${PRAFULL.email}`,
  sameAs: PRAFULL.sameAs,
  description: PRAFULL.shortBio,
  worksFor: {
    '@type': 'Organization',
    name: 'Spool',
    url: 'https://www.thespoolapp.com',
  },
  knowsAbout: PRAFULL.expertise,
};

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: PRAFULL.url,
  mainEntity: personSchema,
};

export default function PrafullAuthorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <Logo />
      <article className="blog-post-container">
        <div className="blog-post-header">
          <Link href="/blog" className="back-to-blog">← Back to Blog</Link>
          <span className="blog-post-category">Author</span>
          <h1>{PRAFULL.name}</h1>
          <div className="blog-post-meta">
            <span>{PRAFULL.jobTitle}</span>
          </div>
        </div>

        <div className="blog-post-content">
          <p>
            Prafull Sharma is the founder of <Link href="/">Spool</Link>, an iPhone app that
            helps people stop doomscrolling through AI voice check-ins. Instead of blocking
            apps, Spool asks users to speak their reason out loud before opening distracting
            apps like TikTok, Instagram, or X &mdash; a 5-second pause that interrupts the
            autopilot habit loop and produces structured data about <em>why</em> people reach
            for their phones.
          </p>

          <p>
            Prafull has been working on phone-addiction research full-time since 2024. Under
            his leadership, Spool has captured and analyzed over 8,000 first-person statements
            recorded at the moment of compulsive phone use &mdash; a category of data rare in
            the digital-wellbeing literature, which typically relies on retrospective
            self-report.
          </p>

          <h2>What I write about</h2>
          <ul>
            {PRAFULL.expertise.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>Research basis</h2>
          <p>
            The work on this site draws on peer-reviewed research from UCLA, Stanford, NYU,
            Yale, Harvard, and UC Irvine. See the <Link href="/science">science behind Spool</Link>{' '}
            for the specific papers and how Spool operationalizes each.
          </p>

          <h2>Posts by Prafull</h2>
          <ul>
            {POSTS_BY_PRAFULL.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                {' — '}
                <time>{post.date}</time>
              </li>
            ))}
          </ul>

          <h2>Contact</h2>
          <p>
            Email: <a href={`mailto:${PRAFULL.email}`}>{PRAFULL.email}</a>
            <br />
            LinkedIn:{' '}
            <a
              href="https://www.linkedin.com/in/prafull-sharma-363187168/"
              target="_blank"
              rel="noopener noreferrer me"
            >
              prafull-sharma
            </a>
            <br />
            GitHub:{' '}
            <a
              href="https://github.com/prafull2001"
              target="_blank"
              rel="noopener noreferrer me"
            >
              @prafull2001
            </a>
            <br />
            X / Twitter:{' '}
            <a
              href="https://twitter.com/prafull_truffle"
              target="_blank"
              rel="noopener noreferrer me"
            >
              @prafull_truffle
            </a>
          </p>
        </div>
      </article>
      <Footer />
    </>
  );
}
