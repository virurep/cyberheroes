---
name: Data Conventions
description: Naming conventions, field patterns, and structural observations from existing cyberheroes data files
type: project
---

## Naming Conventions

- Top-level data files use **snake_case** for keys: `planet_name`, `page_number`, `start_page`, `part_type`, `part_style`, `quiz_part`, `correctAnswers`, `correctMessage`, `incorrectMessages`, `healthBar`, `lessonPage`
- **Mixed convention anomaly**: quiz question fields use camelCase (`correctAnswers`, `correctMessage`, `incorrectMessages`, `healthBar`, `lessonPage`) while structural/container fields use snake_case (`part_name`, `start_page`, `quiz_part`, `planet_name`)
- Quiz files are named with snake_case: `privacy_planet_quiz.json`, `drag_drop_quiz.json`, `redFlag_greenFlag_quiz.json`
- Transitions use snake_case planet keys: `privacy_planet`, `privacy_moon`
- TOC uses `part_style` values like `"lesson-1"`, `"quiz-1"` (kebab-case values)

## Structural Patterns

### lesson.json
- Top-level: `{ "planets": [ { "planet_name": string, "pages": [...] } ] }`
- Page numbers **restart at 1 per planet** already in the existing data
- Each page: `page_number`, `characters[]`, `message`
- Message: `text`, `speaker` (optional), `style`, `speaker_style` (optional), `buttons`
- Buttons: `{ "prev": N, "next": N }` or `{ "none": true }` for non-navigable pages
- Characters: `name`, `style` (CSS class string), optional `arrow` (page number)
- Vocab terms embedded inline with `<v>word** syntax` in message text

### table_of_contents.json
- Top-level: `{ "table_of_contents": [ { "planet_name": string, "lesson_title": string, "parts": [...] } ] }`
- Parts reference lessons by `start_page` (integer) and quizzes by `quiz_part` (integer, 1-indexed)
- `part_type`: `"lesson"` or `"quiz"`
- `part_style`: `"lesson-1"`, `"lesson-2"`, `"lesson-3"`, `"quiz-1"`, `"quiz-2"`, `"quiz-3"`

### lesson_intro.json
- Fields: `planet_name`, `lesson_title`, `intro_text`, `computer_image_name`, `computer_text`, `active` (boolean)
- Uses planet names as display strings (not slugs)

### transitions.json
- Keyed by snake_case planet name: `privacy_planet`, `privacy_moon`
- Each quiz key (`"quiz-1"`, `"quiz-2"`, `"quiz-3"`) has: `character`, `message`, `end_page`
- `end_page` is the last lesson page before the quiz triggers (planet-local numbering)

### vocab.json
- Global flat list: `{ "words": [ { "word": string, "definition": string } ] }`
- All planets share one vocab file currently — no planet scoping

### Quiz files (privacy_planet_quiz.json, privacy_moon_quiz.json)
- Top-level: `{ "quizzes": [ { "part": "quiz-N", "quiz": [...] } ] }`
- Each question: `id` (global integer), `type`, `question`, `answers[]`, `correctAnswers[]` (0-indexed), `correctMessage[]`, `incorrectMessages[]`, `healthBar` (float 0–1, tracks enemy HP), `hint` (string), optional `lessonPage` (page to navigate to after completing the quiz)

### Drag-drop quiz (drag_drop_quiz.json)
- Top-level: `{ "quiz": [...] }` — flat, no part wrapper
- Each item: `id`, `question`, `correctAnswer` (integer, 0=sensitive/red, 1=public/green), `correctMessage` (string), `incorrectMessages` (string), optional `lessonPage`

### Red-flag green-flag quiz (redFlag_greenFlag_quiz.json)
- Same structure as drag_drop: `{ "quiz": [...] }`
- `correctAnswer`: 0=red flag, 1=green flag
- Single string `correctMessage` and `incorrectMessages` (not arrays)

## Planet Relationships
- Privacy Moon is described as a companion/sequel to Privacy Planet in intro text
- Both planets use page numbering starting at 1 (per-planet, not global)
- Privacy Moon has a warning that it is "the second part of Privacy Planet"
- Planned but inactive planets: Phishing Planet, Malware, Safe Browsing, Online Sharing
