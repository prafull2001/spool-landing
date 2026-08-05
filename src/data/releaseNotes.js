// Release notes for the Spool iOS app, mined from the iOS repo's git history.
// Consumed by src/views/ReleasesPage.js (the "Releases" tab on /analytics).
//
// Purpose: give a non-technical reader one-click copyable context blocks for
// Claude chats that compare RevenueCat / PostHog / onboarding-funnel data
// across app versions. Every copy is self-contained: preamble + mapping table
// + data quirks + the selected release notes.
//
// PLACEHOLDER: RELEASES entries are being generated from iOS git history.
// Shape is final; content is filled in by the mining pass.

// ---------------------------------------------------------------------------
// Standing preamble prepended to every copy, so a fresh Claude chat has the
// full picture without any other context.
// ---------------------------------------------------------------------------
export const CLAUDE_PREAMBLE = `# Spool — App Version Context Pack

Spool is an iOS screen-time app: users set app-blocking schedules, and to unlock
a blocked app they must give a spoken "excuse" (voice check-in) that the app
evaluates. Subscription business (RevenueCat), product analytics in PostHog,
onboarding funnel data in Firebase/Firestore, custom dashboards at
thespoolapp.com/analytics.

How to join data sources to app versions:
- **RevenueCat**: key on \`app_version\` (marketing version, e.g. "4.18") and the
  release-date windows in the mapping table below.
- **PostHog**: events carry \`app_version\` and (during onboarding)
  \`flow_version\` / \`flow_cohort\` properties.
- **Onboarding funnel dashboard**: sessions are bucketed by \`flow_version\`
  (v1–v6 tabs), NOT by app version — use the mapping table to translate.
- A version's "live window" runs from its release date until the next
  version's release date; adoption is gradual (users update over days).

Read the mapping table and data quirks before drawing conclusions.
`;

// ---------------------------------------------------------------------------
// Known measurement traps. Shown on the page and included in every copy.
// ---------------------------------------------------------------------------
export const DATA_QUIRKS_MD = `### Known data quirks (read before analyzing)
- The iOS app logs an onboarding screen event when the user **leaves** a
  screen, not when they arrive on it.
- The onboarding screen named \`sky_paywall\` renders **JourneyPaywallView**
  (\`paywall_type: "journey"\`) in recent versions — the name is historical.
- In the v5 build, \`flow_version\` is always 5 (the commitment-ritual branch
  was unconditionally on).
- **flow_version 6 exists in production but not in git.** Git history renumbered
  6 → 5 on 2026-06-09 and never emits 6 again — but the currently-deployed App
  Store build stamps \`flow_version: 6\` / cohort \`instagram_demo_v6\` (it was
  cut from uncommitted local state; live traffic was dominated by 6 as of
  2026-07-22, ~434 events vs 34 for v9). v6 and v9 are **identical flows**; the
  dashboard's "v6" tab deliberately folds \`flow_version === 6 || 9\`.
- Other flow_version facts: 1 and 7 never existed; 8 = \`focus_web_apps_v8\`
  (~1 day, dev-scale sample); 9 = \`personal_plan_reveal_v9\`; 10 =
  \`post_purchase_journey_v10\` (current 4.27 development snapshot, not
  confirmed live). Resumers get 5 /
  \`legacy_resume_pre_demo_v5\` and legitimately show zero on screens 0–9.85.
  **Prefer \`flow_cohort\` for cohorting.**
- Two \`flow_version\` fields can disagree in PostHog: the super property is the
  app-build constant stamped on every event; the per-event onboarding field is
  the persisted per-attempt assignment. Use the per-event field / cohort.
- v1-era onboarding sessions have **no** \`flow_version\` field at all.
- Multiple TestFlight/App Store builds share \`app_version\` 4.21 (at least 8
  builds, 2026-07-07 → 07-24+) — split by date range or \`app_build\` (which
  only exists as an event property from 2026-07-18). An uncommitted
  \`MARKETING_VERSION → 4.27\` edit labels the current local development
  snapshot; do not treat 4.27 as production until it appears in live data.
- \`name_collection\` and \`create_account\` are conditional screens with low
  traffic by design; low counts there are not dropoff.
`;

// ---------------------------------------------------------------------------
// Cross-version joining notes (from the iOS repo's git history). Included in
// every full copy payload — these are the rules that make RevCat/PostHog
// comparisons valid.
// ---------------------------------------------------------------------------
export const MAPPING_NOTES_MD = `### Cross-version joining notes
**flow_version lineage** (deterministic per-attempt assignment, never a random split):
- \`2\` — introduced 2026-03-17, the only value in 4.1–4.14. Survives later as the
  fallback for unassigned sessions — treat late \`flow_version: 2\` as "unassigned".
- \`3\` — 4.16 (commitment ritual, on for 100%). \`4\` — 4.18 (chat onboarding).
- \`5\` — 4.20/4.21 (quiz + archetype flow; in git it IS the "v6" restructure,
  renumbered Jun 9). \`1\` and \`7\` never existed.
- \`6\` — **the deployed App Store build** (\`instagram_demo_v6\`, reels demo +
  personalized plan; cut from uncommitted state, so git never shows it).
  Dominant in live traffic as of late Jul 2026.
- \`8\` — Jul 20 (\`focus_web_apps_v8\`, ~1 day) · \`9\` — Jul 21
  (\`personal_plan_reveal_v9\`; **identical flow to 6**) · \`10\` —
  current 4.27 development snapshot (\`post_purchase_journey_v10\`, not
  confirmed live). Resumers get
  \`5\` / \`legacy_resume_pre_demo_v5\`.
- The only randomized A/B ever was \`ab_showVideoIntro\` (2026-03-17 → concluded
  2026-04-28, Group A won; the field is a constant \`true\` afterwards).

**Paywall identity rules:**
- Onboarding screen 10.5 has been named \`sky_paywall\` since 2026-03-17 and was
  never renamed, but the rendered view changed: **before 4.18 it is the real Sky
  paywall (\`paywall_type: "sky"\`); from 4.18 (May 17) it is
  \`JourneyPaywallView\` (\`paywall_type: "journey"\`)**. Join on \`paywall_type\`,
  never on \`screen_name\` alone.
- From 4.18 onward \`paywall_type: "sky"\` means the expired/win-back paywall
  (existing users), \`"journey"\` means new-user onboarding.
- After 2026-07-17: \`plan: "weekly"\` = new-user Journey purchases;
  \`plan: "monthly"\` = Sky re-subscribes (Sky still sells monthly).
- Screen 10 (\`onboarding_glass\`) has been unreachable dead code since 2026-03-04.
- A few \`"journey"\` trial starts come from a hidden triple-tap-the-mascot
  easter-egg sheet (\`free_trial_sheet_shown\`), not the main flow.

**Which data source per era:**
- Before 2026-03-24: **no PostHog at all** — only Firestore
  (\`onboarding_sessions\`, \`onboarding_surveys\`) + RevenueCat.
- 2026-03-24 → 2026-04-22: PostHog autocapture only (screens, replays) — no
  custom events.
- 2026-04-22 (4.14) → 2026-07-18: full custom event set, but purchase events
  fire from many places (duplicates possible) and RevenueCat↔PostHog have **no
  per-person join** (\`$posthogUserId\` link didn't exist).
- 2026-07-18 onward: canonical deduped purchase events + server-side \`rc_*\`
  webhook events, joined to RevenueCat via \`$posthogUserId\`, filterable by
  \`environment\` / \`app_build\` / \`access_source\`.
- Firebase Analytics was never used — Firebase is Auth + Firestore + Functions only.
- Not in git (get from ASC/RevenueCat dashboards): actual App Store release
  dates, per-upload build numbers, real production prices/trial lengths.
`;

