import { Inter } from 'next/font/google';
import '../index.css';
import { Analytics } from '@vercel/analytics/react';
import MotionProvider from '../components/MotionProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata = {
  title: 'Spool — Stop Doomscrolling | Screen Time App for iPhone',
  description: 'Spool uses AI voice check-ins to help you stop doomscrolling. 4.8★, 2,000+ users, 25% average screen time reduction. Free on iPhone.',
  openGraph: {
    title: 'Spool — Stop Doomscrolling',
    description: 'Spool uses AI voice check-ins to help you stop doomscrolling. 4.8★, 2,000+ users, 25% average screen time reduction. Free on iPhone.',
    url: 'https://thespoolapp.com',
    siteName: 'Spool',
    images: [{ url: 'https://thespoolapp.com/og-homepage.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@the_spool_app', creator: '@prafull_truffle' },
  alternates: { canonical: 'https://thespoolapp.com' },
  icons: {
    icon: '/spooli-app-icon.png',
    apple: '/spooli-app-icon.png'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Spool",
              "url": "https://thespoolapp.com",
              "logo": "https://thespoolapp.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "team@thespoolapp.com",
                "contactType": "customer support"
              },
              "sameAs": [
                "https://twitter.com/the_spool_app",
                "https://apps.apple.com/us/app/spool-save-your-thread/id6749428484"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://thespoolapp.com",
              "name": "Spool",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://thespoolapp.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
