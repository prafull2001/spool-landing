# SEO Content Backlog — Inbound-Only Strategy (2026-07-07)

Produced by the Opus audit → Fable discovery pass. Execution target: Sonnet.
Scope: ON-SITE content only. No outreach, backlinks, PR, or listicle pitching.

---

## The strategic frame (read before executing anything)

Three research streams (GEO/AI-citation, competitor landscape, top-of-funnel queries) independently converged on the same picture:

1. **This niche's AI-citation supply chain is owned-media driven.** Every category SERP ("best app to stop doomscrolling", "opal vs one sec", "apps like opal") is won by *small app-brand blogs* — not Reddit, not press. Spool's own listicle already ranks top-4 for its core query and AI search summaries are echoing its framing verbatim. **On-site publishing has direct AI-answer leverage here; the no-outreach constraint costs almost nothing.**
2. **Three moats, all on-site:**
   - **Taxonomy moat** — the whole SERP already talks in mechanism buckets (hard block / friction / gamification / reflection). Spool is the sole occupant of "reflection." Content that *teaches the taxonomy* gets reproduced verbatim by LLMs, with Spool as the reflection answer.
   - **Data moat** — 8,667 anonymized voice recordings of pre-scroll intentions (193 users). No competitor has verbalized-intent data; they only have tap data. One canonical data page feeds proprietary quotable stats into every other page.
   - **Moment-of-failure moat** — the highest-readiness searchers are people whose *current* tool just failed them ("why do I always ignore my screen time limits", "why app blockers don't work"). Nobody answers the psychology; SERPs answer the wrong question (tech-support fixes) or are conflicted (blocker apps reviewing themselves).
3. **What's empirically proven vs folklore (2026 evidence):**
   - PROVEN: statistics with named source + date (+22–41% AI visibility, Princeton GEO study); answer-first structure (44.2% of LLM citations come from first 30% of page); HTML tables (81% extraction vs 23% for prose); original data as citation magnet; "X vs Y" / "alternatives to X" brand pages (ChatGPT cites brand sites ~11pts more than Google ranks them).
   - DISPROVEN: llms.txt as a discovery lever (Ahrefs 137K-site study: ~zero AI-bot fetches); FAQPage JSON-LD for AI citations (Ahrefs 1,885-page controlled study: no uplift; Google dropped FAQ rich results May 2026). Keep on-page Q&A *content* (that gets extracted); stop investing in the markup.
   - Freshness signaling matters: every ranking competitor shows "Updated [current month] 2026" and refreshes aggressively.

**Known SERP absences to close** (verified July 2026): Spool absent from "best screen time app iphone 2026", "apps like opal", "opal vs one sec", "app that makes you pause before opening instagram" — the last one being Spool's exact mechanic.

**Evidence honesty rules for all items:**
- Every stat needs a real, named, dated citation. Known unsourced claims already on the site to fix or cut: "42% more likely" (attributed to 'Harvard and Yale'), "96×/day" (Stanford), "23-min refocus" (UC Irvine).
- Spool's own numbers must be phrased as self-contained citable sentences: "Spool users cut screen time 25% on average (Spool internal data, n≈3,000 users, 2026)."
- Do NOT claim Reddit demand for anything below — research could not verify Reddit thread visibility directly.
- Skipped deliberately: teen/parent queries (wrong buyer, YMYL treatment-center SERP), nomophobia/phantom-vibration (curiosity intent, no action), algorithm-addiction post (cannibalizes existing TikTok post).

---

## WAVE 0 — Gates & multipliers (do first; they lift all 25 existing pages)

### T1. [TECH] Refactor the content source — GATING DECISION
The backlog below is ~25 new pages. Today each page = 4 hand-edits (blogMeta/compareMeta, the 1,827-line BlogPost.js blogContent, BlogPage card list, sitemap.js). **This batch is past the refactor threshold.** Before Wave 2, consolidate to a single content registry (one module exporting per-slug {meta, body, card, cluster, related[]} that blogMeta/compareMeta/BlogPage/sitemap all derive from — or properly wire the dormant MDX pipeline). Sitemap gets real `lastModified` from the registry instead of `new Date()`. Effort: M-L. Impact: every subsequent item gets ~4× cheaper and drift-proof.

### L1. [LINKING] Cluster wiring + nav fixes
- Add `/compare` to Header AND Footer nav.
- Sibling-link the 5 platform guides (TikTok/Reels/Shorts/X/Reddit) with a shared "Stop scrolling on every platform" block.
- Add a 3-item "Related" block to every article (cluster siblings first — cluster map below).
- Byline consistency: all bylines → `/authors/prafull` (blog index currently links LinkedIn).
- Update `/authors/prafull` archive from 5 items to all 25+.
Effort: S-M. Impact: fixes the fully-siloed structure across every existing page.

