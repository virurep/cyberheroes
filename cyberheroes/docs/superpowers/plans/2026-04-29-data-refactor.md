# Data Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate lesson and quiz data from shared multi-planet JSON files to per-planet folders with auto-sequential page navigation, eliminating integer page references and naming inconsistencies.

**Architecture:** Each planet gets its own folder (`src/data/privacy-planet/`, `src/data/privacy-moon/`) containing `lesson.json` and `quiz.json`. A registry module (`src/data/planets.js`) maps planet slugs to their data files. Components load data via the registry using the URL param slug directly — no string transforms.

**Tech Stack:** React (CRA), React Router, JSON data files, no test suite (verify each task by running `npm start` and navigating the changed route)

**Spec:** `docs/superpowers/specs/2026-04-29-data-refactor-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/data/privacy-planet/lesson.json` | Create | All Privacy Planet lesson data |
| `src/data/privacy-planet/quiz.json` | Create | Privacy Planet quiz questions |
| `src/data/privacy-moon/lesson.json` | Create | All Privacy Moon lesson data |
| `src/data/privacy-moon/quiz.json` | Create | Privacy Moon final quiz (quiz-3) |
| `src/data/privacy-moon/drag-drop.json` | Create | Drag-drop quiz data (moved) |
| `src/data/privacy-moon/red-flag-green-flag.json` | Create | Red/green flag quiz data (moved) |
| `src/data/planets.js` | Create | Registry mapping slug → data |
| `src/components/lessons/Buttons.js` | Modify | Read new `noButtons`/`button` props instead of `buttons` object |
| `src/components/lessons/Message.js` | Modify | Pass new props to Buttons |
| `src/components/lessons/Lesson.js` | Modify | 0-based index, registry, named `to` navigation |
| `src/components/lessons/Transition.js` | Modify | Registry, compute resumeIndex, remove string transforms |
| `src/components/lessons/Transition_Cert.js` | Modify | Registry, remove string transforms |
| `src/components/lessons/LessonIntro.js` | Modify | Registry, remove duplicate lookups |
| `src/components/lessons/TableOfContents.js` | Modify | Registry, 0-based start_page |
| `src/components/review/review.js` | Modify | Registry, remove string transforms |
| `src/components/quizzes/Privacy-Planet-Quiz.js` | Modify | Registry, new field names |
| `src/components/quizzes/Privacy-Planet-Quiz-Answers.js` | Modify | Registry, computed healthBar, resumeIndex |
| `src/components/quizzes/Privacy-Moon-Quiz.js` | Modify | Registry, new field names |
| `src/components/quizzes/Privacy-Moon-Quiz-Answers.js` | Modify | Registry, computed healthBar, resumeIndex |
| `src/components/quizzes/Drag-Drop-Quiz.js` | Modify | Import from new path |
| `src/components/quizzes/RedFlag-GreenFlag-Quiz.js` | Modify | Import from new path |
| `src/components/quizzes/game-answers.js` | Modify | Import from new path if applicable |
| Old shared data files (8 files) | Delete | Removed after all components updated |
| `src/data/lessons/vocab.json` | Keep | Stays global; Message.js imports it directly |

---

## Page Data Transformation Rules

Apply these rules when creating the new `lesson.json` files from the old `lesson.json`:

| Old field | New field | Rule |
|---|---|---|
| `page_number` | — | Remove entirely |
| `message.buttons.prev: N` | — | Remove (auto: index − 1) |
| `message.buttons.next: N` (integer) | — | Remove (auto: index + 1) |
| `message.buttons.next: "string"` | `message.to: "string"` | Move out of buttons, remove buttons |
| `message.buttons.none: true` | `message.no_buttons: true` | Move out of buttons |
| `message.buttons.continue: { next, style, text }` | `message.button: { to, style, text }` | Rename `next` → `to` |
| `character.arrow: N` | `character.arrow: N-1` | Convert 1-based page → 0-based index |

**TOC start_page conversion:** `new_start_page = old_start_page - 1` (all are 1-based in old data → 0-based in new)

---

## Task 1: Create `src/data/privacy-planet/lesson.json`

