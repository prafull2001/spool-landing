import HomePage from '@/views/HomePage';

export const metadata = {
  // `absolute` opts out of the root layout's `%s | Spool` template so the
  // homepage title isn't rendered as "…Screen Time App | Spool" (duplicate brand).
  title: { absolute: 'Spool — Stop Doomscrolling | iPhone Screen Time App' },
  description: 'Spool pairs AI voice check-ins with Focus Web, a social media feed blocker for Instagram Reels, YouTube Shorts, X Explore, and Snapchat Spotlight on iPhone.',
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
            "image": "https://www.thespoolapp.com/og-homepage-20k.jpg",
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
