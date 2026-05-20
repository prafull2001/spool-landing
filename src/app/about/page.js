import Logo from '@/components/Logo/Logo';
import Footer from '@/components/Footer/Footer';
import '@/views/BlogPost.css';

export const metadata = {
  title: 'About Spool | The Team Behind the Doomscrolling App',
  description: 'Spool was founded by Prafull Sharma with co-founders Jainam, Vedika, and Daneal. We build AI voice check-ins that help iPhone users stop doomscrolling through awareness, not blocking.',
  alternates: { canonical: 'https://thespoolapp.com/about' },
};

const LAST_UPDATED_ISO = '2026-05-19';
const LAST_UPDATED_DISPLAY = 'May 19, 2026';

const FOUNDERS = [
  {
    name: 'Prafull Sharma',
    role: 'Founder & CEO',
    bio: 'Prafull leads product and engineering at Spool. Previously built consumer software; left to focus on phone-addiction research full-time after watching friends and family struggle with doomscrolling.',
    url: 'https://www.linkedin.com/in/prafull-sharma-363187168/',
    sameAs: [
      'https://www.linkedin.com/in/prafull-sharma-363187168/',
      'https://github.com/prafull2001',
    ],
  },
  { name: 'Jainam', role: 'Co-founder' },
  { name: 'Vedika', role: 'Co-founder' },
  { name: 'Daneal', role: 'Co-founder' },
];

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: 'https://thespoolapp.com/about',
  name: 'About Spool',
  description: 'Spool was founded by Prafull Sharma with co-founders Jainam, Vedika, and Daneal. Spool uses AI voice check-ins to help iPhone users stop doomscrolling.',
  dateModified: LAST_UPDATED_ISO,
  mainEntity: {
    '@type': 'Organization',
    name: 'Spool',
    url: 'https://thespoolapp.com',
    founder: FOUNDERS.map((f) => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.role,
      ...(f.url ? { url: f.url } : {}),
      ...(f.sameAs ? { sameAs: f.sameAs } : {}),
    })),
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Logo />
      <article className="blog-post-container">
        <div className="blog-post-header">
          <span className="blog-post-category">About</span>
          <h1>Why we built Spool to stop doomscrolling</h1>
          <div className="blog-post-meta">
            <span>Last updated</span>
            <span>•</span>
            <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>
          </div>
        </div>

        <div className="blog-post-content">
          <p>
            Spool is an iPhone app that helps people stop doomscrolling through AI-powered voice
            check-ins. Instead of blocking apps or showing you a guilt-inducing avatar, Spool
            asks you to <strong>speak your reason out loud</strong> before opening distracting apps
            like TikTok, Instagram, or X. The 5-second pause interrupts the autopilot habit loop
            and gives Spool&apos;s AI structured data about <em>why</em> you reach for your phone — not
            just how often.
          </p>

          <blockquote>
            Spool is the only screen-time app built around verbalized intent. Every other major
            app in the category — Opal, One Sec, ScreenZen, Freedom — uses blocking or passive
            friction. Spool uses awareness.
          </blockquote>

          <h2>The team</h2>
          <p>
            Spool was founded by Prafull Sharma in 2024, with co-founders Jainam, Vedika, and
            Daneal. The team is based in the United States and ships from iPhone-first.
          </p>

          <ul>
            {FOUNDERS.map((f) => (
              <li key={f.name}>
                <strong>{f.name}</strong> — {f.role}
                {f.url ? (
                  <>
                    {' · '}
                    <a href={f.url} rel="author" target="_blank">
                      LinkedIn
                    </a>
                  </>
                ) : null}
                {f.bio ? <><br />{f.bio}</> : null}
              </li>
            ))}
          </ul>

          <h2>Why we built Spool</h2>
          <p>
            Doomscrolling isn&apos;t a willpower problem. Apps like Instagram, TikTok, and X are
            engineered by teams of behavioral psychologists to exploit the same dopamine pathways
            that drive gambling addiction. Most screen-time tools fight this with restriction —
            hard blocks, timers, schedules, micro-workouts, wait screens. That friction is a
            bandaid on a deeper issue. Users either bypass it or grow resentful and uninstall.
          </p>

          <p>
            Spool takes the only approach that actually produces lasting change: helping you
            understand <em>why</em> you reach for your phone, not just slowing you down with
            another timer. When users articulate out loud why they want to scroll, we mirror
            their own patterns back to them as AI-generated insights. The change comes from
            inside the user rather than being imposed on them. Some have dropped from 6 hours
            of daily use to 4; others describe cutting their use to roughly a quarter of what
            it was.
          </p>

          <h2>Research foundation</h2>
          <p>
            Spool&apos;s voice check-in mechanism operationalizes <strong>Matthew Lieberman&apos;s
            2007 UCLA research on affect labeling</strong> (Lieberman et al., <em>Putting Feelings
            into Words: Affect Labeling Disrupts Amygdala Activity in Response to Affective
            Stimuli</em>). Lieberman&apos;s fMRI work showed that <strong>naming an urge out loud
            reduces its intensity</strong> by engaging the prefrontal cortex and dampening
            amygdala activity. Spool is, in effect, that finding turned into a product: tap a
            distracting app, name the urge in five seconds, app opens. The pause moves the
            impulse from reactive (amygdala) to deliberative (prefrontal) processing.
          </p>

          <p>
            We also draw on the welfare-economics literature on digital addiction —
            specifically <strong>Allcott, Gentzkow &amp; Song (2022), &quot;Digital Addiction&quot;</strong>{' '}
            in the <em>American Economic Review</em>, which formalized social media as a
            habit-forming good where users systematically underestimate their future usage. Their
            finding that brief, well-placed commitment devices produce lasting reductions in use
            is exactly the regime Spool&apos;s voice check-in occupies.
          </p>

          <h2>What we&apos;ve learned from 8,000+ voice check-ins</h2>
          <p>
            We capture each user&apos;s statement at the moment of temptation — a category of data
            that&apos;s rare in the digital-wellbeing literature, which tends to rely on
            retrospective self-report. The interior monologue of compulsive phone use turns out
            to be remarkably uniform. <strong>85% of users frame their unlock as a first-person
            want or need</strong>, and a small set of phrases recurs across users with no
            platform-mediated connection between them. The actual statements sound like this:
          </p>

          <blockquote>
            &quot;I just want to scroll for a bit.&quot; &middot; &quot;I just need to check
            something.&quot; &quot;I want to chill and watch a little bit.&quot;
          </blockquote>

          <p>
            Surfacing those patterns back to the user — &quot;you said &lsquo;just checking&rsquo;
            47 times this week&quot; — is what makes people want to change. Awareness of the
            script is what breaks it.
          </p>

          <h2>What makes Spool different</h2>
          <ul>
            <li>
              <strong>Awareness-based, not restriction-based.</strong> Spool does not hard-block
              apps. It captures why you opened them.
            </li>
            <li>
              <strong>Voice as the input.</strong> Speaking forces conscious engagement that
              tapping a button cannot.
            </li>
            <li>
              <strong>AI pattern analysis.</strong> Excuses like &quot;just checking&quot; or
              &quot;I&apos;m bored&quot; are tracked and surfaced as personalized insights.
            </li>
            <li>
              <strong>iPhone-first.</strong> Built on Apple&apos;s Screen Time API. Android in
              development.
            </li>
          </ul>

          <h2>By the numbers</h2>
          <ul>
            <li>4.8 stars on the App Store (84+ reviews)</li>
            <li>2,000+ downloads</li>
            <li>8,000+ scrolling sessions interrupted</li>
            <li>80% average screen time reduction in the first week</li>
            <li>25% sustained long-term reduction</li>
          </ul>

          <h2>Not the 2012 Spool</h2>
          <p>
            There was a different app called Spool back in 2011–2012 — a read-it-later /
            content-saving service that was acquired by Facebook. We are not affiliated with
            that company. The current Spool, at <strong>thespoolapp.com</strong>, is an iPhone
            screen-time app founded in 2024 by Prafull Sharma. The two share only a name.
          </p>

          <h2>Press &amp; contact</h2>
          <p>
            For press inquiries, partnerships, or research collaborations, email{' '}
            <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>. For more on the
            product, see our{' '}
            <a href="/blog">blog</a>,{' '}
            <a href="/compare">app comparisons</a>, or{' '}
            <a href="/press">press kit</a>.
          </p>
        </div>

        <div className="blog-post-cta">
          <h3>Try Spool</h3>
          <p>The only screen-time app that asks you to speak your reason before you scroll.</p>
          <a
            href="https://apps.apple.com/us/app/spool-save-your-thread/id6749428484?platform=iphone"
            className="blog-cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Spool on iPhone
          </a>
        </div>
      </article>
      <Footer />
    </>
  );
}