**Files:**
- Create: `src/data/privacy-planet/lesson.json`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p cyberheroes/src/data/privacy-planet
touch cyberheroes/src/data/privacy-planet/lesson.json
```

- [ ] **Step 2: Write the top-level structure**

Open `src/data/privacy-planet/lesson.json` and write the skeleton, then populate each section:

```json
{
  "id": "privacy-planet",
  "name": "Privacy Planet",
  "active": true,
  "intro": {
    "lesson_title": "Sensitive Information",
    "text": "Welcome to Privacy Planet. Life here is generally peaceful, and people usually have nothing much to worry about. However, over the last few years, Privacy Planet is becoming less and less private. Investigate the cause for the issue and help the people on the planet.",
    "computer_image": "patrick-wanted.png",
    "computer_text": "Hello Cyber Hero! We are told that Patrick the Predatorus is keeping something very <v>valuable** that he stole. We need your help to find what he stole and bring it back to us. This journey will be dangerous, be very careful about ANYONE that you meet on Privacy Planet!"
  },
  "quiz_transitions": { ... },
  "cert_transition": { ... },
  "table_of_contents": { ... },
  "review": { ... },
  "pages": [ ... ]
}
```

- [ ] **Step 3: Populate `quiz_transitions`**

Copy from `src/data/lessons/transitions.json` under `planets.privacy_planet`, remove `end_page`:

```json
"quiz_transitions": {
  "quiz-1": {
    "character": "Allie",
    "message": "Use what you learned to Defeat Enemy 1 and help me get back my information!!!"
  },
  "quiz-2": {
    "character": "Allie",
    "message": "Huh looks like an enemy is trying to follow us! Quick let's defeat them with our knowledge!"
  },
  "quiz-3": {
    "character": "Allie",
    "message": "Looks like we have everything we need to finish this planet! Let's defeat the last enemy to get my sensitive data Back!"
  }
}
```

- [ ] **Step 4: Populate `cert_transition`**

Copy from `src/data/lessons/transition_cert.json` under `planets.privacy_planet`:

```json
"cert_transition": {
  "character": "Allie",
  "message": " Yay!! You defeated all the enemies and helped me keep my sensitive data safe! Thank you so much Cyber Hero! \n\n As a token of my appreciation, I award you with a cyber hero sensitive data protector certificate."
}
```

- [ ] **Step 5: Populate `table_of_contents`**

Copy from `src/data/lessons/table_of_contents.json` for Privacy Planet. Convert all `start_page` values to 0-based (`start_page = old_start_page - 1`):

```json
"table_of_contents": {
  "lesson_title": "Sensitive Information",
  "parts": [
    { "part_name": "What is Sensitive Data?",               "start_page": 0,  "part_type": "lesson", "part_style": "lesson-1" },
    { "part_name": "Sensitive Data Quiz 1",                  "part_type": "quiz",   "part_style": "quiz-1" },
    { "part_name": "Why is Sensitive Data Important?",        "start_page": 19, "part_type": "lesson", "part_style": "lesson-2" },
    { "part_name": "Sensitive Data Quiz 2",                  "part_type": "quiz",   "part_style": "quiz-2" },
    { "part_name": "Who Should Sensitive Data Be Shared With?","start_page": 24, "part_type": "lesson", "part_style": "lesson-3" },
    { "part_name": "Sensitive Data Quiz 3",                  "part_type": "quiz",   "part_style": "quiz-3" }
  ]
}
```

- [ ] **Step 6: Populate `review`**

Copy from `src/data/lessons/review.json` under `planet.privacy_planet`. The top-level `planet` and `privacy_planet` wrapper keys are dropped — the quiz keys go directly:

```json
"review": {
  "quiz-1": {
    "character": "Allie",
    "options": [
      {
        "id": 1,
        "title": "What is Sensitive Data?",
        "review_lesson": [
          { "page": 1, "title": "Sensitive Data", "message": "Is private and personal information..." },
          { "page": 2, "title": "Sensitive Data Continued", "message": "Sharing your <v>sensitive data**..." }
        ]
      },
      {
        "id": 2,
        "title": "Types of Sensitive Information",
        "review_lesson": [
          { "page": 1, "title": "Types of Sensitive Information", "message": "<ul>Full Name<li>Birthday<li>Home Address<li>Phone Number<li>Email Address**" }
        ]
      }
    ]
  },
  "quiz-2": {
    "character": "Allie",
    "options": [ ... copy from review.json planet.privacy_planet.quiz-2 ... ]
  },
  "quiz-3": {
    "character": "Allie",
    "options": [ ... copy from review.json planet.privacy_planet.quiz-3 ... ]
  }
}
```

Copy all `options` content verbatim from `review.json → planet.privacy_planet` for quiz-2 and quiz-3.

- [ ] **Step 7: Populate `pages` array**

Apply the page transformation rules to all 35 pages from `src/data/lessons/lesson.json` under `planets[0].pages` (Privacy Planet).

Representative examples:

**Sequential page (most pages — remove page_number and buttons.prev/next integers):**
```json
{
  "characters": [{ "name": "Cyber Hero", "style": "character-left" }],
  "message": {
    "text": "I've made it to Privacy Planet, I wonder what I'm going to find!",
    "speaker": "Cyber Hero",
    "style": "message-box-bottom",
    "speaker_style": "speaker-right"
  }
}
```

**Quiz trigger page (buttons.next was "quiz-1" → message.to):**
```json
{
  "characters": [{ "name": "Allie", "style": "character-right character-flip" }],
  "message": {
    "text": "There are many things that people may ask you...",
    "speaker": "Allie",
    "style": "message-box-bottom",
    "speaker_style": "speaker-left",
    "to": "quiz-1"
  }
}
```

**No-button encounter page (buttons.none → message.no_buttons, character arrow 1-based → 0-based):**
```json
{
  "characters": [
    { "name": "Cyber Hero",     "style": "character character-s character-left character-left-1" },
    { "name": "Allie",          "style": "character-s character-left character-left-2 character-left-last" },
    { "name": "Privacy Enemy",  "style": "character-s character-right character-right-1 character-flip", "arrow": 8 },
    { "name": "Privacy Enemy",  "style": "character-s character-right character-right-2 character-flip", "arrow": 8 },
    { "name": "Privacy Enemy",  "style": "character-s character-right character-right-3 character-flip", "arrow": 8 }
  ],
  "message": {
    "text": "!! YOU'VE ENCOUNTERED ENEMIES !!",
    "style": "alert-header",
    "no_buttons": true
  }
}
```
(Old `arrow: 9` → new `arrow: 8`. Old page 9 is now index 8.)

**Custom button page (buttons.continue → message.button):**
```json
{
  "characters": [{ "name": "Allie", "style": "character-left" }],
  "message": {
    "text": "Yay!! You defeated all the enemies and helped me keep my <v>sensitive data** safe!...",
    "style": "message-box-right",
    "button": { "text": "View Certificate", "style": "default-button", "to": "certificate" }
  }
}
```

Apply these rules to all 35 pages.

- [ ] **Step 8: Commit**

```bash
git add cyberheroes/src/data/privacy-planet/lesson.json
git commit -m "feat: add privacy-planet/lesson.json with refactored page structure"
```

---

## Task 2: Create `src/data/privacy-planet/quiz.json`

**Files:**
- Create: `src/data/privacy-planet/quiz.json`

- [ ] **Step 1: Create the file**

```bash
touch cyberheroes/src/data/privacy-planet/quiz.json
```

- [ ] **Step 2: Write the structure**

Copy all question content from `src/data/quizzes/privacy_planet_quiz.json`. Apply these changes:
- `quizzes` → `parts`
- `part` → `id`
- `quiz` → `questions`
- Remove `id` from each question
- Remove `healthBar` from each question
- Remove `lessonPage` from each question

```json
{
  "parts": [
    {
      "id": "quiz-1",
      "questions": [
        {
          "type": "multiple-choice",
          "question": "What is Sensitive Data?",
          "answers": [
            "Information that is private and personal to you",
            "Details that only your friends need to know",
            "A type of public information anyone can access",
            "Information that has no impact on your safety"
          ],
          "correctAnswers": [0],
          "correctMessage": [
            "AHHHH! You got it correct!",
            "Sensitive data is private and personal to you, like your name, address, or phone number."
          ],
          "incorrectMessages": [
            "",
            "Sensitive data is not just for friends; it should only be shared with trusted adults when necessary.",
            "Public information is meant to be widely available, while sensitive data should be restricted.",
            "Sensitive data, if exposed, can have serious consequences, such as identity theft or fraud."
          ],
          "hint": "💡Hint: Sensitive data is something you want to protect💡"
        }
      ]
    },
    {
      "id": "quiz-2",
      "questions": [ ... ]
    },
    {
      "id": "quiz-3",
      "questions": [ ... ]
    }
  ]
}
```

Copy all question data from `privacy_planet_quiz.json` exactly, applying the three removals above to every question.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/data/privacy-planet/quiz.json
git commit -m "feat: add privacy-planet/quiz.json with refactored question structure"
```

