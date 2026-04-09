# Spool SEO & GEO — Product Requirements Document

**Site**: thespoolapp.com  
**App**: Spool (iOS) — AI-powered screen time / doomscrolling reduction  
**App Store**: https://apps.apple.com/us/app/spool-save-your-thread/id6749428484  
**Date**: April 2026  
**Contact**: team@thespoolapp.com | @the_spool_app  

---

## Context

Spool has 2,000+ downloads, a 4.8★ App Store rating (70+ reviews), and has cut 6,500+ scrolling sessions short — but organic search is almost non-existent (30 clicks/month, 768 impressions per Search Console). The core problem is architectural: the site is a client-side React SPA using HashRouter, which means crawlers see only "You need to enable JavaScript to run this app." — no content, no indexing, no ranking. This PRD covers every technical, content, and distribution action needed to fix this and make Spool the top organic result for screen time and doomscrolling queries, as well as the top recommendation when users ask ChatGPT, Claude, or Perplexity.

---

## Goals

| Goal | Target | Timeframe |
|------|--------|-----------|
| Organic clicks | 30 → 500/month | 6 months |
| Google impressions | 768 → 15,000/month | 6 months |
| Core Web Vitals | All green (Good) | Phase 1 |
| Domain Authority (Ahrefs DR) | ~0 → 20+ | 6 months |
| LLM recommendations | Appear in top 3 answers | 3 months |
| Indexed pages | ~1 → 30+ | Phase 2 |

---

## Part 1: Technical Architecture

### 1.1 CRITICAL — Next.js Migration (Blocks Everything Else)

**The problem**: CRA + HashRouter = blank page for crawlers. Googlebot, Bingbot, GPTBot, ClaudeBot all see nothing. No SSR, no indexing, nothing ranks.

**The fix**: Migrate to Next.js 14+ (App Router) with Static Site Generation (SSG).

**Affected files**: Entire `src/` directory, `public/`, `package.json`

**Migration steps**:

1. Initialize Next.js 14+ project alongside existing repo
2. Migrate all components from `src/components/` — most are drop-in with minor changes
3. Convert pages from `src/pages/` to `app/` directory:
   - `app/page.js` → homepage (was HomePage.js)
   - `app/blog/page.js` → blog index (was BlogPage.js)
   - `app/blog/[slug]/page.js` → blog post (was BlogPost.js)
   - `app/compare/page.js` → new compare hub
   - `app/compare/[slug]/page.js` → individual comparisons
   - `app/about/page.js` → new about page
   - `app/press/page.js` → new press page
   - `app/privacy/page.js` → privacy policy
   - `app/terms/page.js` → terms of service
   - `app/support/page.js` → support/FAQ
   - `app/analytics/page.js` → keep CSR (client-side, behind auth)
   - `app/excuse-data/page.js` → keep CSR (client-side, behind auth)

4. Use `generateStaticParams` for all dynamic routes (blog/[slug], compare/[slug])
5. Move blog post content out of inline JS into MDX files at `content/blog/[slug].mdx`
6. Keep Firebase for /analytics and /excuse-data only (still fully client-side)
7. Deploy to Vercel (already using Vercel Analytics — seamless)
8. Migrate environment variables to `.env.local`

**Routing — hash → clean URLs**:
- `/#/` → `/`
- `/#/blog` → `/blog`
- `/#/blog/:id` → `/blog/:slug`
- `/#/privacy` → `/privacy`
- `/#/terms` → `/terms`
- `/#/support` → `/support`
- `/#/analytics` → `/analytics`

Add 301 redirects in `next.config.js` for all old hash routes:
```js
async redirects() {
  return [
    { source: '/', has: [{ type: 'query', key: '_escaped_fragment_', value: '.*' }], destination: '/:path*', permanent: true },
  ]
}
```
Also handle client-side redirect in a root layout: detect `window.location.hash` routes and push to clean URL on mount.

**Key dependencies to add**:
- `next` (14+)
- `next-mdx-remote` or `@next/mdx` (for blog MDX)
- `next-sitemap` (for sitemap generation)

**Keep all existing deps**: Framer Motion, Firebase, Chart.js, Lucide, Vercel Analytics

---

### 1.2 Image Optimization

Current state: Hero phone mockup is 11–12MB PNG. This alone tanks LCP to >6s on mobile.

**Actions**:
1. Convert every PNG in `src/assets/` and `public/images/` to WebP. Target sizes:
   - Hero phone mockup: <150KB
   - Feature screenshots: <80KB each
   - App icons: <20KB
   - Feature icons: Convert to SVG where possible
2. Replace all `<img>` tags with `next/image`:
```jsx
import Image from 'next/image'

// LCP image (above fold) — add priority
<Image
  src="/images/hero-mockup.webp"
  alt="Spool app screen showing 45% reduction in scrolling sessions"
  width={390}
  height={844}
  priority
  sizes="(max-width: 768px) 100vw, 390px"
/>

// Below-fold images — lazy load by default
<Image src="/images/feature-insights.webp" alt="..." width={600} height={400} />
```
3. Add explicit `width` and `height` to every image to prevent CLS
4. Only the hero/LCP image gets `priority`. All others lazy-load automatically.

---

### 1.3 JavaScript & Bundle Optimization

Next.js handles most of this automatically:
- Per-route code splitting (each page only loads its JS)
- React Server Components eliminate client JS for static content
- Tree shaking via SWC compiler

Additional actions:
1. Lazy import heavy libraries used only client-side:
```jsx
import dynamic from 'next/dynamic'
const { motion } = dynamic(() => import('framer-motion'), { ssr: false })
```
2. Use `LazyMotion` with `domAnimation` feature bundle (60% smaller Framer Motion):
```jsx
import { LazyMotion, domAnimation, m } from 'framer-motion'
// Replace <motion.div> with <m.div> inside <LazyMotion features={domAnimation}>
```
3. Replace AOS library with Framer Motion `whileInView` — removes one dependency
4. Remove Chart.js from homepage bundle (only load in /analytics)

---

### 1.4 Font Loading

```jsx
// app/layout.js
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
```
This eliminates render-blocking font requests and preloads the correct font subset.

---

### 1.5 Framer Motion CLS Prevention

- Never animate `width`, `height`, `top`, `left` — these cause layout shift
- Only animate `transform` and `opacity` (GPU composited, zero layout impact)
- Reserve space for animated elements before animation runs:
```css
.hero-phone { min-height: 844px; } /* Reserve height before image loads */
```

