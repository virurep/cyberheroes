# Bug Diagnosis Report

Date: 2026-04-10
Branch: `feature/planet-schema-migration`

---

## Bug 1: Quizzes Loop When Finished

### Symptom
After answering the last quiz question, the quiz restarts or re-renders instead of navigating to the answers/results page.

### Root Cause

**There are actually two distinct looping issues affecting different quiz types.**

#### Issue 1A: Privacy-Planet quiz-1 dispatches to the wrong sub-quiz router

**File:** `src/components/quizzes/QuizRouter.js`, lines 34-41

The `QuizRouter` determines which quiz component to render. It counts the number of distinct quiz types for a given part. For `privacy-planet` part `quiz-1`, the manifest (`src/data/planets/privacy-planet/manifest.json`, lines 32-35) declares two quiz slugs:

```json
"quiz_slugs": ["sensitive-data-quiz-1", "sensitive-data-drag-drop"]
```

These resolve to types `multiple-choice` and `drag-drop` respectively. Since `quizTypes.length > 1` (line 40), `QuizRouter` dispatches to `<PrivacyMoonQuizRoute />` (line 41).

**`PrivacyMoonQuizRoute`** (`src/components/quizzes/Privacy-Moon-Quiz-Route.js`, lines 16-28) is hardcoded for privacy-moon's quiz flow:
- `quiz-1` -> navigates to `drag-drop`
- `quiz-2` -> navigates to `redflag-greenflag`
- `quiz-3` -> navigates to `final-quiz`

This means privacy-planet's `quiz-1` gets routed to the drag-drop quiz, which then navigates to `game-answers.js` on completion. But `game-answers.js` (line 20-23) navigates back to either `drag-drop` or `redflag-greenflag` for the next question, and on the **last question** navigates to `/${planetSlug}/lesson` with `page: currentQuestion.lessonPage`.

**The looping happens because:** For drag-drop on privacy-planet, the `lessonPage` field on the last question (`sensitive-data-drag-drop.json`, line 55) is `9`. So after the drag-drop quiz finishes, it navigates to privacy-planet lesson page 9. Lesson page 9's `next` button eventually leads back to `quiz-1` again (page 19's `next` is `"quiz-1"`), creating a loop.

**This is not exactly a "restart" loop** -- it's a flow problem where the drag-drop quiz for privacy-planet navigates the user back to a lesson page that eventually leads back to the same quiz transition.

**The multiple-choice part of quiz-1 (`sensitive-data-quiz-1`) is never shown** because `PrivacyMoonQuizRoute` always sends `quiz-1` to `drag-drop`, skipping it entirely.

#### Issue 1B: `game-answers.js` loses `part` state, causing re-render loops

**File:** `src/components/quizzes/game-answers.js`, lines 17-33

When `game-answers.js` calls `handleNextQuestion()` and the quiz is not yet done (line 20-26), it navigates to the next question:

```javascript
navigate(quizType === 'drag-drop'
    ? `/${planetSlug}/quiz/drag-drop`
    : `/${planetSlug}/quiz/redflag-greenflag`, {
    state: { questionIndex: nextIndex }
});
```

**The `part` field is NOT passed** in `location.state`. Both `Drag-Drop-Quiz.js` (line 19) and `RedFlag-GreenFlag-Quiz.js` (line 19) default to `part || 'quiz-1'` when `part` is missing. This works for `quiz-1` by coincidence but will fail for `quiz-2` and `quiz-3` parts, potentially loading the wrong quiz data.

Similarly, `Drag-Drop-Quiz.js` navigates to `game-answers` (line 53) without passing `part`:

```javascript
navigate(`/${planetSlug}/drag-drop-quiz/game-answers`, {
    state: { isCorrect, currentQuestion: {...}, questionIndex, quizType: 'drag-drop' }
});
```

No `part` is forwarded, so the `part` state is lost after the first question.

#### Issue 1C: Privacy-Moon quiz-2 and quiz-3 reference non-existent quiz data files

**Files:** `src/data/planets/privacy-moon/manifest.json`, lines 54-57 and 77-79

The manifest references:
- `sharing-online-quiz-2` (for part `quiz-2`)
- `sharing-online-quiz-3` (for part `quiz-3`)

