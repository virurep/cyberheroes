---
name: Pre-existing build warnings
description: ESLint warnings that existed before the 2026-04-09 audit pass — not introduced by us
type: project
---

These warnings appear on every build and are NOT regressions from our changes:

- `src/components/intro.js` line 3: `logo` defined but never used
- `src/components/lessons/Arrival.js` line 1: `useEffect` defined but never used
- `src/components/lessons/Lesson.js` line 12: `backgroundImages` assigned but never used
- `src/components/quizzes/Drag-Drop-Quiz.js` line 15: `selectedBox` assigned but never used
- `src/components/quizzes/Privacy-Planet-Quiz.js` line 4: `useParams` defined but never used
- `src/components/quizzes/RedFlag-GreenFlag-Quiz.js` line 5: `Al` defined but never used
- `src/components/util/TextReader.js` line 14: `currentWordIndex` assigned but never used
- `src/components/util/TextReader.js` line 83: `no-cond-assign` warning (assignment in while condition)
- `src/components/util/TextReader.js` line 89: `no-loop-func` warning (function in loop)

**Why:** Documenting these so future build runs can distinguish new warnings from pre-existing ones.
**How to apply:** If `npm run build` shows only these warnings, the build is clean.