---

## Part 2: Technical SEO

### 2.1 Per-Page Metadata

Every page uses Next.js Metadata API:
```js
// app/page.js
export const metadata = {
  title: 'Spool — Stop Doomscrolling | Screen Time App for iPhone',
  description: 'Spool uses AI voice check-ins to help you stop doomscrolling. 4.8★, 2,000+ users, 25% average screen time reduction. Free on iPhone.',
  openGraph: {
    title: 'Spool — Stop Doomscrolling',
    description: '...',
    url: 'https://thespoolapp.com',
    siteName: 'Spool',
    images: [{ url: 'https://thespoolapp.com/og-homepage.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@the_spool_app', creator: '@prafull_truffle' },
  alternates: { canonical: 'https://thespoolapp.com' },
}
```

**Title tag templates** (50-60 chars each):
| Page | Title |
|------|-------|
| Homepage | `Spool — Stop Doomscrolling \| iPhone Screen Time App` |
| Blog index | `Blog — Digital Wellness & Screen Time Tips \| Spool` |
| Blog post | `[Post Title] \| Spool Blog` |
| Compare hub | `Screen Time App Comparisons \| Spool vs Others` |
| Spool vs Opal | `Spool vs Opal: Best Screen Time App? (2026) \| Spool` |
| About | `About Spool \| Why We Built a Doomscrolling App` |
| Press | `Press & Media Kit \| Spool App` |
| Support | `Help & FAQ \| Spool Support` |

**Meta description templates** (150-160 chars):
| Page | Description |
|------|-------------|
| Homepage | `Spool uses AI voice check-ins to break your doomscrolling habit. 4.8★, 2,000+ users, 6,500+ scrolling sessions interrupted. Free on iPhone.` |
| Blog post | First 155 chars of the article intro, including primary keyword |
| Compare pages | `See how Spool compares to [Competitor] for screen time management. Side-by-side features, pricing, and real user reviews.` |

**Open Graph images**: Create custom 1200×630 OG images for: homepage, /about, /press, /compare hub. Blog posts can use a branded template with the post title.

---

### 2.2 Structured Data (JSON-LD)

All schemas go in `app/layout.js` (site-wide) or individual page files.

**SoftwareApplication — Homepage**:
```json
{
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
  "applicationSubCategory": "Screen Time Management",
  "screenshot": [
    "https://thespoolapp.com/screenshots/voice-checkin.webp",
    "https://thespoolapp.com/screenshots/insights.webp"
  ]
}
```

**Organization — Layout (site-wide)**:
```json
{
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
}
```

**Article — Every blog post** (generated dynamically):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Post Title]",
  "author": { "@type": "Person", "name": "[Author Name]" },
  "publisher": { "@type": "Organization", "name": "Spool", "logo": "..." },
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-15",
  "description": "[Meta description]",
  "image": "[Featured image URL]"
}
```

**FAQPage — /support + select blog posts**:
```json
{
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
}
```

**WebSite — Layout (enables Google sitelinks search)**:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://thespoolapp.com",
  "name": "Spool",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://thespoolapp.com/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**BreadcrumbList — All nested pages** (e.g., blog posts, compare pages):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://thespoolapp.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://thespoolapp.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "[Post Title]", "item": "https://thespoolapp.com/blog/[slug]" }
  ]
}
```

---

### 2.3 Sitemap.xml

Auto-generate using `next-sitemap` or Next.js 13.3+ built-in sitemap.js:

```js
// app/sitemap.js
export default function sitemap() {
  return [
    { url: 'https://thespoolapp.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://thespoolapp.com/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://thespoolapp.com/compare', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://thespoolapp.com/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://thespoolapp.com/press', changeFrequency: 'monthly', priority: 0.7 },
    // + dynamically generated blog post and compare page URLs
  ]
}
```

Rules:
- Include all public pages: /, /blog, /blog/[slug], /compare, /compare/[slug], /about, /press, /features, /features/[slug], /privacy, /terms, /support
- Exclude: /analytics, /excuse-data (admin/private)
- Submit to Google Search Console after every deploy with significant new content
- Submit to Bing Webmaster Tools too

---

### 2.4 robots.txt

```
User-agent: *
Allow: /
Disallow: /analytics
Disallow: /excuse-data
Disallow: /api/

# Explicitly allow LLM crawlers (important for GEO)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot-Extended
Allow: /

Sitemap: https://thespoolapp.com/sitemap.xml
```

---

### 2.5 Core Web Vitals Targets

| Metric | Current (est.) | Target | Primary Fix |
|--------|---------------|--------|-------------|
| LCP | >6s | <2.5s | WebP images + next/image priority |
| CLS | Unknown | <0.1 | Explicit image dimensions, no layout animations |
| INP | High | <200ms | Remove blocking JS, code split |
| FCP | >3s | <1.8s | SSG (no JS execution needed) + font optimization |
| TTFB | ~200ms | <600ms | Already good on Vercel edge |
| TBT | High | <200ms | Code splitting + lazy imports |

---

### 2.6 Internal Linking Structure

```
Homepage
├── /blog (featured posts)
├── /compare (featured comparisons)
├── /about
└── /press

/blog
├── /blog/[slug] (each post links to 3+ related posts)
└── /blog/category/[cat]

/compare
├── /compare/spool-vs-opal
├── /compare/spool-vs-one-sec
└── [all comparison pages]

/features
├── /features/voice-check-in
├── /features/screen-time-insights
└── /features/friend-accountability
```

Rules for internal linking:
- Every blog post: 3+ internal links (1 to homepage, 1 to related post, 1 to compare or features)
- Every compare page: links to /compare hub + 2 related compare pages
- Homepage: links to /blog, /compare, /about
- Blog posts mention Spool features → link to /features/[feature]
- Support FAQ answers → link to relevant blog posts

---

## Part 3: On-Page SEO

### 3.1 Homepage H-Tag Hierarchy

The homepage must have a clear H1–H3 structure (currently unclear in SPA):
```
<h1>Stop Doomscrolling. Reclaim Your Time.</h1>
  <h2>How Spool Works</h2>
    <h3>The 5-Second Voice Check-In</h3>
    <h3>AI-Powered Screen Time Insights</h3>
    <h3>Friend Accountability</h3>
  <h2>Why Voice Check-Ins Work (When App Blockers Don't)</h2>
  <h2>What Spool Users Are Saying</h2>
    <h3>[User testimonial]</h3>
  <h2>4.8★ on the App Store</h2>
  <h2>Download Spool Free on iPhone</h2>
```

