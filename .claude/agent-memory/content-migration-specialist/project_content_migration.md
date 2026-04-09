---
name: Content Migration to Per-Planet Structure
description: Details of the 2026-04-09 migration from global lesson/quiz files to per-planet directory structure under src/data/planets/
type: project
---

On 2026-04-09, migrated existing lesson/quiz/vocab content from global files into per-planet directories.

**Why:** The global single-file approach (one lesson.json for all planets) doesn't scale as more planets are added. Per-planet directories enable independent content authoring and eliminate cross-planet page numbering coupling.

**How to apply:**
- New content should go into `src/data/planets/<slug>/` directories
- Each planet has: manifest.json, lesson.json, vocab.json, and quizzes/ directory
- Page numbers are planet-local (start at 1 per planet)
- Privacy Moon quiz-2 and quiz-3 content files still need to be authored
- Review and certificate data (review.json, transition_cert.json) are not yet covered by the new schema
- Quiz fields in migrated files still use camelCase (source format) not snake_case (schema target)
- Originals archived at `src/data/_archive/`