// ---------------------------------------------------------------------------
// RELEASES — entries in any order here; sorted newest-first on export below.
// All *Md fields are markdown strings. liveUntil: null means "current".
// ---------------------------------------------------------------------------
const ENTRIES = [
  {
    version: '3.0',
    releaseDate: '2026-01-25',
    liveUntil: '2026-02-03',
    commitCount: 259,
    headline: 'App Store launch — the AI excuse interrogator ships after 6 months of building',
    flowVersions: 'none (no flow_version field existed)',
    cohorts: '—',
    paywall: '`CustomPaywallView` at screen 10, soft ("CONTINUE USING FREE" skip)',
    pricing: '$4.99/mo · $24.99/yr, no trial',
    sections: [
      {
        title: 'Summary',
        md: `Six months of building (Jul 2025 – Jan 2026) produced an AI "excuse interrogator" screen-time blocker that shipped to the App Store with a full 20+ screen onboarding funnel, a freemium 1-app limit, and **zero product analytics instrumentation** — only RevenueCat purchase data and Firestore documents exist for this era.

Spool started 2025-07-18 as a voice-based "roast" app: record a spoken excuse for why you need your distracting app, it gets transcribed, and an AI judges whether it's good enough. August 2025 added the three pillars that survived to launch — Apple Screen Time / FamilyControls integration with a custom shield screen, an excuse log with AI summaries and tips, and a social friends system (excuse feed + weekly leaderboard). September was a grind against Apple's Screen Time APIs plus legal plumbing for review. October: multi-app blocking, custom paywall replacing RevenueCat's hosted one. November: Google/Apple sign-in, the modular Focus Tools system (Pomodoro, Thread Breath, Quick Reset, Spooli Tickle, anxiety check), and a Firebase Cloud Functions backend moving AI excuse validation, pattern detection, and tip generation to OpenAI \`gpt-3.5-turbo\`. December rebuilt the UI end to end (Home, Stats, Insights Hub, notification reminders, in-app rating prompt, DeviceActivityReport extension). January was launch prep, ending with "app store uploaded" on 2026-01-25.`,
      },
      {
        title: 'App state at launch',
        md: `- **Core loop:** blocked app → Spool shield → pick unlock duration (1/2/3/5 min) → give a reason by voice or typing → Cloud Function + OpenAI validates → granted or refused. Offline keyword fallback.
- **Thread metaphor:** daily "Thread" starts at 100%; every unlock deducts proportional to the daily limit; at 0% the thread "snaps" until tomorrow.
- **Pattern blocking:** \`detect_pattern_block\` compares excuses against recent ones; repeats trigger a "PATTERN DETECTED" screen with category counts (Break/Reward, Procrastination, Quick Check, Boredom, FOMO, Other).
- **Tabs:** Home, Stats (DeviceActivityReport), Rules, Settings + a "Full Access" crown tab shown only to non-subscribers.
- **Onboarding:** ~23 mandatory screens in \`SpoolOnboardingFlowView\` — video intro → surveys → Screen Time permission (early, screen 4.5) → "Top App Demon" report → App Store review request at screen 8.5 → **paywall at screen 10 BEFORE account creation at screen 13** → schedule/app-selection/config screens.
- **Paywall/pricing:** custom \`CustomPaywallView\`; \`com.stopscrollingwith.Spool.Month\` $4.99/mo and \`.Year\` $24.99/yr (annual preselected with SAVE badge). No intro offer. No close button — skip via "CONTINUE USING FREE" text link.
- **Freemium:** free users block exactly 1 app; the 2nd app triggers the paywall. \`usedFreeCode\` Firestore flag comps users entirely outside RevenueCat.
- **Analytics: essentially none.** Firebase Analytics linked but not one \`Analytics.logEvent\` call in the tree; **PostHog does not exist yet** (first commit 2026-03-24). Behavioral data for this era lives only in Firestore: \`users\`, \`users/{uid}/excuses\`, \`friends\`, \`friend_requests\`, \`top_apps_optimized\`.
- **Blocking:** \`ManagedSettingsStore\` + extensions (\`shieldconfig\`, \`SpoolShieldAction\`, \`Device-Monitor\`, \`SpoolReport\` with 5 report contexts). Anti-tamper added in the launch commit: schedule/limit increases require an 8-second spoken justification.`,
      },
      {
        title: 'Data quirks',
        md: `- **No product analytics for this entire era** — no PostHog, no custom Firebase events. Funnel/paywall analysis for 3.0 can only be inferred from RevenueCat events and Firestore doc counts.
- **Paywall precedes signup:** RevenueCat customers start as anonymous IDs, aliased to Firebase UID at account creation. Some purchasers never finished onboarding and have no \`users\` doc at all.
- Every user is forced through the paywall, so "paywall views" ≈ everyone who got 10 screens deep, not an intent-signalling subset.
- Comped users (\`usedFreeCode\`) make the app's "premium" count larger than RevenueCat's paying-subscriber count.
- v3.0 was live only ~9 days — small cohorts, truncated retention curves.
- The onboarding review request (screen 8.5) was only "hopefully fixed" on 2026-01-20; early rating volume may be unreliable.`,
      },
    ],
  },
  {
    version: '3.2',
    releaseDate: '2026-02-03',
    liveUntil: '2026-03-05',
    commitCount: 1,
    headline: 'Single-commit hotfix: blocking engine stopped silently dying',
    flowVersions: 'none',
    cohorts: '—',
    paywall: '`CustomPaywallView` (unchanged, soft)',
    pricing: '$4.99/mo · $24.99/yr (unchanged)',
    sections: [
      {
        title: 'Summary',
        md: `Not a feature release — one commit ("changed blocking nil thing") that rewrote how the blocking schedule decides it is "on." Previously a master \`isEnabled\` flag could disagree with the seven per-day toggles, and Spool would quietly block nothing while the UI implied it was working. The fix deletes the master switch from the decision path everywhere (app, \`BlockingManager\`, Device-Monitor extension) — the only question is now "is any day enabled?" (\`hasAnyEnabledDays\`).

User-visible: the schedule on/off toggle disappeared (days are the only control), and users whose saved settings can't load now default to **all-day blocking, 7 days, 00:00–23:59** instead of nothing. Heavy diagnostic logging (\`[SCHEDULE_DUMP]\`) was added — the team was actively chasing "blocking not firing" reports.

Note: marketing version jumped 3.0 → 3.2 with no 3.1 release.`,
      },
      {
        title: 'Onboarding / Paywall / Analytics',
        md: `- Onboarding: no changes.
- Paywall & revenue: no changes.
- Analytics: no changes — only local debug logging that never leaves the device.`,
      },
      {
        title: 'Data quirks',
        md: `- No 3.1 exists — anything attributed to "3.1" is mislabeled.
- Blocking was silently broken for some users before this build, so 3.0-era retention/engagement is artificially depressed; improvement in the Feb 3 – Mar 5 window is plausibly a bug-fix effect, not product improvement.
- Users with unreadable settings woke up with 24/7 blocking they never chose — expect a spike in blocked-app events, excuse requests, and possibly uninstalls/refunds early in the window.
- Zero product/paywall/onboarding changes: any conversion movement in this window is external (traffic mix, seasonality), not shipped code.`,
      },
    ],
  },
  {
    version: '3.3',
    releaseDate: '2026-03-05',
    liveUntil: '2026-04-05',
    commitCount: 7,
    headline: 'Onboarding + monetization rebuild: Sky paywall, weekly plan, 3-day trial, hard paywall',
    flowVersions: 'none (no flow_version stamp yet — separate old vs new onboarding only by app version)',
    cohorts: '—',
    paywall: '`SkyPaywallView` in onboarding (screen 10.5, **hard** — no skip; X opens a 30%-off downsell); `GlassPaywallView` in-app',
    pricing: '$4.99/wk · $49.99/yr (3-day trial) · $35/yr limited-time offer',
    sections: [
      {
        title: 'Summary',
        md: `The biggest release of the early era, in three layers. First, a complete cosmetic overhaul of onboarding: brown accents replaced with blue/black, header logo removed, new Spooli mascot art set, cinematic intros — a full-screen looping intro video with audio is now screen 0, and the welcome screen got a clouds video with a typewriter "Spool" animation plus "1000+" and "4.8 stars" social proof.

Second, three new onboarding screens: a referral-source survey ("How did you hear about Spool?"), an academic-studies credibility screen (Harvard/Yale/UC Irvine/UCLA), and a two-step Screen Time permission explainer that shows a mockup of Apple's dialog before auto-firing the real one.

Third — most important commercially — the paywall was rebuilt twice in three days. \`GlassPaywallView\` (liquid-glass Metal shader) landed for the in-app Full Access screen; \`SkyPaywallView\` became the onboarding paywall. Pricing changed materially: annual **$24.99 → $49.99** with a new **3-day free trial**; monthly ($9.99) **replaced by weekly** \`com.stopscrollingwith.Spool.Weekly\` at $4.99/wk; and a new **$35/yr LimitedTimeOffer** product appears as a ~30%-off downsell when the user taps X. **The Sky paywall has no skip path — onboarding became a hard paywall.** First onboarding survey data (\`referralSource\`, \`mainIssue\`) started writing to Firestore.`,
      },
      {
        title: 'Onboarding',
        md: `- Added screen 0 Video Intro; flow start moved from screen 1 to 0.
- Added screen 0.5 "How did you hear about Spool?" — options \`Instagram\`, \`TikTok\`, \`Reddit\`, \`Friend\`, \`Other\`.
- Added screen 8.75 Academic Studies (tappable citations).
- Screen 4.5 split: 4.5 \`ScreenTimeConnectView\` (info) + 4.75 \`ScreenTimeDialogView\` (mock dialog → real \`AuthorizationCenter.requestAuthorization\` after 800ms).
- Added screen 10.5 Sky Paywall; screen 9 now advances to 10.5, **skipping the old screen-10 paywall**.
- Survey persistence begins: screen 0.5 writes \`referralSource\`, screen 1 writes \`mainIssue\` (stored as shortened labels: \`Attention span\`, \`Disconnected from people\`, \`Bad mood\`, \`Too much doomscrolling\`).
- Still no \`flow_version\` field or A/B assignment anywhere.`,
      },
      {
        title: 'Paywall & revenue',
        md: `- Annual raised $24.99 → $49.99 (\`com.stopscrollingwith.Spool.Year\`) + 3-day free trial.
- Monthly removed, replaced by weekly: \`com.stopscrollingwith.Spool.Weekly\`, $4.99/wk, same subscription group.
- New \`com.stopscrollingwith.Spool.LimitedTimeOffer\` — $35.00/yr with 3-day trial, shown as "Limited One Time Offer" (~30% OFF, "$0.67/wk") on paywall close attempt.
- Sky paywall: annual framed as "$0.96/wk, billed annually for $49.99" vs weekly card; CTA becomes "Continue with 3 day free trial" when RevenueCat reports a zero-price intro.
- **No skip path**: \`onClose\` is nil; the X only opens the downsell sheet.
- In-app \`GlassPaywallView\` still references the removed monthly product — its non-annual purchase likely failed in 3.3 (see quirks).`,
      },
      {
        title: 'Analytics',
        md: `- Still no Firebase Analytics events, **no PostHog SDK yet**. All product analytics are Firestore writes.
- New Firestore collection \`onboarding_surveys\`: doc keyed by device ID with \`{referralSource, mainIssue}\`, plus a second auto-ID doc \`{uid, referralSource, mainIssue}\` written at sign-up → duplicates.
- \`referralSource\`/\`mainIssue\` also copied onto \`users/{uid}\` at sign-up.
- \`firestore.rules\` committed for the first time: \`onboarding_sessions\`, \`onboarding_events\`, \`onboarding_surveys\` with \`allow write: if true\`. **Sessions/events have rules but no writer yet — empty collections in this era.**`,
      },
      {
        title: 'Data quirks',
        md: `- **Massive confound:** annual price doubled + first trial + monthly→weekly + full paywall redesign + downsell all shipped at once. Trial-start rate, paid conversion, and ARPU all move; nothing is attributable to a single change.
- **First-ever free trial:** purchases from 3.3 onward are trial starts; first paid renewals land ~Mar 8+. Early-window revenue dips are timing artifacts.
- **Product ID discontinuity:** \`Month\` disappears, \`Weekly\` appears — monthly cohort stops growing Mar 5; that's not churn. Weekly billing also multiplies transaction counts.
- **Hard paywall:** non-purchasers can't reach screens 11–22 (welcome, account creation, schedule, app selection). Expect onboarding-completion and account-creation counts to collapse in this window while paywall→purchase rate looks great.
- **Blocking may never be applied during onboarding:** \`onApplyBlocking()\` only ran on the now-skipped screen 10 — subscribed users could finish with no blocking configured (likely early-churn/refund driver).
- Two \`onboarding_surveys\` docs per user (device-ID + uid); dedupe before counting referral sources. Device-ID docs with no uid doc = everyone who hit the hard paywall and left.
- App size ballooned (~100MB of videos/images added) — install→first-open drop-off may worsen for non-product reasons.
- Internal build number stayed 3.1 while marketing went 3.3.`,
      },
    ],
  },
  {
    version: '4.1',
    releaseDate: '2026-04-05',
    liveUntil: '2026-04-11',
    commitCount: 28,
    headline: 'PostHog arrives (autocapture + replay), expired-subscriber hard paywall, gamification, phone auth',
    flowVersions: '2 (first version writing `flow_version` to `onboarding_sessions`)',
    cohorts: '`ab_showVideoIntro` A/B **concluded** — hardcoded true from here on',
    paywall: '`SkyPaywallView` (onboarding, hard; X opens downsell) + new `isExpiredMode` win-back variant',
    pricing: '$49.99/yr · $9.99/mo (weekly→monthly swap) · ~$35/yr `limited_offer` win-back',
    sections: [
      {
        title: 'Summary',
        md: `Five weeks of work released in one go (the "Monster push" bump commit itself is tiny). Three big pieces:

**Expired-subscriber hard paywall:** once a user has ever been subscribed, lapsing routes them to a full-screen non-dismissable \`SkyPaywallView\` in expired mode — animated personal stats ("N day streak", "N sessions cut short") and a purchase pointed at the separate \`limited_offer\` RevenueCat package (~$35/yr win-back). All shields cleared, deep links suppressed.

**Analytics infrastructure:** PostHog iOS SDK added (2026-03-24) with lifecycle events, screen views, and **session replay** on — but **zero custom events yet** (autocapture only). Onboarding also starts writing per-device Firestore \`onboarding_sessions\` docs tracking every screen transition, with \`flow_version: 2\`.

**Funnel/auth:** phone sign-in added as a third auth method; video-intro A/B test concluded (everyone gets the video now); gamification layer (points, streaks, milestones), Wrapped share feature, and the paywall's second plan switched **weekly → monthly** ($9.99, from the RevenueCat \`.monthly\` package).`,
      },
      {
        title: 'Onboarding',
        md: `- Screen 2 (\`PhoneSymptomsView\`) removed; flow: \`video_intro\` (0) → \`how_did_you_hear\` (0.5) → \`checkbox_selection\` (1) → \`age_selection\` (3) → … → \`sky_paywall\` (10.5) → account screens → \`blocking_confirmation\` (22).
- \`flow_version: 2\` written on every \`onboarding_sessions\` doc (new collection: \`device_id\`, \`started_at\`, \`last_screen_name\`, \`dropped_off\`, \`reached_paywall\`, \`screens_completed[]\`, \`uid\` linked at account creation).
- \`ab_showVideoIntro\` 50/50 split deleted — always true from 4.1.
- Survey values: \`referralSource\` (Instagram/TikTok/Reddit/Friend/Other), \`mainIssue\`, integer \`age\`; all written immediately on Continue so drop-offs are captured.
- \`onboarding_surveys\` changed from auto-ID docs to device-ID-keyed with merge (fixes double-counting).`,
      },
      {
        title: 'Paywall & revenue',
        md: `- Sky paywall second plan: Weekly ($4.99) → **Monthly ($9.99)**; annual stays $49.99 ("$4.17/mo" label). Weekly product no longer purchasable from 2026-03-28.
- New expired-mode paywall purchases the \`limited_offer\` package (~$35/yr, "% OFF" badge).
- The X button opens the limited-offer upsell instead of closing — limited-offer impressions are largely dismissal attempts.
- Trial copy now dynamic from RevenueCat \`introductoryDiscount\` (was hardcoded "2 WEEK FREE TRIAL").`,
      },
      {
        title: 'Analytics',
        md: `- **PostHog live from 2026-03-24**: autocapture \`$screen\`, lifecycle events, session replay (inputs masked), \`identify(uid, {email, name})\` on auth. **No custom \`capture()\` calls yet.**
- Firestore \`onboarding_sessions\` collection begins (device-ID keyed).
- \`firestore.rules\` opened anonymous writes to \`onboarding_sessions\` / \`onboarding_surveys\` (users aren't signed in during onboarding).
- No Firebase Analytics events at all.`,
      },
      {
        title: 'Data quirks',
        md: `- The video-intro A/B comparison must cut off at 2026-04-05; the field is useless as a segmentation key afterward.
- \`onboarding_surveys\` schema changed mid-flight (auto-ID → device-keyed): counting docs across the boundary over-counts earlier periods.
- Sessions are keyed by device, not user — reinstalls look like new people. \`dropped_off\` reads true for any unfinished session, including in-progress ones.
- Expired hard paywall makes churn look like a wall: lapsed users' engagement goes to zero instantly. \`previousSubscriptionStatus\` is never cleared — stale flags can trap resubscribers.
- New-user vs win-back purchases share one screen; distinguish by product/package in RevenueCat, not screen name.
- Unlock durations changed 1/2/3/5 → 1/5/10/15 min on 2026-03-24 — duration time-series break there.
- Live only 6 days, bundling 5 weeks of changes — single-change attribution impossible.`,
      },
    ],
  },
  {
    version: '4.12',
    releaseDate: '2026-04-11',
    liveUntil: '2026-04-14',
    commitCount: 1,
    headline: 'In-app cancellation flow with a 7-day free-extension save offer (RevenueCat promotional entitlements)',
    flowVersions: '2 (unchanged)',
    cohorts: '—',
    paywall: 'unchanged from 4.1',
    pricing: 'unchanged',
    sections: [
      {
        title: 'Summary',
        md: `One commit (SPO-116): Settings → Manage Subscription now opens a four-step retention funnel — reason survey → engagement-tier-personalized pitch → **7-day free extension offer** → final confirmation — before handing off to Apple's subscription settings.

The tier pitch is derived from total excuse count (tier 1 = 0, tier 2 = 1–4, tier 3 = 5+, which shows the user's own streak plus hardcoded marketing claims: "75% screen-time drop", "42 min/day saved", "3.2× more intentional choices"). The save offer is real: a Cloud Function grants a 7-day promotional entitlement via the RevenueCat V2 REST API; if that fails it falls back to writing \`pauseUntil\` on the Firestore user doc, which unlocks the app with **no RevenueCat record at all**.`,
      },
      {
        title: 'Analytics',
        md: `- New Firestore collection \`cancellation_events/{userId}/events\`: \`reason\`, \`reasonText\`, \`userSegment\`, \`engagementTier\`, \`daysSubscribed\`, \`excuseCountAtCancel\`, \`streakAtCancel\`, \`offerShown\` (always \`"free_extension_7_day"\`), \`offerAccepted\`, \`completedCancellation\`, \`appVersion\`.
- **Nothing goes to PostHog** — the flow appears only as autocaptured screens/replays.`,
      },
      {
        title: 'Data quirks',
        md: `- Live only 3 days; extensions granted here expire during 4.13.
- The "Are you sure?" pre-step did NOT ship here (added in 4.13) — 4.12 vs 4.13 funnel step counts aren't comparable.
- Manage Subscription is ungated: free/comped/curious users generate \`cancellation_events\` — cancellation intent is overstated.
- Dismissals only log if a reason was selected — true top-of-funnel is invisible.
- **Promotional entitlements appear in RevenueCat as active subscribers with $0 revenue** (inflate actives, depress ARPU); \`pauseUntil\` fallback users are active in-app but look churned in RevenueCat.
- \`daysSubscribed\` is estimated, not read from purchase date; \`userSegment\` is naive string matching.
- The tier-3 stat claims are hardcoded marketing copy, not measured outcomes.`,
      },
    ],
  },
  {
    version: '4.13',
    releaseDate: '2026-04-14',
    liveUntil: '2026-04-22',
    commitCount: 6,
    headline: 'Home-screen widgets (thread + streak), Strict Mode, and an "Are you sure?" step on cancellation',
    flowVersions: '2 (unchanged)',
    cohorts: '—',
    paywall: 'unchanged',
    pricing: 'unchanged',
    sections: [
      {
        title: 'Summary',
        md: `Three unrelated features shipped together. **Widgets** (SPO-127): two small WidgetKit widgets — "Thread Status" (Spooli art + remaining-thread % with six bands from Thread Strong to Thread Snapped) and "Streak" (fire icon + day count), reading from the App Group on a 30-minute timeline. **Strict Mode** (SPO-128): a Rules toggle that fully locks blocked apps with no excuse path; turning it off requires a user-chosen cooldown (30m/1h/4h/24h), signalled between processes via a sentinel file. **Cancellation**: a leading "Are you sure you want to cancel?" step added in front of the 4.12 funnel. Also fixed Xcode schemes broken by an accidental project rename in 4.12.`,
      },
      {
        title: 'Analytics',
        md: `- **No new events.** Widgets emit nothing (adoption unmeasurable); Strict Mode emits nothing.
- PostHog is still autocapture-only — zero custom \`capture()\` calls in the codebase.`,
      },
      {
        title: 'Data quirks',
        md: `- Widget adoption/retention correlation can only be inferred, never measured, for this era.
- Cancellation funnel changed shape: 4.13 users can bail at "Are you sure?" before selecting a reason, and reason-less exits aren't logged — **4.13 records fewer \`cancellation_events\` per attempt than 4.12 by construction**.
- Strict Mode users can't log excuses or unlock: their excuse/unlock/points counts drop to zero while blocking is active, which also drags their cancellation \`engagementTier\` down (a power user can read as tier 1).
- Shield taps become silent no-ops in Strict Mode — shield-interaction counts drop with no explaining event.
- Live 8 days — the only early-4.1x window with a usable sample for weekly metrics.`,
      },
    ],
  },
  {
    version: '4.14',
    releaseDate: '2026-04-22',
    liveUntil: '2026-04-28',
    commitCount: 32,
    headline: 'The release that turned on analytics — ~50 custom PostHog events + the Reflect tab',
    flowVersions: '2 (unchanged)',
    cohorts: 'video-intro A/B remains concluded (always true)',
    paywall: '`SkyPaywallView` — weekly card replaced by Monthly ($9.99)',
    pricing: '$49.99/yr · $9.99/mo · `LimitedTimeOffer` in expired mode',
    sections: [
      {
        title: 'Summary',
        md: `**The single most consequential release for data.** Before 4.14 the PostHog SDK fired zero custom events; 4.14 shipped ~50 hand-written events across onboarding, paywall, excuse/unlock, subscription, tabs, settings, friends, and focus tools. Anything in PostHog before 2026-04-22 is not comparable to anything after.

User-facing headline: a new **Reflections tab** (position 1) — a day-grouped timeline of the user's own journaled excuses with category filters, plus premium-gated AI "Deep Insights" per app (new Cloud Function \`generate_deep_insights\` on gpt-4o-mini). A long-lived branch also merged in: phone auth polish, identity bridging across Firebase/RevenueCat/PostHog/device ID, and **two paywall-bypass security holes closed** (the "I already have an account" path previously skipped subscription checks, and social sign-in auto-created accounts that skipped onboarding + paywall entirely).`,
      },
      {
        title: 'Analytics (the big one)',
        md: `- Onboarding: \`onboarding_step_viewed\` (\`step_number\`, \`step_name\`, \`time_on_previous_step_ms\`), \`onboarding_referral_selected\`, \`onboarding_issue_selected\`, \`onboarding_schedule_selected\`, \`onboarding_apps_selected\`, \`onboarding_daily_limit_set\`, \`onboarding_completed\`, \`account_created\`, \`display_name_entered\`.
- Paywall: \`paywall_shown\` (\`type\`, \`is_expired_mode\`), \`paywall_plan_selected\`, \`paywall_purchase_tapped\`, \`paywall_purchase_completed\`, \`paywall_purchase_cancelled\`, \`paywall_closed\`, \`paywall_skipped\`, \`limited_offer_shown\`, \`limited_offer_purchase_tapped\`. Onboarding paywalls use \`paywall_type\` values \`onboarding_glass\` / \`onboarding_sky\`.
- Excuse/unlock: \`blocked_app_shield_shown\`, \`blocked_app_walk_away\`, \`unlock_time_selected\`, \`excuse_recording_started/completed\`, \`excuse_text_submitted\`, \`excuse_validated\`, \`excuse_rejected\`, \`unlock_granted\`, \`unlock_dismissed\`, \`excuse_saved\`, \`focus_tool_recommended/selected\`.
- Subscription: \`subscription_status_changed\`, \`subscription_restored\`, \`subscription_expired\`, \`trial_started\`. Navigation: \`tab_switched\`, \`deep_link_opened\`, \`rating_prompt_shown/response\`, \`milestone_celebration_shown\`, \`notification_permission_response\`. Plus the whole Reflections family (\`reflections_tab_opened\`, \`deep_insights_opened\`, \`deep_insights_locked\`, …).
- **Session replay config changed**: \`screenshotMode = true\` (SwiftUI replays render at all now) and \`maskAllTextInputs\` false — replays before 4.14 were largely blank.`,
      },
      {
        title: 'Paywall & revenue',
        md: `- Sky paywall weekly → monthly card swap shipped live here (commit was in the 4.14 branch).
- Two paywall-bypass holes closed — some previously-free users now hit the paywall; expect more "No account found" errors + returning-user paywall views.
- RevenueCat identity bridge: RC customer ID = Firebase UID, \`revenuecatId\` on \`users/{uid}\`, \`firebaseUID\` as RC subscriber attribute — bidirectional joins now possible.
- Deep Insights lock is a **new in-app paywall entry point** (\`deep_insights_locked\`) — \`paywall_shown\` now includes non-onboarding traffic.`,
      },
      {
        title: 'Data quirks',
        md: `- **Never compare event volume across the 4.13→4.14 boundary** — the cliff at 2026-04-22 is instrumentation, not behavior.
- Branch commits span 2026-03-26→04-22 but ALL went live 2026-04-22 — don't date changes by commit date.
- 6-day live window; early days are mostly 4.13 users (no events) + a trickle of updaters.
- Weekly SKU disappears from the paywall: RevenueCat weekly purchases → ~0, weekly MRR decays via renewals only.`,
      },
    ],
  },
  {
    version: '4.16',
    releaseDate: '2026-04-28',
    liveUntil: '2026-04-30',
    commitCount: 9,
    headline: 'Commitment Ritual + Before/After pre-paywall screens → flow_version 3; Liquid Glass redesign',
    flowVersions: '3 (bumped from 2; hardcoded on for everyone)',
    cohorts: 'no A/B — 100% get the commitment ritual',
    paywall: 'unchanged products/pricing; paywall now 2 screens deeper in the funnel',
    pricing: '$49.99/yr · $9.99/mo (unchanged)',
    sections: [
      {
        title: 'Summary',
        md: `Two new screens inserted **immediately before the paywall**: the Commitment Ritual (screen 9.5 — type ≥8 words or speak ≥3s about why you want less screen time, then hold-to-commit, then your own words shown back: "This is what you're fighting for") and Before/After (9.75 — 6h32m → 1h49m bar comparison, CTA "Start Your Free Week And Gain 4+ Hours Back"). Classic commitment-and-consistency warm-up. \`flow_version\` bumped to 3.

Cosmetically, SPO-152 replaced solid cards with frosted Liquid Glass across 40+ files and rebuilt the tab bar as a floating capsule. The "main issue" survey question became **multi-select** (writes \`mainIssues\` array; keeps \`mainIssue\` = first pick for compatibility), and the screen-time slider value now saves as \`screenTimeHours\`.`,
      },
      {
        title: 'Analytics',
        md: `- New event \`commitment_text_entered\` (\`text_length\`, \`used_voice_input\`).
- \`onboarding_issue_selected\` **changed shape**: now \`issues\` (array) + \`issue_count\` + legacy \`issue\` (first selection).
- New \`step_name\` values: \`commitment_ritual\`, \`before_after\`.
- \`onboarding_surveys\` gains \`commitmentText\`, \`commitmentUsedVoice\`, \`screenTimeHours\`, \`mainIssues\`.`,
      },
      {
        title: 'Data quirks',
        md: `- **Live 2 days** — directional at best; window overlaps heavily with un-updated 4.14 users.
- Raw \`paywall_shown\` drops relative to installs because two screens now precede it — normalize by step-0 views and segment by \`flow_version\` (2 vs 3), not date.
- No 4.15 exists — numbering skip, not a lost release.
- Drop-off at \`commitment_ritual\` is a designed friction gate, not necessarily a bug.
- Issue-count charts inflate post-multi-select unless you use \`issue_count\`.`,
      },
    ],
  },
  {
    version: '4.17',
    releaseDate: '2026-04-30',
    liveUntil: '2026-05-17',
    commitCount: 11,
    headline: 'AppsFlyer attribution wired into RevenueCat (Reddit Ads) + onboarding polish — 17 days live',
    flowVersions: '3 (unchanged)',
    cohorts: 'Before/After CTA copy changed for a Pisces A/B test',
    paywall: 'unchanged; in-app premium upsell removed from excuse-validation screen',
    pricing: '$49.99/yr · $9.99/mo (unchanged)',
    sections: [
      {
        title: 'Summary',
        md: `The commercially important item: **AppsFlyer SDK** added and linked to RevenueCat (\`setAppsflyerID\` + \`collectDeviceIdentifiers\`; Firebase UID as AppsFlyer customer user ID) — from 2026-04-30, purchases can be traced to paid campaigns (built for Reddit Ads). Everything else is polish: full-bleed sky gradient on onboarding, per-screen color fixes (SPO-159), new app icons, pattern-detected screen rebuilt in glass, and a real fix for music/podcasts being interrupted on app launch.

Two small revenue/UX changes: the "Spool Premium lets you block multiple apps" upsell was deleted from the excuse-validation screen, and the Before/After CTA changed "Start Your Free Week…" → "Use Spool…" for a Pisces A/B test. Live 17 days — the best-powered dataset of the 4.14–4.17 era.`,
      },
      {
        title: 'Analytics',
        md: `- **No PostHog event changes** — event set identical to 4.16.
- **AppsFlyer attribution begins 2026-04-30**: \`af_status\` (Organic/Non-organic), \`media_source\`, \`campaign\`; RC customers now carry install-source attribution.`,
      },
      {
        title: 'Data quirks',
        md: `- 17-day window vs 6 and 2 for neighbors — compare rates, never totals.
- **Installs before 2026-04-30 have no attribution and read as organic forever** — not a channel-mix shift.
- Top App Demon fix (filtered out Spool/Apple system apps): pre-4.17 "top app" data is contaminated with "Spool"/"Messages".
- Removing the validation-screen upsell drops non-onboarding \`paywall_shown\` starting 4/30 — expected and intentional.
- If Pisces was serving CTA variants, in-app copy isn't constant across the window.`,
      },
    ],
  },
  {
    version: '4.18',
    releaseDate: '2026-05-17',
    liveUntil: '2026-07-06',
    commitCount: 15,
    headline: 'Chat onboarding (8-act Spooli conversation) + the Journey paywall — 7 weeks live',
    flowVersions: '4 (2 if commitment ritual off — doesn’t cleanly separate builds)',
    cohorts: 'no A/B — same flow for everyone',
    paywall: '`JourneyPaywallView` at 10.5 (hard, `paywall_type: "journey"`); `SkyPaywallView` still serves expired win-back',
    pricing: '$49.99/yr (yearly total shown big, per-week small — Apple compliance) · $6.99/mo fallback · $35/yr LTO',
    sections: [
      {
        title: 'Summary',
        md: `Onboarding stopped being a video and became a conversation: Welcome (0) → Name Input (0.25) → a scripted 8-act Spooli chat (0.75) that walks through pattern recognition and a mirror reframe using the user's name, rendering app grids/review cards/mechanic demos inside chat bubbles. The video intro is gone; post-paywall name collection (screen 12) is skipped since the name is captured up front.

The paywall was replaced: screen 10.5 is now **\`JourneyPaywallView\`** (~1,000 lines — Spooli badge, "Start spooling today", laurel social proof, gradient timeline, sticky glass pricing panel), hard with no skip. Per Apple feedback the yearly **total** is the big number. The bump commit itself fixed two purchase-blocking bugs found in TestFlight: plan pills untappable on iOS 26 (glassEffect stealing the gesture) and "Subscription not available" when tapping Buy before offerings loaded.

Also: Memory Mirror (LLM quotes the user's own past excuse back verbatim, server-assembled), a sycophancy filter on all user-facing LLM output, and \`smart_spooli\` finally using the user's excuse history it was previously discarding.`,
      },
      {
        title: 'Onboarding',
        md: `- Added \`welcome\` (0), \`name_input\` (0.25), \`chat_onboarding\` (0.75); removed the video intro; screen 12 skipped.
- \`flow_version\` = **4** (still 2 when commitment ritual off).
- Survey unchanged (multi-select main-issue at screen 1).`,
      },
      {
        title: 'Analytics',
        md: `- Added: \`chat_onboarding_started\`, \`chat_onboarding_act_completed\`, \`chat_onboarding_completed\`, \`display_name_entered\` (\`collected_at: "onboarding_pre_referral"\`).
- **\`paywall_purchase_completed\` \`paywall_type\` renamed in practice: \`onboarding_sky\` → \`onboarding_journey\`** at 10.5.
- Removed: \`focus_tool_recommended\` (post-excuse recommendation popup killed).
- \`onboarding_surveys\` gains \`displayName\`.`,
      },
      {
        title: 'Data quirks',
        md: `- **7-week live window** — dwarfs neighbors in absolute installs/trials/renewals; always normalize per-day or per-install.
- Two paywalls live simultaneously: \`onboarding_journey\` (onboarding) + sky (expired win-back). Filtering one type undercounts revenue.
- Dashboards filtered on \`onboarding_sky\` show onboarding purchases "collapsing" on May 17 — that's the rename, not revenue.
- Funnel step names changed at the front (\`welcome\`/\`name_input\`/\`chat_onboarding\` new, video gone) — step-index funnels misalign across May 17.
- Screen 10 (\`GlassPaywallView\`) exists but nothing navigates to it — dead code, ignore.`,
      },
    ],
  },
  {
    version: '4.20',
    releaseDate: '2026-07-06',
    liveUntil: '2026-07-07',
    commitCount: 40,
    headline: 'Quiz + attention-archetype onboarding (flow_version 5), paywall resume, 7-notification win-back, ATT',
    flowVersions: '5 (v6 was committed Jun 8 and reverted Jun 9 — **no shipped build reports 6 from this era**)',
    cohorts: 'no A/B — new flow for 100%',
    paywall: '`JourneyPaywallView` (hard) + new `DiscountOfferPaywallView` / `FreeTrialPaywallView` win-back sheets',
    pricing: '$44.99/yr regular · $34.99/yr deal (~22% off) · trials ONLY via side doors (`default` offering, not the live `default_wo_free_trial`)',
    sections: [
      {
        title: 'Summary',
        md: `Seven weeks of work released at once (there is no 4.19 — confirmed). Onboarding was rebuilt twice: name input dropped; a Brainrot-style intro arc (\`meet_spooli\` → \`thread_unravel\` → slider → notification swarm); the multi-select issue question replaced by a **5-question single-select quiz** (goal / screen-time effect / profession / when you scroll / tried before) feeding an \`AttentionArchetype\` engine that assigns one of six identities (The Night Spiraler, The Morning Doomscroller, The All-Day Drifter, The Numbed Scroller, The Anxious Refresher, The Restless Seeker) revealed after a breathing exercise. Commitment ritual split into typed-reason (9.5) + 5-second hold (9.6).

Monetization mechanics: **onboarding resumes at the paywall** — abandoners land straight on \`JourneyPaywallView\` next launch; purchasers who quit resume at setup. Notification permission moved up front (new screen 4.85 \`notification_priming\`) specifically so a **7-notification win-back sequence** can re-engage paywall abandoners: day 1 discount → \`DiscountOfferPaywallView\`, day 2 free trial → \`FreeTrialPaywallView\`, days 3–7 one real 5-star review per day. Plus a secret free-trial sheet behind a triple-tap on the paywall mascot.

Two flags: the headline "Reels-Free Instagram" feature is **debug-only** (never visible in App Store builds), and **App Tracking Transparency finally works** — previously the ATT prompt never showed, every install stalled 60s and sent no IDFA (Meta = SKAN-only). Fixed Jul 6 → Meta attribution data is not comparable across that boundary.`,
      },
      {
        title: 'Onboarding',
        md: `- Added: \`meet_spooli\` (0.1), \`thread_unravel\` (0.2), \`see_for_yourself\` (0.3), \`modern_apps\` (0.4), quiz screens \`goal\`/\`screen_time_affect\`/\`profession\`/\`when_rot\`/\`tried_before\` (1.25–1.45), \`notification_priming\` (4.85), \`grounding_breath\` (5.2), \`archetype_reveal\` (5.4), \`top_app_demon\` (5.6), \`commitment_hold\` (9.6).
- Removed: \`name_input\`, \`checkbox_selection\`. Renamed: \`commitment_ritual\` → \`commitment_reason\`.
- \`flow_version\` = **5**. Survey fields: \`goal\`, \`screenTimeAffect\`, \`profession\`, \`whenRot\`, \`triedBefore\` + archetype fields (\`archetypeId\`, \`archetypeName\`, \`stimulationExposure\`, \`daytimeVulnerability\`).
- Resume guards prevent duplicate accounts on purchased-resume.`,
      },
      {
        title: 'Paywall & revenue',
        md: `- Paywall re-entry restructures when purchases happen — can occur days after install with no onboarding screens between.
- \`DiscountOfferPaywallView\`: "{percent}% OFF", buys \`limited_offer\` package ($44.99 → $34.99 fallback, ~22%).
- \`FreeTrialPaywallView\`: "7 DAYS FREE, then {annual}/yr" — buys \`offerings.all["default"]\` annual (carries the trial).
- **Load-bearing RevenueCat fact: the current offering is \`default_wo_free_trial\`** — the main paywall sells no-trial plans; trials only via win-back trial, the trial sheet, or the secret triple-tap sheet.
- "Have an account? Sign in" link added to the Journey paywall (un-traps existing users).
- Win-back arms only if notifications authorized + not completed + not purchased; re-viewing the paywall resets timers.`,
      },
      {
        title: 'Analytics',
        md: `- Added: \`onboarding_quiz_answered\` \`{question, answer}\`, \`archetype_revealed\`, \`notification_permission_response\` (4.85), \`winback_notifications_scheduled\`, \`winback_notification_tapped\` \`{offer}\`, \`winback_deal_offer_shown/dismissed/purchase_tapped\`, \`winback_free_trial_offer_shown/dismissed/purchase_tapped\`, \`free_trial_sheet_shown\`, \`free_trial_purchase_tapped\`, \`paywall_sign_in_tapped\`, \`commitment_completed\`.
- New \`paywall_purchase_completed\` \`paywall_type\` values: \`winback_deal\`, \`winback_free_trial\`; \`plan: "free_trial"\`.
- Removed: \`onboarding_issue_selected\`, \`display_name_entered\`.
- Per-excuse \`durationMinutes\` now written to Firestore.`,
      },
      {
        title: 'Data quirks',
        md: `- **Live 1 day.** Win-back notifications fire at +24h/+48h/days 3–7 — essentially none fired to 4.20 users; \`winback_*\` revenue attribution lands on 4.21.
- \`paywall_shown\` inflates vs unique users (returning abandoners re-hit 10.5 every launch); the onboarding→paywall denominator changes shape.
- Nine screens added / two removed / one renamed — step funnels break across Jul 6; the web dashboard initially rendered \`notification_priming\` as unknown.
- \`flow_version: 6\` from this era = TestFlight/dev builds from the one-day Jun 8–9 window only.
- The bump commit's headline feature (Reels-Free IG) never shipped to App Store users — don't over-attribute.
- **ATT discontinuity Jul 6**: Meta/AppsFlyer install + CAC numbers not comparable across it.
- Low trial volume is by design (no-trial default offering), not a bug.
- Blocked-apps-wipe bug (apps silently vanishing from Rules) was live for TestFlight users Jun 9–19 — engagement dips there may be product damage.`,
      },
    ],
  },
  {
    version: '4.21',
    releaseDate: '2026-07-07',
    liveUntil: null,
    commitCount: 52,
    headline: 'FocusWeb ships, then two weeks of funnel rebuilding under one version number',
    flowVersions: '5 at release → **6 in the deployed build** (`instagram_demo_v6`, cut from uncommitted state) → 8/9 in repo (Jul 20/21) → 10 (unreleased). 6≡9 identical flows.',
    cohorts: '`instagram_demo_v6` (deployed, dominant) · `personal_plan_reveal_v9` (repo HEAD) · `legacy_resume_pre_demo_v5` (resumers) · `focus_web_apps_v8` (~1 day) · `post_purchase_journey_v10` (unreleased)',
    paywall: '`JourneyPaywallView` (hard); **Monthly → Weekly swap Jul 17**; win-back sheets unchanged',
    pricing: '$4.99/wk + annual (`default_wo_free_trial` — no trial on the main paywall) · $34.99/yr win-back deal',
    sections: [
      {
        title: 'Summary',
        md: `4.21 shipped Jul 7 with **FocusWeb**: the Reels-free Instagram hack became a full distraction-free in-app browser hub — launcher grid, per-app toggles (Block Reels / Explore / Stories / Shorts / DMs, Following-only feed), Instagram + YouTube at launch, X added later (partial — For-You suppression was attempted four ways and removed as non-working). On Jul 10 FocusWeb was promoted to a top-level **Focus tab**, displacing Reflect (now a button on Stats). A FaceTime-style **Mirror intervention** (shows users their own face before granting access) shipped Jul 15; a Blackjack mini-game was added and deleted the same day — never shipped.

Then 46 more commits landed under the same version number. The commercially critical ones: **Jul 17 — the onboarding paywall's Monthly plan replaced with Weekly** ($4.99/wk fallback, yearly stays default). **Jul 18 — purchase analytics rebuilt from scratch (SPO-219)**: one canonical \`paywall_purchase_completed\` deduped by transaction ID (13 duplicate call sites deleted), new failure/restore events, an \`access_source\` classifier (paid/trial/promotional/sandbox/dev_bypass/free_code), and a deployed Firebase function turning **RevenueCat webhooks into idempotent \`rc_*\` PostHog events** (renewals, cancels, billing issues, refunds — server-side truth PostHog never had). Same day, SPO-222 instrumented previously-silent surfaces (Focus Web funnel, Screen Time grant/deny, rule edits, support taps) and enabled PostHog surveys.

Jul 20–22: the biggest onboarding rewrite of the era — three new early screens including an interactive **synthetic Instagram demo** (pixel-faithful fake IG with a real scrollable feed; user toggles Block Reels and watches reels disappear, before any paywall), a pre-paywall **Personalized Plan** reveal (local-only, no AI), an expanded archetype reveal, and \`onboarding_completed\` redefined to fire only after blocking is *verifiably* active. \`flow_version\` jumped 5 → 8 → 9 here (10 on origin/main, unreleased).`,
      },
      {
        title: 'Builds within 4.21',
        md: `The repo does not record build numbers (\`CURRENT_PROJECT_VERSION\` never changed), so boundaries are inferred from merge dates:
- **Jul 7** — original 4.21: FocusWeb hub (IG + YouTube). Almost certainly the App Store 4.21.
- **Jul 11** — X app added; IG Following-only mode; Focus tab replaces Reflect.
- **Jul 15** (two merges) — X For-You removal; Mirror intervention (Blackjack in-and-out same day).
- **Jul 16** — Screen Time denial recovery (SPO-211), faster FocusWeb bar (SPO-212).
- **Jul 17** — **Monthly → Weekly paywall swap** (highest-leverage revenue change in the window).
- **Jul 18** — Help & Support overhaul; SPO-219 purchase analytics + RevenueCat→PostHog bridge; SPO-222 instrumentation + surveys.
- **Jul 20–22** — flow v8/v9 onboarding (synthetic IG demo, Personalized Plan, "Best Value" yearly badge, yearly pill moved left). Likely TestFlight-only at time of mining.
- **Jul 24 (origin/main, unreleased)** — post-purchase onboarding journey, flow_version 10 / \`post_purchase_journey_v10\`.
- An uncommitted \`MARKETING_VERSION → 4.24\` edit exists locally, so the App Store may show 4.22–4.24 for content git labels 4.21.`,
      },
      {
        title: 'Onboarding',
        md: `- New screens (Jul 20–22): \`focus_web_intro\` (0.425), \`instagram_reels_demo\` (0.45 — guided browse → toggle Block Reels → apply, state machine tracks \`toggleCount\`/\`scrollCount\`), \`focus_web_apps\` (0.475), \`personalized_plan\` (9.85).
- Archetype reveal (5.4) heavily expanded (plain-language interpretations, new metric rows); \`grounding_breath\` (5.2) dropped from the flow order.
- **flow_version/cohort truth:** the deployed App Store build stamps **6 / \`instagram_demo_v6\`** (cut from uncommitted local state — git itself never emits 6); repo history goes 5 → 8 (\`focus_web_apps_v8\`, Jul 20, ~1 day) → 9 (\`personal_plan_reveal_v9\`, Jul 21, HEAD) → 10 (\`post_purchase_journey_v10\`, unreleased). 6 and 9 are identical flows. Resumers get 5 / \`legacy_resume_pre_demo_v5\`. Assignment persisted per attempt (\`spool_onboarding_attempt_id\` etc. in UserDefaults).
- \`onboarding_sessions\`/\`onboarding_surveys\` docs now stamped with \`onboarding_attempt_id\`, \`flow_version\`, \`flow_cohort\`.
- Screen Time denial no longer dead-ends onboarding (screen 4.75 offers re-try / Open Settings).`,
      },
      {
        title: 'Paywall & revenue',
        md: `- **Monthly → Weekly (Jul 17)**: \`JourneyPaywallView\` left pill now Weekly ($4.99 fallback, RevenueCat \`.weekly\` package); yearly stays default, badge later changed "Popular" → "Best Value" and moved left.
- RevenueCat config: current offering \`default_wo_free_trial\` serving \`$rc_weekly\` + \`$rc_annual\` (\`YearNoFreeTrial\`) — **no trial on the main paywall**; \`limited_offer\` and trial-bearing \`default\` offerings exist for win-back/side doors.
- Known config risk: in the Xcode debug catalog the annual package failed to resolve — if Yearly conversions look impossibly low on some builds, that's a candidate cause.
- Promotional grants (cancellation-flow saves) now tagged \`access_source: "promotional"\` client- and server-side so they can be excluded from conversion math.
- Win-back funnel completed: \`scheduled → (suppressed | tapped{source}) → offer_shown → purchase_tapped → completed\`; purchases cancel remaining review nudges.`,
      },
      {
        title: 'Analytics',
        md: `- **Canonical purchase events (Jul 18)**: \`paywall_purchase_completed\` emitted from exactly one place, deduped by StoreKit transaction ID, with \`period\`, \`access_source\`, \`product_id\`, \`price_amount\`, \`currency\`, \`transaction_id\`. New \`paywall_purchase_failed\` (previously invisible) and \`purchase_restored\` (replaces \`subscription_restored\`). \`subscription_status_changed\` transition-gated; \`subscription_expired\` one-shot.
- **Super properties on every event (from Jul 18)**: \`environment\` (debug/testFlight/appStore), \`app_build\`, \`flow_version\`.
- **\`rc_*\` webhook bridge (from ~Jul 18)**: \`rc_initial_purchase\`, \`rc_renewal\`, \`rc_cancellation\`, \`rc_expiration\`, \`rc_billing_issue\`, \`rc_refund\`, etc. — idempotent, server-side, joined via \`$posthogUserId\`/\`firebase_uid\`.
- **SPO-222**: \`focus_hub_opened\`, \`focus_web_app_opened\`, \`focus_web_page_loaded\`, \`focus_web_load_failed\`, \`focus_web_session_ended\`, \`focus_web_setting_changed\`, \`screen_time_authorization_result\` (\`granted\`, \`context\`, \`after_denial\`), \`app_rule_added/removed\`, \`blocking_schedule_changed\`, \`strict_mode_toggled\`, \`support_contact_tapped\`.
- **PR #114**: \`focus_web_onboarding_demo_viewed/interacted/completed\` (\`reels_blocked\`, \`toggle_count\`), \`onboarding_rule_activation_started/succeeded/failed\`, and \`onboarding_completed\` redefined (fires only after verified blocking activation, carries cohort fields).
- Win-back: \`winback_notification_suppressed\` (new), \`winback_notification_tapped\` gains \`source\`, \`winback_notifications_cancelled\`.
- **Known unmerged fix**: five paywall flows (journey/sky limited-offer + free-trial, winback deal/trial) emit completed/cancelled with **no matching \`paywall_purchase_tapped\`** in all shipped 4.21 builds — cancel-rate math is invalid for those types until the Jul 23 fix branch merges.`,
      },
      {
        title: 'Data quirks',
        md: `- **\`app_version = 4.21\` is not one product** — at least 8 builds with materially different onboarding, paywall, and analytics. Always segment by date and/or \`app_build\` (property exists only from Jul 18).
- **\`paywall_purchase_completed\` changes meaning Jul 18** (13 emit sites → 1, deduped): a volume drop is deduplication, not lost revenue. Same date: \`subscription_status_changed\`/\`subscription_expired\` volume collapses (gating), \`subscription_restored\` flatlines (renamed).
- **\`onboarding_completed\` changes meaning Jul 20** (now requires verified activation) — completion rate looks worse while measuring something stricter.
- \`plan\` flips \`"monthly"\` → \`"weekly"\` on Jul 17; \`"monthly"\` after that = stale client.
- \`rc_*\` events have no history before ~Jul 18 and no backfill; they may attach to a different PostHog person than client events for pre-bridge purchasers.
- **Before quoting conversion: filter \`access_source\` to paid/trial and \`environment\` to appStore** — sandbox/dev/promo/free-code and TestFlight traffic land in the same project.
- The synthetic-IG-demo + personalized-plan onboarding reached real users via the deployed \`flow_version: 6\` build (~mid-to-late Jul); confirm exact first-seen dates in PostHog before attributing conversion changes to it.
- Blackjack never shipped; X FocusWeb is functionally incomplete (low engagement expected).`,
      },
    ],
  },
  {
    version: '4.27',
    releaseDate: '2026-08-05',
    releaseStatus: 'development',
    liveUntil: null,
    commitCount: 47,
    headline: 'Development snapshot: exercise unlocks, Snapchat, clearer blocking state, and retention repairs',
    flowVersions: '10 / `post_purchase_journey_v10` for new attempts · 5 / `legacy_resume_pre_demo_v5` for resumed attempts',
    cohorts: '`post_purchase_journey_v10` (new attempts) · `legacy_resume_pre_demo_v5` (resumers)',
    paywall: '`JourneyPaywallView` (hard, unchanged); new Apple promotional free-week save offer for eligible weekly/monthly cancellers',
    pricing: '$4.99/wk + annual (`default_wo_free_trial`) · storefront price now read from live product metadata · eligible churn save = 1 free week at next renewal',
    sections: [
      {
        title: 'Summary',
        md: `This is a **development snapshot, not a confirmed App Store release**. It covers 47 commits after the Jul 24 boundary documented in 4.21 and uses the local user-owned \`MARKETING_VERSION = 4.27\` label.

The product gained two camera-based intervention styles: **Push-Ups and Squats**, each granting one minute per completed rep. The in-Spool app hub added **Snapchat** alongside Instagram, YouTube, and X, with controls that preserve chat/camera while hiding Spotlight and Stories. Public language now calls this surface **Apps** and explains that the cleaner experience happens inside Spool while regular installed apps remain unchanged; internal \`FocusWeb\` types, storage keys, and analytics event names stay stable.

Home now exposes a truthful blocking-status badge (on now, starts later, or off) with timing and selected-app count. Rules preserves the existing layout but gives Bedtime, Work Focus, 9–5, and All day explicit emoji and persisted selected states. Home Thread now defaults to the approved unlock-request ledger promised by onboarding; Settings offers the older observed-Screen-Time visualization as an explicit display-only option without changing unlock eligibility.`,
      },
      {
        title: 'Onboarding',
        md: `- New attempts use **flow_version 10 / \`post_purchase_journey_v10\`**; resumed attempts remain isolated in 5 / \`legacy_resume_pre_demo_v5\`.
- The post-purchase journey keeps continuous progress through the current product story: Thread depletion, daily request pool, the real blocked-app request flow, and the cleaner Apps alternative.
- Apps onboarding now names Instagram, YouTube, X, and Snapchat and explicitly says the experience opens inside Spool; regular apps are unchanged.
- “How did you hear about Spool?” choices shuffle once per screen presentation to reduce first-row acquisition bias. Selection now persists the stable source value (Instagram, TikTok, Reddit, Friend, or Other), not the displayed row index.
- Blocking completion remains success-gated: \`onboarding_completed\` fires only after rule activation succeeds, not merely after the final screen appears.`,
      },
      {
        title: 'Product, paywall & revenue',
        md: `- **Push-Ups + Squats:** optional camera interventions alternate with Mirror Mode when multiple styles are enabled. One verified rep earns one minute; abandoning an attempt does not grant a walk-away reward.
- **Snapchat in Apps:** chat and camera remain available; Spotlight and Stories can be hidden. Snapchat has its own persisted web profile and recovery/navigation handling.
- **Blocking clarity:** Home and Rules now derive status from the same master enablement, enabled days, authorization, selected targets, monitoring result, and overnight-window semantics used by enforcement.
- **Cancellation save:** an active eligible weekly/monthly subscriber whose \`willRenew\` turns false can receive a real Apple promotional offer for one free week at the next renewal. Yearly plans intentionally do not receive this offer. Redemption is verified against StoreKit renewal data before success is claimed.
- Subscription duration and price labels now come from RevenueCat/StoreKit product metadata rather than copied prices or product-ID naming conventions. Expiration analytics preserve the outgoing product identity before state clears.`,
      },
      {
        title: 'Analytics & backend',
        md: `- New cancellation sequence: \`subscription_set_to_cancel\` → \`churn_winback_scheduled\` → \`churn_save_offer_shown\` → \`churn_save_offer_redeemed\` (with verified renewal evidence). Offer action, unavailable, and unverified paths are separate.
- RevenueCat webhook identity handling now prefers authoritative non-anonymous identity, aliases only safe anonymous IDs into an already identified Firebase user, keeps unrelated anonymous customers distinct, and drops events with no usable identity instead of collapsing them onto \`unknown\`.
- RevenueCat alias and lifecycle events use deterministic retry-safe IDs/timestamps; obsolete client \`$posthogUserId\` writes were removed.
- Referral-source randomization does **not** change stored values: PostHog, Firestore, and UserDefaults still receive the exact semantic source.
- Public **Apps** naming is a copy/clarity change only. Continue querying the existing \`focus_*\` / \`focus_web_*\` events across 4.21 and 4.27.`,
      },
      {
        title: 'Data quirks',
        md: `- **Do not include 4.27 in production cohorts until \`app_version = 4.27\` is observed in App Store/TestFlight data.** The date above is the code-snapshot date, not a verified store release date.
- The Thread number on Home changes source by default: 4.27 uses approved requested minutes, while older builds used observed blocked-app Screen Time. The optional Settings switch restores the old display only; unlock enforcement never changes. Segment before comparing Thread percentages across versions.
- Churn-save users are a rescue cohort, not ordinary paid conversion. The free week applies only to eligible weekly/monthly cancellers and begins at the next billing event; yearly and already-promotional access are excluded.
- Push-Up/Squat availability and completion depend on camera permission plus on-device pose detection. Do not interpret low use as rejection without separating permission denial, setup failure, abandonment, and completed sessions.
- \`flow_version 10\` persists per onboarding attempt. Late resumed attempts can legitimately emit version 5 even inside a 4.27 build.
- The public tab name changed from Focus/FocusWeb to Apps, but internal identifiers were deliberately preserved for continuity; a drop in old event names would indicate instrumentation breakage, not the rename itself.`,
      },
    ],
  },
];