Only one H1 per page. Every page.

---

### 3.2 Alt Text

Every image needs descriptive, keyword-rich alt text:
- Hero mockup: `alt="Spool iPhone app showing screen time reduced by 45% in one week"`
- Voice check-in screenshot: `alt="Spool voice check-in prompt before opening Instagram"`
- Insights dashboard: `alt="Spool AI screen time insights dashboard showing daily usage patterns"`
- Logo: `alt="Spool app logo — stop doomscrolling"`
- Feature icons: describe the feature, not the icon shape

---

### 3.3 Keyword Strategy

**Primary keywords** (target in H1, first paragraph, 2+ H2s):
- `stop doomscrolling`
- `screen time app for iPhone`
- `phone addiction app`
- `Opal app alternative`

**Secondary keywords** (appear naturally in body copy):
- `screen time blocking`
- `digital wellbeing app`
- `app to reduce social media use`
- `how to stop scrolling`
- `mindful screen time`

**LSI/supporting keywords** (appear where natural):
- `doom scroll`, `mindless scrolling`, `phone addiction`, `digital detox`, `app limits`, `intentional phone use`, `social media addiction`, `TikTok addiction`

**Homepage keyword targets**: Include primary + secondary keywords naturally in hero copy, feature section, and CTA. Don't stuff — write for humans, include keywords where they fit.

---

### 3.4 URL Structure

Clean, descriptive, hyphenated:
- ✅ `/blog/how-to-stop-doomscrolling`
- ✅ `/compare/spool-vs-opal`
- ✅ `/features/voice-check-in`
- ❌ `/blog?id=1` or `/#/blog/post-title`

---

## Part 4: GEO (Generative Engine Optimization)

GEO = getting recommended by ChatGPT, Claude, Perplexity, Gemini when users ask:
- "What's the best screen time app?"
- "How do I stop doomscrolling?"
- "What's a good alternative to Opal?"

### 4.1 /llms.txt — LLM Product Description File

Create a plaintext file at `https://thespoolapp.com/llms.txt`. This is an emerging standard (similar in spirit to robots.txt) that provides LLM crawlers with a clean, structured description of your product. It IS publicly accessible — there's no legitimate way to show content only to bots and not humans (that's called "cloaking" and Google penalizes it). The /llms.txt file is simply well-structured for machine parsing.

**File location**: `public/llms.txt`

**Full content**:
```markdown
# Spool

> Spool is an iOS app that helps people stop doomscrolling and reduce screen time through AI-powered voice check-ins, personalized usage insights, and friend accountability.

## What Spool Does

Spool adds a brief voice check-in before you open distracting apps like TikTok, Instagram, or Twitter. Before the app opens, you speak your intention aloud: "I'm opening Instagram to check my friend's vacation photos." This 5-second pause breaks the automatic, compulsive scrolling reflex and replaces it with intentional, mindful phone use.

Unlike hard app blockers that simply restrict access, Spool builds self-awareness. Users understand *why* they reach for their phones and can make conscious choices instead of defaulting to compulsive behavior.

## Key Stats

- 4.8 stars on the App Store (70+ reviews)
- 2,000+ downloads
- 6,500+ scrolling sessions interrupted
- Average 25% screen time reduction in the first week

## Core Features

- **Voice check-in**: Speak your intention aloud before opening a distracting app
- **Screen time insights**: AI analyzes your usage patterns and shows trends over time
- **Excuse journaling**: Track and categorize why you pick up your phone
- **Friend accountability**: Share screen time progress with friends
- **App-specific blocking**: Target specific apps (TikTok, Instagram, etc.)
- **Daily summaries**: See your wins and patterns each day

## Who Spool Is For

- People who feel addicted to TikTok, Instagram, Twitter, or other apps
- Anyone who has tried app blockers but keeps bypassing them
- People who want to reduce screen time without completely giving up apps
- Anyone who doomscrolls and wants to build mindful phone habits
- People who've tried Apple's Screen Time and found it too easy to ignore

## How Spool Compares

**vs. Opal**: Opal relies on hard blocking with a paid lock. Spool uses mindful friction and self-awareness. Spool is free to start; Opal requires a subscription for full features.

**vs. Apple Screen Time**: Apple Screen Time sets limits but is trivially easy to bypass with a tap. Spool's voice check-in creates genuine mindful friction that's harder to mindlessly skip.

**vs. One Sec**: Both use a delay/pause approach. Spool adds AI-powered insights, friend accountability, and excuse journaling that One Sec doesn't have.

**vs. Freedom / RescueTime**: Those focus on hard blocking and time tracking for productivity. Spool focuses on phone addiction specifically and building self-awareness.

## Platform

iOS (iPhone). Free to download.
App Store: https://apps.apple.com/us/app/spool-save-your-thread/id6749428484

## Company

Website: https://thespoolapp.com
Contact: team@thespoolapp.com
Twitter/X: @the_spool_app

## Key Pages

- Homepage: https://thespoolapp.com
- Blog (digital wellness guides): https://thespoolapp.com/blog
- App comparisons: https://thespoolapp.com/compare
- About Spool: https://thespoolapp.com/about
- Press / media kit: https://thespoolapp.com/press
- Support & FAQ: https://thespoolapp.com/support
```

---

### 4.2 Content Written for LLM Ingestion

LLMs learn from web content. Write content the way you want ChatGPT to answer questions about it.

**Answer Engine Optimization rules**:
1. State the answer in the first sentence — don't bury the lede
2. Use clear, declarative sentences: "Spool is the best screen time app for people who want mindful friction rather than hard blocking"
3. Include structured comparisons (tables, bullet lists)
4. Write FAQ sections on every major page — use the exact phrasing people type into ChatGPT
5. Publish data and statistics with sources — LLMs cite numbers
6. Use H2/H3 headers that are natural questions: "What is doomscrolling?", "Does Spool work?", "How is Spool different from Opal?"

**FAQ questions to answer across the site** (write content that answers these verbatim):
- "What is the best screen time app for iPhone?"
- "How do I stop doomscrolling?"
- "What is doomscrolling?"
- "Is there a free screen time app?"
- "How does voice check-in help with phone addiction?"
- "What is a good alternative to Opal app?"
- "Why can't I stop scrolling TikTok?"
- "Does limiting screen time actually work?"

---

