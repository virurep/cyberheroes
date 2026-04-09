---
name: Quiz Types
description: All quiz types found in existing cyberheroes quiz files and their unique field structures
type: project
---

## Quiz Types Found in Existing Data

### 1. multiple-choice
- Used in `privacy_planet_quiz.json` and `privacy_moon_quiz.json`
- Fields: `id`, `type: "multiple-choice"`, `question`, `answers[]` (array of strings), `correctAnswers[]` (array of 0-indexed ints, usually one), `correctMessage[]` (array of strings), `incorrectMessages[]` (array, one per answer, empty string for correct answer), `healthBar` (float 0–1), `hint` (string), optional `lessonPage`

### 2. multiple-select
- Used in `privacy_planet_quiz.json`
- Same structure as multiple-choice but `correctAnswers[]` has multiple indices
- `incorrectMessages[]` may be a single-element array with a shared incorrect feedback

### 3. true-false
- Used in `privacy_planet_quiz.json`
- Same structure as multiple-choice, `answers` is always `["True", "False"]`
- `correctAnswers` is `[0]` or `[1]`

### 4. drag-drop (drag_drop_quiz.json)
- Top-level wrapper: `{ "quiz": [...] }` (no parts)
- Fields: `id`, `question` (string to classify), `correctAnswer` (0=sensitive data, 1=public/safe), `correctMessage` (single string), `incorrectMessages` (single string — hint for retry), optional `lessonPage`
- No `healthBar`, no `hint` field (feedback IS the incorrectMessages)
- No `type` field in existing data (inferred from file)

### 5. red-flag-green-flag (redFlag_greenFlag_quiz.json)
- Identical structure to drag-drop
- `correctAnswer`: 0=red flag (dangerous), 1=green flag (safe)
- No `type` field in existing data
- No `healthBar`
- No `hint` field

## Key Observations
- Question IDs are globally unique integers across all quizzes in a single planet's quiz file
- `healthBar` field represents enemy health remaining after answering; used for battle-game UI effect
- `lessonPage` on the last question of a part signals where to navigate after the quiz ends
- `correctMessage` is an array in MC/MS/TF quizzes but a single string in drag-drop/RFGF quizzes
- `incorrectMessages` is an array (one per answer) in MC/MS/TF but a single string in drag-drop/RFGF
