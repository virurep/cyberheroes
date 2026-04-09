---
name: Schema Design Decisions
description: Architectural decisions made during planet schema design and rationale for the per-planet content system
type: project
---

## Key Architectural Decisions

### Naming Convention Choice
- Adopted **snake_case** for all structural fields in the new schema, matching the dominant convention in existing source files (planet_name, page_number, start_page, part_type, etc.)
- Exception: quiz question-level fields (correctAnswers, correctMessage, incorrectMessages, healthBar, lessonPage) retain camelCase to stay consistent with existing quiz data files

### Planet-Local Page Numbering
- Pages restart at 1 per planet — this already exists in lesson.json
- The new schema formalizes this: lessonPageRange uses planet-local page numbers
- Benefit: planets can be reordered or removed without renumbering all other planets

### Parts Array Design
- Parts reference lesson content via `lesson_page_range` (start/end) rather than global page numbers
- Parts reference quizzes via `quiz_slugs` (array of strings) rather than integer quiz_part numbers
- This decouples manifest from internal page/quiz numbering and makes each planet self-contained

### Quiz File Organization
- One file per quiz slug under `quizzes/` subdirectory
- Quiz type is explicit via `type` field (not inferred from filename)
- `planet_slug` and `slug` fields added for traceability
- drag-drop and red-flag-green-flag types get explicit `type` fields (absent in existing data)

### Moon/Companion Planet Relationship
- Moons have a `parent_planet_slug` field in manifest.json
- This captures the "sequel/companion" relationship noted in lesson_intro.json
- Moons are otherwise structurally identical to planets

### Transition and Intro Metadata
- Intro metadata (intro_text, computer_image_name, computer_text) moved into manifest.json under `intro` object
- Transition data (character, message, end_page per quiz) moved into manifest.json `parts` array under `transition` object
- This collocates all planet-level configuration in one manifest

### Vocab Scoping
- vocab.json scoped per-planet, with a `planet_slug` field
- Words used across planets can appear in multiple planet vocab files (acceptable duplication for self-containment)
