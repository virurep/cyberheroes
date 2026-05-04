# Data Refactor Design

**Date:** 2026-04-29  
**Topic:** Per-planet data files, auto-sequential pages, unified naming

---

## Problem

The current data layer has four pain points that make adding or editing lessons error-prone:

1. **Integer-based navigation** — `lesson.json` pages carry explicit `page_number` fields and `buttons.next`/`buttons.prev` are raw integers. Adding or reordering a page requires manually renumbering every reference.
2. **Four naming formats for the same planet** — `"Privacy Planet"`, `privacy planet`, `privacy_planet`, `privacy-planet` coexist across files, requiring runtime string transforms in components.
3. **Cross-file coupling via magic numbers** — `transitions.json` has `end_page: 19` and quiz files have `lessonPage: 20` that must stay in sync with `page_number` values in `lesson.json`.
4. **Data scattered across 4+ files** per lesson — lesson dialogue, quiz transitions, intros, vocab, TOC, and quizzes all live in separate shared files, making it impossible to see one lesson's full flow in one place.

---

## Chosen Approach

**Per-planet folders with separate lesson and quiz files, auto-sequential page navigation.**

---

## File Structure

**Before:**
```
src/data/
  lessons/
    lesson.json
    lesson_intro.json
    transitions.json
    vocab.json
    review.json
    table_of_contents.json
    transition_cert.json
  quizzes/
    privacy_planet_quiz.json
    privacy_moon_quiz.json
    drag_drop_quiz.json
    redFlag_greenFlag_quiz.json
```

**After:**
```
src/data/
  privacy-planet/
    lesson.json       (intro, pages, quiz_transitions, vocab, review, TOC)
    quiz.json         (quiz questions for all parts)
  privacy-moon/
    lesson.json
    quiz.json
    drag-drop.json
    red-flag-green-flag.json
```

Adding a new planet = create a new folder with its files. Nothing else changes.

---

## Page Data Model

### Before (typical page)
```json
{
  "page_number": 2,
  "characters": [...],
  "message": {
    "text": "...",
    "speaker": "Allie",
    "style": "message-box-bottom",
    "speaker_style": "speaker-left",
    "buttons": { "prev": 1, "next": 3 }
  }
}
```

### After (sequential page — the common case)
```json
{
  "characters": [...],
  "message": {
    "text": "...",
    "speaker": "Allie",
    "style": "message-box-bottom",
    "speaker_style": "speaker-left"
  }
}
```

`page_number`, `prev`, and `next` are gone. The renderer uses array index: prev = index − 1, next = index + 1.

### Non-sequential navigation

Pages that jump to a named destination add a `"to"` field on `message`:

```json
{ "message": { "text": "...", "to": "quiz-1" } }
{ "message": { "text": "...", "to": "certificate" } }
{ "message": { "text": "...", "to": "patrick-defeat" } }
```

### Custom button
```json
{
  "message": {
    "text": "...",
    "button": { "text": "View Certificate", "style": "default-button", "to": "certificate" }
  }
}
```

### No-button page (encounter screens — character click handles navigation)
```json
{
  "message": {
    "text": "!! YOU'VE ENCOUNTERED ENEMIES !!",
    "style": "alert-header",
    "no_buttons": true
  }
}
```

### Quiz transitions (formerly `transitions.json`)

Folded into the planet's `lesson.json` as a top-level section. `end_page` is removed — the component derives the resume index by finding the page whose `message.to` matches the quiz part.

```json
{
  "quiz_transitions": {
    "quiz-1": {
      "character": "Allie",
      "message": "Use what you learned to defeat Enemy 1!"
    },
    "quiz-2": { ... },
    "quiz-3": { ... }
  }
}
```

### Certificate transition (formerly `transition_cert.json`)

Also folded into the planet's `lesson.json`:

```json
{
  "cert_transition": {
    "character": "Allie",
    "message": "Yay!! You defeated all the enemies and helped me keep my sensitive data safe!"
  }
}
```

---

## Quiz Data Model

### Before (excerpt from `privacy_planet_quiz.json`)
```json
{
  "quizzes": [
    {
      "part": "quiz-1",
      "quiz": [
        {
          "id": 1,
          "type": "multiple-choice",
          "question": "...",
          "answers": [...],
          "correctAnswers": [0],
          "correctMessage": [...],
          "incorrectMessages": [...],
          "healthBar": 0.8,
          "hint": "..."
        },
        {
          "id": 5,
          "...",
          "healthBar": 0,
          "lessonPage": 20
        }
      ]
    }
  ]
}
```

