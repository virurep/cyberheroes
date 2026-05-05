# CyberHeroes UI Overhaul — Visual Design Spec

## Goal

Apply the new pixel-art / dark-space visual design system (from the Claude Design handoff) to every screen in the app. This is a visual-only pass — navigation logic, quiz routing, and lesson flow are unchanged.

## Scope

**In:** Colors, typography, backgrounds, borders, effects, character art, button styles, animations.

**Out:** Quiz behavior (inline feedback), conversational lesson progressive-reveal, XP system, new routing. These are a separate future project.

## Architecture

**Single source of truth:** One new file — `src/styles/tokens.css` — defines all CSS custom properties. Every other stylesheet imports nothing; they just use the variables. To retheme the whole app, you change one file.

**Global effects:** A scan-line overlay and vignette are rendered once in `App.js` as fixed-position `<div>`s so they cover every screen without each component needing to know about them.

**Font:** Press Start 2P loaded via Google Fonts in `public/index.html`. Applied globally via `body { font-family: 'Press Start 2P', monospace; }` in `tokens.css`.

**Knight sprite:** `knight.png` from the design handoff copied to `src/img/characters/knight.png`. A reusable `<Knight>` React component (`src/components/util/Knight.js`) renders it with color-themed CSS filter + glow drop-shadow + float animation. All existing character `<img>` tags in lessons and quizzes replaced with `<Knight color="..." />`.

**No planet backgrounds:** All `{planet}-background` CSS classes that applied background images are replaced with the flat dark surface color (`--bg`). The existing background image files are left in place but no longer referenced.

## Design Tokens (`src/styles/tokens.css`)

```css
:root {
  /* Surfaces */
  --bg:      #020b18;
  --surf:    #071525;
  --surf2:   #0d1f35;
  --border:  #0f2a45;

  /* Brand */
  --cyan:    #00d4ff;
  --purple:  #7c3aed;
  --gold:    #ffd700;
  --green:   #00ff88;
  --red:     #ff4055;
  --orange:  #ff8c00;

  /* Text */
  --text:    #dde8f5;
  --dim:     #4a6080;

  /* Typography */
  --font:    'Press Start 2P', monospace;

  /* Spacing scale */
  --sp-1:  4px;
  --sp-2:  8px;
  --sp-3:  12px;
  --sp-4:  16px;
  --sp-5:  24px;
  --sp-6:  32px;
  --sp-7:  48px;
  --sp-8:  64px;

  /* Borders */
  --radius-sm: 0px;   /* pixel art — no border radius */
  --radius-md: 0px;
  --border-width: 2px;

  /* Shadows / Glows */
  --glow-cyan:   0 0 16px rgba(0,212,255,.45);
  --glow-purple: 0 0 16px rgba(124,58,237,.45);
  --glow-gold:   0 0 16px rgba(255,215,0,.45);
  --glow-green:  0 0 16px rgba(0,255,136,.45);
  --glow-red:    0 0 16px rgba(255,64,85,.45);
}

/* Global resets */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--surf); }
::-webkit-scrollbar-thumb { background: var(--border); }
::-webkit-scrollbar-thumb:hover { background: var(--cyan); }
```

## Knight Component (`src/components/util/Knight.js`)

Props: `size` (px, default 64), `color` (cyan | purple | green | red | gold | white, default cyan), `animate` (bool, default true), `flip` (bool, default false).

Renders `<img src={knightImg} />` with:
- `imageRendering: pixelated`
- CSS `filter` preset per color (brightness/hue-rotate/saturate to tint the sprite)
- `drop-shadow` glow matching the color
- `animation: float 3s ease-in-out infinite` when animate=true

Color-to-filter map (from design handoff `ds-primitives.jsx`):
- `cyan`:   `brightness(1.4) contrast(1.1)`
- `purple`: `brightness(1.3) contrast(1.1) hue-rotate(195deg) saturate(1.4)`
- `green`:  `brightness(1.4) contrast(1.1) hue-rotate(100deg) saturate(1.3)`
- `red`:    `brightness(1.4) contrast(1.1) hue-rotate(300deg) saturate(1.5)`
- `gold`:   `brightness(1.5) contrast(1.1) hue-rotate(248deg) saturate(1.6)`
- `white`:  `brightness(1.8) contrast(.9) saturate(.1)`