But only these files exist in `src/data/planets/privacy-moon/quizzes/`:
- `sharing-online-quiz-1.json`
- `sharing-online-rfgf.json`

**The files `sharing-online-quiz-2.json` and `sharing-online-quiz-3.json` were never created during the content migration.** When the user reaches privacy-moon quiz-2 or quiz-3:
1. `getQuizSlugsForPart()` returns `["sharing-online-quiz-2"]`
2. `getQuiz("privacy-moon", "sharing-online-quiz-2")` returns `undefined`
3. In `Privacy-Planet-Quiz.js` (used for single-type multiple-choice), `quizData` is `null`, `currentQuiz` is `null`, and accessing `currentQuiz?.quiz[currentQuestionIndex]` returns `undefined`
4. The component crashes or renders nothing, potentially causing a re-render loop from error boundaries

### Which Refactor Step Introduced It

- **Issue 1A:** Content migration + loader creation. The `QuizRouter` was designed generically but `PrivacyMoonQuizRoute` remained hardcoded. The manifest's `quiz_slugs` for privacy-planet quiz-1 now correctly lists both quiz types, but the routing logic assumes only privacy-moon has multi-type parts.
- **Issue 1B:** Route refactor. The navigation calls were updated to use `planetSlug` but `part` was not consistently forwarded through the quiz flow.
- **Issue 1C:** Content migration (incomplete). Only quiz-1 data was migrated for privacy-moon; quiz-2 and quiz-3 JSON files were never created from the original `privacy_moon_quiz.json`.

### Exact Files and Line Numbers

| File | Lines | Issue |
|------|-------|-------|
| `src/components/quizzes/QuizRouter.js` | 40-41 | Multi-type dispatch always uses `PrivacyMoonQuizRoute` |
| `src/components/quizzes/Privacy-Moon-Quiz-Route.js` | 16-28 | Hardcoded quiz-part-to-route mapping, planet-agnostic |
| `src/components/quizzes/game-answers.js` | 20-26 | Does not pass `part` in navigation state |
| `src/components/quizzes/Drag-Drop-Quiz.js` | 53 | Does not pass `part` in navigation state |
| `src/components/quizzes/RedFlag-GreenFlag-Quiz.js` | 30 | Does not pass `part` in navigation state |
| `src/data/planets/privacy-moon/manifest.json` | 54-57, 77-79 | References `sharing-online-quiz-2` and `sharing-online-quiz-3` which do not exist |

### Recommended Fix Approach

1. **Refactor `QuizRouter` and `PrivacyMoonQuizRoute`** to be truly planet-agnostic. Instead of hardcoding quiz-part-to-route mappings, read the quiz types from the manifest's `quiz_slugs` array and route based on the actual quiz type data, stepping through them in order.

2. **Pass `part` through all quiz navigation calls** in `game-answers.js`, `Drag-Drop-Quiz.js`, and `RedFlag-GreenFlag-Quiz.js`.

3. **Create the missing quiz data files** (`sharing-online-quiz-2.json` and `sharing-online-quiz-3.json`) by splitting the original `src/data/quizzes/privacy_moon_quiz.json` data into per-part files, matching how privacy-planet's quizzes were split.

---

## Bug 2: Characters Rendering Incorrectly

### Symptom
Lesson characters appear in wrong positions, wrong images, or missing entirely.

### Root Cause

**After thorough investigation, the character data format is identical between the archived (legacy) format and the new migrated format.** Both use the same fields:

```json
{
  "name": "Allie",
  "style": "character-right character-flip"
}
```

And optionally:
```json
{
  "name": "Patrick",
  "style": "character-right",
  "arrow": 9
}
```

The `Characters.js` component (`src/components/lessons/Characters.js`) resolves images by converting the character `name` to lowercase, replacing spaces with hyphens, and looking up `./name.png` via `require.context`. This logic has not changed.

**However, the data loading path has changed, and this is the likely source of the bug.**

#### Issue 2A: Route parameter name mismatch between lesson routes and quiz routes

**File:** `src/App.js`, lines 41-50 vs 53-59

Lesson routes use `:planet` as the parameter name:
```jsx
<Route path="/:planet/lesson" element={<LessonPage />} />
```

Quiz routes use `:planetSlug` as the parameter name:
```jsx
<Route path="/:planetSlug/quiz" element={<QuizRouter />} />
```

