# Project Lessons

- When the user asks to stop an authentication or deployment flow, terminate it immediately and do not restart or keep polling. If deployment credentials are unavailable, pause and let the user choose the next action.
- For Vercel production releases, push a fresh commit SHA to `main` before any feature branch. If Vercel has already registered that SHA as a Preview, a later `main` push may not promote it to Production.
