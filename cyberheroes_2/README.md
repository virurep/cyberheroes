# CyberHeroes (v2)

A production React + TypeScript + Vite rebuild of the CyberHeroes design system —
a JSON-driven content engine for cybersecurity lessons and quizzes, themed as a
pixel-art knight's quest.

This is a from-scratch app, built from the `_design_handoff/` Claude Design
bundle (kept in place for reference, not shipped in the build). It lives
alongside the original CRA app in `../cyberheroes/` and is otherwise
independent of it.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks (tsc -b) then builds to dist/
npm run preview  # serve the production build locally
```

## Routes

| Route              | Page              | Notes                                             |
| ------------------ | ----------------- | -------------------------------------------------- |
| `/`                 | `IntroPage`        | Starfield intro, hero name/color picker → `/map`   |
| `/map`              | `MapPage`          | Chapters → lessons, from `listLessons()`           |
| `/lesson/:id`       | `LessonPage`       | Renders a standard or conversational lesson        |
| `/quiz/:id`         | `QuizPage`         | Renders a quiz via `<QuizRenderer>`                |
| `/styleguide`       | `StyleguidePage`   | Every primitive/component, by section — the design-port acceptance test |

Routing uses `HashRouter` (matches the sibling app's convention — works on
static hosts like GitHub Pages with no server-side rewrite rules).

## Authoring content — no code changes required

All lesson and quiz content is data. Vite eagerly globs every JSON file in
these two folders at build/dev time, validates it with `zod`, and makes it
available through the content engine (`src/content/engine/loaders.ts`):

- `src/content/lessons/*.json`
- `src/content/quizzes/*.json`

Drop a new file in, follow the schema below, and it shows up automatically —
in `listLessons()` / `listQuizzes()`, on `/map`, and at `/lesson/:id` or
`/quiz/:id`. **If the JSON doesn't match the schema, the app throws a loud
error in dev** naming the file and the exact field that failed (via
`zod`'s `safeParse` — see `src/content/engine/loaders.ts`).

### Adding a quiz

Create `src/content/quizzes/my-quiz.json`:

```json
{
  "id": "my-quiz",
  "title": "My Quiz",
  "lessonId": "some-lesson-id",
  "passThreshold": 0.7,
  "questions": [
    { "id": "q1", "type": "multiple_choice", "xp": 10, "question": "...", "options": ["A", "B", "C"], "correct": 1 },
    { "id": "q2", "type": "select_all", "xp": 15, "question": "...", "options": ["A", "B", "C"], "correctSet": [0, 2] },
    { "id": "q3", "type": "true_false", "xp": 5, "question": "...", "answer": true },
    {
      "id": "q4",
      "type": "drag_drop_sort",
      "xp": 20,
      "title": "SORT THE WORDS",
      "buckets": [{ "id": "a", "label": "BUCKET A", "color": "var(--green)", "rgb": "0,255,136" }],
      "items": [{ "id": "i1", "label": "word", "bucket": "a" }]
    }
  ]
}
```

Visit `/quiz/my-quiz`. `passThreshold` is the fraction of total question XP
needed to pass (default `0.7`).

### Adding a lesson

Two shapes, picked by `type`:

**Standard (block-based)** — `src/content/lessons/my-lesson.json`:

```json
{
  "id": "my-lesson",
  "type": "standard",
  "chapter": "My Chapter",
  "chapterNum": 1,
  "lessonNum": 1,
  "title": "My Lesson",
  "knightColor": "cyan",
  "totalXP": 0,
  "hero": { "eyebrow": "CHAPTER 1 · LESSON 1", "title": "My {{gold:Lesson}}", "knightColor": "cyan", "body": "Intro text." },
  "sections": [
    {
      "number": 1,
      "title": "SECTION TITLE",
      "blocks": [
        { "type": "text", "content": "Plain paragraph with {{cyan:emphasis}}." },
        { "type": "textbox", "boxType": "tip", "content": "A callout." }
      ]
    }
  ],
  "footer": { "nextLabel": "TAKE THE QUIZ", "nextQuiz": "my-quiz" }
}
```

`footer.nextQuiz` (optional) is the quiz id the lesson's final "next" button
routes to; if omitted it routes back to `/map`.

**Conversational** — knight & mage dialogue, no sections/blocks:

```json
{
  "id": "my-lesson-convo",
  "type": "conversational",
  "chapter": "My Chapter",
  "chapterNum": 1,
  "title": "Knight & Mage: My Topic",
  "knightColor": "cyan",
  "topic": "MY TOPIC",
  "turns": [
    { "speaker": "knight", "content": "..." },
    { "speaker": "mage", "content": "..." }
  ],
  "footer": { "nextQuiz": "my-quiz" }
}
```

### Rich-text mini-syntax

Any `content` string (block content, hero body, dialogue, convo turns, etc.)
is run through `renderRichText()` (`src/content/engine/richText.tsx`), which
recognizes:

| Token                  | Renders as                                  |
| ----------------------- | -------------------------------------------- |
| `{{gold:text}}`         | `<span style="color:var(--gold)">text</span>` |
| `{{cyan:text}}`         | same, cyan                                    |
| `{{red:text}}`          | same, red                                     |
| `{{green:text}}`        | same, green                                   |
| `{{purple:text}}`       | same, purple                                  |
| `{{code:text}}`         | `<InlineCode>text</InlineCode>`               |
| anything else           | passed through as plain text                  |

It's a small, closed tokenizer — no nesting, no raw HTML, nothing
interpreted as markup beyond these six tokens.

## Extending the engine — adding a new type

Both questions and blocks follow the same registry pattern: a `type`
discriminator on the JSON object selects a renderer component via a
`Record<Type, Component>` lookup. An unrecognized `type` renders a visible
red "UNKNOWN ... TYPE" dev box instead of crashing (see `BlockRenderer.tsx`
and the inline fallback in `QuizRenderer.tsx`) — though in practice `zod`
will reject an unrecognized `type` in the JSON itself before it gets that
far, with a clear file/field error.

### Adding a new question type

1. Add the type to `QuestionType` and the `Question` union in
   [`src/content/engine/types.ts`](src/content/engine/types.ts).
2. Add a matching branch to the `QuestionSchema` discriminated union in
   [`src/content/engine/schemas.ts`](src/content/engine/schemas.ts).
3. Write a presentational component (or reuse one) and a thin adapter in
   [`src/content/engine/questionRegistry.tsx`](src/content/engine/questionRegistry.tsx)
   typed `QuestionProps<YourQuestion>`.
4. Register it in `QUESTION_RENDERERS`.

### Adding a new block type

Same shape, in [`types.ts`](src/content/engine/types.ts) /
[`schemas.ts`](src/content/engine/schemas.ts) /
[`blockRegistry.tsx`](src/content/engine/blockRegistry.tsx) (`BLOCK_RENDERERS`).

## Project structure

```
src/
  components/
    primitives/   # Knight, PxFrame, XPBadge, ProgressBar, StatRow, Chip, InlineCode, ContentTitle
    textboxes/     # TextBox, DialogueBox, KeyTerm, QuoteBox, StepBox
    lesson/        # LessonHeader/Body/Footer/Hero/Section/Text
    convo/         # MagePortrait, ConvoTurn, ConvoLesson, MAGE config
    quiz/          # QuizQuestion, SelectAllThatApply, TrueFalse, DragDropSort
  content/
    engine/        # types, zod schemas, question/block registries, loaders, renderers
    lessons/       # *.json — authorable lesson content
    quizzes/       # *.json — authorable quiz content
  pages/           # IntroPage, MapPage, LessonPage, QuizPage, StyleguidePage
  styles/
    tokens.css     # ported design tokens, buttons, animations, scan/vignette overlays
```

## Design-port acceptance test

`/styleguide` mirrors `_design_handoff/reference/Cyberheroes Design System.html`
section-by-section, rendering every primitive, textbox type, lesson layout,
conversational lesson, quiz question type, and the drag-drop sorter with real
component instances (not screenshots of the prototype). Use it to visually
sanity-check the port whenever a primitive changes.

## Notable decisions / deferred work

- **Routing**: `HashRouter`, matching the sibling CRA app's GitHub Pages
  convention.
- **XP/progress persistence**: not implemented. `IntroPage` writes the
  chosen hero name/color to `localStorage` (`cyberheroes.hero`) as a stub;
  per-lesson/per-quiz progress persistence is a stretch goal, not done.
- **`matching` / `fill_blank` question types**: not implemented (stretch
  goal) — the registry is structured so either is a ~30-line addition per
  the steps above.
- **Keyboard accessibility pass** on quiz options / drag-drop: not done.
  Drag-drop already has tap-to-place as a non-keyboard fallback.
- **`image` block type**: implemented in the registry/schema even though the
  design handoff didn't specify one, since the spec explicitly invited
  adding it ("add if useful; keep the registry open for extension").