This is **inconsistent but not broken** -- each component extracts the correct param name it expects. `Lesson.js` (line 16) uses `const { planet } = useParams()` and `Transition.js` (line 12) also uses `const { planet } = useParams()`. Quiz components use `const { planetSlug } = useParams()`.

**But this becomes a problem when quiz components navigate back to lesson pages.** For example, `Privacy-Planet-Quiz-Answers.js` (line 33) navigates to:

```javascript
navigate(`/${planetSlug}/lesson`, { state: { page: currentQuestion.lessonPage } });
```

This constructs the URL correctly (e.g., `/privacy-planet/lesson`), and `Lesson.js` extracts `planet` from `useParams()` matching the route `/:planet/lesson`. So the URL works -- the parameter name in the route definition (`planet`) is what `useParams()` gives, regardless of what the navigating component called it.

**The actual character rendering issue is NOT caused by the data migration.** The character field names, image paths, and styles are preserved exactly.

#### Issue 2B: Potential `getLessonPages()` return shape issue

**File:** `src/content/loader.js`, line 129 and `src/components/lessons/Lesson.js`, line 31

`getLessonPages(planet)` returns the raw JSON object from `lessonCache`. The new per-planet JSON files have the shape:

```json
{
  "planet_slug": "privacy-planet",
  "pages": [...]
}
```

`Lesson.js` (line 32) does:
```javascript
const planetData = lessonData || { pages: [] };
```

Then accesses `planetData.pages` -- this works correctly since the new format has `pages` at the top level.

The old format (`_archive/lessons/lesson.json`) had:
```json
{
  "planets": [
    { "planet_name": "Privacy Planet", "pages": [...] }
  ]
}
```

If `Lesson.js` was previously accessing `lessonData.planets[0].pages` (or similar), and was updated to `lessonData.pages`, the migration + loader refactor changed this correctly.

#### Issue 2C: Most likely cause -- CSS class mismatch or missing images

Since the character data format is identical and the loader returns the correct shape, the character rendering issue is likely caused by one of these:

1. **Missing character image files** -- if a character `name` in the new JSON doesn't have a matching PNG in `src/img/characters/`, `require.context` will throw at runtime, causing the component to crash.

2. **CSS class names** -- the `style` field values like `"character-left"`, `"character-right character-flip"`, `"character-left character-s"` must have corresponding CSS rules in `src/styles/lesson.css`. If styles were changed or classes renamed, characters would appear in wrong positions.

3. **Page-number-based rendering** -- `Lesson.js` uses `planetData.pages.find(page => page.page_number === pageNum)` (line 40-41). If any pages in the new JSON have incorrect or duplicate `page_number` values, the wrong page data (and thus wrong characters) would display.

### Which Refactor Step Introduced It

Without being able to reproduce the visual issue, the most likely cause is either:
- **Content migration** -- if page numbers were renumbered or character entries were altered during the split from the monolithic `lesson.json` to per-planet files
- **CSS changes** -- if any style refactoring accompanied the migration

### Exact Files and Line Numbers

| File | Lines | Issue |
|------|-------|-------|
| `src/components/lessons/Characters.js` | 10-11 | Image resolution logic -- crashes if name doesn't match a file |
| `src/components/lessons/Lesson.js` | 31-32 | Data loading from `getLessonPages()` |
| `src/components/lessons/Lesson.js` | 40-41 | Page lookup by `page_number` |
| `src/content/loader.js` | 128-129 | Stores raw JSON in lessonCache |

### Recommended Fix Approach

1. **Verify page numbers** are sequential and unique in both `privacy-planet/lesson.json` and `privacy-moon/lesson.json`. Run a quick script to check for gaps or duplicates.

2. **Verify all character names** referenced in the lesson JSON have matching PNGs in `src/img/characters/`. The name-to-filename conversion (lowercase, spaces to hyphens) must produce valid filenames.

3. **Add error boundaries** around the `Characters` component so that a missing image for one character doesn't crash the entire lesson page.

4. **Add a fallback image** in `Characters.js` instead of crashing when `require.context` fails to find a matching image file.

---

## Additional Related Bugs Discovered

### Bug 3: Route parameter naming inconsistency in App.js

