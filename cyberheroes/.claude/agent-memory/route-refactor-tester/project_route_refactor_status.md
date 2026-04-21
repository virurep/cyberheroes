---
name: Route refactor Phase 1 status
description: Phase 1 route cleanup completed but multiple regressions identified — missing quiz files, broken quiz routing, state loss in navigation
type: project
---

Phase 1 route cleanup completed on 2026-04-10. All `data/quizzes/` and `data/lessons/` direct imports eliminated from `src/components/`. Components now use `src/content/loader.js` for all planet, lesson, vocab, quiz, and transition data.

**Why:** Moving toward a fully data-driven routing and content architecture where adding a new planet only requires adding JSON files under `src/data/planets/`, with no component changes needed.

**How to apply:**
- `transition_cert.json` and `review.json` are NOT yet migrated to per-planet schema -- they still import from `data/_archive/`. These are the next migration targets.
- `ExplorationMap.js` still has a hardcoded planet list -- future work to make it loader-driven.
- CSS class names like `privacy-planet-quiz-background` remain hardcoded -- acceptable for now, but will need a dynamic approach when more planets are added.

**Active regressions identified 2026-04-10 (see /BUGS_DIAGNOSIS.md):**
- `sharing-online-quiz-2.json` and `sharing-online-quiz-3.json` never created during migration -- privacy-moon quiz parts 2 and 3 are broken
- `QuizRouter` dispatches multi-type parts to `PrivacyMoonQuizRoute` which is hardcoded for privacy-moon's flow, breaking privacy-planet quiz-1
- `PrivacyMoonQuizRoute` does not forward `part` state on redirect -- quiz-2/3 load wrong data
- `game-answers.js` does not forward `part` state to next question -- affects quiz flow
- Route param names inconsistent: lesson routes use `:planet`, quiz routes use `:planetSlug`
