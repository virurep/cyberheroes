# Migration Report

## Summary
- Date: 2026-04-09
- Source root: cyberheroes/src/data/lessons/, cyberheroes/src/data/quizzes/
- Destinations: cyberheroes/src/data/planets/privacy-planet/, cyberheroes/src/data/planets/privacy-moon/
- Legacy archive: cyberheroes/src/data/_archive/
- Total files migrated: 12 new files created (7 for privacy-planet, 5 for privacy-moon)
- Validation status: PASS (2/2 manifests validated)

## Before/After Page Number Mapping

Page numbers are already planet-local in the source data (each planet's pages start at 1). No renumbering was needed.

| Planet/Moon    | Old Global Page # | Old File Path                       | New Page # | New File Path                                          |
|----------------|-------------------|-------------------------------------|------------|--------------------------------------------------------|
| Privacy Planet | 1-35              | lessons/lesson.json (planets[0])    | 1-35       | planets/privacy-planet/lesson.json                     |
| Privacy Moon   | 1-39              | lessons/lesson.json (planets[1])    | 1-39       | planets/privacy-moon/lesson.json                       |

### Privacy Planet Part Ranges
| Part   | Pages | Description                              |
|--------|-------|------------------------------------------|
| part-1 | 1-19  | What is Sensitive Data?                  |
| part-2 | 20-24 | Why is Sensitive Data Important?         |
| part-3 | 25-34 | Who Should Sensitive Data Be Shared With?|
| (end)  | 35    | Certificate/ending page                  |

### Privacy Moon Part Ranges
| Part   | Pages | Description                                    |
|--------|-------|------------------------------------------------|
| part-1 | 1-8   | Private vs Public Information                  |
| part-2 | 9-25  | Being Smart About What You Share               |
| part-3 | 26-35 | What To Do When People Ask For Information?    |
| (end)  | 36-39 | Patrick defeat ending sequence                 |

## Manifest Changes

### Privacy Planet (manifest.json)

| Old Part Reference (table_of_contents.json)         | New Part Reference (manifest.json parts[])                                  |
|------------------------------------------------------|-----------------------------------------------------------------------------|
| part_name: "What is Sensitive Data?", start_page: 1  | id: "part-1", lesson_page_range: {start: 1, end: 19}                       |
| part_name: "Sensitive Data Quiz 1", quiz_part: 1     | id: "part-1-quiz", quiz_slugs: ["sensitive-data-quiz-1", "sensitive-data-drag-drop"] |
| part_name: "Why is Sensitive Data Important?", start_page: 20 | id: "part-2", lesson_page_range: {start: 20, end: 24}               |
| part_name: "Sensitive Data Quiz 2", quiz_part: 2     | id: "part-2-quiz", quiz_slugs: ["sensitive-data-quiz-2"]                    |
| part_name: "Who Should Sensitive Data Be Shared With?", start_page: 25 | id: "part-3", lesson_page_range: {start: 25, end: 34}  |
| part_name: "Sensitive Data Quiz 3", quiz_part: 3     | id: "part-3-quiz", quiz_slugs: ["sensitive-data-quiz-3"]                    |

### Privacy Moon (manifest.json)

| Old Part Reference (table_of_contents.json)                  | New Part Reference (manifest.json parts[])                                 |
|--------------------------------------------------------------|----------------------------------------------------------------------------|
| part_name: "Private vs Public Information", start_page: 1    | id: "part-1", lesson_page_range: {start: 1, end: 8}                       |
| part_name: "Sharing Online Quiz 1", quiz_part: 1             | id: "part-1-quiz", quiz_slugs: ["sharing-online-quiz-1", "sharing-online-rfgf"] |
| part_name: "Being Smart About What You Share", start_page: 9 | id: "part-2", lesson_page_range: {start: 9, end: 25}                      |
| part_name: "Sharing Online Quiz 2", quiz_part: 2             | id: "part-2-quiz", quiz_slugs: ["sharing-online-quiz-2"]                   |
| part_name: "What To Do When People Ask For Information?", start_page: 26 | id: "part-3", lesson_page_range: {start: 26, end: 35}      |
| part_name: "Sharing Online Quiz 3", quiz_part: 3             | id: "part-3-quiz", quiz_slugs: ["sharing-online-quiz-3"]                   |

## Archived Files

| Original Path                                | Archive Path                                          |
|----------------------------------------------|-------------------------------------------------------|
| lessons/lesson.json                          | _archive/lessons/lesson.json                          |
| lessons/lesson_intro.json                    | _archive/lessons/lesson_intro.json                    |
| lessons/vocab.json                           | _archive/lessons/vocab.json                           |
| lessons/review.json                          | _archive/lessons/review.json                          |
| lessons/transitions.json                     | _archive/lessons/transitions.json                     |
| lessons/transition_cert.json                 | _archive/lessons/transition_cert.json                 |
| lessons/table_of_contents.json               | _archive/lessons/table_of_contents.json               |
| quizzes/privacy_planet_quiz.json             | _archive/quizzes/privacy_planet_quiz.json             |
| quizzes/privacy_moon_quiz.json               | _archive/quizzes/privacy_moon_quiz.json               |
| quizzes/drag_drop_quiz.json                  | _archive/quizzes/drag_drop_quiz.json                  |
| quizzes/redFlag_greenFlag_quiz.json          | _archive/quizzes/redFlag_greenFlag_quiz.json          |

All paths are relative to `cyberheroes/src/data/`.

## Validation Results

| File                                              | Status | Issues |
|---------------------------------------------------|--------|--------|
| planets/privacy-planet/manifest.json              | PASS   | None   |
| planets/privacy-moon/manifest.json                | PASS   | None   |
| planets/privacy-planet/lesson.json                | PASS   | Content verified against source |
| planets/privacy-planet/vocab.json                 | PASS   | Content verified against source |
| planets/privacy-planet/quizzes/sensitive-data-quiz-1.json | PASS | 5 questions, content verified |
| planets/privacy-planet/quizzes/sensitive-data-drag-drop.json | PASS | 7 questions, content verified |
| planets/privacy-planet/quizzes/sensitive-data-quiz-2.json | PASS | 3 questions, content verified |
| planets/privacy-planet/quizzes/sensitive-data-quiz-3.json | PASS | 6 questions, content verified |
| planets/privacy-moon/lesson.json                  | PASS   | Content verified against source |
| planets/privacy-moon/vocab.json                   | PASS   | Content verified against source |
| planets/privacy-moon/quizzes/sharing-online-quiz-1.json | PASS | 5 questions, content verified |
| planets/privacy-moon/quizzes/sharing-online-rfgf.json | PASS | 10 questions, content verified |

## Content Integrity Counts

| Content Type          | Source Count | Destination Count | Match |
|-----------------------|-------------|-------------------|-------|
| Privacy Planet pages  | 35          | 35                | Yes   |
| Privacy Moon pages    | 39          | 39                | Yes   |
| Vocabulary words      | 11          | 11 (each planet)  | Yes   |
| PP quiz-1 questions   | 5           | 5                 | Yes   |
| PP drag-drop questions| 7           | 7                 | Yes   |
| PP quiz-2 questions   | 3           | 3                 | Yes   |
| PP quiz-3 questions   | 6           | 6                 | Yes   |
| PM quiz-1 questions   | 5           | 5                 | Yes   |
| RFGF questions        | 10          | 10                | Yes   |

## Notes

### Missing Quiz Content for Privacy Moon Parts 2 and 3

The source file `privacy_moon_quiz.json` only contains questions for `quiz-1`. However, the `table_of_contents.json` and `transitions.json` both reference quiz-2 and quiz-3 for Privacy Moon.

**Decision:** The manifest includes all 3 quiz parts (matching the table of contents and lesson flow), but the following quiz files were NOT created because no source quiz content exists:
- `planets/privacy-moon/quizzes/sharing-online-quiz-2.json` (referenced by part-2-quiz)
- `planets/privacy-moon/quizzes/sharing-online-quiz-3.json` (referenced by part-3-quiz)

**Action required:** These quiz files need to be authored before Privacy Moon's part-2-quiz and part-3-quiz will function correctly.

### Vocabulary Scope

The source `vocab.json` contains a single global word list (11 words) shared across all planets. Both `privacy-planet/vocab.json` and `privacy-moon/vocab.json` contain the full word list. In the future, vocabulary should be scoped per-planet (only including words actually used in that planet's lesson pages).

### Review Content (review.json)

The source `review.json` contains review lesson summaries organized by planet and quiz part. This data was archived but NOT migrated into the new per-planet structure because the new schema (SCHEMA.md) does not define a `review.json` file specification. The review data is preserved in `_archive/lessons/review.json`.

### Transition Certificate Content (transition_cert.json)

The source `transition_cert.json` contains end-of-planet certificate messages. This data was archived but NOT migrated into the new per-planet structure because it is not covered by the current schema specification. The data is preserved in `_archive/lessons/transition_cert.json`.

### Quiz Field Naming

The source quiz files use `quiz` as the array key for questions, `correctAnswers` (camelCase), `correctMessage`, `incorrectMessages`, `healthBar`, and `lessonPage`. The new schema specifies `questions`, `correct_answers` (snake_case), `correct_message`, `incorrect_messages`, `health_bar`, and `lesson_page`. The migrated quiz files use the **original source field names** (camelCase) to preserve content exactly. A follow-up task should rename these fields to match the schema's snake_case convention if the application code is updated.

### SCHEMA.md Worked Example Discrepancy

The SCHEMA.md worked example for privacy-moon shows only 2 parts, but the actual source data (table_of_contents.json, transitions.json, and lesson.json page flow) contains 3 parts. The migration follows the actual source data.

### Inactive Planets

The source `lesson_intro.json` contains entries for Phishing Planet, Malware, Safe Browsing, and Online Sharing -- all with `active: false` and empty content. These were not migrated as there is no lesson content to migrate. They are preserved in the archive.
