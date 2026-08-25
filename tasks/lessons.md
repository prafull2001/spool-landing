# Project Lessons

- A persisted onboarding assignment survives app updates and resume handoffs; describe `legacy_resume_pre_demo_v5` only as the fallback for a resume with no valid stored assignment, not as the identity of every resumer.
- An analytics cohort picker must include and default to the current live flow; keep unreleased cohorts available for validation without making an empty future cohort the operational default.
- Legacy A/B controls, charts, labels, and membership must be limited to sessions with an eligible assignment inside the cohort and date window that were actually randomized; late-only ranges, fallback traffic, and missing assignments stay unassigned.
- Derive experiment windows from the commits that introduce and remove the randomizer, not from the later flow-version or App Store release boundary.
- A device identifier is not a unique account key; only expose account PII through a device fallback when exactly one user document matches it and the session has no explicit UID.
- When a horizontally scrollable selector defaults to an item outside the initial viewport, overflow alone is not enough; reveal the active item on mount and on selection changes without scrolling the page vertically.
- When asked to update the Release tab from iOS Git diffs, use `src/data/releaseNotes.js` in the landing repository; do not infer App Store Connect or start an authentication flow unless the user explicitly asks for store metadata.
- When the user asks to stop an authentication or deployment flow, terminate it immediately and do not restart or keep polling. If deployment credentials are unavailable, pause and let the user choose the next action.
- For Vercel production releases, push a fresh commit SHA to `main` before any feature branch. If Vercel has already registered that SHA as a Preview, a later `main` push may not promote it to Production.
- When handing off AppsFlyer attribution, clearly distinguish the raw OneLinks from the public `/get?src=` wrapper URLs. Creators and ManyChat use the wrapper URLs; the site uses the mapped OneLinks for attribution and opens the raw Spool App Store listing.
- Public `/get?src=` links must never send visitors to the Spool homepage. Every platform, including desktop tests, must continue toward the App Store listing; only the handoff mechanism varies by browser.