### After (`privacy-planet/quiz.json`)
```json
{
  "parts": [
    {
      "id": "quiz-1",
      "questions": [
        {
          "type": "multiple-choice",
          "question": "...",
          "answers": [...],
          "correctAnswers": [0],
          "correctMessage": [...],
          "incorrectMessages": [...],
          "hint": "..."
        }
      ]
    },
    { "id": "quiz-2", "questions": [...] },
    { "id": "quiz-3", "questions": [...] }
  ]
}
```

**Removed fields:**
- `id` on each question — questions identified by part + array index
- `lessonPage` — resume index derived at runtime: find the page with `message.to === partId`, use index + 1
- `healthBar` — computed by component as `questionsRemaining / totalQuestions`

**Renamed:**
- `quizzes` → `parts`
- `quiz` → `questions`
- `part` → `id`

**Unchanged:** `type`, `question`, `answers`, `correctAnswers`, `correctMessage`, `incorrectMessages`, `hint`

---

## Planet Naming

One canonical format: the URL slug (`privacy-planet`).

| Old format | Where it appeared | Status |
|---|---|---|
| `"Privacy Planet"` | `lesson.json`, `lesson_intro.json` | → `"name": "Privacy Planet"` (display only) |
| `privacy planet` | runtime in `Lesson.js` | removed |
| `privacy_planet` | `transitions.json`, `Transition.js` | removed |
| `privacy-planet` | URL routes, `useParams()` | **canonical** |

Each planet JSON contains:
```json
{ "id": "privacy-planet", "name": "Privacy Planet" }
```

`id` is the slug used for file paths and lookups. `name` is the human-readable display string used in the UI only.

---

## Planet Data Registry

Components currently import a single shared `lesson.json` and look up the planet at runtime. With per-planet files, a static registry module (`src/data/planets.js`) maps each slug to its data:

```js
import privacyPlanetLesson from './privacy-planet/lesson.json';
import privacyPlanetQuiz   from './privacy-planet/quiz.json';
import privacyMoonLesson   from './privacy-moon/lesson.json';
import privacyMoonQuiz     from './privacy-moon/quiz.json';

export const lessonData = {
  'privacy-planet': privacyPlanetLesson,
  'privacy-moon':   privacyMoonLesson,
};

export const quizData = {
  'privacy-planet': privacyPlanetQuiz,
  'privacy-moon':   privacyMoonQuiz,
};
```

Components import from this registry using the URL slug directly — no string transforms. Adding a new planet = add two lines to this file.

---

## Component Changes

All changes are mechanical simplifications — no new logic, no new components.

### `Lesson.js`
- `pageNum` state becomes a 0-based array index
- `getPlanetData` string lookup removed — data imported directly by slug
- `getPageData` `find(page => page.page_number === pageNum)` replaced by `pages[pageNum]`
- `goToPage` reads `message.to` instead of mixed integer/string from `buttons.next`
- `wildcardMatch` helper removed — `message.to` values are unambiguous named strings

### `Transition.js`
- `.replace(/-/g, '_')` string transform removed
- `end_page` lookup replaced: search pages for `message.to === quizPart` to get trigger index; "Go back to lesson" navigates to that index

### Quiz components (`Privacy-Planet-Quiz.js`, `Privacy-Moon-Quiz.js`)
- Load from `privacy-planet/quiz.json` (planet-scoped)
- `lessonPage` removed — resume index = trigger page index + 1 (from lesson array)
- `healthBar` computed as `(questionsRemaining / totalQuestions)` at render time

### `LessonIntro.js`, `TableOfContents.js`, `VocabPopup.js`, review components
- Each loads from its planet's `lesson.json` instead of the old shared files

---

## What Does Not Change

- The conversational flow, dialogue content, and quiz questions are identical
- All route paths remain the same (`/:planet/lesson`, `/:planet/quiz`, etc.)
- The visual rendering of characters, messages, and buttons is unchanged
- Special quiz types (`drag-drop`, `red-flag-green-flag`) keep their structure, just move into the planet folder
