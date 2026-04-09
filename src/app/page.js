import HomePage from '@/views/HomePage';

export const metadata = {
  title: 'Spool — Stop Doomscrolling | iPhone Screen Time App',
  description: 'Spool uses AI voice check-ins to break your doomscrolling habit. 4.8★, 2,000+ users, 6,500+ scrolling sessions interrupted. Free on iPhone.',
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Spool",
            "operatingSystem": "iOS",
            "applicationCategory": "LifestyleApplication",
            "description": "AI-powered screen time app that uses voice check-ins to help you stop doomscrolling and build mindful phone habits",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "70",
              "bestRating": "5",
              "worstRating": "1"
            },
            "downloadUrl": "https://apps.apple.com/us/app/spool-save-your-thread/id6749428484",
            "applicationSubCategory": "Screen Time Management"
          })
        }}
      />
      <HomePage />
    </>
  );
}