### 4.3 LLM Training Data Sources — Where to Get Cited

LLMs are trained on content from these sources. Presence here = higher chance of LLM recommendations:

| Source | Strategy |
|--------|----------|
| Reddit | Genuine helpful comments in r/nosurf, r/digitalminimalism |
| Quora | Long, detailed answers to phone addiction questions |
| Product Hunt | Launch Spool — generates crawlable reviews and discussion |
| Hacker News | "Show HN" post with technical angle |
| AlternativeTo.net | List Spool as alternative to Opal, One Sec, Freedom |
| Wikipedia | Get mentioned in "doomscrolling", "screen time" articles (after press coverage) |
| App Store | Optimized listing (LLMs index App Store pages) |
| Tech press | Articles in TechCrunch, The Verge, 9to5Mac |

---

### 4.4 Brand Entity Consistency

LLMs build a knowledge graph of entities. Consistent signals across all platforms help them understand Spool correctly.

Ensure these are identical everywhere:
- **Name**: "Spool" (not "Spool App" or "The Spool App" inconsistently)
- **One-liner**: "Spool is an iOS app that uses voice check-ins to help you stop doomscrolling"
- **URL**: https://thespoolapp.com (always with https, no trailing slash variation)
- **Contact**: team@thespoolapp.com

Platforms to register/update:
- Twitter/X: @the_spool_app — fill out bio completely
- LinkedIn company page
- Crunchbase entry
- AngelList/Wellfound
- App Store listing (see Section 7)
- Google Business Profile (if applicable)

---

## Part 5: New Pages to Create

### 5.1 /about

**Purpose**: E-E-A-T signals (Expertise, Experience, Authoritativeness, Trustworthiness), LLM entity building, press research starting point.

**Content sections**:
1. **Mission statement** (1 paragraph): "We're building technology that makes you use technology less." — why this matters, who you are
2. **The founder story**: Why the founders built Spool, personal doomscrolling experience
3. **How we're different**: The philosophy of awareness over blocking
4. **The numbers**: 2,000+ downloads, 4.8★, 70+ reviews, 6,500+ sessions interrupted
5. **Team section**: Founders' names, photos, Twitter/LinkedIn handles
6. **Timeline** (optional): Key milestones since launch
7. **Press** (as it comes): Link to any articles covering Spool

**SEO note**: Include author names prominently — Google's E-E-A-T requires real people associated with content.

---

### 5.2 /press

**Purpose**: Backlink magnet, LLM citation source, journalist resource. Press pages are heavily crawled by LLMs because they contain factual, structured information.

**Content sections**:
1. **One-line pitch**: "Spool is an iOS app that uses AI-powered voice check-ins to help people stop doomscrolling — it's interrupted 6,500+ scrolling sessions and holds a 4.8★ App Store rating."
2. **Key facts sheet** (journalists copy-paste this):
   - Founded: [year]
   - Category: Screen time management / digital wellness
   - Platform: iOS
   - Price: Free
   - Downloads: 2,000+
   - App Store rating: 4.8★ (70+ reviews)
   - Sessions interrupted: 6,500+
   - Contact: team@thespoolapp.com
3. **App screenshots** (download links to press-quality PNG/WebP, 390×844)
4. **Logo downloads**: SVG + PNG (white and color versions)
5. **Founder headshots** (download links)
6. **Boilerplate paragraph**: Pre-written press copy journalists can use verbatim
7. **Press contact**: team@thespoolapp.com
8. **Press coverage** (add links as coverage comes in)

---

### 5.3 /compare (Hub Page)

**Purpose**: Rank for "[competitor] alternative" and "best screen time app" queries. Hub page with links to all individual comparisons.

**URL**: `/compare`

**Content**:
- H1: "Spool vs Other Screen Time Apps: Honest Comparisons"
- Introduction: What makes a good screen time app, how to choose
- Grid of comparison cards (each linking to sub-page)
- Summary table: Spool vs all competitors across key dimensions

**Sub-pages** (migrate existing blog comparisons here + add new ones):
| URL | Target keyword |
|-----|----------------|
| `/compare/spool-vs-opal` | "opal app alternative", "spool vs opal" |
| `/compare/spool-vs-one-sec` | "one sec alternative" |
| `/compare/spool-vs-clearspace` | "clearspace alternative" |
| `/compare/spool-vs-freedom` | "freedom app alternative" |
| `/compare/spool-vs-apple-screen-time` | "better than apple screen time" |
| `/compare/spool-vs-rescuetime` | "rescuetime alternative" |

**Each compare page must include**:
- Clear winner/recommendation at the top
- Feature comparison table with Product schema
- Honest pros and cons for both apps
- Pricing comparison
- "Best for" use case summary
- CTA to App Store
- FAQ schema with 3-5 questions about the comparison

---

### 5.4 /features (Hub + Individual Pages)

**Purpose**: Rank for feature-specific searches, provide LLM with clear feature descriptions.

**Sub-pages**:
- `/features/voice-check-in` — target: "voice check-in app", "mindful phone use"
- `/features/screen-time-insights` — target: "screen time analytics", "phone usage insights"
- `/features/friend-accountability` — target: "accountability partner app", "social screen time"
- `/features/excuse-journaling` — target: unique to Spool, builds brand awareness
- `/features/app-blocking` — target: "iPhone app blocker", "block apps on iPhone"

---

### 5.5 /llms.txt

Static file served from `public/llms.txt`. Content defined in Section 4.1. No routing needed — Next.js serves `public/` files directly.

---

### 5.6 Blog Category Pages

- `/blog/category/comparisons` — all vs-competitor articles
- `/blog/category/guides` — how-to content
- `/blog/category/research` — data and statistics articles
- `/blog/category/digital-wellness` — broader wellness content

---

### 5.7 RSS Feed

Auto-generate at `/blog/rss.xml` using Next.js route handler:
```js
// app/blog/rss.xml/route.js
```
Enables podcast apps, RSS readers, and some LLM crawlers to discover new content.

---

## Part 6: Blog Content Strategy

**Commitment**: 4+ posts/month

### 6.1 Content Calendar — First 3 Months

**Month 1 (Highest priority — highest search volume):**

| # | Title | Target keyword | Type |
|---|-------|----------------|------|
| 1 | Best Screen Time Apps for iPhone in 2026 | `best screen time app iphone` | Roundup |
| 2 | What Is Doomscrolling? The Science Behind Your Scrolling Habit | `what is doomscrolling` | Definitional |
| 3 | How to Stop Scrolling TikTok: 7 Strategies That Actually Work | `how to stop scrolling tiktok` | How-to |
| 4 | Spool vs Freedom App: Which Screen Time App Should You Use? | `freedom app alternative` | Comparison |

