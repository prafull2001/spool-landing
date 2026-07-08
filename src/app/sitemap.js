import { getSitemapEntries } from '@/data/content';

export default function sitemap() {
  const baseUrl = 'https://www.thespoolapp.com';
  const { blog: blogPosts, compare: comparePages } = getSitemapEntries();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...blogPosts.map(({ slug, lastModified }) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...comparePages.map(({ slug, lastModified }) => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified,
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
