# Route Cleanup Report — Phase 1

## Build Status

**PASS** — `npm run build` completes successfully with only pre-existing ESLint warnings (unused variables in ExplorationMap, Arrival, Lesson, etc.). No new warnings introduced.

## Summary of Changes

### Task 1: QuizRouter Dispatch Map Removal

**File: `src/components/quizzes/QuizRouter.js`**
- Removed hardcoded `QUIZ_COMPONENTS` map (`{ 'privacy-planet': ..., 'privacy-moon': ... }`)
- Now uses `getQuizSlugsForPart(planetSlug, part)` from the content loader to discover quiz slugs for the current part
- Reads the `type` field from quiz JSON to determine which component to render
- For parts with multiple quiz types (e.g., privacy-moon's quiz-1 has both multiple-choice and red-flag-green-flag), routes to `PrivacyMoonQuizRoute` for sub-quiz sequencing
- For single-type parts (e.g., multiple-choice only), dispatches directly to `PrivacyPlanetQuiz`

### Task 2: Data Import Elimination

| File | Old Import | New Source | Status |
|------|-----------|------------|--------|
| `src/components/lessons/Lesson.js` | `data/lessons/lesson.json` | `getLessonPages(planet)` from content loader | DONE |
| `src/components/lessons/LessonIntro.js` | `data/lessons/lesson_intro.json` | `getPlanet(planet)` — uses manifest's `intro` field | DONE |
| `src/components/lessons/Message.js` | `data/lessons/vocab.json` | `getVocab(planet)` from content loader | DONE |
| `src/components/lessons/Transition.js` | `data/lessons/transitions.json` | `getTransition(planet, quizPart)` and `getQuizEndPage(planet, quizPart)` from content loader | DONE |
| `src/components/lessons/TableOfContents.js` | `data/lessons/table_of_contents.json` | `getPlanet(planet)` — transforms manifest `parts` array | DONE |
| `src/components/lessons/Transition_Cert.js` | `data/lessons/transition_cert.json` | Redirected to `data/_archive/lessons/transition_cert.json` (not yet migrated to planet schema) | DONE |
| `src/components/review/review.js` | `data/lessons/review.json` | Redirected to `data/_archive/lessons/review.json` (not yet migrated to planet schema) | DONE |
| `src/components/quizzes/Privacy-Planet-Quiz.js` | `data/quizzes/privacy_planet_quiz.json` | `getQuiz()` + `getQuizSlugsForPart()` from content loader | DONE |
| `src/components/quizzes/Privacy-Moon-Quiz.js` | `data/quizzes/privacy_moon_quiz.json` | `getQuiz()` + `getQuizSlugsForPart()` from content loader | DONE |
| `src/components/quizzes/Drag-Drop-Quiz.js` | `data/quizzes/drag_drop_quiz.json` | `getQuiz()` + `getQuizSlugsForPart()` from content loader | DONE |
| `src/components/quizzes/RedFlag-GreenFlag-Quiz.js` | `data/quizzes/redFlag_greenFlag_quiz.json` | `getQuiz()` + `getQuizSlugsForPart()` from content loader | DONE |

### Task 3: Cross-Planet Navigation

| File | Old Hardcoded Navigation | New Dynamic Navigation | Status |
|------|-------------------------|----------------------|--------|
| `src/components/lessons/Certificate.js` | `if (planet === 'privacy-planet')` | `getNextPlanet(planet)` — if next planet exists, go to patrick-leaving; else go to exploration-map | DONE |
| `src/components/lessons/Patrick_leaving.js` | `navigate('/privacy-moon/moon-map')` | `navigate('/${nextPlanet.slug}/moon-map')` using `getNextPlanet(planet)` | DONE |
| `src/components/lessons/Patrick_Defeat.js` | `navigate('/privacy-moon/certificate')` | `navigate('/${planet}/certificate')` using `useParams()` | DONE |
| `src/components/lessons/Moon_Map.js` | `navigate('/privacy-moon/lesson-intro')` | `navigate('/${planet}/lesson-intro')` using `useParams()` | DONE |

### Content Loader Additions (`src/content/loader.js`)

New exported functions:
- `getNextPlanet(currentSlug)` — returns next planet manifest by order, or undefined
- `getPreviousPlanet(currentSlug)` — returns previous planet manifest by order, or undefined
- `getAllQuizzes(slug)` — returns all quiz objects for a planet
- `getQuizSlugsForPart(planetSlug, quizPart)` — returns quiz slugs for a manifest part
- `getTransition(planetSlug, quizPart)` — returns transition data from manifest
- `getQuizEndPage(planetSlug, quizPart)` — returns the lesson page range end for a quiz part

### Message.js Refactoring

- Added `processTextWithVocab(text, onVocabClick, vocabWords)` — explicit vocab parameter, no global state dependency
- `processText` is preserved as a backward-compatible wrapper using fallback vocab
- `setFallbackVocab(words)` allows setting the fallback vocab for non-component contexts
- Message component now uses `useParams()` to get `planet` and `getVocab(planet)` for planet-specific vocab
- LessonIntro now uses `processTextWithVocab` with explicit vocab from the loader

## Grep Results

### `grep -r "data/quizzes|data/lessons" src/components/`
**Result: No matches.** All direct data imports have been eliminated.

### `grep -r "privacy-planet|privacy-moon" src/components/`
**Remaining references (all acceptable):**

| File | Reference | Type | Acceptable? |
|------|-----------|------|-------------|
| `ExplorationMap.js` | Image imports, route strings for map UI | Map configuration | Yes — map UI is outside scope |
| `QuizRouter.js` | Comment mentioning privacy-moon | Documentation | Yes — comment only |
| `Privacy-Planet-Quiz-Answers.js` | `privacy-planet-quiz-background`, `privacy-planet-health-bar` | CSS class names | Yes |
| `Privacy-Planet-Quiz.js` | `privacy-planet-quiz-background` | CSS class name | Yes |
| `Drag-Drop-Quiz.js` | `privacy-moon-quiz-background` | CSS class name | Yes |
| `RedFlag-GreenFlag-Quiz.js` | `privacy-moon-quiz-background` | CSS class name | Yes |
| `Privacy-Moon-Quiz.js` | `privacy-moon-quiz-background` | CSS class name | Yes |
| `Privacy-Moon-Quiz-Answers.js` | `privacy-moon-quiz-background`, `privacy-moon-quiz-answers-container` | CSS class names | Yes |
| `game-answers.js` | `privacy-moon-quiz-background` | CSS class name | Yes |
| `Moon_Map.js` | `privacy-planet-background` | CSS class name | Yes |
| `Patrick_leaving.js` | `privacy-moon.png` image import | Asset reference | Yes |

## Remaining Risks

1. **transition_cert and review data** remain in `_archive/` — they use the old `privacy_planet`/`privacy_moon` underscore-keyed format. When new planets are added, these data files will need to be migrated to the per-planet schema. The components (`Transition_Cert.js`, `review.js`) still use the underscore conversion (`planet.replace(/-/g, '_')`) to look up data.

2. **ExplorationMap.js** has a hardcoded planet list with routes. This is the map UI and is outside the current cleanup scope, but will need updating when new planets are added to the manifest system.

3. **CSS class names** like `privacy-planet-quiz-background` and `privacy-moon-quiz-background` are hardcoded in quiz components. These are presentation concerns and are correct as-is, but future planets will need corresponding CSS classes or a dynamic class generation approach.

4. **PrivacyMoonQuizRoute** (`Privacy-Moon-Quiz-Route.js`) still has hardcoded quiz-part-to-route-path mapping (`quiz-1` -> `drag-drop`, `quiz-2` -> `redflag-greenflag`, `quiz-3` -> `final-quiz`). This works because it routes to sub-quiz URL paths, but could be made more dynamic in the future.

5. **Quiz answer components** (`Privacy-Planet-Quiz-Answers.js`, `Privacy-Moon-Quiz-Answers.js`, `game-answers.js`) receive quiz data via `location.state` rather than loading from the content loader directly. This is the existing pattern and works correctly, but means they depend on the calling quiz component passing the right data shape.
