---
name: Cyberheroes Project Overview
description: Architecture, patterns, and known issues for the cyberheroes React CRA app
type: project
---

App lives at /Users/virurepalle/Code/cyberheroes/cyberheroes (subfolder). CRA project, React 19, Bootstrap 5 (imported but never used in source), deployed via gh-pages to GitHub Pages, uses HashRouter.

**Why:** Capstone project for UW Informatics students — educational cybersecurity platform for 3rd/4th graders.

**How to apply:** Keep recommendations child-friendly and appropriate for a student project context. Bootstrap is entirely unused — it's a bundle-size quick win. react-scripts 5.x is the primary vuln surface; upgrading requires a CRA replacement (Vite migration is the recommended path).

Key structural facts:
- All lesson/quiz content is driven from JSON data files in src/data/
- Characters are loaded dynamically via require.context from src/img/characters/
- App uses HashRouter (for GitHub Pages compatibility — do not suggest BrowserRouter)
- BrowserRouter is imported in index.js but unused (dead import)
- reportWebVitals.js is an empty file; web-vitals package is in dependencies but never called
- bootstrap package is in dependencies but zero imports in any source file
- `logo 3.o.png`, `password-planet.png`, and `0-letter.png` appear to be orphaned assets (no import found in source)
- privacy-enemy.png has no direct import (loaded via require.context in Characters.js using character name from JSON data)

Known recurring anti-patterns:
- index-as-key pattern: TableOfContents.js:76, Privacy-Planet-Quiz.js:109
- Missing key props in Characters.js map (no key= on returned elements)
- Unused imports: Privacy-Moon-Quiz.js imports useParams but has it commented out; AboutUs.js imports useNavigate but never calls navigate(); RedFlag-GreenFlag-Quiz.js destructures `part` from useParams but never uses it
- useEffect at TextReader.js:36 runs on every render (no dependency array) — intentional poll pattern but causes unnecessary re-runs
- console.log left in production code: Privacy-Moon-Quiz.js:18, Privacy-Moon-Quiz-Answers.js:37, Privacy-Planet-Quiz-Answers.js:32
- Non-strict equality (==, !=) used in Privacy-Planet-Quiz-Answers.js
- Deprecated onKeyPress used in Buttons.js:38
- All About Us team member photos use img onClick with window.open but no role="button" or tabIndex

Accessibility hotspots:
- AboutUs.js: 6 img elements with onClick handlers (LinkedIn links) lack role="button" and tabIndex="0"
- ExplorationMap.js: planet/moon divs with onClick lack role="button" and keyboard support
- Arrival.js: arrival-hero div with onClick lacks role/tabIndex
- Buttons.js: hidden input (not in use) has no label
- RedFlag-GreenFlag-Quiz.js: img flags with onClick lack role="button"
- Characters.js: clickable character img lacks role="button"
- TableOfContents.js: toc-header div with onClick lacks role="button"
- ReviewMenu.js: Back to Quiz span with onClick lacks role/tabIndex

Large assets (near or above 200KB):
- rocket.png: 252KB — largest single asset
- enemy.png: 224KB
- patrick.png: 184KB (near threshold)
- privacy-enemy.png: 176KB (near threshold)
