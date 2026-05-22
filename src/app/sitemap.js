export default function sitemap() {
  const baseUrl = 'https://www.thespoolapp.com';

  const blogPosts = [
    'best-apps-stop-doomscrolling-2026',
    'how-to-stop-doom-scrolling',
    'doom-scrolling-habit',
    'intentional-screen-time',
    'breaking-phone-addiction',
    'how-to-stop-doomscrolling-on-tiktok',
    'how-to-stop-doomscrolling-on-instagram-reels',
    'how-to-stop-doomscrolling-on-youtube-shorts',
    'how-to-stop-doomscrolling-on-twitter-x',
    'how-to-stop-doomscrolling-on-reddit',
    'why-cant-i-put-my-phone-down',
    'is-doomscrolling-an-addiction',
    'how-much-screen-time-is-too-much-2026',
    'does-grayscale-mode-work',
    'why-do-i-scroll-when-anxious',
  ];

  const comparePages = [
    'spool-vs-opal',
    'spool-vs-one-sec',
    'spool-vs-clearspace',
    'spool-vs-brainrot',
    'spool-vs-unrot',
    'spool-vs-apple-screen-time',
    'spool-vs-freedom',
    'spool-vs-forest',
    'spool-vs-screenzen',
    'spool-vs-jomo',
  ];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...blogPosts.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...comparePages.map(slug => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/science`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/authors/prafull`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/press`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