---

## Task 3: Create `src/data/privacy-moon/lesson.json`

**Files:**
- Create: `src/data/privacy-moon/lesson.json`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p cyberheroes/src/data/privacy-moon
touch cyberheroes/src/data/privacy-moon/lesson.json
```

- [ ] **Step 2: Write the file**

Follow the exact same structure as `privacy-planet/lesson.json`. Source data from:
- Intro: `src/data/lessons/lesson_intro.json` → `intros[1]` (Privacy Moon entry)
- Pages: `src/data/lessons/lesson.json` → `planets[1].pages` (Privacy Moon, 39 pages)
- `quiz_transitions`: `src/data/lessons/transitions.json` → `planets.privacy_moon`
- `cert_transition`: `src/data/lessons/transition_cert.json` → `planets.privacy_moon`
- `table_of_contents`: `src/data/lessons/table_of_contents.json` → second entry
- `review`: `src/data/lessons/review.json` → `planet.privacy_moon`

```json
{
  "id": "privacy-moon",
  "name": "Privacy Moon",
  "active": true,
  "intro": {
    "lesson_title": "Sharing Online",
    "text": "Welcome to Privacy Moon. Life here is quiet, but residents have begun to report suspicious behavior nearby. We need your help to find the cause.\n\nWARNING: This lesson is the second part of Privacy Planet. This lesson can be completed on it's own, but the story or lesson contents may not make sense.",
    "computer_image": "patrick-wanted.png",
    "computer_text": "Hello Cyber Hero! Patrick has escaped from Privacy Planet and is hiding somewhere on the moon. Allie's brother, Alejandro, should be nearby. Find him and defeat Patrick for good!"
  },
  "quiz_transitions": {
    "quiz-1": {
      "character": "Alejandro",
      "message": "What are some examples of these types of information?\n\nHMM... let's test your knowledge."
    },
    "quiz-2": {
      "character": "Alejandro",
      "message": "Huh Looks like an enemy is trying to follow us! Quick let's defeat them with our knowledge!"
    },
    "quiz-3": {
      "character": "Alejandro",
      "message": "Looks like we have everything we need to finish this planet! Let's defeat the last enemy to get my sensitive data back!"
    }
  },
  "cert_transition": {
    "character": "Alejandro",
    "message": "We did it cyber hero! patrick is finally gone and privacy moon is safe! \n\n Please take this certificate as an award for all your help!"
  },
  "table_of_contents": {
    "lesson_title": "Sharing Online",
    "parts": [
      { "part_name": "Private vs Public Information",             "start_page": 0,  "part_type": "lesson", "part_style": "lesson-1" },
      { "part_name": "Sharing Online Quiz 1",                     "part_type": "quiz",   "part_style": "quiz-1" },
      { "part_name": "Being Smart About What You Share",          "start_page": 8,  "part_type": "lesson", "part_style": "lesson-2" },
      { "part_name": "Sharing Online Quiz 2",                     "part_type": "quiz",   "part_style": "quiz-2" },
      { "part_name": "What To Do When People Ask For Information?","start_page": 25, "part_type": "lesson", "part_style": "lesson-3" },
      { "part_name": "Sharing Online Quiz 3",                     "part_type": "quiz",   "part_style": "quiz-3" }
    ]
  },
  "review": { ... },
  "pages": [ ... ]
}
```

Privacy Moon pages with special navigation (apply transformation rules to all 39 pages):
- Index 7 (old page 8): `to: "quiz-1"`
- Index 24 (old page 25): `to: "quiz-2"`
- Index 32 (old page 33): `no_buttons: true`, Safe character `arrow: 33` (old `arrow: 34` → 33)
- Index 34 (old page 35): `to: "quiz-3"`
- Index 38 (old page 39): `to: "patrick-defeat"`

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/data/privacy-moon/lesson.json
git commit -m "feat: add privacy-moon/lesson.json with refactored page structure"
```

---

## Task 4: Create Privacy Moon Quiz Files

**Files:**
- Create: `src/data/privacy-moon/quiz.json`
- Create: `src/data/privacy-moon/drag-drop.json`
- Create: `src/data/privacy-moon/red-flag-green-flag.json`

- [ ] **Step 1: Create `privacy-moon/quiz.json`**

Source from `src/data/quizzes/privacy_moon_quiz.json`. The existing file has one part (`part: "quiz-1"`) which is actually the final quiz (quiz-3 in the lesson flow). Rename the part id and apply field removals:

```json
{
  "parts": [
    {
      "id": "quiz-3",
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
    }
  ]
}
```

Copy all questions from `privacy_moon_quiz.json → quizzes[0].quiz`. Remove `id`, `healthBar`, `lessonPage` from each question.

- [ ] **Step 2: Create `privacy-moon/drag-drop.json`**

Copy the entire contents of `src/data/quizzes/drag_drop_quiz.json` verbatim (no structural changes needed):

```bash
cp cyberheroes/src/data/quizzes/drag_drop_quiz.json cyberheroes/src/data/privacy-moon/drag-drop.json
```

- [ ] **Step 3: Create `privacy-moon/red-flag-green-flag.json`**

Copy the entire contents of `src/data/quizzes/redFlag_greenFlag_quiz.json` verbatim:

```bash
cp cyberheroes/src/data/quizzes/redFlag_greenFlag_quiz.json cyberheroes/src/data/privacy-moon/red-flag-green-flag.json
```

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/data/privacy-moon/
git commit -m "feat: add privacy-moon quiz data files"
```

---

## Task 5: Create `src/data/planets.js` Registry

**Files:**
- Create: `src/data/planets.js`

- [ ] **Step 1: Write the registry**

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

- [ ] **Step 2: Verify the registry imports compile**

```bash
cd cyberheroes && npm start
```

Expected: App compiles. The existing components still work (they still import the old files). This just confirms the registry itself has no syntax errors. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/data/planets.js
git commit -m "feat: add planets registry module"
```

---

## Task 6: Update `Buttons.js` and `Message.js`

**Files:**
- Modify: `src/components/lessons/Buttons.js`
- Modify: `src/components/lessons/Message.js`

These two are updated together because Message passes props to Buttons and they must stay in sync.

- [ ] **Step 1: Rewrite `Buttons.js`**

Replace the entire file content:

