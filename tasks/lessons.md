# Project Lessons

- When the user asks to stop an authentication or deployment flow, terminate it immediately and do not restart or keep polling. If deployment credentials are unavailable, pause and let the user choose the next action.
- For Vercel production releases, push a fresh commit SHA to `main` before any feature branch. If Vercel has already registered that SHA as a Preview, a later `main` push may not promote it to Production.
- When handing off AppsFlyer attribution, clearly distinguish the raw OneLinks from the public `/get?src=` wrapper URLs. Creators and ManyChat use the wrapper URLs; the site uses the mapped OneLinks for attribution and opens the raw Spool App Store listing.
- Public `/get?src=` links must never send visitors to the Spool homepage. Every platform, including desktop tests, must continue toward the App Store listing; only the handoff mechanism varies by browser.