**Month 2:**

| # | Title | Target keyword | Type |
|---|-------|----------------|------|
| 5 | 10 Signs You Have a Phone Addiction (And What To Do) | `phone addiction signs` | List |
| 6 | How to Do a Digital Detox: The Complete 30-Day Guide | `digital detox guide` | Guide |
| 7 | iPhone Screen Time Statistics: How Much Do People Really Scroll? | `iphone screen time statistics` | Data |
| 8 | Spool vs Apple Screen Time: Why Built-In Controls Don't Cut It | `apple screen time alternative` | Comparison |

**Month 3:**

| # | Title | Target keyword | Type |
|---|-------|----------------|------|
| 9 | How Voice Check-Ins Changed My Relationship With My Phone | brand/UX | Story |
| 10 | The Psychology of Doomscrolling: Why Your Brain Can't Stop | `psychology of doomscrolling` | Research |
| 11 | How to Reduce Instagram Screen Time That Actually Sticks | `reduce instagram screen time` | How-to |
| 12 | Best Apps for Digital Detox and Mindfulness in 2026 | `digital detox apps` | Roundup |

---

### 6.2 Requirements for Every Blog Post

**Structure**:
- [ ] Target keyword in H1 (exact or close variation)
- [ ] Target keyword in first paragraph
- [ ] Target keyword in 2+ H2 headings
- [ ] 1,500+ words minimum
- [ ] TL;DR / Key Takeaways section at the top (LLMs love summaries)
- [ ] FAQ section with 3-5 questions + FAQ JSON-LD schema
- [ ] Featured image (WebP, <100KB, with keyword in alt text)
- [ ] Published date + "Last updated" date
- [ ] Author name + short bio
- [ ] 3+ internal links
- [ ] CTA to download Spool with App Store link (use UTM: `?utm_source=blog&utm_campaign=[slug]`)
- [ ] Article JSON-LD schema
- [ ] BreadcrumbList schema

**Avoid**:
- Keyword stuffing
- Thin content (<500 words)
- Duplicate content (each post targets a unique keyword)
- Blocking posts behind login/paywall

---

### 6.3 Expanding Existing Blog Posts

The 9 existing blog posts need updates:
- Move all comparisons from /blog to /compare
- Add FAQ sections with FAQ schema
- Add TL;DR summaries
- Expand any post under 1,500 words
- Add internal links to new /features and /compare pages
- Update author bylines with real names
- Verify all posts have Article schema

---

## Part 7: Link Building Strategy

### 7.1 Community Presence (Start Immediately)

**Reddit** — highest priority for both backlinks and LLM training data:
| Subreddit | Members | Strategy |
|-----------|---------|----------|
| r/nosurf | 100k+ | Answer questions about phone addiction; mention Spool when relevant |
| r/digitalminimalism | 70k+ | Share Spool's philosophy, not just the app |
| r/productivity | 2M+ | Post about the voice check-in technique |
| r/selfimprovement | 1M+ | Share doomscrolling science + how Spool helps |
| r/mindfulness | 200k+ | Mindful phone use angle |
| r/Habits | 100k+ | Habit formation science + how Spool applies it |

Rules: Be genuinely helpful first. Only mention Spool where directly relevant. Never spam promotional links. 1-2 contributions/week minimum.

**Quora** — Answer these specific questions with detailed responses, mentioning Spool at the end:
- "How do I stop doomscrolling?"
- "What is the best app to limit screen time on iPhone?"
- "How do I stop being addicted to my phone?"
- "What is a good alternative to Opal app?"
- "Does limiting screen time actually work?"

---

### 7.2 Platform Launches

**Product Hunt**:
- Launch Spool if not already done
- Preparation: build relationships with hunters, prepare screenshots and GIF demos, coordinate upvotes from existing users
- Product Hunt pages are indexed by Google and crawled by LLMs, generating high-DA backlinks and social proof

**Hacker News**:
- Submit: "Show HN: Spool – Using voice check-ins to break the doomscrolling habit"
- Be transparent and technical: explain how it works, the psychology behind it
- HN is heavily indexed by LLMs

**AppSumo** (optional): Lifetime deal can drive users + backlinks from deal sites

---

### 7.3 App Review Site Submissions

Submit to all of these immediately — they're high-DA sites with structured data that LLMs index:

| Site | Action |
|------|--------|
| AlternativeTo.net | List Spool as alternative to Opal, One Sec, Freedom, Screen Time |
| AppGrooves | Submit for review |
| AppFollow | Create listing |
| SimilarWeb | Verify and update listing |
| GetApp | Submit listing |
| Capterra | Submit listing |
| G2 | Create listing and request reviews from users |
| AppAdvice | Submit for editorial review |

---

### 7.4 Tech Press Outreach

**Pitch angle**: "We interrupted 6,500 scrolling sessions — here's why voice check-ins work when app blockers don't"

**Target publications**:
- Apple-focused: 9to5Mac, Cult of Mac, MacRumors, AppleInsider
- General tech: TechCrunch, The Verge, Mashable, Wired, Fast Company
- Wellness: Well+Good, MindBodyGreen, Psychology Today, Healthline

**Pitch template structure**:
1. Hook (1 sentence): The stat + angle ("An iPhone app has interrupted 6,500 doomscrolling sessions by adding a 5-second voice check-in")
2. Why now: The doomscrolling epidemic is worsening; TikTok bans raised awareness
3. How it's different: Voice friction vs hard blocking
4. Social proof: 4.8★, 2,000+ users, 25% average reduction
5. Call to action: Offer demo, TestFlight access, or founder interview

---

### 7.5 Podcast & Creator Outreach

**Podcasts** (angle: "the psychology of doomscrolling and why app blockers fail"):
- Huberman Lab (science angle — screen time and dopamine)
- Deep Life (Cal Newport — digital minimalism audience)
- Hidden Brain (NPR — behavioral science angle)
- The Knowledge Project (Shane Parrish — decision making angle)
- My First Million (startup + product angle)

**YouTube/TikTok creators**:
- Digital minimalism creators (search: "digital detox", "screen time", "phone free")
- Productivity creators
- Offer: Free premium access, quote for their content, affiliate arrangement