```jsx
import React, { useState } from 'react';

const Buttons = ({ noButtons, button, onNext, onPrev, onNavigate, pageNum, maxPage }) => {
  const [inputValue, setInputValue] = useState(pageNum + 1);

  if (noButtons) return <div className="button-container" />;

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      const target = parseInt(inputValue);
      if (!isNaN(target)) onNavigate(target - 1);
    }
  };

  return (
    <div className="button-container">
      {pageNum > 0 && (
        <button className="lesson-button prev-button" onClick={onPrev} />
      )}
      <input
        className="lesson-page-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleInputKeyPress}
      />
      {button ? (
        <button
          className={button.style}
          onClick={() => onNavigate(button.to)}
        >
          {button.text}
        </button>
      ) : (
        pageNum < maxPage - 1 && (
          <button className="lesson-button next-button" onClick={onNext} />
        )
      )}
    </div>
  );
};

export default Buttons;
```

- [ ] **Step 2: Update `Message.js`**

Change the `Message` component signature and the `<Buttons>` call. Only the bottom part of the file changes (the component itself — keep `processText` export identical):

```jsx
const Message = ({ message, onNext, onPrev, onNavigate, pageNum, maxPage }) => {
  const messageRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    if (messageRef.current) {
      const height = messageRef.current.offsetHeight;
      setOffset(height);
    }
  }, [message]);

  const [selectedVocab, setSelectedVocab] = useState(null);

  const handleVocabClick = (vocab) => {
    setSelectedVocab(vocab);
  };

  const paragraphs = processText(message.text, handleVocabClick);
  const processedHeader = message.header ? processText(message.header, handleVocabClick) : null;

  return (
    <div className="text-container">
      {processedHeader && (
        <div className="text-header">{processedHeader}</div>
      )}
      {message.speaker && (
        <div
          className={`speaker-name ${message.speaker_style}`}
          style={{ position: "absolute", bottom: `${offset}px` }}
        >
          <p>{message.speaker.toUpperCase()}</p>
        </div>
      )}
      <div ref={messageRef} className={`message-box ${message.style}`}>
        <div className="lesson-text">{paragraphs}</div>
        <Buttons
          noButtons={message.no_buttons}
          button={message.button}
          onNext={onNext}
          onPrev={onPrev}
          onNavigate={onNavigate}
          pageNum={pageNum}
          maxPage={maxPage}
        />
      </div>
      {selectedVocab && (
        <VocabPopup
          word={selectedVocab.word}
          definition={selectedVocab.definition}
          onClose={() => setSelectedVocab(null)}
        />
      )}
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/lessons/Buttons.js cyberheroes/src/components/lessons/Message.js
git commit -m "refactor: update Buttons and Message to use new navigation props"
```

---

## Task 7: Update `Lesson.js`

**Files:**
- Modify: `src/components/lessons/Lesson.js`

- [ ] **Step 1: Rewrite `Lesson.js`**

```jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import '../../styles/lesson.css';
import Navbar from '../util/NavBar';
import Characters from './Characters';
import Message from './Message';
import { lessonData } from '../../data/planets';
import TextReader from '../util/TextReader';

const backgroundImages = require.context('../../img/backgrounds', false, /\.(png|jpe?g|svg)$/);

const Lesson = () => {
  const { planet } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const textReaderRef = useRef(null);

  const planetData = lessonData[planet];
  const pages = planetData?.pages ?? [];

  const [pageNum, setPageNum] = useState(() =>
    Math.max(0, location.state?.page ?? 0)
  );

  const pageData = pages[pageNum];

  const stopReader = () => {
    if (textReaderRef.current?.stopReading) {
      textReaderRef.current.stopReading();
    }
  };

  const navigateTo = (destination) => {
    stopReader();
    if (typeof destination === 'number') {
      setPageNum(destination);
      return;
    }
    if (destination.startsWith('quiz')) {
      navigate(`/${planet}/transition`, { state: { quizPart: destination } });
    } else if (destination === 'certificate') {
      navigate(`/${planet}/certificate`);
    } else if (destination === 'patrick-defeat') {
      navigate(`/${planet}/patrick-defeat`);
    } else if (destination === 'review') {
      navigate(`/${planet}/review`);
    }
  };

  const handleNext = () => {
    stopReader();
    const to = pageData.message?.to;
    if (to) {
      navigateTo(to);
    } else {
      setPageNum(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    stopReader();
    setPageNum(prev => prev - 1);
  };

  const handleCharacterClick = (index) => {
    setPageNum(index);
  };

  if (!planetData || !pageData) {
    return <div>Planet or page not found</div>;
  }

  return (
    <div className={`lesson-container ${planet}-background`}>
      <Navbar />
      <TextReader ref={textReaderRef} />
      <div className={`lesson-content ${pageData.message.style}-container readable-text`}>
        <Characters
          characters={pageData.characters.map(character => ({
            ...character,
            onClick: character.arrow !== undefined ? handleCharacterClick : undefined
          }))}
        />
        <Message
          key={pageNum}
          message={pageData.message}
          onNext={handleNext}
          onPrev={handlePrev}
          onNavigate={navigateTo}
          pageNum={pageNum}
          maxPage={pages.length}
        />
      </div>
    </div>
  );
};

export default Lesson;
```

- [ ] **Step 2: Verify**

```bash
cd cyberheroes && npm start
```

Navigate to `http://localhost:3000/privacy-planet/lesson`. Click through several pages. Confirm prev/next work, quiz trigger navigates to transition, encounter screen shows no buttons.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/lessons/Lesson.js
git commit -m "refactor: update Lesson.js to use registry and 0-based page index"
```

---

## Task 8: Update `Transition.js`

**Files:**
- Modify: `src/components/lessons/Transition.js`

- [ ] **Step 1: Rewrite `Transition.js`**

```jsx
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/transitions.css";
import Navbar from '../util/NavBar';
import TextReader from "../util/TextReader";
import { lessonData } from '../../data/planets';

