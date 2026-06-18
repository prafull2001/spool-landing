import HomePage from '@/views/HomePage';

export const metadata = {
  title: 'Spool — Stop Doomscrolling | iPhone Screen Time App',
  description: 'Spool uses AI voice check-ins to break your doomscrolling habit. 4.8★, 2,000+ users, 8,000+ scrolling sessions interrupted. Free on iPhone.',
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
            "url": "https://www.thespoolapp.com",
            "image": "https://www.thespoolapp.com/og-homepage.jpg",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "downloadUrl": "https://apps.apple.com/us/app/spool-save-your-thread/id6749428484",
            "applicationSubCategory": "Screen Time Management"
          })
        }}
      />
      <HomePage />
    </>
  );
}
