---
name: CyberHeroes Admin UI — schema, keys, and architecture
description: Planet/lesson/quiz schema fields, localStorage key conventions, routing, and Phase 3 migration strategy for the admin UI
type: project
---

## Planet manifest schema (privacy-planet is canonical)
- slug, name, title, order, active, parent_planet_slug (optional), icon, theme {primary, secondary, background, accent}, intro {intro_text, computer_image_name, computer_text}, parts[]
- Each part: id, title, part_style (lesson-1…lesson-N or quiz-1…quiz-N), lesson_page_range {start, end} (lesson parts only), quiz_slugs[] (quiz parts only), transition {character, message} (quiz parts only)

## Lesson page schema (lesson.json → pages[])
- page_number, characters[] {name, style}, message {text, speaker, style, speaker_style, header?, buttons {prev?, next?, continue? {text, next}}}
- Rich text markup in message.text: `<v>word**` vocab, `<b>text**` bold, `<red>text**`, `<gold>text**`, `<u>text**`

## Quiz schemas
- multiple-choice: slug, planet_slug, type, part, questions[] {id, type, question, answers[], correctAnswers[], correctMessage[], incorrectMessages[], healthBar, hint, lessonPage?}
- drag-drop: questions[] {id, question, correctAnswer (0=Sensitive/1=Not), correctMessage, incorrectMessages}
- red-flag-green-flag: questions[] {id, question, correctAnswer (0=Red/1=Green), correctMessage, incorrectMessages}

## localStorage keys
- `admin_planets` — JSON object: { [slug]: manifestOverride }
- `admin_lessons_<slug>` — JSON: { planet_slug, pages: [...] }
- `admin_quizzes_<slug>` — JSON object: { [quizSlug]: quizData }

## Data access layer
- `/src/admin/data/index.js` — all reads/writes go through this module. Swap implementations here for Supabase in Phase 3 without touching components.
- Key exports: getPlanetOverrides, savePlanet, deletePlanetOverride, getLessonsOverride, saveLessonsOverride, saveLessonPage, deleteLessonPage, getQuizOverrides, saveQuiz, deleteQuizOverride

## Routing
- HashRouter (GitHub Pages constraint) — admin lives at `#/admin/*`
- Route added to src/App.js: `<Route path="/admin/*" element={<AdminLayout />} />`
- AdminLayout uses nested Routes: index=PlanetList, planets/new=PlanetForm, planets/:slug/edit=PlanetForm, planets/:slug/lessons=LessonEditor, planets/:slug/quizzes=QuizEditor

## Export ZIP
- AdminLayout handles export via JSZip + FileSaver
- Merges loader data with all localStorage overrides
- Output: `planets/<slug>/manifest.json`, `lesson.json`, `vocab.json`, `quizzes/<quizSlug>.json`
- Vocab is pass-through (no admin editing of vocab yet)

## Dependencies added
- react-hook-form (forms), jszip (zip generation), file-saver (browser download)

**Why:** Admin UI for content authors to create/edit planets, lessons, and quizzes without touching JSON files directly.
**How to apply:** When extending the admin, always go through src/admin/data/index.js for reads/writes. Match existing localStorage key naming exactly.
