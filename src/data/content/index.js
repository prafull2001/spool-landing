import { CONTENT } from './registry';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Formats an ISO 'YYYY-MM-DD' date as 'Month D, YYYY' without going through
// Date/timezone parsing (which shifts date-only ISO strings near UTC midnight).
export function formatDisplayDate(iso) {
  const [y, m, dd] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${dd}, ${y}`;
}

function displayTitle(entry) {
  return entry.card.title || entry.meta.title;
}

// For app/blog/[id]/page.js — { [slug]: { title, description, datePublished, dateModified } }
export function getBlogMetaMap() {
  const out = {};
  for (const [slug, entry] of Object.entries(CONTENT)) {
    if (entry.type !== 'blog') continue;
    out[slug] = {
      title: entry.meta.title,
      description: entry.meta.description,
      datePublished: entry.meta.datePublished,
      dateModified: entry.meta.dateModified,
    };
  }
  return out;
}

// For app/compare/[id]/page.js — { [slug]: { title, description, date, competitor, faq } }
export function getCompareMetaMap() {
  const out = {};
  for (const [slug, entry] of Object.entries(CONTENT)) {
    if (entry.type !== 'compare') continue;
    out[slug] = {
      title: entry.meta.title,
      description: entry.meta.description,
      date: entry.meta.dateModified,
      competitor: entry.meta.competitor,
      faq: entry.meta.faq,
    };
  }
  return out;
}

// For views/BlogPage.js — the /blog index card list, in curated display order.
export function getCardList() {
  return Object.entries(CONTENT).map(([slug, entry]) => ({
    id: slug,
    title: displayTitle(entry),
    excerpt: entry.card.excerpt,
    date: formatDisplayDate(entry.meta.datePublished),
    dateISO: entry.meta.datePublished,
    readTime: entry.card.readTime,
    category: entry.card.category,
    isComparison: entry.type === 'compare',
  }));
}

// For views/BlogPost.js — shared renderer for both /blog/[id] and /compare/[id].
export function getBlogContentMap() {
  const out = {};
  for (const [slug, entry] of Object.entries(CONTENT)) {
    out[slug] = {
      title: displayTitle(entry),
      date: formatDisplayDate(entry.meta.datePublished),
      readTime: entry.card.readTime,
      category: entry.card.category,
      content: entry.body,
    };
  }
  return out;
}

// For app/sitemap.js — real lastModified per URL instead of build-time new Date().
export function getSitemapEntries() {
  const blog = [];
  const compare = [];
  for (const [slug, entry] of Object.entries(CONTENT)) {
    const item = { slug, lastModified: entry.meta.dateModified };
    if (entry.type === 'blog') blog.push(item);
    else compare.push(item);
  }
  return { blog, compare };
}
