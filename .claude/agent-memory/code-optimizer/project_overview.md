---
name: Project overview
description: Tech stack, routing, and key constraints for the cyberheroes React app
type: project
---

Cyberheroes is a React (CRA) educational app teaching cybersecurity to 3rd/4th graders. Built by a UW Informatics capstone team.

- Entry point: `cyberheroes/src/index.js` — uses **HashRouter only** (BrowserRouter import was dead and removed)
- No automated tests — all validation must be done via `npm run build` (exits 0 = safe)
- Build command: `cd /Users/virurepalle/Code/cyberheroes/cyberheroes && npm run build`
- Hosted at `/cyberheroes/` path (set in package.json homepage)
- Quiz components under `src/components/quizzes/`, lessons under `src/components/lessons/`
- `TextReader.js` is a `forwardRef` component with speech synthesis; exposes `stopReading` via imperative handle

**Why:** No test suite means every change must be conservative and build-verified before commit.
**How to apply:** Always run `npm run build` before committing. Never batch unrelated changes.
