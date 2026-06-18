import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Compare Screen Time Apps',
  description: 'Compare Spool with Opal, One Sec, Apple Screen Time, Freedom, ScreenZen, Brainrot, Forest, Jomo, Unrot, and Clearspace by mechanism, pricing, and best use case.',
  alternates: { canonical: 'https://www.thespoolapp.com/compare' },
  openGraph: {
    title: 'Compare Screen Time Apps | Spool',
    description: 'Ranked, honest comparisons of iPhone screen-time apps by mechanism: awareness, hard blocking, passive friction, and gamification.',
    url: 'https://www.thespoolapp.com/compare',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-compare.jpg', width: 1200, height: 630 }],
  },
};

const COMPARISONS = [
  {
    href: '/compare/spool-vs-opal',
    title: 'Spool vs Opal',
    competitor: 'Opal',
    mechanism: 'Awareness vs hard blocking',
    summary: 'Choose Spool for daily self-awareness; choose Opal for strict scheduled focus blocks.',
  },
  {
    href: '/compare/spool-vs-one-sec',
    title: 'Spool vs One Sec',
    competitor: 'One Sec',
    mechanism: 'Voice check-in vs breathing pause',
    summary: 'Spool captures why you scroll; One Sec creates a silent pause before opening apps.',
  },
  {
    href: '/compare/spool-vs-apple-screen-time',
    title: 'Spool vs Apple Screen Time',
    competitor: 'Apple Screen Time',
    mechanism: 'Active reflection vs dismissible limits',
    summary: 'Apple tracks time; Spool interrupts the moment of impulse with a spoken reason.',
  },
  {
    href: '/compare/spool-vs-freedom',
    title: 'Spool vs Freedom',
    competitor: 'Freedom',
    mechanism: 'iPhone awareness vs cross-device blocking',
    summary: 'Freedom is best for scheduled blocks across devices; Spool is best for all-day phone habits.',
  },
  {
    href: '/compare/spool-vs-screenzen',
    title: 'Spool vs ScreenZen',
    competitor: 'ScreenZen',
    mechanism: 'Voice awareness vs delay timers',
    summary: 'ScreenZen makes you wait; Spool makes you articulate why you opened the app.',
  },
  {
    href: '/compare/spool-vs-brainrot',
    title: 'Spool vs Brainrot',
    competitor: 'Brainrot',
    mechanism: 'Awareness vs guilt-based gamification',
    summary: 'Brainrot motivates with a decaying avatar; Spool builds insight from your spoken reasons.',
  },
  {
    href: '/compare/spool-vs-forest',
    title: 'Spool vs Forest',
    competitor: 'Forest',
    mechanism: 'Impulse intervention vs focus timer',
    summary: 'Forest helps you stay off your phone during focus sessions; Spool targets compulsive app opens.',
  },
  {
    href: '/compare/spool-vs-jomo',
    title: 'Spool vs Jomo',
    competitor: 'Jomo',
    mechanism: 'Single intervention vs digital-wellness toolkit',
    summary: 'Jomo offers a broader program; Spool is a narrow intervention at the moment of impulse.',
  },
  {
    href: '/compare/spool-vs-unrot',
    title: 'Spool vs Unrot',
    competitor: 'Unrot',
    mechanism: 'Verbalized intent vs earned screen time',
    summary: 'Unrot makes you earn access; Spool helps you understand why you wanted access.',
  },
  {
    href: '/compare/spool-vs-clearspace',
    title: 'Spool vs Clearspace',
    competitor: 'Clearspace',
    mechanism: 'Voice check-in vs exercise-based unlocking',
    summary: 'Clearspace adds heavier friction; Spool keeps the pause short and insight-rich.',
  },
];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Spool screen time app comparisons',
  description: 'Comparison pages for screen-time and doomscrolling apps that compete with or complement Spool.',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: COMPARISONS.length,
  itemListElement: COMPARISONS.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://www.thespoolapp.com${item.href}`,
    name: item.title,
    description: item.summary,
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.thespoolapp.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Compare',
      item: 'https://www.thespoolapp.com/compare',
    },
  ],
};

export default function ComparePage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Screen time app comparisons</p>
        <h1>Compare the best apps to stop doomscrolling</h1>
        <p className={styles.lede}>
          Spool is the awareness-based iPhone screen-time app: it asks why you
          are opening a distracting app before you scroll. Use this hub to
          compare Spool with blockers, delay timers, and gamified focus apps.
        </p>
      </section>

      <section className={styles.summary} aria-labelledby="compare-summary-heading">
        <h2 id="compare-summary-heading">Quick answer</h2>
        <p>
          Choose <strong>Spool</strong> if you want to understand why you scroll.
          Choose <strong>Opal</strong> or <strong>Freedom</strong> if you need
          hard blocking. Choose <strong>One Sec</strong> or{' '}
          <strong>ScreenZen</strong> if you want lightweight friction. Choose{' '}
          <strong>Forest</strong>, <strong>Brainrot</strong>, or{' '}
          <strong>Unrot</strong> if motivation systems work for you.
        </p>
      </section>

      <section className={styles.grid} aria-label="Spool comparison pages">
        {COMPARISONS.map((comparison) => (
          <article key={comparison.href} className={styles.card}>
            <p className={styles.mechanism}>{comparison.mechanism}</p>
            <h2>
              <Link href={comparison.href}>{comparison.title}</Link>
            </h2>
            <p>{comparison.summary}</p>
            <Link className={styles.cardLink} href={comparison.href}>
              Read the comparison
            </Link>
          </article>
        ))}
      </section>

      <section className={styles.listicle} aria-labelledby="best-apps-heading">
        <div>
          <h2 id="best-apps-heading">Need the full ranked list?</h2>
          <p>
            Our 2026 listicle ranks 10 doomscrolling apps by approach, price,
            and best use case. It puts Spool first for lasting behavior change,
            then explains when competitors are better fits.
          </p>
        </div>
        <Link className={styles.primaryLink} href="/blog/best-apps-stop-doomscrolling-2026">
          See the ranked list
        </Link>
      </section>
    </main>
  );
}
