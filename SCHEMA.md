# Per-Planet Content Schema

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [File Specifications](#file-specifications)
   - [manifest.json](#manifestjson)
   - [lesson.json](#lessonjson)
   - [quizzes/\<slug\>.json](#quizzesslug-json)
   - [vocab.json](#vocabjson)
4. [Parts Array Design](#parts-array-design)
5. [Quiz Types](#quiz-types)
6. [Worked Example: privacy-planet](#worked-example-privacy-planet)
7. [Worked Example: privacy-moon](#worked-example-privacy-moon)
8. [Migration Notes](#migration-notes)
9. [Validation](#validation)

---

## Overview

### Purpose

This schema defines a **per-planet content model** for the CyberHeroes learning platform. Each planet (and its companion moons) is a self-contained educational module with its own lesson pages, quizzes, vocabulary, and display metadata. All content for a planet lives under a single directory, making it straightforward to add, remove, or reorder planets without touching any other module's data.

### Motivation for Redesign

The existing data architecture stores all lesson pages for all planets in a single `lesson.json`, all vocab in a single `vocab.json`, and quiz files that mix planet-specific content in shared files. While this worked for a two-planet prototype, it introduces several problems as the curriculum grows:

- **Page numbering coupling**: Adding pages to one planet requires updating page references in transitions and table-of-contents entries for other planets.
- **Discoverability**: There is no single file that describes what content belongs to a planet — the information is spread across `lesson.json`, `table_of_contents.json`, `transitions.json`, and `lesson_intro.json`.
- **Scalability**: Planned planets (Phishing Planet, Malware, Safe Browsing, Online Sharing) will significantly increase file sizes, making single-file maintenance impractical.
- **Collaboration**: Content authors cannot work on separate planets in parallel without merge conflicts.

### Relationship to Existing Data

This schema is a **forward-looking design target**. The Migration Notes section describes how existing global data maps conceptually to this new structure. No existing files are modified.

---

## Directory Structure

```
src/data/planets/
├── privacy-planet/
│   ├── manifest.json          # Planet metadata, parts, intro, and theme
│   ├── lesson.json            # All lesson pages for this planet (page numbers start at 1)
│   ├── vocab.json             # Vocabulary scoped to this planet
│   └── quizzes/
│       ├── sensitive-data-quiz-1.json   # Part 1 multiple-choice quiz
│       ├── sensitive-data-drag-drop.json # Part 1 drag-and-drop quiz
│       └── sensitive-data-quiz-2.json   # Part 2 multiple-choice quiz
│       └── sensitive-data-quiz-3.json   # Part 3 multiple-choice quiz
│
├── privacy-moon/
│   ├── manifest.json
│   ├── lesson.json
│   ├── vocab.json
│   └── quizzes/
│       ├── sharing-online-quiz-1.json
│       ├── sharing-online-rfgf.json     # red-flag-green-flag quiz
│       └── sharing-online-quiz-2.json
│
├── phishing-planet/           # Future planet (stub)
│   └── manifest.json
│
└── malware-planet/            # Future planet (stub)
    └── manifest.json
```

Each `<planet-slug>/` directory name must be a valid kebab-case slug matching the `slug` field in that planet's `manifest.json`.

---

## File Specifications

### manifest.json

The manifest is the authoritative index for a planet. It describes metadata, theming, intro story content, and the ordered sequence of parts (lesson sections and quizzes) that make up the planet's curriculum.

#### Top-Level Fields

| Field             | Type    | Required | Description                                                                                   |
|-------------------|---------|----------|-----------------------------------------------------------------------------------------------|
| `slug`            | string  | Yes      | Kebab-case unique identifier for this planet. Must match the directory name.                  |
| `name`            | string  | Yes      | Short human-readable planet name shown in navigation (e.g., `"Privacy Planet"`).             |
| `title`           | string  | Yes      | Full display title for the lesson module (e.g., `"Sensitive Information"`).                  |
| `order`           | integer | Yes      | Curriculum sequence position. Planets are displayed in ascending order. Starts at 1.         |
| `active`          | boolean | Yes      | Whether this planet is published and accessible to students.                                  |
| `parent_planet_slug` | string | No    | For moons: the slug of the parent planet this moon extends. Omitted for primary planets.     |
| `theme`           | object  | Yes      | Color token map for rendering the planet's UI. See [Theme Object](#theme-object).            |
| `icon`            | string  | Yes      | Asset path or identifier for the planet icon (e.g., `"privacy-planet-icon.png"`).           |
| `intro`           | object  | Yes      | Story intro content shown before the lesson begins. See [Intro Object](#intro-object).       |
| `parts`           | array   | Yes      | Ordered list of curriculum parts. See [Parts Array Design](#parts-array-design).             |

#### Theme Object

| Field        | Type   | Required | Description                                              | Example          |
|--------------|--------|----------|----------------------------------------------------------|------------------|
| `primary`    | string | Yes      | Primary brand color (hex or CSS color token).           | `"#4A90D9"`      |
| `secondary`  | string | Yes      | Secondary/accent color.                                 | `"#2C5F8A"`      |
| `background` | string | Yes      | Page background color.                                  | `"#EAF4FF"`      |
| `accent`     | string | Yes      | Highlight/call-to-action color.                         | `"#F5A623"`      |

#### Intro Object

| Field                | Type   | Required | Description                                                                         |
|----------------------|--------|----------|-------------------------------------------------------------------------------------|
| `intro_text`         | string | Yes      | Narrative intro paragraph shown on the mission briefing screen.                    |
| `computer_image_name`| string | Yes      | Filename of the image displayed in the mission computer panel.                     |
| `computer_text`      | string | Yes      | Text displayed alongside the computer image in the mission briefing.               |

#### Part Object (within `parts` array)

| Field               | Type   | Required | Description                                                                                           |
|---------------------|--------|----------|-------------------------------------------------------------------------------------------------------|
| `id`                | string | Yes      | Kebab-case identifier for this part (e.g., `"part-1"`). Must be unique within the planet.            |
| `title`             | string | Yes      | Display title for this curriculum part shown in the table of contents.                               |
| `part_style`        | string | Yes      | CSS style class applied to this part's TOC entry (e.g., `"lesson-1"`, `"quiz-1"`). Mirrors existing convention. |
| `lesson_page_range` | object | Yes (for lesson parts) | Planet-local page range for this lesson section. See [Lesson Page Range](#lesson-page-range-object). |
| `quiz_slugs`        | array  | Yes (for quiz parts)   | Ordered list of quiz slug strings that belong to this part. Each slug maps to a file under `quizzes/`. |
| `transition`        | object | No       | Story transition shown just before the quiz begins. See [Transition Object](#transition-object).     |

> Note: A part is either a lesson part (has `lesson_page_range`, no `quiz_slugs`) or a quiz part (has `quiz_slugs`, no `lesson_page_range`). Parts alternate: lesson, quiz, lesson, quiz, ...

#### Lesson Page Range Object

| Field   | Type    | Required | Description                                                                   |
|---------|---------|----------|-------------------------------------------------------------------------------|
| `start` | integer | Yes      | First planet-local page number of this lesson section. Minimum value: 1.     |
| `end`   | integer | Yes      | Last planet-local page number of this lesson section. Must be >= `start`.    |

#### Transition Object

| Field       | Type   | Required | Description                                                                                  |
|-------------|--------|----------|----------------------------------------------------------------------------------------------|
| `character` | string | Yes      | Name of the character delivering the transition message.                                    |
| `message`   | string | Yes      | Story message shown to the student before the quiz starts.                                  |

#### Example manifest.json (abbreviated)

```json
{
  "slug": "privacy-planet",
  "name": "Privacy Planet",
  "title": "Sensitive Information",
  "order": 1,
  "active": true,
  "theme": {
    "primary": "#4A90D9",
    "secondary": "#2C5F8A",
    "background": "#EAF4FF",
    "accent": "#F5A623"
  },
  "icon": "privacy-planet-icon.png",
  "intro": {
    "intro_text": "Welcome to Privacy Planet...",
    "computer_image_name": "patrick-wanted.png",
    "computer_text": "Hello Cyber Hero! We are told that Patrick..."
  },
  "parts": [
    {
      "id": "part-1",
      "title": "What is Sensitive Data?",
      "part_style": "lesson-1",
      "lesson_page_range": { "start": 1, "end": 19 }
    },
    {
      "id": "part-1-quiz",
      "title": "Sensitive Data Quiz 1",
      "part_style": "quiz-1",
      "quiz_slugs": ["sensitive-data-quiz-1"],
      "transition": {
        "character": "Allie",
        "message": "Use what you learned to defeat Enemy 1!"
      }
    }
  ]
}
```

---

### lesson.json

Contains all lesson pages scoped to this planet. Page numbers are **planet-local** — they always start at 1 and increment by 1. This file mirrors the structure of the existing `lesson.json` but contains only one planet's pages.

#### Top-Level Fields

| Field        | Type   | Required | Description                                                                    |
|--------------|--------|----------|--------------------------------------------------------------------------------|
| `planet_slug`| string | Yes      | The slug of the planet this lesson belongs to. Used for traceability.         |
| `pages`      | array  | Yes      | Ordered array of page objects. Page numbers must be contiguous starting at 1. |

#### Page Object

| Field        | Type    | Required | Description                                                                                       |
|--------------|---------|----------|---------------------------------------------------------------------------------------------------|
| `page_number`| integer | Yes      | Planet-local page number. Starts at 1, must be unique within the file.                           |
| `characters` | array   | No       | Characters visible on this page. See [Character Object](#character-object).                      |
| `message`    | object  | Yes      | The dialogue or narrative content displayed on this page. See [Message Object](#message-object). |

#### Character Object

| Field   | Type   | Required | Description                                                                             |
|---------|--------|----------|-----------------------------------------------------------------------------------------|
| `name`  | string | Yes      | Character display name (e.g., `"Cyber Hero"`, `"Allie"`, `"Privacy Enemy"`).          |
| `style` | string | Yes      | Space-separated CSS class string controlling character position and appearance.         |
| `arrow` | integer| No       | If present, renders a clickable arrow on this character navigating to the given page.  |

#### Message Object

| Field          | Type            | Required | Description                                                                                                               |
|----------------|-----------------|----------|---------------------------------------------------------------------------------------------------------------------------|
| `text`         | string          | Yes      | Dialogue or narrative text. Vocab terms are wrapped with `<v>term**` syntax for tooltip rendering.                       |
| `speaker`      | string          | No       | Name of the speaking character. Omitted for narration-only or alert pages.                                               |
| `style`        | string          | Yes      | CSS class for the message box layout (e.g., `"message-box-bottom"`, `"alert-header"`).                                   |
| `speaker_style`| string          | No       | CSS class controlling speaker label alignment (e.g., `"speaker-right"`, `"speaker-left"`).                               |
| `buttons`      | object          | Yes      | Navigation controls. One of: `{ "prev": N, "next": N }`, `{ "next": N }`, `{ "prev": N }`, or `{ "none": true }`. |

#### Example lesson.json

```json
{
  "planet_slug": "privacy-planet",
  "pages": [
    {
      "page_number": 1,
      "characters": [
        { "name": "Cyber Hero", "style": "character-left" }
      ],
      "message": {
        "text": "I've made it to Privacy Planet, I wonder what I'm going to find!",
        "speaker": "Cyber Hero",
        "style": "message-box-bottom",
        "speaker_style": "speaker-right",
        "buttons": { "next": 2 }
      }
    },
    {
      "page_number": 2,
      "characters": [
        { "name": "Allie", "style": "character-right character-flip" }
      ],
      "message": {
        "text": "Hii! I'm Allie. I lost my <v>sensitive data** to Patrick. Can you help me get it back?",
        "speaker": "Allie",
        "style": "message-box-bottom",
        "speaker_style": "speaker-left",
        "buttons": { "prev": 1, "next": 3 }
      }
    },
    {
      "page_number": 3,
      "characters": [
        { "name": "Cyber Hero", "style": "character-left" }
      ],
      "message": {
        "text": "<v>Sensitive data**? What is that?",
        "speaker": "Cyber Hero",
        "style": "message-box-bottom",
        "speaker_style": "speaker-right",
        "buttons": { "prev": 2, "next": 4 }
      }
    }
  ]
}
```

---

### quizzes/\<slug\>.json

One file per quiz. The filename (without `.json`) must exactly match the `slug` field inside the file and must be listed in the parent planet's `manifest.json` `parts[].quiz_slugs` array.

There are five quiz formats. The `type` field (required in this schema — note it was absent from drag-drop and red-flag-green-flag files in the existing data) determines which additional fields are required.

#### Shared Top-Level Fields (all quiz types)

| Field         | Type   | Required | Description                                                                          |
|---------------|--------|----------|--------------------------------------------------------------------------------------|
| `slug`        | string | Yes      | Kebab-case identifier matching the filename. E.g., `"sensitive-data-quiz-1"`.       |
| `planet_slug` | string | Yes      | Slug of the planet this quiz belongs to. Used for traceability.                     |
| `type`        | string | Yes      | Quiz format. One of: `"multiple-choice"`, `"drag-drop"`, `"red-flag-green-flag"`.  |
| `part`        | string | Yes      | Which part this quiz belongs to (e.g., `"quiz-1"`). Mirrors existing convention.   |
| `questions`   | array  | Yes      | Array of question objects. Structure varies by `type`. See [Quiz Types](#quiz-types). |

> Note: The existing data uses a `quiz` key for the questions array. This schema standardizes it to `questions` for clarity.

#### Example quiz file header

```json
{
  "slug": "sensitive-data-quiz-1",
  "planet_slug": "privacy-planet",
  "type": "multiple-choice",
  "part": "quiz-1",
  "questions": [...]
}
```

---

### vocab.json

Contains vocabulary definitions scoped to this planet. Terms from this file are referenced inline in lesson pages using the `<v>term**` syntax.

#### Top-Level Fields

| Field         | Type   | Required | Description                                                              |
|---------------|--------|----------|--------------------------------------------------------------------------|
| `planet_slug` | string | Yes      | Slug of the planet this vocab list belongs to.                          |
| `words`       | array  | Yes      | Array of vocabulary entry objects.                                       |

#### Vocabulary Entry Object

| Field        | Type   | Required | Description                                              |
|--------------|--------|----------|----------------------------------------------------------|
| `word`       | string | Yes      | The vocabulary term as it appears in the lesson text.   |
| `definition` | string | Yes      | Plain-language definition suitable for the target age.  |

#### Example vocab.json

```json
{
  "planet_slug": "privacy-planet",
  "words": [
    {
      "word": "Sensitive Data",
      "definition": "Private and personal information that should be kept safe."
    },
    {
      "word": "Identity",
      "definition": "The unique set of characteristics that make a person who they are."
    },
    {
      "word": "Guardian",
      "definition": "A person who is responsible for the care and upbringing of a child."
    }
  ]
}
```

---

## Parts Array Design

### Why Parts Reference Content by Name (Not Global Page Numbers)

The `parts` array in `manifest.json` is the **authoritative curriculum map** for a planet. It answers: "What content does this planet contain, and in what order?"

In the existing system, the table of contents references lesson sections by their global `start_page` number and quizzes by an integer `quiz_part`. This creates tight coupling:

- If any earlier planet's page count changes, all subsequent `start_page` references across the entire table of contents become wrong.
- Quiz references (`quiz_part: 2`) are meaningless without knowing which file to look in.

The new design solves both problems:

**Lesson sections** use `lesson_page_range` with planet-local page numbers. Since page numbers restart at 1 per planet (this is already how `lesson.json` works), changing one planet's content never affects another planet's page references.

**Quizzes** use `quiz_slugs` — an array of filename-based identifiers. The connection between the manifest and the quiz content is the filename itself, which is stable and human-readable.

### How Planet-Local Page Numbering Enables Reordering

Because every planet's pages are numbered 1..N independently:

- Moving a planet from position 2 to position 4 in the curriculum requires only changing its `order` field.
- No page numbers in `lesson.json`, `parts[].lesson_page_range`, or `transition.end_page` need to change.
- Lesson navigation buttons (`buttons.prev` and `buttons.next`) reference planet-local pages and remain correct.

### Parts Alternation Pattern

Parts alternate between lesson content and quiz content:

```
part-1         (lesson)  → pages 1–19
part-1-quiz    (quiz)    → quiz slugs for part 1
part-2         (lesson)  → pages 20–24
part-2-quiz    (quiz)    → quiz slugs for part 2
part-3         (lesson)  → pages 25–34
part-3-quiz    (quiz)    → quiz slugs for part 3
```

A part has **either** `lesson_page_range` or `quiz_slugs` — never both. The `part_style` field (`"lesson-1"`, `"quiz-2"`, etc.) drives the visual styling in the table of contents.

### Multiple Quizzes Per Part

`quiz_slugs` is an array to support planets where a part has more than one quiz type. For example, Privacy Planet's first part includes both a multiple-choice quiz and a drag-drop quiz:

```json
"quiz_slugs": ["sensitive-data-quiz-1", "sensitive-data-drag-drop"]
```

The quizzes are presented in the order they appear in `quiz_slugs`.

---

## Quiz Types

All quiz types share the top-level fields defined in [quizzes/\<slug\>.json](#quizzesslugjson). The `questions` array structure varies by type.

### Type: multiple-choice

Used for standard single-answer and multi-answer questions. Also covers `true-false` variant questions (where `answers` is always `["True", "False"]`).

#### Question Object Fields

| Field             | Type    | Required | Description                                                                                                  |
|-------------------|---------|----------|--------------------------------------------------------------------------------------------------------------|
| `id`              | integer | Yes      | Unique question identifier within this quiz file.                                                            |
| `type`            | string  | Yes      | `"multiple-choice"`, `"multiple-select"`, or `"true-false"`. Determines whether one or many answers are valid. |
| `question`        | string  | Yes      | The question text displayed to the student.                                                                  |
| `answers`         | array   | Yes      | Array of answer option strings.                                                                              |
| `correct_answers` | array   | Yes      | Array of 0-indexed integers identifying correct answer(s).                                                   |
| `correct_message` | array   | Yes      | Array of two strings: `[short_praise, explanation]` shown on correct answer.                                |
| `incorrect_messages`| array | Yes      | Array of strings, one per answer option. Empty string (`""`) for the correct answer's slot.                 |
| `health_bar`      | number  | Yes      | Enemy health remaining (0.0–1.0) after this question. Used for battle UI. Last question should be 0.0.      |
| `hint`            | string  | Yes      | Hint text shown to the student. Empty string if no hint.                                                    |
| `lesson_page`     | integer | No       | Planet-local page number to navigate to after this quiz part completes. Present only on the last question.  |

#### Example multiple-choice question

```json
{
  "id": 1,
  "type": "multiple-choice",
  "question": "What is Sensitive Data?",
  "answers": [
    "Information that is private and personal to you",
    "Details that only your friends need to know",
    "A type of public information anyone can access",
    "Information that has no impact on your safety"
  ],
  "correct_answers": [0],
  "correct_message": [
    "You got it correct!",
    "Sensitive data is private and personal to you, like your name, address, or phone number."
  ],
  "incorrect_messages": [
    "",
    "Sensitive data is not just for friends; it should only be shared with trusted adults when necessary.",
    "Public information is meant to be widely available, while sensitive data should be restricted.",
    "Sensitive data, if exposed, can have serious consequences, such as identity theft or fraud."
  ],
  "health_bar": 0.8,
  "hint": "Hint: Sensitive data is something you want to protect"
}
```

---

### Type: drag-drop

Students drag information items into one of two buckets: **Sensitive Data** (private, keep safe) or **Public Info** (safe to share). Each question presents a single item to classify.

#### Question Object Fields

| Field              | Type    | Required | Description                                                                                             |
|--------------------|---------|----------|---------------------------------------------------------------------------------------------------------|
| `id`               | integer | Yes      | Unique question identifier within this quiz file.                                                       |
| `question`         | string  | Yes      | The item/scenario to classify (e.g., `"Your Full Name"`).                                              |
| `correct_answer`   | integer | Yes      | `0` = Sensitive Data (private), `1` = Public Info (safe to share).                                    |
| `correct_message`  | string  | Yes      | Explanation shown when the student places the item correctly.                                           |
| `incorrect_message`| string  | Yes      | Hint shown when the student places the item incorrectly.                                                |
| `lesson_page`      | integer | No       | Planet-local page number to navigate to after this quiz completes. Present only on the last question.  |

> Note: `correct_message` and `incorrect_message` are singular strings (not arrays), unlike the multiple-choice type.

#### Example drag-drop question

```json
{
  "id": 1,
  "question": "Your Full Name",
  "correct_answer": 0,
  "correct_message": "Your full name is sensitive data. Strangers who know your full name can look up more information about you, like where you live or where you go to school.",
  "incorrect_message": "Think about what people can look up if they know your full name. Is this something you would want a stranger to have access to?"
}
```

---

### Type: red-flag-green-flag

Students evaluate online scenarios and label each one as a **Red Flag** (dangerous, concerning) or **Green Flag** (safe, acceptable). The question presents a scenario sentence.

#### Question Object Fields

| Field              | Type    | Required | Description                                                                                             |
|--------------------|---------|----------|---------------------------------------------------------------------------------------------------------|
| `id`               | integer | Yes      | Unique question identifier within this quiz file.                                                       |
| `question`         | string  | Yes      | The online scenario to evaluate.                                                                        |
| `correct_answer`   | integer | Yes      | `0` = Red Flag (dangerous/concerning), `1` = Green Flag (safe/acceptable).                            |
| `correct_message`  | string  | Yes      | Explanation shown when the student classifies the scenario correctly.                                   |
| `incorrect_message`| string  | Yes      | Feedback shown when the student classifies the scenario incorrectly.                                    |
| `lesson_page`      | integer | No       | Planet-local page number to navigate to after this quiz completes. Present only on the last question.  |

#### Example red-flag-green-flag question

```json
{
  "id": 1,
  "question": "You're playing Roblox and another player says, 'Want to build something cool?'",
  "correct_answer": 1,
  "correct_message": "They're keeping the conversation inside the game and talking about game activities — it's not personal or inappropriate.",
  "incorrect_message": "They're not asking for your real name, where you live, or trying to meet in real life."
}
```

---

## Worked Example: privacy-planet

This section provides a complete, internally consistent set of content files for the `privacy-planet` module.

### Directory layout

```
src/data/planets/privacy-planet/
├── manifest.json
├── lesson.json
├── vocab.json
└── quizzes/
    ├── sensitive-data-quiz-1.json
    ├── sensitive-data-drag-drop.json
    ├── sensitive-data-quiz-2.json
    └── sensitive-data-quiz-3.json
```

---

### manifest.json

```json
{
  "slug": "privacy-planet",
  "name": "Privacy Planet",
  "title": "Sensitive Information",
  "order": 1,
  "active": true,
  "theme": {
    "primary": "#4A90D9",
    "secondary": "#2C5F8A",
    "background": "#EAF4FF",
    "accent": "#F5A623"
  },
  "icon": "privacy-planet-icon.png",
  "intro": {
    "intro_text": "Welcome to Privacy Planet. Life here is generally peaceful, and people usually have nothing much to worry about. However, over the last few years, Privacy Planet is becoming less and less private. Investigate the cause for the issue and help the people on the planet.",
    "computer_image_name": "patrick-wanted.png",
    "computer_text": "Hello Cyber Hero! We are told that Patrick the Predatorus is keeping something very valuable that he stole. We need your help to find what he stole and bring it back to us. This journey will be dangerous, be very careful about ANYONE that you meet on Privacy Planet!"
  },
  "parts": [
    {
      "id": "part-1",
      "title": "What is Sensitive Data?",
      "part_style": "lesson-1",
      "lesson_page_range": { "start": 1, "end": 19 }
    },
    {
      "id": "part-1-quiz",
      "title": "Sensitive Data Quiz 1",
      "part_style": "quiz-1",
      "quiz_slugs": ["sensitive-data-quiz-1", "sensitive-data-drag-drop"],
      "transition": {
        "character": "Allie",
        "message": "Use what you learned to Defeat Enemy 1 and help me get back my information!!!"
      }
    },
    {
      "id": "part-2",
      "title": "Why is Sensitive Data Important?",
      "part_style": "lesson-2",
      "lesson_page_range": { "start": 20, "end": 24 }
    },
    {
      "id": "part-2-quiz",
      "title": "Sensitive Data Quiz 2",
      "part_style": "quiz-2",
      "quiz_slugs": ["sensitive-data-quiz-2"],
      "transition": {
        "character": "Allie",
        "message": "Huh looks like an enemy is trying to follow us! Quick let's defeat them with our knowledge!"
      }
    },
    {
      "id": "part-3",
      "title": "Who Should Sensitive Data Be Shared With?",
      "part_style": "lesson-3",
      "lesson_page_range": { "start": 25, "end": 34 }
    },
    {
      "id": "part-3-quiz",
      "title": "Sensitive Data Quiz 3",
      "part_style": "quiz-3",
      "quiz_slugs": ["sensitive-data-quiz-3"],
      "transition": {
        "character": "Allie",
        "message": "Looks like we have everything we need to finish this planet! Let's defeat the last enemy to get my sensitive data Back!"
      }
    }
  ]
}
```

---

### lesson.json (pages 1–3 shown; full file would contain pages 1–34)

```json
{
  "planet_slug": "privacy-planet",
  "pages": [
    {
      "page_number": 1,
      "characters": [
        { "name": "Cyber Hero", "style": "character-left" }
      ],
      "message": {
        "text": "I've made it to Privacy Planet, I wonder what I'm going to find!",
        "speaker": "Cyber Hero",
        "style": "message-box-bottom",
        "speaker_style": "speaker-right",
        "buttons": { "next": 2 }
      }
    },
    {
      "page_number": 2,
      "characters": [
        { "name": "Allie", "style": "character-right character-flip" }
      ],
      "message": {
        "text": "Hii! I'm Allie. I lost my <v>sensitive data** to Patrick. Can you help me get it back?",
        "speaker": "Allie",
        "style": "message-box-bottom",
        "speaker_style": "speaker-left",
        "buttons": { "prev": 1, "next": 3 }
      }
    },
    {
      "page_number": 3,
      "characters": [
        { "name": "Cyber Hero", "style": "character-left" }
      ],
      "message": {
        "text": "<v>Sensitive data**? What is that?",
        "speaker": "Cyber Hero",
        "style": "message-box-bottom",
        "speaker_style": "speaker-right",
        "buttons": { "prev": 2, "next": 4 }
      }
    },
    {
      "page_number": 4,
      "characters": [
        { "name": "Allie", "style": "character-right character-flip" }
      ],
      "message": {
        "text": "<v>Sensitive data** is private and personal information that belongs to you and should be kept safe.",
        "speaker": "Allie",
        "style": "message-box-bottom",
        "speaker_style": "speaker-left",
        "buttons": { "prev": 3, "next": 5 }
      }
    },
    {
      "page_number": 5,
      "characters": [
        { "name": "Allie", "style": "character-right character-flip" }
      ],
      "message": {
        "text": "Sharing your <v>sensitive data** with the wrong people like Patrick could lead to problems, so it's important to know what <v>sensitive data** is and how to protect it.",
        "speaker": "Allie",
        "style": "message-box-bottom",
        "speaker_style": "speaker-left",
        "buttons": { "prev": 4, "next": 6 }
      }
    }
  ]
}
```

> The full `lesson.json` for `privacy-planet` contains 34 pages (pages 1–34 matching the `part_style` ranges in `manifest.json`). Pages 1–19 correspond to Part 1, pages 20–24 to Part 2, and pages 25–34 to Part 3.

---

### quizzes/sensitive-data-quiz-1.json

```json
{
  "slug": "sensitive-data-quiz-1",
  "planet_slug": "privacy-planet",
  "type": "multiple-choice",
  "part": "quiz-1",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "What is Sensitive Data?",
      "answers": [
        "Information that is private and personal to you",
        "Details that only your friends need to know",
        "A type of public information anyone can access",
        "Information that has no impact on your safety"
      ],
      "correct_answers": [0],
      "correct_message": [
        "You got it correct!",
        "Sensitive data is private and personal to you, like your name, address, or phone number."
      ],
      "incorrect_messages": [
        "",
        "Sensitive data is not just for friends; it should only be shared with trusted adults when necessary.",
        "Public information is meant to be widely available, while sensitive data should be restricted.",
        "Sensitive data, if exposed, can have serious consequences, such as identity theft or fraud."
      ],
      "health_bar": 0.8,
      "hint": "Hint: Sensitive data is something you want to protect"
    },
    {
      "id": 2,
      "type": "multiple-choice",
      "question": "Why is it important to keep sensitive data safe?",
      "answers": [
        "Because sharing it with more people makes you more popular",
        "To prevent others from stealing your identity or personal information",
        "So that strangers can help you with your personal details",
        "It is not important to keep sensitive data safe"
      ],
      "correct_answers": [1],
      "correct_message": [
        "Correct! How did you know?",
        "Protecting sensitive data helps prevent identity theft, fraud, and unauthorized access to personal accounts."
      ],
      "incorrect_messages": [
        "Popularity is not linked to sharing personal data; it is about maintaining trust and safety.",
        "",
        "Strangers should never have access to your personal details, as they could misuse them.",
        "Keeping data safe is essential for protecting your identity and personal security."
      ],
      "health_bar": 0.6,
      "hint": "Hint: You wouldn't share your password with a stranger, right? Keeping your information safe protects you!"
    },
    {
      "id": 3,
      "type": "multiple-select",
      "question": "What information should you keep private from strangers? (Select all that apply)",
      "answers": [
        "Full name",
        "Favorite food",
        "Birthday",
        "Favorite color",
        "Phone number",
        "Home Address"
      ],
      "correct_answers": [0, 2, 4, 5],
      "correct_message": [
        "Another one right!",
        "Your full name, birthday, phone number, and home address can be used to identify and track someone."
      ],
      "incorrect_messages": [
        "A favorite color is not considered sensitive data because it does not reveal personal details that could be exploited."
      ],
      "health_bar": 0.4,
      "hint": "Hint: If a stranger shouldn't know it, keep it private!"
    },
    {
      "id": 4,
      "type": "true-false",
      "question": "A stranger can use your home address to find out where you live.",
      "answers": ["True", "False"],
      "correct_answers": [0],
      "correct_message": [
        "Correct again!",
        "If someone knows your home address, they can determine your exact location, which poses a security risk."
      ],
      "incorrect_messages": [
        "",
        "Think about what a home address provides. Your home address is sensitive data that you do not want to share with strangers online."
      ],
      "health_bar": 0.2,
      "hint": ""
    },
    {
      "id": 5,
      "type": "multiple-choice",
      "question": "Why is it risky to share your birthday online?",
      "answers": [
        "People might forget to send you a gift",
        "It's not risky at all",
        "Someone could use it to guess passwords or pretend to be you",
        "It makes it harder to buy a cake"
      ],
      "correct_answers": [2],
      "correct_message": [
        "You got all of the questions correct!",
        "Birthdays are often used as part of security questions or for identity verification, making them valuable to cybercriminals."
      ],
      "incorrect_messages": [
        "Security risks have nothing to do with receiving gifts.",
        "Sharing a birthday can contribute to identity theft.",
        "",
        "This answer has no connection to cybersecurity risks."
      ],
      "health_bar": 0,
      "hint": "Hint: Birthdays are fun to celebrate, but you also use your birthdate to set up online accounts.",
      "lesson_page": 20
    }
  ]
}
```

---

### quizzes/sensitive-data-drag-drop.json

```json
{
  "slug": "sensitive-data-drag-drop",
  "planet_slug": "privacy-planet",
  "type": "drag-drop",
  "part": "quiz-1",
  "questions": [
    {
      "id": 1,
      "question": "Your Favorite Color",
      "correct_answer": 1,
      "correct_message": "Your favorite color can be public information and shared with strangers as it does not contain any sensitive data.",
      "incorrect_message": "Think about what sensitive data is made up of. Does your favorite color contain any personal information about yourself?"
    },
    {
      "id": 2,
      "question": "Your Full Name",
      "correct_answer": 0,
      "correct_message": "Your full name is sensitive data. Strangers who know your full name can look up more information about you, like where you live or where you go to school.",
      "incorrect_message": "Think about what people can look up if they know your full name. Is this something you would want a stranger to have access to?"
    },
    {
      "id": 3,
      "question": "Your Birthday",
      "correct_answer": 0,
      "correct_message": "People can use your birthday to guess passwords or pretend to be you online.",
      "incorrect_message": "Think about where your birthday can be used on the internet. What information or accounts can a stranger access with your birthday?"
    },
    {
      "id": 4,
      "question": "Your Home Address",
      "correct_answer": 0,
      "correct_message": "Your home address is where you live. Sharing this online with strangers can be dangerous as it allows them to find exactly where you are.",
      "incorrect_message": "Think about what people can access with your home address. Is this something you would want a stranger to have?",
      "lesson_page": 20
    }
  ]
}
```

---

### quizzes/sensitive-data-quiz-2.json (abbreviated)

```json
{
  "slug": "sensitive-data-quiz-2",
  "planet_slug": "privacy-planet",
  "type": "multiple-choice",
  "part": "quiz-2",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "What is one of the main reasons to keep sensitive information private?",
      "answers": [
        "To ensure you have more storage space",
        "To prevent others from using it against you",
        "To not get bored with too much information",
        "To make it easier to share with friends later"
      ],
      "correct_answers": [1],
      "correct_message": [
        "That's correct!",
        "Sensitive information can be used for identity theft, fraud, or manipulation. Keeping it private reduces these risks."
      ],
      "incorrect_messages": [
        "Protecting data has nothing to do with digital storage.",
        "",
        "Privacy is about safety, not entertainment.",
        "Sensitive data should not be shared casually."
      ],
      "health_bar": 0.66,
      "hint": "Hint: Think about what people can do with your sensitive data."
    },
    {
      "id": 2,
      "type": "true-false",
      "question": "Once your sensitive data has been leaked, it is usually easy to retrieve and secure it again.",
      "answers": ["True", "False"],
      "correct_answers": [1],
      "correct_message": [
        "You got everything correct! You defeat the enemy!",
        "Once sensitive data is exposed, it is difficult to remove from the internet or prevent others from using it."
      ],
      "incorrect_messages": [
        "Once data is exposed, it is very hard to fully remove it from the internet.",
        ""
      ],
      "health_bar": 0,
      "hint": "Hint: Think about what kinds of information someone will have access to if they get your data.",
      "lesson_page": 25
    }
  ]
}
```

---

### vocab.json

```json
{
  "planet_slug": "privacy-planet",
  "words": [
    {
      "word": "Sensitive Data",
      "definition": "Private and personal information that should be kept safe."
    },
    {
      "word": "Identity",
      "definition": "The unique set of characteristics that make a person who they are."
    },
    {
      "word": "Investigate",
      "definition": "To look into a complex or unknown situation in detail."
    },
    {
      "word": "Valuable",
      "definition": "Of great worth or importance."
    },
    {
      "word": "Guardian",
      "definition": "A person who is responsible for the care and upbringing of a child."
    },
    {
      "word": "Trustworthy",
      "definition": "Able to be trusted or depended on."
    }
  ]
}
```

---

## Worked Example: privacy-moon

Privacy Moon is a **companion moon** to Privacy Planet. It covers the lesson topic "Sharing Online" and is the direct narrative sequel to Privacy Planet. It is structurally similar to a planet but has two distinguishing features:

1. `parent_planet_slug` identifies the planet it extends.
2. It is shorter (fewer pages and parts) than a primary planet.

### Directory layout

```
src/data/planets/privacy-moon/
├── manifest.json
├── lesson.json
├── vocab.json
└── quizzes/
    ├── sharing-online-quiz-1.json
    ├── sharing-online-rfgf.json
    └── sharing-online-quiz-2.json
```

---

### manifest.json

```json
{
  "slug": "privacy-moon",
  "name": "Privacy Moon",
  "title": "Sharing Online",
  "order": 2,
  "active": true,
  "parent_planet_slug": "privacy-planet",
  "theme": {
    "primary": "#7B68D9",
    "secondary": "#4A3F8A",
    "background": "#F0EEFF",
    "accent": "#E8A0D4"
  },
  "icon": "privacy-moon-icon.png",
  "intro": {
    "intro_text": "Welcome to Privacy Moon. Life here is quiet, but residents have begun to report suspicious behavior nearby. We need your help to find the cause.\n\nWARNING: This lesson is the second part of Privacy Planet. This lesson can be completed on its own, but the story or lesson contents may not make sense.",
    "computer_image_name": "patrick-wanted.png",
    "computer_text": "Hello Cyber Hero! Patrick has escaped from Privacy Planet and is hiding somewhere on the moon. Allie's brother, Alejandro, should be nearby. Find him and defeat Patrick for good!"
  },
  "parts": [
    {
      "id": "part-1",
      "title": "Private vs Public Information",
      "part_style": "lesson-1",
      "lesson_page_range": { "start": 1, "end": 8 }
    },
    {
      "id": "part-1-quiz",
      "title": "Sharing Online Quiz 1",
      "part_style": "quiz-1",
      "quiz_slugs": ["sharing-online-quiz-1", "sharing-online-rfgf"],
      "transition": {
        "character": "Alejandro",
        "message": "What are some examples of these types of information?\n\nHMM... let's test your knowledge."
      }
    },
    {
      "id": "part-2",
      "title": "Being Smart About What You Share",
      "part_style": "lesson-2",
      "lesson_page_range": { "start": 9, "end": 25 }
    },
    {
      "id": "part-2-quiz",
      "title": "Sharing Online Quiz 2",
      "part_style": "quiz-2",
      "quiz_slugs": ["sharing-online-quiz-2"],
      "transition": {
        "character": "Alejandro",
        "message": "Huh Looks like an enemy is trying to follow us! Quick let's defeat them with our knowledge!"
      }
    }
  ]
}
```

> Privacy Moon has 2 parts (vs Privacy Planet's 3) and uses `parent_planet_slug: "privacy-planet"` to express its relationship. The theme uses a purple/lavender palette to visually distinguish it from the blue Privacy Planet.

---

### lesson.json (pages 1–3 shown; full file contains pages 1–25)

```json
{
  "planet_slug": "privacy-moon",
  "pages": [
    {
      "page_number": 1,
      "characters": [
        { "name": "Cyber Hero", "style": "character-left" }
      ],
      "message": {
        "text": "I landed on the moon. I must find Alejandro!",
        "speaker": "Cyber Hero",
        "style": "message-box-bottom",
        "speaker_style": "speaker-right",
        "buttons": { "next": 2 }
      }
    },
    {
      "page_number": 2,
      "characters": [
        { "name": "Alejandro", "style": "character-right character-flip" }
      ],
      "message": {
        "text": "Cyber Hero! Over here! Patrick is hiding somewhere on this moon. We need to learn about <v>public vs private** information to stop him.",
        "speaker": "Alejandro",
        "style": "message-box-bottom",
        "speaker_style": "speaker-left",
        "buttons": { "prev": 1, "next": 3 }
      }
    },
    {
      "page_number": 3,
      "characters": [
        { "name": "Alejandro", "style": "character-right character-flip" }
      ],
      "message": {
        "text": "Some information is <v>private** — like your home address, phone number, and passwords. Other information is <v>public** — like your favorite color or the sports team you cheer for.",
        "speaker": "Alejandro",
        "style": "message-box-bottom",
        "speaker_style": "speaker-left",
        "buttons": { "prev": 2, "next": 4 }
      }
    }
  ]
}
```

> Page numbers start at 1 for this moon module, completely independent of Privacy Planet's page numbering.

---

### quizzes/sharing-online-quiz-1.json

```json
{
  "slug": "sharing-online-quiz-1",
  "planet_slug": "privacy-moon",
  "type": "multiple-choice",
  "part": "quiz-1",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "A person online wants to meet you in real life. What is the safest action?",
      "answers": [
        "Agree to meet them if they seem friendly",
        "Ask for a picture to make sure they're real",
        "Share your location but only with them",
        "Tell a trusted adult right away"
      ],
      "correct_answers": [3],
      "correct_message": [
        "That's right!",
        "The safest option is to inform a trusted adult, as meeting someone from the internet can be risky."
      ],
      "incorrect_messages": [
        "Just because someone seems friendly online doesn't mean they are safe in real life.",
        "A picture doesn't guarantee safety; people can fake or manipulate images.",
        "Sharing your location with a stranger online is dangerous and can put you and your family at risk.",
        ""
      ],
      "health_bar": 0.6,
      "hint": "Hint: If something makes you unsure or feels risky, talk to someone you trust first."
    },
    {
      "id": 2,
      "type": "multiple-choice",
      "question": "Someone online is being really nice to you and making you feel special. What should you be aware of?",
      "answers": [
        "They could be trying to gain your trust for the wrong reasons — remain cautious",
        "If they seem nice, there's no reason to worry",
        "You should tell them personal details so they continue being nice",
        "Trust them completely because they make you feel good"
      ],
      "correct_answers": [0],
      "correct_message": [
        "Exactly right!",
        "Some people use kindness as a tactic to gain trust and manipulate others."
      ],
      "incorrect_messages": [
        "",
        "Even if someone appears nice, they may have bad intentions. It's important to be cautious.",
        "Sharing personal details makes you vulnerable to scams and manipulation.",
        "Feelings of trust should be built over time with known and safe people, not strangers online."
      ],
      "health_bar": 0,
      "hint": "Hint: Sometimes people pretend to be nice to get something from you — stay alert.",
      "lesson_page": 9
    }
  ]
}
```

---

### quizzes/sharing-online-rfgf.json

```json
{
  "slug": "sharing-online-rfgf",
  "planet_slug": "privacy-moon",
  "type": "red-flag-green-flag",
  "part": "quiz-1",
  "questions": [
    {
      "id": 1,
      "question": "You're playing Roblox and another player says, 'Want to build something cool?'",
      "correct_answer": 1,
      "correct_message": "They're keeping the conversation inside the game and talking about game activities — it's not personal or inappropriate.",
      "incorrect_message": "They're not asking for your real name, where you live, or trying to meet in real life."
    },
    {
      "id": 2,
      "question": "They try to make you feel special or tell you to keep your conversation a secret.",
      "correct_answer": 0,
      "correct_message": "Telling you to keep secrets from trusted adults is a big warning sign. Safe people don't do that.",
      "incorrect_message": "Green flag conversations are honest, open, and never ask you to hide things."
    },
    {
      "id": 3,
      "question": "A person online wants to meet you in real life.",
      "correct_answer": 0,
      "correct_message": "Meeting someone from the internet can be dangerous — especially if you don't really know who they are.",
      "incorrect_message": "Green flag people don't ask kids to meet up — it's not safe.",
      "lesson_page": 9
    }
  ]
}
```

---

### vocab.json

```json
{
  "planet_slug": "privacy-moon",
  "words": [
    {
      "word": "Phishing",
      "definition": "Methods of tricking people into revealing private information like email addresses and passwords."
    },
    {
      "word": "Emergency",
      "definition": "A sudden and unexpected situation that requires immediate attention."
    },
    {
      "word": "Scenario",
      "definition": "An imagined setting that shows a situation that can possibly happen."
    },
    {
      "word": "Trustworthy",
      "definition": "Able to be trusted or depended on."
    },
    {
      "word": "Feature",
      "definition": "A characteristic or ability of something."
    }
  ]
}
```

---

## Migration Notes

These notes describe how existing global data maps to the new per-planet schema. No code changes are required; this is conceptual guidance for a future migration.

### lesson.json

The existing `lesson.json` has a `planets` array where each entry already uses planet-local page numbering (pages restart at 1 per planet). Migration is straightforward:

- Each `planets[i]` entry becomes a separate `src/data/planets/<planet-slug>/lesson.json`.
- Add a `planet_slug` field matching the directory name.
- The `planet_name` field is replaced by `planet_slug` for machine-readability; the human-readable name lives in `manifest.json`.

### table_of_contents.json

The existing TOC references lesson sections by `start_page` (integer) and quizzes by `quiz_part` (integer). In the new schema:

- Each `parts[]` entry in `table_of_contents.json` becomes a `parts[]` entry in `manifest.json`.
- `start_page` becomes `lesson_page_range.start`. The `end` value must be derived (it is the last page before the next part's `start_page`, or the page referenced by the next quiz's transition `end_page`).
- `quiz_part: N` becomes `quiz_slugs: ["<derived-slug>"]`. Slug names must be chosen and the corresponding quiz files renamed accordingly.
- `part_style` is carried over directly.

### transitions.json

The existing `transitions.json` keyed by planet and quiz part maps as follows:

- `character` and `message` move into `manifest.json` `parts[].transition`.
- `end_page` (the last lesson page before the quiz) becomes `lesson_page_range.end` in the preceding lesson part.

### lesson_intro.json

Each entry maps directly to `manifest.json`:

- `lesson_title` → `manifest.title`
- `intro_text` → `manifest.intro.intro_text`
- `computer_image_name` → `manifest.intro.computer_image_name`
- `computer_text` → `manifest.intro.computer_text`
- `active` → `manifest.active`

### Quiz Files

The existing quiz files use a `quizzes[]` wrapper with `part` as a discriminator. In the new schema:

- Each `quizzes[i]` entry (one per quiz part) becomes a separate file under `quizzes/`.
- The filename (slug) must be chosen to be descriptive and kebab-case.
- Add `slug`, `planet_slug`, and `type` fields to each file.
- Rename `quiz` array to `questions`.
- Rename `correctAnswers` to `correct_answers`, `correctMessage` to `correct_message`, `incorrectMessages` to `incorrect_messages`, `healthBar` to `health_bar`, `lessonPage` to `lesson_page` to normalize to snake_case.
- The drag-drop and red-flag-green-flag files (currently without a `type` field) need `type: "drag-drop"` and `type: "red-flag-green-flag"` added, and `incorrectMessages` renamed to `incorrect_message` (singular, since it is already a string).

### vocab.json

The existing global word list must be split by planet:

- Words used only in Privacy Planet lesson pages go into `privacy-planet/vocab.json`.
- Words used only in Privacy Moon lesson pages go into `privacy-moon/vocab.json`.
- Words used in both can appear in both files (acceptable duplication for self-containment).
- Add `planet_slug` to each file.

---

## Validation

The file `planet.schema.json` at the project root validates a planet's `manifest.json`. It uses JSON Schema draft-07.

### Usage with ajv-cli

```bash
npx ajv-cli validate -s planet.schema.json -d src/data/planets/privacy-planet/manifest.json
npx ajv-cli validate -s planet.schema.json -d src/data/planets/privacy-moon/manifest.json
```

### Usage with Node.js (ajv)

```js
const Ajv = require("ajv");
const ajv = new Ajv();
const schema = require("./planet.schema.json");
const manifest = require("./src/data/planets/privacy-planet/manifest.json");

const validate = ajv.compile(schema);
const valid = validate(manifest);
if (!valid) console.error(validate.errors);
```

### What the Schema Validates

- All required top-level fields are present.
- `slug` and `parent_planet_slug` match the kebab-case pattern `^[a-z0-9]+(-[a-z0-9]+)*$`.
- `order` is a positive integer.
- `theme` contains all four required color fields.
- `parts` is a non-empty array.
- Each part has `id` (kebab-case) and `title`.
- Parts with `lesson_page_range` have valid integer `start` and `end` values where `end >= start >= 1`.
- Parts with `quiz_slugs` have a non-empty array of kebab-case strings.
- No additional properties are allowed at the manifest top level or within `theme`.

Individual quiz files, `lesson.json`, and `vocab.json` are not yet covered by the schema but follow the structures defined in this document. Future schema files (`lesson.schema.json`, `quiz.schema.json`, `vocab.schema.json`) can be added following the same pattern.
