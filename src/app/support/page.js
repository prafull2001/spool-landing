import SupportPage from '@/views/SupportPage';

export const metadata = {
  title: 'Help & FAQ | Spool Support',
  description: 'Get help with Spool, find answers to common questions about voice check-ins, and contact our support team.',
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does Spool stop doomscrolling?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Spool adds a 5-second voice check-in before you open distracting apps. You speak your intention aloud, which breaks the automatic reflex and makes you scroll mindfully instead of compulsively."
                }
              }
            ]
          })
        }}
      />
      <SupportPage />
    </>
  );
}
