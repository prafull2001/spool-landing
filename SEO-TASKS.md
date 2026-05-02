# Spool SEO / ASO / GEO Task List

## Google Search Console Issues (from screenshots)

| Issue | Status | Notes |
|-------|--------|-------|
| "Page with redirect" (2 pages) | Not a problem | `http://` and `http://www.` redirect to `https://` — expected behavior |
| "Alternate page with proper canonical" (1 page) | Not a problem | `https://www.` defers to `https://` canonical — expected behavior |
| Hash-based sitemap URLs | FIXED | Replaced static `sitemap.xml` with dynamic `src/app/sitemap.js` |

---

## DONE (this session)

- [x] Replaced static sitemap.xml (had `/#/` hash URLs) with dynamic `src/app/sitemap.js`
- [x] Added `metadataBase: new URL('https://thespoolapp.com')` to root layout
- [x] Added title template (`%s | Spool`) for child pages
- [x] Added canonical URLs to blog post pages
- [x] Created 20-question FAQ section with FAQPage JSON-LD schema
- [x] FAQ grouped into 3 categories (About Spool, Screen Time, Comparisons)
- [x] Cotton candy gradient background applied site-wide
- [x] Glass UI applied to all components
- [x] New Spooli mascot assets swapped in
- [x] Phone mockup welcome screen updated
- [x] Tab favicon updated to spool_final_icon.png

---

## QUICK WINS — Do This Week

### Technical SEO
- [ ] Move FAQ JSON-LD schema from client-side `FAQ.js` to server-side `page.js` (crawlers may not see client-rendered schema)
- [ ] Resubmit sitemap in Google Search Console (the old one had broken URLs)
- [ ] Create OG image (`public/og-homepage.jpg`, 1200x630px) — currently referenced in metadata but file doesn't exist
- [ ] Add Article schema (datePublished, author) to blog post pages
- [ ] Add BreadcrumbList schema to blog and compare pages

### Content
- [ ] Fill out `/about` page — founder story, mission, team (currently placeholder)
- [ ] Fill out `/press` page — media kit, key stats, press mentions (currently placeholder)
- [ ] Update `public/llms.txt` — add pricing ($7.99/mo, $39.99/yr), update stats to 8k+ excuses
- [ ] Create `public/llms-full.txt` — expanded version with all FAQ content and comparisons

### ASO (App Store)
- [ ] Change App Store title from "Spool: Save Your Thread" to "Spool: Stop Doomscrolling"
- [ ] Change subtitle to "Screen Time & Phone Detox"
- [ ] Update keyword field: `screen time,doomscrolling,phone addiction,app blocker,digital detox,focus,mindful,scrolling,brainrot`
- [ ] Set up in-app review prompts (SKStoreReviewController) after positive moments

### Distribution
- [ ] Submit to AlternativeTo (as alternative to Opal, One Sec, Freedom, ScreenZen, Brainrot)
- [ ] Submit to Product Hunt (schedule launch)
- [ ] Create G2 product listing
- [ ] Post founder story on Indie Hackers
- [ ] Submit to BetaPage
- [ ] Post genuinely helpful content on Reddit: r/nosurf, r/digitalminimalism, r/productivity

---

## MONTH 1 — Content Calendar

### Week 1
- [ ] Blog: "Phone Addiction Statistics 2026" (data pillar, 2500+ words)
- [ ] Blog: "What is Brainrot? Symptoms, Causes, and How to Fix It" (trending keyword)

### Week 2
- [ ] Blog: "How to Stop Scrolling TikTok" (high-volume long-tail)
- [ ] Blog: "Why App Blockers Don't Work (And What Does)" (positions Spool)

### Week 3
- [ ] Blog: "Digital Detox Guide 2026: Step-by-Step" (pillar, 3000+ words)
- [ ] Compare page: "Spool vs ScreenZen"

### Week 4
- [ ] Compare page: "Spool vs Freedom"
- [ ] Blog: "Screen Time and Mental Health: What the Research Says"

---

## MONTH 2-3 — Long-Term

### More Blog Posts
- [ ] "How to Stop Scrolling Instagram"
- [ ] "Dopamine Detox: Does It Actually Work?" (expand from FAQ)
- [ ] "How I Reduced My Screen Time by 80%" (founder story)
- [ ] "Best Screen Time Apps 2026: Honest Comparison" (own the listicle)
- [ ] "How to Stop Checking Your Phone Compulsively"
- [ ] Compare page: "Spool vs Monk"
- [ ] "The Science Behind Voice Check-Ins" (unique, citable)
- [ ] "ADHD and Phone Addiction: What You Need to Know"
- [ ] Publish "State of Doomscrolling" report with anonymized Spool user data

### Link Building
- [ ] Outreach to 20 "best screen time app" listicle authors requesting inclusion
- [ ] Pitch 3 guest posts to digital wellness blogs
- [ ] Respond to journalist queries on HARO/Connectively
- [ ] Pitch to TechCrunch, Lifehacker, The Verge

### ASO Iteration
- [ ] Redesign App Store screenshots (billboard first, keyword-rich captions)
- [ ] Create preview video showing voice check-in flow
- [ ] Set up Apple Search Ads ($300/mo budget, 4-campaign structure)
- [ ] A/B test screenshots via Product Page Optimization
- [ ] Create Custom Product Pages (TikTok addiction, work focus, digital wellness)

### GEO Ongoing
- [ ] Update llms.txt quarterly with fresh stats
- [ ] Monitor AI chatbot responses monthly ("best screen time app", "stop doomscrolling")
- [ ] Build consistent Reddit presence (2-3 posts/week)
- [ ] Ensure all blog posts use "direct answer" format under question-based H2s

---

## Target Keywords (by priority)

### High Priority (homepage + blog)
| Keyword | Est. Volume | Where to target |
|---------|-------------|-----------------|
| screen time app | 18-22K | Homepage H1/meta |
| how to stop doomscrolling | 8-12K | Blog + FAQ |
| phone addiction | 14-18K | Blog pillar |
| stop doomscrolling | 5-8K | Homepage + blog |
| best screen time app iPhone | 3-5K | Compare hub |
| reduce screen time | 6-9K | Blog |

### Long-Tail (blog posts)
| Keyword | Est. Volume |
|---------|-------------|
| how to stop scrolling TikTok | 1-2K |
| best app to reduce screen time iPhone 2026 | 500-1K |
| screen time app that actually works | 800-1.5K |
| why can't I stop scrolling | 2-3K |
| dopamine detox app iPhone | 1-2K |
| alternative to Opal app | 500-1K |
| Instagram addiction help | 1.5-2.5K |

---

## Key Stats to Use in Content
- 4.8 stars on App Store (70+ reviews)
- 2,000+ downloads
- 8,000+ scrolling sessions interrupted
- 80% avg screen time reduction in first week
- 25% sustained long-term reduction
- $7.99/month or $39.99/year
- Voice check-in takes ~5 seconds
- Verbalizing intentions increases behavior change by 42% (Harvard/Yale research)