**File:** `src/App.js`

Lesson routes (lines 41-50) use `:planet` while quiz routes (lines 53-59) use `:planetSlug`. While this works because each component extracts its own param name, it is confusing and error-prone. A future refactor that assumes a consistent param name will break.

### Bug 4: `game-answers.js` route path inconsistency

**File:** `src/App.js`, line 59

The route for `game-answers.js` is defined as:
```
/:planetSlug/drag-drop-quiz/game-answers
```

But it is navigated to from `Drag-Drop-Quiz.js` (line 53) and `RedFlag-GreenFlag-Quiz.js` (line 30) as:
```
/${planetSlug}/drag-drop-quiz/game-answers
```

This path uses `drag-drop-quiz` (not `quiz/drag-drop`), which is **inconsistent with the rest of the quiz route structure** where all quiz routes are under `/:planetSlug/quiz/...`. This means the drag-drop and red-flag-green-flag answer pages are at a different URL hierarchy than the other quiz answer pages.

### Bug 5: Privacy-Moon quiz-2 data never shows `sharing-online-quiz-2` which doesn't exist

**File:** `src/data/planets/privacy-moon/manifest.json`, line 55

As noted in Bug 1C, `sharing-online-quiz-2.json` and `sharing-online-quiz-3.json` do not exist. This means privacy-moon parts 2 and 3 are completely broken -- users will hit an error screen or blank page when navigating to these quizzes.

**This was introduced during the content migration step.** The original monolithic `privacy_moon_quiz.json` (at `src/data/quizzes/privacy_moon_quiz.json`) contained all questions for all parts. During migration, only `sharing-online-quiz-1.json` was created, leaving parts 2 and 3 without data.

### Bug 6: `PrivacyMoonQuizRoute` loses `part` state on redirect

**File:** `src/components/quizzes/Privacy-Moon-Quiz-Route.js`, lines 18-26

When `PrivacyMoonQuizRoute` redirects (e.g., `quiz-1` -> `/drag-drop`), it does NOT pass `location.state` through the navigation. The target components (`Drag-Drop-Quiz.js`, `RedFlag-GreenFlag-Quiz.js`, `Privacy-Moon-Quiz.js`) then receive no `part` in their state and default to `'quiz-1'`.

This means:
- `quiz-2` redirects to `redflag-greenflag` but the RFGF quiz loads data for `quiz-1` (the default), showing the wrong questions
- `quiz-3` redirects to `final-quiz` but loads data for `quiz-1`

### Bug 7: `lessonPage` field only exists on the LAST question of each quiz

The `lessonPage` field (which tells quiz answer components where to return to in the lesson) only exists on the final question of each quiz file. For example:
- `sensitive-data-quiz-1.json`: `lessonPage: 20` on question 5 (the last one)
- `sensitive-data-quiz-3.json`: `lessonPage: 36` on question 14 (the last one)

The answer components (`Privacy-Planet-Quiz-Answers.js` line 35, `Privacy-Moon-Quiz-Answers.js` line 40, `game-answers.js` line 30) use `currentQuestion.lessonPage` to navigate back to the lesson after the last question. **If the `lessonPage` field is missing from the last question due to a migration error, the navigation will break.** Currently all last questions have this field, so this is a fragility risk rather than an active bug.

---

## Summary Table

| Bug | Severity | Introduced By | Status |
|-----|----------|---------------|--------|
| 1A: QuizRouter multi-type dispatch | High | Content migration + loader | Active -- privacy-planet quiz-1 broken |
| 1B: `part` state lost in game-answers | Medium | Route refactor | Active -- affects quiz flow after first question |
| 1C: Missing privacy-moon quiz files | Critical | Content migration (incomplete) | Active -- quiz-2 and quiz-3 completely broken |
| 2: Character rendering | Needs repro | Unknown | Needs visual reproduction to confirm |
| 3: Param naming inconsistency | Low | Route refactor | Latent risk |
| 4: Route path inconsistency | Low | Route refactor | Cosmetic, works currently |
| 5: Same as 1C | Critical | Content migration | Active |
| 6: PrivacyMoonQuizRoute loses state | High | Route refactor | Active -- quiz-2 and quiz-3 redirect wrong data |
| 7: lessonPage fragility | Low | Content migration | Latent risk |