## Global Effects (`App.js`)

Two fixed-position overlay divs inserted once, outside the router:

```jsx
{/* scan-line overlay */}
<div style={{
  position:'fixed', inset:0, pointerEvents:'none', zIndex:998,
  background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,212,255,.022) 3px,rgba(0,212,255,.022) 4px)'
}}/>
{/* vignette */}
<div style={{
  position:'fixed', inset:0, pointerEvents:'none', zIndex:999,
  background:'radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,.55) 100%)'
}}/>
```

## Global Animations (`src/styles/tokens.css` — continued)

```css
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@keyframes glow-pulse {
  0%,100% { box-shadow: 0 0 8px currentColor; }
  50%      { box-shadow: 0 0 24px currentColor; }
}
@keyframes up-in {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes pop-in {
  0%   { transform: scale(.7); opacity: 0; }
  80%  { transform: scale(1.06); }
  100% { transform: scale(1);   opacity: 1; }
}
```

## Screen-by-Screen Changes

### Navbar (`src/styles/navbar.css`, `NavBar.js`)
- Background: `rgba(2,11,24,.96)` + `backdrop-filter: blur(14px)`
- Bottom border: `2px solid var(--border)`
- Logo text: CYBER in `--cyan`, HEROES in `--gold`
- Nav links: `--dim` default, `--cyan` on hover/active with `border-bottom: 3px solid var(--cyan)`
- Font: `var(--font)` at 8px, `letter-spacing: 2px`

### Landing (`src/styles/landing.css`, `landing.js`)
- Background: `var(--bg)`
- Heading: `var(--cyan)` with glow
- Knight sprite centered, `color="cyan"`, `size=120`, animated
- CTA button: `btn-primary` style (cyan bg, `#000` text, `box-shadow: 0 4px 0 #006080`)

### Exploration Map (`src/styles/map.css`, `ExplorationMap.js`)
- Background: `var(--bg)`
- Planet cards: `var(--surf)` bg, `2px solid var(--border)` border
- Active/hover planet: border becomes `var(--cyan)`, glow shadow
- Planet labels: `var(--cyan)` at 8px

### Lesson Intro (`src/styles/intro.css`, `LessonIntro.js`)
- Background: `var(--bg)`
- Title: `var(--gold)`, 14px
- Body text: `var(--text)`, 10px, `line-height: 2.2`
- Start button: `btn-primary`
- Knight: `color="gold"`, `size=96`, animated

### Lesson Pages (`src/styles/lesson.css`, `Lesson.js`, `Message.js`, `Buttons.js`)
- Background: `var(--bg)` — remove all `{planet}-background` classes
- Message box: `var(--surf)` bg, pixel-frame border (`--cyan`), `padding: 24px`
- Character side: Knight, `color="cyan"`, `size=96`, float animation
- Prev/Next buttons: `btn-ghost` / `btn-primary`
- Page input: `var(--surf2)` bg, `var(--border)` border, `var(--cyan)` focus
- TOC dropdown: `var(--surf)` bg, `var(--border)` border, `--cyan` accent

### Transitions (`src/styles/transitions.css`, `Transition.js`, `Transition_Cert.js`)
- Background: `var(--bg)`
- Message box: pixel-frame `--purple` border
- Knight: `color="purple"`, `size=96`
- Buttons: `btn-primary`, `btn-ghost`

### Quiz — Planet (`src/styles/quiz.css`, `Privacy-Planet-Quiz.js`)
- Background: `var(--bg)`
- Question box: `var(--surf)` bg, `3px solid var(--cyan)` border
- Answer buttons: `var(--surf2)` bg, `--border` border; hover → `--cyan` border
- Selected: `rgba(0,212,255,.1)` bg, `--cyan` border
- Submit/Next: `btn-primary`
- Font: `var(--font)` 9-11px