const Transition = () => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const quizPart = location.state?.quizPart;
    const planetLesson = lessonData[planet];

    if (!planetLesson) {
        return <div className="transition-container"><Navbar /><TextReader /><p>Error: Planet not found</p></div>;
    }

    const currQuiz = planetLesson.quiz_transitions?.[quizPart];

    if (!currQuiz) {
        return <div className="transition-container"><Navbar /><TextReader /><p>Error: Quiz transition not found</p></div>;
    }

    // Derive resume index: find the page that triggers this quiz, resume at index + 1
    const triggerIndex = planetLesson.pages.findIndex(p => p.message?.to === quizPart);
    const resumeIndex = triggerIndex >= 0 ? triggerIndex + 1 : 0;

    const imageName = currQuiz.character.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    const handleQuizButtonClick = () => {
        navigate(`/${planet}/quiz`, { state: { part: quizPart, resumeIndex } });
    };

    const handleLessonButtonClick = () => {
        navigate(`/${planet}/lesson`, { state: { page: triggerIndex } });
    };

    const handleReviewButtonClick = () => {
        navigate(`/${planet}/review`, { state: { quizPart } });
    };

    return (
        <div className={`transition-container ${planet}-background`}>
            <Navbar />
            <TextReader />
            <div className="transition-content readable-text">
                <div className="transition-layout">
                    <div className="message-side-transition">
                        <div className="transition-message-box">
                            <p className="transition-message">{currQuiz.message}</p>
                            <div className="button-container-transition">
                                <button className='quiz-button' onClick={handleQuizButtonClick}>TAKE THE QUIZ</button>
                                <button className='quiz-button' onClick={handleLessonButtonClick}>GO BACK TO LESSON</button>
                                <button className='review-button' onClick={handleReviewButtonClick}>GO BACK TO REVIEW</button>
                            </div>
                        </div>
                    </div>
                    <div className="character-side-transition">
                        <img src={imagePath} alt={currQuiz.character} className="character-image-transition" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transition;
```

- [ ] **Step 2: Verify**

In the running dev server, navigate to a lesson page that triggers a quiz (e.g., page 19 of privacy-planet). Click next to trigger the transition screen. Confirm: character image shows, message shows, all three buttons work.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/lessons/Transition.js
git commit -m "refactor: update Transition.js to use registry and computed resumeIndex"
```

---

## Task 9: Update `Transition_Cert.js`

**Files:**
- Modify: `src/components/lessons/Transition_Cert.js`

- [ ] **Step 1: Update the import and lookup**

Replace:
```js
import TransitionCertsData from '../../data/lessons/transition_cert.json';
// ...
const planetName = planet.toLowerCase().replace(/-/g, '_');
const transitionData = TransitionCertsData.planets[planetName];
```

With:
```js
import { lessonData } from '../../data/planets';
// ...
const planetLesson = lessonData[planet];
const transitionData = planetLesson?.cert_transition;
```

Also update the error check: replace `if (!transitionData)` guard to use `planetLesson?.cert_transition`.

The character image loading stays the same:
```js
const imageName = transitionData.character.toLowerCase().replace(/\s+/g, '-');
const imagePath = characterImages(`./${imageName}.png`);
```

Full updated file:
```jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/transitions.css";
import Navbar from '../util/NavBar';
import TextReader from "../util/TextReader";
import { lessonData } from '../../data/planets';

const TransitionCerts = () => {
    const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
    const { planet } = useParams();
    const navigate = useNavigate();

    const planetLesson = lessonData[planet];
    const transitionData = planetLesson?.cert_transition;

    if (!transitionData) {
        return (
            <div className="transition-container">
                <Navbar />
                <TextReader />
                <div className="transition-content">
                    <p>Error: Transition data not found</p>
                </div>
            </div>
        );
    }

    const imageName = transitionData.character.toLowerCase().replace(/\s+/g, '-');
    const imagePath = characterImages(`./${imageName}.png`);

    const handleCertificate = () => {
        navigate(`/${planet}/certificate`);
    };

    return (
        <div className={`transition-container ${planet}-background`}>
            <Navbar />
            <TextReader />
            <div className="transition-content readable-text">
                <div className="transition-layout">
                    <div className="message-side">
                        <div className="message-box">
                            <p className="transition-message">{transitionData.message}</p>
                            <div className="button-container">
                                <button className="certificate-button" onClick={handleCertificate}>
                                    VIEW CERTIFICATE
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="character-side">
                        <img src={imagePath} alt={transitionData.character} className="character-image" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransitionCerts;
```

- [ ] **Step 2: Verify**

Navigate through privacy-planet quiz-3 to reach the transition-cert screen. Confirm character and message display, and "View Certificate" navigates to certificate.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/lessons/Transition_Cert.js
git commit -m "refactor: update Transition_Cert.js to use registry"
```

---

## Task 10: Update `LessonIntro.js`

**Files:**
- Modify: `src/components/lessons/LessonIntro.js`

- [ ] **Step 1: Replace import and remove duplicate lookups**

Current file has three separate calls that each re-lookup the planet data. Replace with one lookup via registry.

```jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/intro.css';
import '../../styles/lesson.css';
import { lessonData } from '../../data/planets';
import rocket from '../../img/general/rocket.png';
import computer from "../../img/general/computer.png";
import Navbar from '../util/NavBar';
import TextReader from '../util/TextReader';
import VocabPopup from '../util/VocabPopup';
import { processText } from './Message';

const planetImages = require.context('../../img/planets', false, /\.(png|jpe?g|svg)$/);
const introImages = require.context('../../img/lesson-intro', false, /\.(png|jpe?g|svg)$/);

const LessonIntro = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [showComputer, setShowComputer] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);

  const handleVocabClick = (vocab) => setSelectedVocab(vocab);
  const startLesson = () => navigate(`/${planet}/arrival`);
  const handleBackToMap = () => navigate('/exploration-map');
  const handleEnterLesson = () => setShowComputer(true);

  const planetLesson = lessonData[planet];
  const active = planetLesson?.active ?? false;
  const intro = planetLesson?.intro;

  const getPlanetImage = () => {
    try {
      return planetImages(`./${planet}.png`);
    } catch {
      return null;
    }
  };

  const getComputerIntroImage = () => {
    try {
      return introImages(`./${intro?.computer_image}`);
    } catch {
      return null;
    }
  };

  const planetImage = getPlanetImage();
  const computerIntroImage = getComputerIntroImage();

  if (showComputer && active) {
    return (
      <div>
        <Navbar />
        <TextReader />
        <div className="lesson-intro-background readable-text">
          <img src={computer} alt="Computer" className="computer-image" />
          <div className="computer-content">
            <div className="computer-content-top">
              {computerIntroImage && <img src={computerIntroImage} alt="Computer" className="computer-intro-image" />}
              <div className="intro-message">
                {processText(intro.computer_text, handleVocabClick)}
              </div>
            </div>
            <div className="computer-btn-container">
              <button className="go-back-map-btn" onClick={handleBackToMap}>Go Back to Map</button>
              <button className="start-lesson-btn" onClick={startLesson}>Start Your Adventure</button>
            </div>
          </div>
        </div>
        {selectedVocab && (
          <VocabPopup word={selectedVocab.word} definition={selectedVocab.definition} onClose={() => setSelectedVocab(null)} />
        )}
      </div>
    );
  } else if (!active) {
    return (
      <div>
        <Navbar />
        <TextReader />
        <div className="lesson-intro-background readable-text">
          <img src={computer} alt="Computer" className="computer-image" />
          <div className="computer-content">
            <div className="computer-content-top">
              <div className="coming-soon-message">
                <h1>🪐 Coming Soon! 🪐</h1>
                <p>Oops! Our satellite couldn't reach this planet—it's not ready for visitors yet.</p>
                <p>This planet is still being built by CyberHeroes. Check back soon for more adventures!</p>
              </div>
            </div>
            <div className="computer-btn-container">
              <button className="go-back-map-btn" onClick={handleBackToMap}>Go Back to Map</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Navbar />
        <TextReader />
        <div className="lesson-intro-background readable-text">
          <div className="lesson-intro-side">
            <img src={rocket} alt="Rocket Ship" className="lesson-intro-rocket" />
            {planetImage && <img src={planetImage} alt={`${planet} Planet`} className="lesson-intro-planet" />}
          </div>
          <div className="lesson-intro-message">
            <h1 className="lesson-intro-title">You have arrived at {planetLesson.name}!</h1>
            {processText(intro.text, handleVocabClick)}
            <button className="enter-lesson-btn" onClick={handleEnterLesson}>
              ENTER {planetLesson.name.toUpperCase()}
            </button>
          </div>
        </div>
        {selectedVocab && (
          <VocabPopup word={selectedVocab.word} definition={selectedVocab.definition} onClose={() => setSelectedVocab(null)} />
        )}
      </div>
    );
  }
};

