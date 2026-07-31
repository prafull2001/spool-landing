import Link from 'next/link';
import Footer from '@/components/Footer/Footer';
import Logo from '@/components/Logo/Logo';
import { FOCUS_WEB_PLATFORMS } from '@/data/focusWeb';
import styles from './focus-web.module.css';

export const metadata = {
  title: 'Social Media Feed Blocker for Reels, Shorts & Spotlight',
  description:
    'Focus Web is Spool’s social media feed blocker and distraction-free browser. Remove Reels, Shorts, Spotlight, Stories, Discover, Explore, and DMs on iPhone.',
  alternates: { canonical: 'https://www.thespoolapp.com/focus-web' },
  openGraph: {
    title: 'Focus Web: Social Media Feed Blocker for iPhone',
    description:
      'Remove Reels, Shorts, Spotlight, Stories, Discover, Explore, and DMs without blocking every social platform.',
    url: 'https://www.thespoolapp.com/focus-web',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage.jpg', width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.thespoolapp.com' },
    { '@type': 'ListItem', position: 2, name: 'Focus Web', item: 'https://www.thespoolapp.com/focus-web' },
  ],
};

export default function FocusWebPage() {
  return (
    <>
      <Logo />
      <main className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <header className={styles.hero}>
          <p className={styles.eyebrow}>Spool Focus Web</p>
          <h1>A social media feed blocker for Reels, Shorts, Spotlight, and Explore</h1>
          <p className={styles.lede}>
            Focus Web is Spool&apos;s distraction-free social media browser. It removes
            selected features inside Instagram, YouTube, X, and Snapchat, so you can
            block the scroll surface instead of losing the whole platform.
          </p>
          <a
            className={styles.primaryLink}
            href="https://apps.apple.com/us/app/spool-screen-time-control/id6749428484?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Focus Web on iPhone
          </a>
        </header>

        <section className={styles.answer} aria-labelledby="focus-web-answer">
          <h2 id="focus-web-answer">What can Spool remove?</h2>
          <p>
            Spool can hide <strong>Instagram Reels, Stories, Explore, and DMs</strong>;{' '}
            <strong>YouTube Shorts</strong>; <strong>X Explore</strong>; and{' '}
            <strong>Snapchat Spotlight, Stories, and Discover</strong>. Each platform runs
            inside Focus Web, and its filters apply there—not to the native social app.
          </p>
        </section>

        <section className={styles.tableSection} aria-labelledby="platform-table-heading">
          <h2 id="platform-table-heading">Focus Web platform filters</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>What Spool can remove</th>
                  <th>Dedicated guide</th>
                </tr>
              </thead>
              <tbody>
                {FOCUS_WEB_PLATFORMS.map((item) => (
                  <tr key={item.slug}>
                    <th scope="row">{item.platform}</th>
                    <td>{item.removes.join(', ')}</td>
                    <td>
                      <Link href={`/focus-web/${item.slug}`}>{item.shortLabel}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.cards} aria-label="Focus Web platform guides">
          {FOCUS_WEB_PLATFORMS.map((item) => (
            <article className={styles.card} key={item.slug}>
              <p className={styles.cardLabel}>{item.platform}</p>
              <h2>{item.title}</h2>
              <p>{item.answer}</p>
              <Link href={`/focus-web/${item.slug}`}>See what Spool removes</Link>
            </article>
          ))}
        </section>

        <section className={styles.explainer} aria-labelledby="focus-web-how">
          <h2 id="focus-web-how">How Focus Web differs from an app blocker</h2>
          <p>
            A normal app blocker works at the app level: Instagram is available or it is not.
            Focus Web works at the surface level. You open the platform through Spool and remove
            the specific feed, tab, or communication path that triggers your habit. Spool can
            also add a voice check-in before a distracting native app opens, so filtering and
            self-awareness can work together.
          </p>
          <h2>Does Spool modify Instagram, YouTube, X, or Snapchat?</h2>
          <p>
            No. Focus Web is a browser inside Spool. It filters the web interfaces shown inside
            Spool and does not modify or claim affiliation with the native social-media apps.
          </p>
          <h2>How does Focus Web compare with other feed filters?</h2>
          <p>
            SocialLite, Dull, and UNDOOMED also use filtered browsers, but their surrounding
            tools differ. Read the verified{' '}
            <Link href="/compare/spool-vs-sociallite">Spool vs SocialLite</Link>,{' '}
            <Link href="/compare/spool-vs-dull">Spool vs Dull</Link>, and{' '}
            <Link href="/compare/spool-vs-undoomed">Spool vs UNDOOMED</Link> comparisons for
            platform coverage, filter depth, limits, and best-fit guidance.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