### E1. [EXPAND EXISTING] BLUF + quotable-stat retrofit (all 25 pages)
- 40–60-word direct answer as the first paragraph under the H1 and under every question-format H2.
- Ensure the core claim ("Spool is the only awareness-based screen-time app — it asks you to speak your reason aloud before the app opens") appears in the first 30% of every relevant page.
- Convert every orphaned number sitewide into a citable sentence (number + source + date). Fix/cut the three unsourced stats listed above.
- Add visible "Last updated: [date]" to the listicle + compare pages; put quarterly refresh of `best-apps-stop-doomscrolling-2026` on a calendar (top competitor refreshes to yesterday's date).
Effort: M. Impact: proven citation-extraction levers applied to pages that already rank.

### T2. [TECH] One-time llms.txt regeneration, then stop
Regenerate llms.txt/llms-full.txt to list all 25 (soon more) content URLs from the registry; commit the currently-uncommitted versions. Then treat as near-zero-priority maintenance (empirically not a discovery lever). Do NOT add more FAQPage JSON-LD; keep existing markup, keep visible Q&A content. Effort: S.

---

## WAVE 1 — The moat pages (highest impact ÷ effort)

### D1. [NEW PAGE] Canonical data report: "What 8,667 Voice Recordings Reveal About Why People Doomscroll (Spool Data Report, 2026)"
Route suggestion: `/research/why-people-doomscroll` (linked from /science, /press, homepage).
- Methodology block up top: n=8,667 recordings, 193 users, date range, anonymization method.
- 10–15 numbered findings, each a self-contained extractable stat sentence (pattern: "62% of pre-scroll check-ins used obligation language ('I need to'), according to Spool's analysis of 8,667 voice recordings" — VERIFY every number against the actual dataset via /analytics before publishing; the We Are Founders piece is the precedent but numbers must be re-derived, not copied).
- HTML tables for category breakdowns; charts.
- This is the reviews.org "186 times/day" play: one memorable headline number the whole niche ends up quoting.
Target: "doomscrolling data", "why do people doomscroll", AI-citation magnet. Effort: M (data work + page). Impact: HIGHEST — the only unreplicable asset in the category, and it seeds proprietary stats into S1, T3, and every guide below.

### G1. [NEW GUIDE] "Why Do I Always Ignore My Screen Time Limits? (The 'Remind Me in 15 Minutes' Habit)"
Cleanest intent gap found: SERP is tech-support fixes; nobody answers the psychology of tapping "ignore" every time. Searcher has already tried the free tool and knows it failed = maximum product readiness. Bridge: a voice check-in at the moment of override IS the intervention. Cite: Spool data (D1), self-determination/reactance literature (find real citations). Effort: S-M. Impact: HIGH.

### G2. [NEW GUIDE — PILLAR] "Why App Blockers Don't Work (And What Actually Does)"
The category argument. Only conflicted content competes (blocker apps reviewing themselves). Structure = the 4-bucket taxonomy (hard block / friction / gamification / reflection) with an honest what-each-is-good-for table — this taxonomy is what AI answers reproduce. Cite: Frontiers 2025 displacement finding (blocked users just procrastinate elsewhere), Lieberman 2007 affect labeling. Internal links: G1, the listicle, /compare hub, /science. Effort: M. Impact: HIGH — becomes the pillar of a new "Why reflection works" cluster.

### C1. [NEW COMPARE] "Opal vs One Sec vs Spool (2026): Full Comparison"
Proven self-insertion format (habitdoom precedent) into a weak SERP where Spool is absent; ChatGPT favors brand sites for vs-queries. Real-data table: price/yr, mechanism bucket, free tier, platform, research basis. Verdict per user type ("ranked by job" framing). Effort: S-M. Impact: HIGH.

### S1. [NEW PAGE] "Doomscrolling Statistics 2026" roundup
Verified open lane — no dedicated stat roundup exists (unlike crowded screen-time stats). 40–60 stats, segmented H2s (prevalence / mental health / demographics / platforms), every stat with named source + year, HTML tables, 5–10 Spool-proprietary stats from D1 seeded in (citing this page = citing Spool). Visible last-updated; quarterly refresh. Effort: M. Impact: HIGH (citation magnet + internal-link hub).

### G3. [NEW GUIDE] "Does Dopamine Detox Actually Work? What the Science Says"
Huge demand; indie app blog (morso.app) already proves top-3 winnable. Conclusion writes Spool's thesis: the neuroscience framing is wrong (cite Cameron Sepah's original CBT framing + GoodRx/Cleveland Clinic critiques), the behavior change is real, and structured reflection beats abstinence. Effort: S-M. Impact: HIGH.

---

## WAVE 2 — Comparison & alternatives expansion (commercial intent)