export default LessonIntro;
```

- [ ] **Step 2: Verify**

Navigate to `http://localhost:3000/privacy-planet/lesson-intro`. Confirm the intro screen renders, the "ENTER" button shows the computer screen, and "Start Your Adventure" proceeds to arrival.

Navigate to an inactive planet URL (e.g., `/phishing-planet/lesson-intro` if routed). Confirm "Coming Soon" renders.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/lessons/LessonIntro.js
git commit -m "refactor: update LessonIntro.js to use registry"
```

---

## Task 11: Update `TableOfContents.js`

**Files:**
- Modify: `src/components/lessons/TableOfContents.js`

- [ ] **Step 1: Replace import and lookup**

```jsx
import "../../styles/table-of-contents.css";
import { useParams, useNavigate } from "react-router-dom";
import { lessonData } from '../../data/planets';
import { useState } from 'react';
import tocClose from '../../img/general/toc_close.png';
import tocOpen from '../../img/general/toc_open.png';
import dropdownArrow from '../../img/general/dropdown_right.png';

const TableOfContents = () => {
  const { planet } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const planetLesson = lessonData[planet];
  const tocData = planetLesson?.table_of_contents;

  const handlePartClick = (part) => {
    if (part.part_type === "quiz") {
      navigate(`/${planet}/transition`, { state: { quizPart: part.part_style } });
    } else {
      navigate(`/${planet}/lesson`, { state: { page: part.start_page } });
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    tocData && (
      <div className="table-of-contents-container">
        <div className="parts-container">
          <div className="toc-header" onClick={toggleDropdown}>
            <div className="header-content">
              <img src={isOpen ? tocOpen : tocClose} alt="Table of Contents" className="toc-icon" />
              <span>Table of Contents</span>
              <img src={dropdownArrow} alt="Dropdown Arrow" className={`dropdown-arrow ${isOpen ? 'right-arrow' : 'down-arrow'}`} />
            </div>
          </div>
          <div className={`toc-body ${isOpen ? 'open' : ''}`}>
            {tocData.parts.map((part, index) => (
              <div key={index} className={`part-item ${part.part_style}`} onClick={() => handlePartClick(part)}>
                <span className="part-name">{part.part_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default TableOfContents;
```

- [ ] **Step 2: Verify**

On a lesson page, open the Table of Contents. Confirm all parts are listed. Click a lesson part — confirm it navigates to the correct page index. Click a quiz part — confirm it navigates to the transition screen.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/lessons/TableOfContents.js
git commit -m "refactor: update TableOfContents.js to use registry"
```

---

## Task 12: Update `review.js`

**Files:**
- Modify: `src/components/review/review.js`

- [ ] **Step 1: Replace import and lookup**

```jsx
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../styles/review.css';
import { lessonData } from '../../data/planets';
import ReviewMenu from './ReviewMenu';
import ReviewLesson from './ReviewLesson';

const Review = () => {
    const { planet } = useParams();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState(null);

    const quizPart = location.state?.quizPart;

    const planetLesson = lessonData[planet];
    const currentQuiz = planetLesson?.review?.[quizPart];

    if (!currentQuiz) {
        return (
            <div className={`review-container ${planet}-background`}>
                <p>Error: Review data not found</p>
            </div>
        );
    }

    const handleOptionSelect = (option) => setSelectedOption(option);
    const handleCloseLesson = () => setSelectedOption(null);

    if (selectedOption) {
        return <ReviewLesson selectedOption={selectedOption} onClose={handleCloseLesson} />;
    }

    return (
        <ReviewMenu
            onOptionSelect={handleOptionSelect}
            character={currentQuiz.character}
            options={currentQuiz.options}
        />
    );
};

export default Review;
```

- [ ] **Step 2: Verify**

Navigate to a quiz transition screen and click "GO BACK TO REVIEW". Confirm the review menu renders with the correct options for that quiz part.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/review/review.js
git commit -m "refactor: update review.js to use registry"
```

---

## Task 13: Update Privacy Planet Quiz Components

**Files:**
- Modify: `src/components/quizzes/Privacy-Planet-Quiz.js`
- Modify: `src/components/quizzes/Privacy-Planet-Quiz-Answers.js`

- [ ] **Step 1: Update `Privacy-Planet-Quiz.js`**

```jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import { quizData } from "../../data/planets";

import circle from "../../img/quizzes/shapes/circle.png";
import diamond from "../../img/quizzes/shapes/diamond.png";
import square from "../../img/quizzes/shapes/square.png";
import triangle from "../../img/quizzes/shapes/triangle.png";
import checkedSquare from "../../img/quizzes/shapes/checked-square.png";

const Quiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentQuestionIndex = location.state?.questionIndex || 0;
    const [selectedAnswers, setSelectedAnswers] = React.useState([]);

    const allQuizData = quizData['privacy-planet'];
    const currentQuiz = allQuizData.parts.find(q => q.id === location.state?.part);
    const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

    const navigateToAnswers = (selectedAnswer) => {
        navigate(`/privacy-planet/quiz/game-answers`, {
            state: {
                selectedAnswer,
                currentQuestion,
                questionIndex: currentQuestionIndex,
                part: location.state?.part,
                currentQuiz,
                resumeIndex: location.state?.resumeIndex
            }
        });
    };

    const handleAnswerClick = (answer) => navigateToAnswers(answer);

    const handleMultipleAnswerClick = (answer) => {
        setSelectedAnswers(prev =>
            prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]
        );
    };

    const handleSubmitClick = () => navigateToAnswers(selectedAnswers);

    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
        const answers = currentQuestion.answers;
        const shapes = [diamond, circle, triangle, square];
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="quiz-container readable-text">
                    <div className="quiz-question">
                        <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                    </div>
                    <div className="quiz-answers-container">
                        {answers.map((answer, i) => (
                            <button key={i} className={`quiz-answer-btn answer-btn-${i + 1}`} onClick={() => handleAnswerClick(answer)}>
                                <img src={shapes[i] ?? square} alt="shape" className="quiz-answer-shape" />
                                <p>{answer}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="quiz-container readable-text">
                    <div className="quiz-question">
                        <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                    </div>
                    <div className="quiz-answers-container multiple-select-answer-container">
                        {currentQuestion.answers.map((answer, index) => (
                            <button key={index} className={`quiz-answer-btn answer-btn-${index + 1}`} onClick={() => handleMultipleAnswerClick(answer)}>
                                <img src={selectedAnswers.includes(answer) ? checkedSquare : square} alt="check box" className="quiz-answer-shape" />
                                <p>{answer}</p>
                            </button>
                        ))}
                    </div>
                    <button className="quiz-submit-btn" onClick={handleSubmitClick} disabled={selectedAnswers.length === 0}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
};

export default Quiz;
```

- [ ] **Step 2: Update `Privacy-Planet-Quiz-Answers.js`**

Key changes: use `currentQuiz.questions.length` (not `.quiz.length`), compute `healthBar` from index, use `location.state.resumeIndex` (not `currentQuestion.lessonPage`).

```jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../util/NavBar';
import '../../styles/quiz.css';
import Allie from '../../img/characters/allie.png';
import Enemy from '../../img/characters/enemy.png';
import DeadEnemy from '../../img/characters/privacy-enemy-dead.png';
import TextReader from '../util/TextReader';

const QuizAnswers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedAnswer, currentQuestion, questionIndex, part, currentQuiz, resumeIndex } = location.state || {};

    const isCorrect = Array.isArray(selectedAnswer)
        ? selectedAnswer.length === currentQuestion.correctAnswers.length &&
          currentQuestion.correctAnswers.every(i => selectedAnswer.includes(currentQuestion.answers[i]))
        : currentQuestion.correctAnswers.includes(currentQuestion.answers.indexOf(selectedAnswer));

    const totalQuestions = currentQuiz.questions.length;
    const healthBar = (totalQuestions - 1 - questionIndex) / totalQuestions;
    const isLastQuestion = questionIndex === totalQuestions - 1;

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            if (part === 'quiz-3') {
                navigate(`/privacy-planet/transition-cert`);
            } else {
                navigate(`/privacy-planet/lesson`, { state: { page: resumeIndex } });
            }
        } else {
            navigate(`/privacy-planet/quiz`, {
                state: { questionIndex: questionIndex + 1, part, resumeIndex }
            });
        }
    };

    if (isCorrect) {
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="answers-container readable-text">
                    <div className="characters-answers-container">
                        <p className="health-bar-label">Health Bar</p>
                        <div className="privacy-planet-health-bar">
                            <progress className="privacy-planet-health-bar-progress" value={healthBar} max="1"></progress>
                        </div>
                        <img
                            src={healthBar !== 0 ? Enemy : DeadEnemy}
                            alt={healthBar !== 0 ? "Enemy" : "Dead Enemy"}
                            className="characters-answers-img"
                        />
                    </div>
                    <div className="text-answers-container">
                        <h1 className="text-answers-title">{currentQuestion.correctMessage[0]}</h1>
                        <p className="text-answers-text">{currentQuestion.correctMessage[1]}</p>
                        <button className="quiz-next-btn" onClick={handleNextQuestion}>
                            {isLastQuestion ? "Return to Lesson" : "Next Question"}
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="privacy-planet-quiz-background">
                <Navbar />
                <TextReader />
                <div className="answers-container readable-text">
                    <div className="characters-answers-container">
                        <img src={Allie} alt="Allie" className="characters-answers-img" />
                    </div>
                    <div className="text-answers-container">
                        <h1 className="text-answers-title">Incorrect Answer</h1>
                        <p className="text-answers-text">
                            {Array.isArray(selectedAnswer)
                                ? currentQuestion.incorrectMessages[0]
                                : currentQuestion.incorrectMessages[currentQuestion.answers.indexOf(selectedAnswer)]}
                        </p>
                        <p className="text-answers-text answer-hint">{currentQuestion.hint}</p>
                        <button className="quiz-try-again-btn" onClick={() => navigate(`/privacy-planet/quiz`, { state: { questionIndex, part, resumeIndex } })}>
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default QuizAnswers;
```

- [ ] **Step 3: Verify**

Navigate through a full Privacy Planet quiz. Confirm:
- Questions display correctly
- Correct/incorrect screens show
- Health bar decreases with each question
- "Next Question" advances correctly
- After the last question of quiz-1 or quiz-2, lesson resumes at the right page
- After the last question of quiz-3, transitions to transition-cert

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/components/quizzes/Privacy-Planet-Quiz.js cyberheroes/src/components/quizzes/Privacy-Planet-Quiz-Answers.js
git commit -m "refactor: update Privacy Planet quiz components to use registry and computed healthBar"
```

---

## Task 14: Update Privacy Moon Quiz Components

**Files:**
- Modify: `src/components/quizzes/Privacy-Moon-Quiz.js`
- Modify: `src/components/quizzes/Privacy-Moon-Quiz-Answers.js`

- [ ] **Step 1: Update `Privacy-Moon-Quiz.js`**

The moon final quiz only renders multiple-choice. Change the data lookup from the hardcoded `part: "quiz-1"` to `id: "quiz-3"` from registry:

```jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";
import "../../styles/quiz.css";
import { quizData } from "../../data/planets";
import circle from "../../img/quizzes/shapes/circle.png";
import diamond from "../../img/quizzes/shapes/diamond.png";
import square from "../../img/quizzes/shapes/square.png";
import triangle from "../../img/quizzes/shapes/triangle.png";

const Quiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentQuestionIndex = location.state?.questionIndex || 0;

    const allQuizData = quizData['privacy-moon'];
    const currentQuiz = allQuizData.parts.find(q => q.id === 'quiz-3');
    const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

    const handleAnswerClick = (answer) => {
        navigate(`/privacy-moon/quiz/final-quiz/game-answers`, {
            state: {
                selectedAnswer: answer,
                currentQuestion,
                questionIndex: currentQuestionIndex,
                part: location.state?.part,
                currentQuiz,
                resumeIndex: location.state?.resumeIndex
            }
        });
    };

    return (
        <div className="privacy-moon-quiz-background">
            <Navbar />
            <TextReader />
            <div className="quiz-container readable-text">
                <div className="quiz-question dark-question">
                    <h1 className="quiz-question-text">{currentQuestion.question}</h1>
                </div>
                <div className="quiz-answers-container">
                    {[diamond, circle, triangle, square].map((shape, i) => (
                        <button key={i} className={`quiz-answer-btn answer-btn-${i + 1}`} onClick={() => handleAnswerClick(currentQuestion.answers[i])}>
                            <img src={shape} alt="shape" className="quiz-answer-shape" />
                            <p>{currentQuestion.answers[i]}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
```

- [ ] **Step 2: Update `Privacy-Moon-Quiz-Answers.js`**

Change `currentQuiz.quiz.length` → `currentQuiz.questions.length`, use `questionIndex` for the safe letter image, use `resumeIndex` from location state instead of `currentQuestion.lessonPage`:

```js
// Replace the handleNextQuestion function:
const handleNextQuestion = () => {
    if (currentQuiz.questions.length === questionIndex + 1) {
        navigate(`/privacy-moon/lesson`, { state: { page: resumeIndex } });
    } else {
        navigate(`/privacy-moon/quiz/final-quiz`, {
            state: { questionIndex: questionIndex + 1, part, resumeIndex }
        });
    }
};

// Replace the safe image selector (uses questionIndex instead of currentQuestion.id):
const safeImages = [letter1, letter2, letter3, letter4, letter5];
// Use safeImages[questionIndex] wherever currentQuestion.id was used for letter selection.

// Add resumeIndex to destructuring:
const { selectedAnswer, currentQuestion, questionIndex, part, currentQuiz, resumeIndex } = location.state || {};
```

Apply the same `isLastQuestion` and `healthBar` computation pattern as in Task 13.

- [ ] **Step 3: Verify**

Navigate through the Privacy Moon final quiz (quiz-3). Confirm questions display, safe letters reveal correctly, and lesson resumes at the right page after completion.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/components/quizzes/Privacy-Moon-Quiz.js cyberheroes/src/components/quizzes/Privacy-Moon-Quiz-Answers.js
git commit -m "refactor: update Privacy Moon quiz components to use registry and computed healthBar"
```

---

## Task 15: Update Special Quiz Imports

**Files:**
- Modify: `src/components/quizzes/Drag-Drop-Quiz.js`
- Modify: `src/components/quizzes/RedFlag-GreenFlag-Quiz.js`
- Modify: `src/components/quizzes/game-answers.js`

- [ ] **Step 1: Update `Drag-Drop-Quiz.js`**

Find the import line:
```js
import quizData from "../../data/quizzes/drag_drop_quiz.json";
```
Replace with:
```js
import quizData from "../../data/privacy-moon/drag-drop.json";
```

- [ ] **Step 2: Update `RedFlag-GreenFlag-Quiz.js`**

Find the import line:
```js
import quizData from "../../data/quizzes/redFlag_greenFlag_quiz.json";
```
Replace with:
```js
import quizData from "../../data/privacy-moon/red-flag-green-flag.json";
```

- [ ] **Step 3: Check `game-answers.js`**

Open `src/components/quizzes/game-answers.js`. If it imports from `drag_drop_quiz.json` or `redFlag_greenFlag_quiz.json`, update those imports to the new paths. If it imports no quiz data directly, no change is needed.

- [ ] **Step 4: Verify**

Navigate through drag-drop quiz (`/privacy-moon/quiz/drag-drop`) and red-flag-green-flag quiz (`/privacy-moon/quiz/redflag-greenflag`). Confirm both load and function correctly.

- [ ] **Step 5: Commit**

```bash
git add cyberheroes/src/components/quizzes/Drag-Drop-Quiz.js cyberheroes/src/components/quizzes/RedFlag-GreenFlag-Quiz.js cyberheroes/src/components/quizzes/game-answers.js
git commit -m "refactor: update special quiz imports to new file locations"
```

---

## Task 16: Delete Old Data Files

**Files:**
- Delete 10 files from `src/data/lessons/` and `src/data/quizzes/`

Only run this task after all previous tasks are complete and you have verified every route in the app.

- [ ] **Step 1: Full app verification checklist**

Run `npm start` and confirm each route works end-to-end:
- [ ] `/privacy-planet/lesson-intro` — intro renders
- [ ] `/privacy-planet/arrival` — arrival renders
- [ ] `/privacy-planet/lesson` — pages 1-35 navigate correctly
- [ ] `/privacy-planet/transition` (quiz-1, quiz-2, quiz-3) — each transition works
- [ ] `/privacy-planet/quiz` — all quiz parts work with correct/incorrect feedback
- [ ] `/privacy-planet/transition-cert` — cert transition works
- [ ] `/privacy-planet/certificate` — certificate renders
- [ ] `/privacy-moon/lesson` — pages 1-39 navigate correctly
- [ ] `/privacy-moon/quiz/drag-drop` — drag-drop quiz works
- [ ] `/privacy-moon/quiz/redflag-greenflag` — red/green flag quiz works
- [ ] `/privacy-moon/quiz/final-quiz` — final quiz works
- [ ] Table of Contents opens and all links navigate to correct pages

- [ ] **Step 2: Delete old files**

```bash
cd cyberheroes
rm src/data/lessons/lesson.json
rm src/data/lessons/lesson_intro.json
rm src/data/lessons/transitions.json
rm src/data/lessons/transition_cert.json
rm src/data/lessons/table_of_contents.json
rm src/data/lessons/review.json
rm src/data/quizzes/privacy_planet_quiz.json
rm src/data/quizzes/privacy_moon_quiz.json
rm src/data/quizzes/drag_drop_quiz.json
rm src/data/quizzes/redFlag_greenFlag_quiz.json
```

- [ ] **Step 3: Run the app one more time to confirm no broken imports**

```bash
npm start
```

Expected: App compiles with no errors. If any component still imports a deleted file, the compiler will immediately show an error — fix that import before committing.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old shared data files replaced by per-planet structure"
```
