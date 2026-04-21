---
name: Quiz route dynamic refactor
description: Refactored all hardcoded privacy-planet/privacy-moon quiz routes to use :planetSlug param; QuizRouter dispatches to correct quiz component
type: project
---

All hardcoded quiz routes in App.js were replaced with dynamic `:planetSlug` parameter routes. A `QuizRouter` component dispatches `/:planetSlug/quiz` to either `PrivacyPlanetQuiz` or `PrivacyMoonQuizRoute` based on the slug value.

**Why:** To make routing scalable so new planets don't require hardcoded route additions in App.js.

**How to apply:** When adding new planet quiz types, add an entry to the `QUIZ_COMPONENTS` map in `QuizRouter.js` rather than adding hardcoded routes to App.js. All quiz components now extract `planetSlug` from `useParams()` for navigation.