New /compare pages, ranked (all: real-data comparison table, 4-Q on-page FAQ, mechanism-bucket framing, honest tone — every competitor fact verified against their current site/App Store at write time):

### C2. [NEW COMPARE] spool-vs-brick
Hardware NFC blocker, NBC-reviewed, cottage industry of alternative-seekers. Angle: physical friction vs spoken intention; you can't carry a tag everywhere.
### C3. [NEW COMPARE] spool-vs-bepresent
44K reviews, gamification bucket, documented billing-complaint churn = alternative-seekers with nowhere authoritative to land. Angle: streaks break, motivation collapses; reflection builds internal motivation. (Handle billing complaints factually and carefully — cite review sources, don't editorialize.)
### C4. [NEW COMPARE] spool-vs-roots
9to5Mac-featured "Screen Time on steroids", $59.99/yr. Angle: Roots grades your dopamine; Spool asks you why.
### C5. [NEW COMPARE] spool-vs-touch-grass
TechCrunch/viral, zero comparison content exists. Angle: both make you DO something first — a grass photo is a gimmick that monetizes failure ($0.99–9.99 paid skips); speaking your intention builds awareness. Shareable title.
### C6. [NEW COMPARE] spool-vs-steppin
Kayak-founder halo, empty vs-SERP. Angle: earning minutes with steps still treats scrolling as the reward.

### C7. [NEW PAGE] "Apps Like Opal: 7 Best Alternatives (2026)"
"apps like opal" SERP = all low-authority self-promo; Spool absent. Include Spool honestly ranked with mechanism buckets.
### C8. [NEW PAGE] "Best One Sec Alternatives (2026)"
Same playbook, same weak field. Spool already has /compare/one-sec to link.
### C9. [NEW PAGE] "Brick App Alternatives — No $60 Hardware Required (2026)"
Captures Foqos/Blok/Unpluq/Locked seekers; fold the hardware-blocker roundup in here (Brick vs Unpluq vs Blok vs Foqos table) rather than a separate page.
### C10. [NEW PAGE] "Apps That Make You Pause Before Opening Instagram (2026)"
Spool's EXACT mechanic; SERP owned by one sec + Android "Pause Point" coverage; Spool absent. Compare one sec, ScreenZen, Android Pause Point, Spool — with affect labeling (Lieberman 2007) as the quotable mechanism differentiator.

Watchlist (do NOT build yet, revisit ~Jan 2027): Dull/UNDOOMED (content-filter category emerging), Refocus, Focus Bear (ADHD roundup inclusion only), "Lock In" (blog post keyword, not compare — 7+ apps share the name). Not viable (checked): Yaap (unverifiable), Clarymind/Flora/Session (no comparison demand), Cold Turkey (desktop-only).

---

## WAVE 3 — Top-of-funnel guides (new audiences) + tools

Ranked by demand × winnability × bridge (evidence per item verified via SERP inspection July 2026):

### G4. [NEW GUIDE] "Why Do I Procrastinate on My Phone?"
Remarkably thin SERP (solo blogs, Quora). Frame: emotional regulation failure, not laziness; Frontiers 2025 finding argues against blockers directly. Bridge: naming the feeling = the evidence-based counter.
### G5. [NEW GUIDE] "ADHD and Doomscrolling: Why Your Brain Can't Stop"
Competitor apps (Inflow, Shimmer) rank = model proven. Hooks: time blindness, variable rewards, low baseline dopamine (cite real ADHD literature). Bridge: voice check-in as external time anchor; nonjudgmental (RSD-sensitive audience hates shame-based blockers). Distinct lens from the existing anxiety post — cross-link, don't merge.
### G6. [NEW GUIDE] "How to Stop Using Your Phone in Bed" (+ revenge-bedtime-procrastination section targeting the long-tail)
Mattress-blog SERP, beatable. Night = high-value use context. RBP head term is entrenched (SleepFoundation) — target "revenge bedtime procrastination scrolling" as an H2, not the head term.
### G7. [NEW GUIDE] "How to Stop Checking Your Phone First Thing in the Morning"
Thin SERP (2023 HuffPost, insurance blogs). 1:1 product story: replace the morning scroll with a 2-minute morning check-in.
### G8. [NEW GUIDE] "Voice Journaling vs Writing: What the Science Says"
Near-zero competition (only tiny app blogs). This cluster describes what Spool IS, not what it fixes. Hooks in SERP already: 130–150 wpm speech vs ~40 wpm typing; verbalization → emotional regulation (Lieberman 2007 — Spool's existing anchor). Seeds a follow-up "Best Voice Journaling Apps (2026)" where Spool lists itself honestly.
### T3. [NEW TOOL] `/tools/` hub: Doomscrolling Test + Screen-Time Cost Calculator
- Test: wrap the published, validated 15-item Doomscrolling Scale (Sharma, Rosen et al.) — winners in this SERP are thin wrappers around validated instruments; competitors (Habi, Intently) already run /tools/ successfully. Also target "brain rot test" as variant keyword.
- Calculator: daily hours + age → lifetime years on screen; SERP is thin, zero-DA sites rank.
- CRITICAL: surround both widgets with extractable copy (scale provenance, scoring interpretation bands, 5–8 cited stats) — a bare JS widget gives LLMs nothing to quote. Diagnostic queries already pull quiz pages into AI answers by name.

---

## WAVE 4 — Secondary guides & cluster completion

### G9. [NEW GUIDE] "Is Brain Rot Reversible? How to Reverse It"
Huge Gen Z demand (Oxford WOTY); head term = WebMD, but the reversal/how-to angle is winnable. Reassurance hook: changes are functional, not structural. Keep brain/cognition-focused to avoid cannibalizing doom-scrolling-habit.
### G10. [NEW GUIDE] "Should You Switch to a Dumbphone? (Or Fix Your iPhone Relationship Instead)"
Vendor-junk SERP; competitor jomo.so proves app blogs win here. High-intent audience already willing to spend $. Spool = the keep-your-phone middle path. Absorbs the "turn iPhone into dumb phone" pillar angle + Light Phone-curious readers.
### G11. [NEW GUIDE] "How to Stop Bed Rotting"
Head term = Cleveland Clinic (skip); the how-to-stop variant ranks small therapy blogs = winnable. Link into G6 sleep cluster.
### G12. [NEW GUIDE] "The 30-Day Digital Detox Plan"
Weak/dated SERP. Week-by-week structured plan; day-1 = baseline awareness; Spool = the accountability layer you keep after day 30. Differentiate from breaking-phone-addiction by format (plan vs explainer) + cross-link.
### G13. [NEW PAGE] Glossary cluster: "What Is Affect Labeling?" / "Doomscrolling Definition" / "What Is Verbalized Intent?"
Medium conviction (glossary GEO evidence thinner) but cheap, and no app competitor claims "affect labeling" — Spool can be the definitional source. ChatGPT skews encyclopedic. Answer-first, 300–600 words each, heavy internal links to /science.
### E2. [EXPAND EXISTING] Extend "why-do-i-scroll-when-anxious" with a depression/sadness section
The depressed-mood variant SERP is unserved but a new URL would cannibalize. Add H2s + Q&A content to the existing post; bump dateModified genuinely.
### G14. [NEW GUIDE] "Things to Do Instead of Scrolling — Matched to Why You're Scrolling" (optional)
Don't write another 99-item list; structure by trigger (bored→stimulation, anxious→regulation, lonely→connection). Bridge: the check-in identifies the trigger. Build only if Waves 1–3 are shipped.
### G15. [NEW GUIDE] "Zombie Scrolling: When You're Not Doomed, Just Numb" (optional)
Rising term, thin SERP. Must be explicitly positioned as the autopilot/no-emotion variant vs doom-scrolling-habit or it cannibalizes.

---

## Cluster map (target end-state)

- **Cluster A — Why reflection works (NEW, brand-defining):** Pillar G2 → spokes G1, G8, G13 glossary, /science, D1. This cluster IS the category argument.
- **Cluster B — Choosing an app (commercial):** Twin hubs: best-apps listicle + /compare. Spokes: all 15+ compare pages, C7–C10 alternatives/roundups, C1 three-way. Every compare page gets "similar comparisons" (same mechanism bucket first).
- **Cluster C — Doomscrolling (existing, strongest):** Pillar how-to-stop-doom-scrolling → 5 platform guides (sibling-linked), is-doomscrolling-an-addiction, why-do-i-scroll-when-anxious (+E2), G15, S1 stats, D1 data.
- **Cluster D — Phone addiction & the brain:** Pillar: rewritten breaking-phone-addiction (stale since Oct 2024) → G3 dopamine, G9 brain rot, G5 ADHD, G4 procrastination, why-cant-i-put-my-phone-down, does-grayscale-mode-work.
- **Cluster E — Daily rhythms (sleep/morning/detox):** Pillar G12 detox plan → G6 bed, G7 morning, G11 bed rotting, intentional-screen-time (stale — refresh), how-much-screen-time-is-too-much.
- **Tools:** T3 hub linked from clusters C and D.

## Suggested execution order for Sonnet
1. Wave 0 (T1 refactor decision first — everything else gets cheaper; L1+E1+T2 can proceed in parallel with refactor)
2. D1 (data report — verify all numbers against Firestore via /analytics before publishing)
3. G1, G2, C1, G3 (can parallelize)
4. S1 (after D1, so proprietary stats exist to seed)
5. Wave 2 compares/roundups (after T1 refactor)
6. Wave 3, then Wave 4
7. Standing: quarterly refresh calendar (listicle, S1, D1, all compare pages' pricing tables)
