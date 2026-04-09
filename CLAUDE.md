# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CyberHeroes is an educational cybersecurity web application for youth, built as a React SPA with a space-exploration game theme. It teaches safe cyber practices through interactive lessons, quizzes, and character-driven storytelling. Deployed to GitHub Pages at `https://virurep.github.io/cyberheroes/`.

## Commands

All commands run from the `cyberheroes/` subdirectory (the actual app lives there, not the repo root):

```bash
cd cyberheroes

npm start          # Dev server at localhost:3000 (hot reload)
npm run build      # Production build → /build
npm test           # Jest in interactive watch mode
npm run deploy     # Build + deploy to gh-pages branch (GitHub Pages)
```

There is no dedicated lint script; ESLint runs automatically via `react-scripts` during build/start.

## Architecture

**Tech stack:** React 19, React Router (HashRouter), Bootstrap 5, Create React App, JSON-driven content — frontend only, no backend.

HashRouter is used (not BrowserRouter) because GitHub Pages doesn't support server-side routing fallbacks.

### Content is data-driven via JSON

All lesson and quiz content lives in `cyberheroes/src/data/`:
- `lessons/lesson.json` — core lesson pages structured as: planet → pages → characters → messages
- `lessons/lesson_intro.json`, `vocab.json`, `review.json`, `transitions.json`, etc.
- `quizzes/*.json` — question definitions for each quiz type

To add or modify lesson content, edit the JSON files rather than components.

### Learning flow

```
Landing → Intro → Exploration Map (planet selection)
  → Lesson Intro → Lesson Pages → Transition
  → Quiz → Quiz Answers → Review → Certificate
```

Five planets/topics: Privacy, Phishing, Malware, Safe Browsing, Online Sharing. Privacy Planet has a sub-module (Privacy Moon) with its own quiz.

### Component organization

```
src/components/
├── lessons/       # Lesson rendering (Lesson.js, LessonIntro, Characters, Message, etc.)
├── quizzes/       # Quiz types: Privacy-Planet, Privacy-Moon, Drag-Drop, RedFlag-GreenFlag
├── review/        # Review menu and review lesson pages
└── util/          # NavBar, TextReader (accessibility), VocabPopup
```

`Lesson.js` is the main lesson renderer — it reads from JSON and handles pagination/character display. Quiz components each manage their own state locally (no global state management).

### Routing

Routes are defined in `src/App.js`. Quiz routes use wildcard matching to handle different planets using the same quiz components.

### Styling

Each component has a corresponding CSS file in `src/styles/`. Bootstrap is used for utilities. The primary font is Fredoka One (Google Fonts).