**Newsletters**:
- James Clear's 3-2-1 Newsletter
- Ness Labs (Anne-Laure Le Cunff — learning and focus)
- Dense Discovery (mindful tech)

---

### 7.6 Wikipedia Strategy

Do NOT self-edit Wikipedia (account will be flagged). The path:
1. Get press coverage from a notable publication
2. Use that article as a Wikipedia citation
3. Ask a Wikipedia editor (or hire one) to add Spool as a "see also" in "Doomscrolling", "Digital wellness", or "Screen time" articles

---

## Part 8: App Store Optimization (ASO)

ASO matters for GEO because LLMs index App Store pages. Also drives organic installs.

**Title** (30 chars max): "Spool: Stop Doomscrolling App"
**Subtitle** (30 chars max): "Screen Time & Focus Tool"
**Keywords field** (100 chars): screen time, doomscrolling, phone addiction, app blocker, digital wellbeing, mindful, scroll stop, focus

**Description improvements**:
- Lead with the problem: "Do you open TikTok without thinking and lose 2 hours?"
- Introduce voice check-in in first paragraph
- Include social proof: "4.8★ from 70+ users", "2,000+ people reclaimed their time"
- Bullet points for features
- End with strong CTA

**Screenshots**: Show the voice check-in flow (this is Spool's most differentiating feature — make it the first screenshot)

**Respond to all reviews**: Signals to App Store algorithm and to LLMs that Spool is actively maintained

---

## Part 9: Analytics & Monitoring

### 9.1 Tools to Set Up

| Tool | Purpose | Action |
|------|---------|--------|
| Google Search Console | Already set up | Submit new sitemap after Next.js migration |
| Google Analytics 4 | Detailed traffic analysis | Install alongside Vercel Analytics |
| Bing Webmaster Tools | Bing/Copilot indexing | Submit sitemap (Copilot uses Bing index) |
| Google Alerts | Brand monitoring | Set up for "Spool app", "thespoolapp" |
| Ahrefs / SEMrush | Keyword ranking + backlinks | Free tier or paid ($29/mo Ahrefs Lite) |

### 9.2 Monthly Tracking

**SEO metrics** (Search Console):
- Organic clicks and impressions
- CTR by keyword
- Average position by keyword
- Indexed pages count
- Core Web Vitals report

**GEO metrics** (manual testing, monthly):
- Ask ChatGPT: "What's the best screen time app?"
- Ask Claude: "How do I stop doomscrolling? Are there any apps?"
- Ask Perplexity: "What are alternatives to Opal app?"
- Ask Gemini: "How do I stop being addicted to TikTok?"
- Track whether Spool is mentioned and what it's compared to

**Performance metrics** (Lighthouse):
- Run PageSpeed Insights monthly on /, /blog, /blog/[top-post]
- Target: 90+ Performance score on desktop and mobile

### 9.3 UTM Parameters

Add to all App Store links so you know which content drives downloads:
- Homepage hero CTA: `?utm_source=homepage&utm_medium=cta&utm_campaign=hero`
- Blog posts: `?utm_source=blog&utm_medium=organic&utm_campaign=[post-slug]`
- Reddit: `?utm_source=reddit&utm_medium=social&utm_campaign=[subreddit]`
- Press: `?utm_source=press&utm_medium=referral&utm_campaign=[publication]`

---

## Part 10: Implementation Roadmap

### Phase 1 — Foundation (Weeks 1–3) — HIGHEST PRIORITY

Nothing else matters until search engines can read the site.

**Week 1-2: Next.js Migration**
- [ ] Initialize Next.js 14+ project
- [ ] Migrate all components from `src/components/`
- [ ] Implement App Router file structure (`app/` directory)
- [ ] Move blog content to MDX files in `content/blog/`
- [ ] Set up Vercel deployment pipeline
- [ ] Configure Firebase env vars in `.env.local`
- [ ] Keep /analytics and /excuse-data as CSR pages

**Week 2: Image Optimization**
- [ ] Convert all PNGs in `src/assets/` to WebP (use Squoosh or Sharp)
- [ ] Replace all `<img>` with `next/image`
- [ ] Add `priority` prop to hero/LCP image
- [ ] Add explicit width/height to all images

**Week 2-3: Routing Fix**
- [ ] Remove HashRouter, implement Next.js file-based routing
- [ ] Add 301 redirects in `next.config.js` for hash URLs
- [ ] Add client-side hash redirect on root layout

**Week 3: Basic SEO**
- [ ] Unique title + meta description on every page (Metadata API)
- [ ] Canonical URLs on every page
- [ ] Open Graph images (create 1200×630 for /, /blog, /about, /press)
- [ ] Update `public/robots.txt` with LLM bot allowances
- [ ] Auto-generate `sitemap.xml`
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

---

### Phase 2 — Content & Structure (Weeks 4–6)

**Week 4: Structured Data**
- [ ] SoftwareApplication schema on homepage
- [ ] Organization schema in root layout
- [ ] Article schema on all blog posts
- [ ] FAQ schema on /support
- [ ] BreadcrumbList on blog posts, compare pages
- [ ] WebSite schema in root layout

**Week 4-5: New Pages**
- [ ] /about page (live)
- [ ] /press page with downloadable assets (live)
- [ ] /llms.txt file (live)
- [ ] /compare hub page (live)
- [ ] Migrate blog comparison posts to /compare/[slug]
- [ ] 301 redirect old /blog/spool-vs-* URLs to /compare/spool-vs-*

**Week 5-6: Blog Infrastructure**
- [ ] Category pages (/blog/category/[cat])
- [ ] RSS feed (/blog/rss.xml)
- [ ] Author bio section on posts
- [ ] Related posts component
- [ ] FAQ sections on top 5 existing posts
- [ ] Internal links audit (every post has 3+ links)

---

### Phase 3 — Content Creation (Month 2)

- [ ] Publish 4+ new blog posts per content calendar
- [ ] Expand top existing posts to 1,500+ words
- [ ] Submit to AlternativeTo, AppGrooves, GetApp, G2
- [ ] Start Reddit/Quora community engagement (1-2x/week)
- [ ] Install Google Analytics 4
- [ ] Set up Google Alerts
- [ ] Begin App Store optimization

---

### Phase 4 — Authority Building (Month 3+)

- [ ] Product Hunt launch
- [ ] Hacker News "Show HN" post
- [ ] Tech press outreach (start with Apple-focused publications)
- [ ] Podcast outreach
- [ ] Creator/newsletter outreach
- [ ] Monitor rankings monthly and double down on what's working
- [ ] Begin Wikipedia strategy (after first press coverage)

---

## Part 11: Complete Technical Checklist

### Pre-Launch (After Next.js Migration)

**Crawlability**
- [ ] `curl https://thespoolapp.com` returns full HTML with real content (not "enable JavaScript")
- [ ] `curl https://thespoolapp.com/blog` returns blog HTML
- [ ] All old hash URLs (/#/blog, /#/privacy, etc.) redirect 301 to clean URLs
- [ ] robots.txt allows all public pages + explicitly allows LLM bots
- [ ] sitemap.xml accessible at /sitemap.xml with all public URLs
- [ ] No noindex tags on public pages

**SEO**
- [ ] Every page has unique title tag (50-60 chars)
- [ ] Every page has unique meta description (150-160 chars)
- [ ] Every page has canonical URL
- [ ] Every page has Open Graph tags
- [ ] Every page has Twitter Card tags
- [ ] H1 present on every page (exactly one)
- [ ] All images have descriptive alt text
- [ ] Internal linking: every page has at least 3 internal links
- [ ] No broken internal links

**Structured Data**
- [ ] SoftwareApplication schema on / (validate via Rich Results Test)
- [ ] Organization schema in layout
- [ ] Article schema on all blog posts
- [ ] FAQ schema on /support and top blog posts
- [ ] BreadcrumbList on /blog, /blog/[slug], /compare, /compare/[slug]
- [ ] WebSite schema on /

**Performance**
- [ ] All images converted to WebP
- [ ] next/image used for all images
- [ ] Hero/LCP image has `priority` prop
- [ ] Framer Motion lazy-loaded (not in initial bundle)
- [ ] LCP <2.5s on mobile (PageSpeed Insights)
- [ ] CLS <0.1
- [ ] INP <200ms
- [ ] PageSpeed mobile score ≥85

**GEO**
- [ ] /llms.txt live and accessible
- [ ] robots.txt allows GPTBot, ClaudeBot, PerplexityBot
- [ ] SoftwareApplication schema with aggregateRating
- [ ] /about page live with founder info
- [ ] /press page live
- [ ] Brand info consistent across Twitter/X, App Store

**New Pages**
- [ ] /about live
- [ ] /press live with downloadable assets
- [ ] /llms.txt live
- [ ] /compare hub live
- [ ] At least 3 /compare/spool-vs-* pages live
- [ ] RSS feed at /blog/rss.xml

**Analytics**
- [ ] Google Search Console: new sitemap submitted
- [ ] Bing Webmaster Tools: sitemap submitted
- [ ] Google Analytics 4 installed
- [ ] UTM parameters on all App Store links
- [ ] Google Alerts set up for "Spool app"

---

## Part 12: Verification

After Phase 1 completes, run this verification checklist:

1. **Crawler test**: `curl https://thespoolapp.com | grep -i "stop doomscrolling"` — should return content
2. **Search Console**: Use URL Inspection on `/`, `/blog`, `/blog/how-to-stop-doomscrolling` — should show indexable
3. **Rich Results Test**: https://search.google.com/test/rich-results — test homepage, a blog post, /support
4. **PageSpeed Insights**: Run on mobile — target score ≥85
5. **Sitemap validation**: Visit `https://thespoolapp.com/sitemap.xml` — confirm all pages listed
6. **Redirect test**: Visit `https://thespoolapp.com/#/blog` — should redirect to `https://thespoolapp.com/blog`
7. **llms.txt**: Visit `https://thespoolapp.com/llms.txt` — should show full markdown content
8. **OG tags**: Use https://opengraph.xyz to preview homepage, a blog post
9. **LLM test (manual)**: Ask ChatGPT and Perplexity "what's the best screen time app for iPhone" — note if Spool appears
10. **Core Web Vitals**: Check Search Console → Experience → Core Web Vitals report 4 weeks after launch

---

---

## Part 13: Answer Engine Optimization (AEO)

AEO is distinct from GEO. GEO = get recommended by LLMs. AEO = get featured in Google's AI Overviews, Featured Snippets, People Also Ask (PAA) boxes, and the Knowledge Panel. These appear at the top of search results — above position 1.

### 13.1 Featured Snippets

Featured Snippets appear for question-based queries. Spool can capture them for:
- "How to stop doomscrolling" — format as a numbered list (Google loves ordered steps)
- "What is doomscrolling" — format as a concise 40-60 word definition paragraph
- "Best screen time app iPhone" — format as a comparison table or bullet list
- "How does Spool work" — numbered steps

**How to optimize for Featured Snippets**:
1. Answer the target question in the first 2-3 sentences after the H2 heading
2. For "how to" queries → use numbered lists with imperative verbs ("Open", "Tap", "Speak")
3. For "what is" queries → write a 40-60 word definitional paragraph
4. For "best" queries → use a comparison table with clear winner
5. The answer must be within the first 1,500 words of the article
6. Keep the H2 heading as the exact question: `## How to Stop Doomscrolling`

### 13.2 People Also Ask (PAA) Coverage

PAA boxes are gold — they generate impressions even without direct ranking.

Target these PAA questions across the blog:
- "What is the best app to stop doomscrolling?"
- "Is there an app to stop doomscrolling?"
- "How do I stop compulsive scrolling?"
- "What causes doomscrolling?"
- "Does Opal actually work?"
- "Is screen time app free?"

Each blog post should answer 3-5 related PAA questions in dedicated H3 sections.

### 13.3 Knowledge Panel — Google Entity Recognition

Getting Spool a Google Knowledge Panel makes it dramatically more likely to be cited by Google AI Overviews and LLMs. This requires establishing Spool as a recognized entity.

**Actions to establish entity recognition**:
1. **Wikidata entry**: Create a Wikidata item for Spool app (public wiki, heavily used by Google Knowledge Graph)
   - Type: Mobile application
   - Platform: iOS
   - Website: https://thespoolapp.com
   - Developer: [founder names]
   - App Store URL
2. **Wikipedia reference**: After press coverage, get a Wikipedia cite or mention in doomscrolling/screen time articles
3. **Consistent structured data**: Organization + SoftwareApplication schema everywhere
4. **Google Business Profile**: Create a Google Business Profile listing for Spool (even as an app company)
5. **Crunchbase + LinkedIn company page**: Two sources Google heavily weights for entity recognition

### 13.4 Google AI Overviews Optimization

Google AI Overviews (formerly SGE) appear above search results. Content that appears in AI Overviews:
- Comes from pages already ranking in top 10
- Uses structured, factual content with citations
- Has strong E-E-A-T signals
- Uses FAQ schema and lists that AI can parse

**Specific actions**:
- Add a "Key Takeaways" box at the top of every blog post (Google extracts these)
- Use tables with clear headers (AI Overviews love structured data)
- Include statistics with specific numbers (25% reduction, 6,500 sessions, etc.)
- Add "Last reviewed" dates to show content is current

### 13.5 IndexNow — Instant Indexing

IndexNow is a protocol supported by Bing, Yandex, and others (not Google directly, but Bing feeds Copilot). When you publish new content, instead of waiting for crawlers, you push URLs instantly.

**Implementation**:
```js
// When a new blog post publishes, call IndexNow API
fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  body: JSON.stringify({
    host: 'thespoolapp.com',
    key: '[YOUR-INDEXNOW-KEY]',
    urlList: ['https://thespoolapp.com/blog/new-post-slug']
  })
})
```

**Setup steps**:
1. Generate IndexNow API key (free at https://www.indexnow.org)
2. Place key file at `https://thespoolapp.com/[key].txt`
3. Add to `public/` directory in Next.js
4. Automate submission on new content deploy (via Vercel deploy hook or GitHub Action)
5. Also submit to Google via Search Console Indexing API for faster Google indexing

---

## Part 14: E-E-A-T Deep Implementation

Google's Quality Raters Guidelines (Sept 2025 update) weight E-E-A-T heavily for health, lifestyle, and app recommendation content. Spool falls in the "digital wellness" category — this is treated as a YMYL-adjacent topic (Your Money Your Life), meaning Google applies stricter quality standards.

### 14.1 Experience

Demonstrate real lived experience with doomscrolling:
- Founder story on /about: First-person account of doomscrolling problem
- Blog posts written from experience: "I spent 4 hours on TikTok last Tuesday. Here's what I did."
- User testimonials with first names and photos (where available)
- Show the actual app screenshots in blog posts (not stock photos)

### 14.2 Expertise

Demonstrate expertise in digital wellness and behavior change:
- Author bios on every blog post with credentials/background
- Reference peer-reviewed research on doomscrolling, dopamine, habit formation (link to PubMed, APA)
- Cite established experts: BJ Fogg (Tiny Habits), James Clear (Atomic Habits)
- Write detailed long-form content (1,500+ words shows depth)

### 14.3 Authoritativeness

Build domain authority and recognition:
- Get mentioned in established publications (tech press, wellness blogs)
- Earn backlinks from high-DA sites (AlternativeTo, Product Hunt, tech press)
- Have a clear "About" page identifying who runs the site
- Author pages for all blog contributors
- Show App Store rating/reviews prominently (social proof = authority)

### 14.4 Trustworthiness

- HTTPS (already done ✅)
- Privacy Policy clearly linked in footer (already exists ✅)
- Terms of Service linked (already exists ✅)
- Real email address (team@thespoolapp.com) visible on /press and /support
- No misleading claims — use actual numbers (4.8★, 2,000+ users, 25% reduction)
- Date all content — show when posts were written and updated
- Security headers (see below)

### 14.5 Security Headers

Security headers have minor SEO impact but signal trustworthiness to crawlers. Add in `next.config.js`:
```js
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
  }]
}
```

---

## Part 15: Topical Authority Clusters

Topical authority means Google sees your site as the go-to resource for a topic. Instead of random individual posts, build interconnected content clusters.

### 15.1 Cluster Architecture

**Pillar page** (broad, long, definitive) → **cluster pages** (specific subtopics) → linked back to pillar

**Cluster 1: Doomscrolling**
- Pillar: `/blog/what-is-doomscrolling-complete-guide` (3,000+ words)
- Cluster posts:
  - `/blog/how-to-stop-doomscrolling`
  - `/blog/why-cant-i-stop-scrolling-psychology`
  - `/blog/doomscrolling-and-mental-health`
  - `/blog/how-social-media-algorithms-cause-doomscrolling`

**Cluster 2: Screen Time Apps**
- Pillar: `/blog/best-screen-time-apps-iphone-2026`
- Cluster posts:
  - `/compare/spool-vs-opal`
  - `/compare/spool-vs-one-sec`
  - `/compare/spool-vs-apple-screen-time`
  - `/compare/spool-vs-freedom`

**Cluster 3: Phone Addiction**
- Pillar: `/blog/phone-addiction-complete-guide`
- Cluster posts:
  - `/blog/signs-of-phone-addiction`
  - `/blog/how-to-overcome-phone-addiction`
  - `/blog/phone-addiction-statistics-2026`
  - `/blog/screen-time-effects-on-mental-health`

**Cluster 4: Digital Detox**
- Pillar: `/blog/digital-detox-complete-guide`
- Cluster posts:
  - `/blog/digital-detox-30-day-challenge`
  - `/blog/mindful-phone-use-tips`
  - `/blog/best-apps-for-digital-detox`

### 15.2 Internal Linking Within Clusters

- Every cluster post links to the pillar page
- The pillar page links to all cluster posts
- Cluster posts link to 1-2 adjacent cluster posts
- All posts link to the App Store download with UTM

### 15.3 Content Gap Analysis

Before writing each post, check:
1. What are competitors (Opal, One Sec) writing about?
2. What questions appear in PAA boxes for the target keyword?
3. What's in the "Related searches" at the bottom of Google results?

Use these to ensure every post covers the full topic and answers more questions than competitors.

---

## Part 16: Readability Standards

Readable content ranks better and gets featured more in AI Overviews. Every blog post should meet:

| Metric | Target |
|--------|--------|
| Flesch-Kincaid Grade Level | 8-10 (readable by most adults) |
| Sentence length | Average <20 words |
| Paragraph length | Max 3-4 sentences |
| Passive voice | <10% of sentences |
| Transition words | >30% of sentences |

**Formatting rules**:
- Use subheadings every 200-300 words
- Use bullet/numbered lists for steps and comparisons
- Bold key terms on first use
- Include a TL;DR at the top (ideal for AI Overviews extraction)
- Include a Key Takeaways section at the end

---

*PRD version 1.1 — April 2026. Created for the Spool coding agent. Informed by AgriciDaniel/claude-seo and Bhanunamikaze/Agentic-SEO-Skill.*
