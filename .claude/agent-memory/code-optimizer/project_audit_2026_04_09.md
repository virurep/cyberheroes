---
name: Audit pass 2026-04-09
description: Repo-auditor batch of changes applied on 2026-04-09 — what was done and remaining issues
type: project
---

Committed as: `59b2f6d` — "chore: apply repo-auditor fixes"

## Changes applied

**Console.log removal:**
- `Privacy-Moon-Quiz.js` line 18: removed `console.log("location: ", location)`
- `Privacy-Moon-Quiz-Answers.js` line 37: removed `console.log("last question...")`
- `Privacy-Planet-Quiz-Answers.js` line 32: removed `console.log("last question...")`

**Dead imports/variables removed:**
- `index.js`: removed unused `BrowserRouter` import
- `AboutUs.js`: removed `useNavigate` import and `const navigate = useNavigate()`
- `Privacy-Moon-Quiz.js`: removed `useParams` import (was already commented out at call site)
- `RedFlag-GreenFlag-Quiz.js`: removed `useParams` import and `const { part } = useParams()`
- `Buttons.js`: removed dead `handleInputChange`, `handleInputKeyPress` functions, `useState` import, `inputValue` state, and the NOT-IN-USE `<input>` element

**Anti-patterns fixed:**
- `Characters.js`: added `key={character.name}` to both branches of `.map()`
- `Privacy-Planet-Quiz-Answers.js`: replaced `!=` with `!==` and `==` with `===`
- `TextReader.js`: added `[lastReadableText]` dependency array to bare `useEffect`

**Accessibility fixes:**
- `ExplorationMap.js`: added `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space) to planet and moon divs
- `Arrival.js`: added `role="button"`, `tabIndex={0}`, `onKeyDown` to `.arrival-hero` div
- `Characters.js`: added `role="button"`, `tabIndex={0}`, `onKeyDown` to clickable character `<img>` (arrow branch)
- `RedFlag-GreenFlag-Quiz.js`: added `role="button"`, `tabIndex={0}`, `onKeyDown` to red and green flag images
- `ReviewLesson.js`: added `aria-label="Next page"` and `aria-label="Previous page"` to empty self-closing buttons

**Rename:**
- `Patrick_leaving.js`: renamed internal component `IntroPage` → `PatrickLeaving` (export name). App.js already imported it as `PatrickLeaving` so no change needed there.

## Remaining issues NOT yet fixed (pre-existing warnings)
See `project_preexisting_warnings.md` for the full list. Notable remaining items in scope for future passes:
- `Privacy-Planet-Quiz.js`: still has unused `useParams` import
- `RedFlag-GreenFlag-Quiz.js`: still has unused `Al` import
- `Arrival.js`: still has unused `useEffect` import
- `TextReader.js`: still has `currentWordIndex` unused state, `no-cond-assign`, `no-loop-func` (these are riskier to touch)
