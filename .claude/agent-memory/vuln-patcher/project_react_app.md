---
name: cyberheroes React app — project context for vuln patching
description: Key facts about the CRA/react-scripts 5.0.1 app that affect vulnerability remediation strategy
type: project
---

The React app lives at `/Users/virurepalle/Code/cyberheroes/cyberheroes` (package.json is there, not in repo root).

**Why:** The subdirectory structure means all npm commands must be run with `cd /Users/virurepalle/Code/cyberheroes/cyberheroes` first.

**How to apply:** Always cd to the cyberheroes subdirectory before running npm commands; do not run from the repo root.

react-scripts is pinned at 5.0.1. All 26 remaining vulnerabilities (as of 2026-04-09) are transitive within react-scripts' dependency tree. Fixing them requires either --force (breaks build) or migrating off CRA to Vite. Do not attempt either without explicit user instruction.

react-router-dom was missing from package.json entirely (imported in src/ but not declared). It was added at ^6.30.3 in the 2026-04-09 patching session. The build was broken before that session — this was a pre-existing issue, not caused by the patching work.

The deploy target is GitHub Pages via `gh-pages -d build`. The `homepage` field in package.json is set to `https://virurep.github.io/cyberheroes/`.
