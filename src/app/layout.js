import { Quicksand } from 'next/font/google';
import '../index.css';
import { Analytics } from '@vercel/analytics/react';
import MotionProvider from '../components/MotionProvider';
import { PRESS_ITEMS } from '../data/press';

const quicksand = Quicksand({ subsets: ['latin'], display: 'swap', variable: '--font-quicksand' });

export const metadata = {
  metadataBase: new URL('https://www.thespoolapp.com'),
  title: {
    default: 'Spool — Stop Doomscrolling | Screen Time App for iPhone',
    template: '%s | Spool',
  },
  description: 'Spool uses AI voice check-ins to help you stop doomscrolling. 4.8★, 2,000+ users, 80% first-week and 25% sustained reduction.',
  openGraph: {
    title: 'Spool — Stop Doomscrolling',
    description: 'Spool uses AI voice check-ins to help you stop doomscrolling. 4.8★, 2,000+ users, 80% first-week and 25% sustained reduction.',
    url: 'https://www.thespoolapp.com',
    siteName: 'Spool',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@the_spool_app', creator: '@prafull_truffle' },
  alternates: { canonical: 'https://www.thespoolapp.com' },
  icons: {
    icon: '/spooli-app-icon.png',
    apple: '/spooli-app-icon.png'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${quicksand.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Spool",
              "alternateName": "Spool App",
              "url": "https://www.thespoolapp.com",
              "logo": "https://www.thespoolapp.com/spooli-app-icon-512.png",
              "description": "Spool uses AI voice check-ins to help you stop doomscrolling. iPhone app for screen time reduction through awareness, not blocking.",
              "founder": [
                {
                  "@type": "Person",
                  "name": "Prafull Sharma",
                  "jobTitle": "Founder & CEO",
                  "url": "https://www.linkedin.com/in/prafull-sharma-363187168/",
                  "sameAs": [
                    "https://www.linkedin.com/in/prafull-sharma-363187168/",
                    "https://github.com/prafull2001"
                  ]
                },
                { "@type": "Person", "name": "Jainam", "jobTitle": "Co-founder" },
                { "@type": "Person", "name": "Vedika", "jobTitle": "Co-founder" },
                { "@type": "Person", "name": "Daneal", "jobTitle": "Co-founder" }
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "team@thespoolapp.com",
                "contactType": "customer support"
              },
              "sameAs": [
                "https://twitter.com/the_spool_app",
                "https://www.linkedin.com/company/spooli/",
                "https://github.com/prafull2001/spool-landing",
                "https://apps.apple.com/us/app/spool-save-your-thread/id6749428484",
                "https://microlaunch.net/p/spool"
              ],
              "subjectOf": PRESS_ITEMS.map(item => ({
                "@type": "NewsArticle",
                "headline": item.title,
                "author": item.authors.map(name => ({ "@type": "Person", "name": name })),
                "publisher": { "@type": "Organization", "name": item.outlet, "url": item.outletUrl },
                "datePublished": item.datePublished,
                "url": item.url
              }))
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://www.thespoolapp.com",
              "name": "Spool",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.thespoolapp.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={quicksand.className}>
        <MotionProvider>
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