export const RELEASES = [...ENTRIES].sort((a, b) =>
  a.releaseDate < b.releaseDate ? 1 : -1
);

// ---------------------------------------------------------------------------
// Markdown builders (used for clipboard payloads)
// ---------------------------------------------------------------------------

export function mappingTableMarkdown() {
  const header =
    '| App version | Released | Live until | flow_version(s) | Cohort(s) | Paywall | Pricing |\n' +
    '|---|---|---|---|---|---|---|';
  const rows = [...RELEASES]
    .reverse()
    .map(r => {
      const released = r.releaseStatus === 'development'
        ? `${r.releaseDate} (development snapshot)`
        : r.releaseDate;
      const liveUntil = r.releaseStatus === 'development'
        ? 'unreleased'
        : (r.liveUntil || 'current');
      return `| ${r.version} | ${released} | ${liveUntil} | ${r.flowVersions || '—'} | ${r.cohorts || '—'} | ${r.paywall || '—'} | ${r.pricing || '—'} |`;
    });
  return `### Version mapping table\n${header}\n${rows.join('\n')}`;
}

export function releaseMarkdown(r) {
  const releaseLine = r.releaseStatus === 'development'
    ? `- Development snapshot: ${r.releaseDate} · Not confirmed live · ${r.commitCount} commits`
    : `- Released: ${r.releaseDate} · Live until: ${r.liveUntil || 'current'} · ${r.commitCount} commits`;
  const lines = [
    `## Version ${r.version} — ${r.headline}`,
    releaseLine,
  ];
  if (r.flowVersions) lines.push(`- Onboarding flow_version(s): ${r.flowVersions}${r.cohorts ? ` · Cohorts: ${r.cohorts}` : ''}`);
  if (r.paywall) lines.push(`- Paywall: ${r.paywall}${r.pricing ? ` · Pricing: ${r.pricing}` : ''}`);
  for (const s of r.sections) {
    lines.push(`\n### ${s.title}\n${s.md.trim()}`);
  }
  return lines.join('\n');
}

// releases: array of release objects, any order; copied oldest-first so the
// pasted context reads chronologically.
export function buildCopyText(releases, { includePreamble = true } = {}) {
  const chronological = [...releases].sort(
    (a, b) => (a.releaseDate < b.releaseDate ? -1 : 1)
  );
  const parts = [];
  if (includePreamble) {
    parts.push(
      CLAUDE_PREAMBLE.trim(),
      mappingTableMarkdown(),
      MAPPING_NOTES_MD.trim(),
      DATA_QUIRKS_MD.trim()
    );
    parts.push('---\n# Release notes' + (chronological.length > 1 ? ' (chronological)' : ''));
  }
  parts.push(...chronological.map(releaseMarkdown));
  return parts.join('\n\n');
}

// Rough token estimate for a copy payload (chars / 4 heuristic).
export function estimateTokens(text) {
  return Math.round(text.length / 4);
}