### Quiz Answers — Planet (`Privacy-Planet-Quiz-Answers.js`, `src/styles/quiz-answers.css`)
- Background: `var(--bg)`
- Correct state: `rgba(0,255,136,.1)` bg, `--green` border, `--green` text
- Incorrect state: `rgba(255,64,85,.1)` bg, `--red` border
- Health bar: pixel-notched `<progress>` replaced with `ProgressBar` component style (`--green` fill, `--surf2` track, notch overlay)
- Knight: `color="red"` when alive, `color="white"` when dead (0 health)
- Allie: Knight `color="cyan"`

### Quiz — Moon (`Privacy-Moon-Quiz.js`, `Privacy-Moon-Quiz-Answers.js`)
- Same token treatment as Planet quiz
- Knight: `color="purple"` for Alejandro role
- Letter-reveal safe images: keep existing, add `border: 2px solid var(--gold)` + `box-shadow: var(--glow-gold)`

### Drag & Drop (`src/styles/drag-drop-quiz.css`, `Drag-Drop-Quiz.js`)
- Background: `var(--bg)`
- Drop targets: `var(--surf2)` bg, `2px dashed var(--border)`; drag-over → `2px dashed var(--cyan)` + glow
- Draggable items: `var(--surf)` bg, `var(--border)` border; dragging → `--cyan` border + `var(--glow-cyan)`

### Red Flag / Green Flag (`RedFlag-GreenFlag-Quiz.js`)
- Background: `var(--bg)`
- Red zone: `rgba(255,64,85,.1)` bg, `--red` border
- Green zone: `rgba(0,255,136,.1)` bg, `--green` border
- Items: `var(--surf)` cards

### Game Answers (`src/styles/game-answers.css`, `game-answers.js`)
- Same correct/incorrect color treatment as quiz answers

### Certificate (`src/styles/certificate.css`, `Certificate.js`)
- Background: `var(--bg)`
- Certificate frame: pixel-frame, `--gold` border, `var(--glow-gold)` shadow
- Text: `--gold` heading, `--text` body
- Knight: `color="gold"`, `size=96`, animated

### Review (`src/styles/review.css`, `ReviewMenu.js`, `ReviewLesson.js`)
- Background: `var(--bg)`
- Menu items: `var(--surf)` cards, `--border` border, `--cyan` on hover
- Knight: `color="cyan"`, `size=64`

### Patrick Defeat / Leaving (`patrick_defeat.css`, `Patrick_Defeat.js`, `Patrick_leaving.js`)
- Background: `var(--bg)`
- Knight: `color="red"` (enemy defeated)
- Text: `--red` accent

### About Us (`src/styles/about.css`, `AboutUs.js`)
- Background: `var(--bg)`
- Cards: `var(--surf)`, `--border` border
- Headings: `--cyan`

## File Changes Summary

**New files:**
- `src/styles/tokens.css` — all CSS custom properties + global resets + animations
- `src/components/util/Knight.js` — reusable Knight sprite component
- `src/img/characters/knight.png` — copied from design handoff

**Modified files:**
- `public/index.html` — add Google Fonts link for Press Start 2P
- `src/App.js` — import `tokens.css`, add scan-line + vignette overlays
- `src/styles/*.css` (all 20 files) — replace hardcoded colors/fonts with tokens, remove planet background classes
- `src/components/lessons/Characters.js` — replace `<img>` with `<Knight>`
- `src/components/lessons/LessonIntro.js` — add Knight, apply tokens
- `src/components/quizzes/Privacy-Planet-Quiz-Answers.js` — new health bar style, Knight for characters
- `src/components/quizzes/Privacy-Moon-Quiz-Answers.js` — Knight for Alejandro role
- All other component `.js` files — minor className/inline-style updates to match tokens

**Untouched:**
- All data files (`src/data/`)
- All routing (`App.js` routes)
- Quiz logic, navigation, lesson flow
- Existing character images (kept, not deleted — will be used when story art is ready)
- `vocab.json`, `TextReader.js`, `VocabPopup.js`
