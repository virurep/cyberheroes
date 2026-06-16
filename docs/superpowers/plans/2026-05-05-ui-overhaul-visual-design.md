# CyberHeroes UI Overhaul — Visual Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the new pixel-art dark-space design system to every screen, replacing the current light-blue aesthetic with dark backgrounds, cyan/gold/purple tokens, Press Start 2P font, and the Knight sprite character.

**Architecture:** Create one `tokens.css` file with all CSS custom properties, import it globally first, then rewrite each screen's CSS to use tokens. JS changes are limited to: adding scan-line/vignette overlays in App.js, creating a Knight component, and replacing character `<img>` tags with `<Knight>`.

**Tech Stack:** React (CRA), CSS custom properties, Google Fonts (Press Start 2P), CSS animations.

**Worktree:** `/Users/virurepalle/Code/cyberheroes/.worktrees/ui-overhaul/`
**Design assets:** `/tmp/cyberheroes-design/cyberheroes/project/knight.png`

---

## File Map

**New files:**
- `cyberheroes/src/styles/tokens.css` — all CSS custom properties, global resets, animations
- `cyberheroes/src/components/util/Knight.js` — reusable Knight sprite component
- `cyberheroes/src/img/characters/knight.png` — copied from design handoff

**Modified files:**
- `cyberheroes/public/index.html` — add Google Fonts link
- `cyberheroes/src/index.js` — import tokens.css first
- `cyberheroes/src/styles/style.css` — remove old font/body, keep nothing breaking
- `cyberheroes/src/App.js` — add scan-line + vignette overlays
- `cyberheroes/src/styles/navbar.css` + `NavBar.js` — dark pixel navbar
- `cyberheroes/src/styles/landing.css` + `landing.js` — dark landing, Knight hero
- `cyberheroes/src/styles/map.css` + `ExplorationMap.js` — dark map
- `cyberheroes/src/styles/intro.css` + `LessonIntro.js` — dark intro screens
- `cyberheroes/src/styles/lesson.css` + `Characters.js` — dark lesson, Knight characters
- `cyberheroes/src/styles/transitions.css` + `Transition.js` + `Transition_Cert.js`
- `cyberheroes/src/styles/quiz.css` + `Privacy-Planet-Quiz.js` + `Privacy-Planet-Quiz-Answers.js`
- `Privacy-Moon-Quiz.js` + `Privacy-Moon-Quiz-Answers.js`
- `cyberheroes/src/styles/drag-drop-quiz.css` + `Drag-Drop-Quiz.js` + `RedFlag-GreenFlag-Quiz.js`
- `cyberheroes/src/styles/game-answers.css` + `game-answers.js`
- `cyberheroes/src/styles/certificate.css` + `Certificate.js`
- `cyberheroes/src/styles/review.css` + `ReviewMenu.js` + `ReviewLesson.js`
- `cyberheroes/src/styles/about.css` + `AboutUs.js`
- `cyberheroes/src/styles/table-of-contents.css`

---

## Task 1: Create design tokens CSS

**Files:**
- Create: `cyberheroes/src/styles/tokens.css`

- [ ] **Step 1: Create the tokens file**

```css
/* cyberheroes/src/styles/tokens.css */

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── TOKENS ── */
:root {
  /* Surfaces */
  --bg:     #020b18;
  --surf:   #071525;
  --surf2:  #0d1f35;
  --border: #0f2a45;

  /* Brand */
  --cyan:   #00d4ff;
  --purple: #7c3aed;
  --gold:   #ffd700;
  --green:  #00ff88;
  --red:    #ff4055;
  --orange: #ff8c00;

  /* Text */
  --text: #dde8f5;
  --dim:  #4a6080;

  /* Typography */
  --font: 'Press Start 2P', monospace;

  /* Spacing */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;

  /* Glows */
  --glow-cyan:   0 0 16px rgba(0,212,255,.45);
  --glow-purple: 0 0 16px rgba(124,58,237,.45);
  --glow-gold:   0 0 16px rgba(255,215,0,.45);
  --glow-green:  0 0 16px rgba(0,255,136,.45);
  --glow-red:    0 0 16px rgba(255,64,85,.45);
}

/* ── GLOBAL ── */
html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
}

button { font-family: var(--font); }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--surf); }
::-webkit-scrollbar-thumb { background: var(--border); }
::-webkit-scrollbar-thumb:hover { background: var(--cyan); }

/* ── PIXEL BUTTONS ── */
.px-btn {
  font-family: var(--font);
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all .12s;
  display: inline-block;
}
.px-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.15); }
.px-btn:active:not(:disabled) { transform: translateY(2px); }
.px-btn:disabled { opacity: .35; cursor: not-allowed; }

.btn-primary {
  background: var(--cyan); color: #000;
  padding: 14px 24px; font-size: 10px;
  box-shadow: 0 4px 0 #006080;
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.btn-gold {
  background: var(--gold); color: #000;
  padding: 14px 24px; font-size: 10px;
  box-shadow: 0 4px 0 #806000;
}
.btn-gold:hover:not(:disabled) {
  box-shadow: 0 6px 0 #806000, var(--glow-gold);
}

.btn-danger {
  background: var(--red); color: #fff;
  padding: 14px 24px; font-size: 10px;
  box-shadow: 0 4px 0 #801020;
}

.btn-success {
  background: var(--green); color: #000;
  padding: 14px 24px; font-size: 10px;
  box-shadow: 0 4px 0 #006840;
}

.btn-ghost {
  background: transparent; color: var(--dim);
  border: 2px solid var(--border);
  padding: 10px 20px; font-size: 8px;
}
.btn-ghost:hover:not(:disabled) { border-color: var(--cyan); color: var(--cyan); }

.btn-sm { padding: 8px 16px; font-size: 7px; }

/* ── PIXEL FRAME ── */
.px-frame {
  position: relative;
  border: 2px solid var(--cyan);
}
.px-frame::before, .px-frame::after {
  content: '';
  position: absolute;
  width: 7px; height: 7px;
  background: var(--cyan);
}
.px-frame::before { top: -2px; left: -2px; }
.px-frame::after  { top: -2px; right: -2px; }

/* ── ANIMATIONS ── */
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@keyframes up-in {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes glow-pulse {
  0%,100% { box-shadow: 0 0 8px currentColor; }
  50%      { box-shadow: 0 0 24px currentColor; }
}
@keyframes pop-in {
  0%  { transform: scale(.7); opacity: 0; }
  80% { transform: scale(1.06); }
  100%{ transform: scale(1);   opacity: 1; }
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls -la cyberheroes/src/styles/tokens.css
```
Expected: file present, ~130 lines.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/styles/tokens.css
git commit -m "feat: add design system tokens CSS"
```

---

## Task 2: Wire tokens globally + add Google Font

**Files:**
- Modify: `cyberheroes/public/index.html`
- Modify: `cyberheroes/src/index.js`
- Modify: `cyberheroes/src/styles/style.css`

- [ ] **Step 1: Add Press Start 2P to index.html**

In `cyberheroes/public/index.html`, add inside `<head>` after the existing `<link rel="manifest">` line:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Import tokens.css first in index.js**

Replace the content of `cyberheroes/src/index.js` with:

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from "react-router-dom";

import './styles/tokens.css';
import './styles/style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
```

- [ ] **Step 3: Replace style.css to remove old font/body overrides**

Replace `cyberheroes/src/styles/style.css` entirely with:

```css
/* Global styles — tokens.css is loaded before this in index.js */

/* Preserve readable-text override used by TextReader accessibility feature */
.readable-text {
  /* intentionally empty — TextReader.css manages this class */
}
```

- [ ] **Step 4: Start dev server and verify font loads**

```bash
cd cyberheroes && npm start
```

Open http://localhost:3000. All text should appear in Press Start 2P pixel font. Background should be `#020b18` (near-black dark blue). If you see Fredoka One still loading, hard-refresh with Ctrl+Shift+R.

- [ ] **Step 5: Commit**

```bash
git add cyberheroes/public/index.html cyberheroes/src/index.js cyberheroes/src/styles/style.css
git commit -m "feat: wire Press Start 2P font and design tokens globally"
```

---

## Task 3: Create Knight component and copy asset

**Files:**
- Create: `cyberheroes/src/img/characters/knight.png`
- Create: `cyberheroes/src/components/util/Knight.js`

- [ ] **Step 1: Copy knight.png from the design handoff**

```bash
cp /tmp/cyberheroes-design/cyberheroes/project/knight.png \
   cyberheroes/src/img/characters/knight.png
```

- [ ] **Step 2: Create the Knight component**

```jsx
// cyberheroes/src/components/util/Knight.js
import knightImg from '../../img/characters/knight.png';

const PRESETS = {
  cyan:   { rgb: '0,180,255',   filter: 'brightness(1.4) contrast(1.1)' },
  purple: { rgb: '160,80,255',  filter: 'brightness(1.3) contrast(1.1) hue-rotate(195deg) saturate(1.4)' },
  green:  { rgb: '0,255,120',   filter: 'brightness(1.4) contrast(1.1) hue-rotate(100deg) saturate(1.3)' },
  red:    { rgb: '255,60,80',   filter: 'brightness(1.4) contrast(1.1) hue-rotate(300deg) saturate(1.5)' },
  gold:   { rgb: '255,200,0',   filter: 'brightness(1.5) contrast(1.1) hue-rotate(248deg) saturate(1.6)' },
  white:  { rgb: '200,220,255', filter: 'brightness(1.8) contrast(.9) saturate(.1)' },
};

const Knight = ({ size = 64, color = 'cyan', animate = true, flip = false }) => {
  const p = PRESETS[color] || PRESETS.cyan;
  return (
    <img
      src={knightImg}
      alt="Knight"
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
        display: 'block',
        transform: flip ? 'scaleX(-1)' : 'none',
        filter: `${p.filter} drop-shadow(0 0 ${size * 0.08}px rgba(${p.rgb},.7)) drop-shadow(0 0 ${size * 0.16}px rgba(${p.rgb},.35))`,
        animation: animate ? 'float 3s ease-in-out infinite' : 'none',
      }}
    />
  );
};

export default Knight;
```

- [ ] **Step 3: Verify knight renders — quick smoke check**

In any existing component temporarily add `import Knight from '../util/Knight'; <Knight size={64} color="cyan" />`, start the app, confirm the sprite appears with a cyan glow and floating animation. Then remove the temporary addition.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/img/characters/knight.png cyberheroes/src/components/util/Knight.js
git commit -m "feat: add Knight sprite component with color presets"
```

---

## Task 4: Add global overlays in App.js

**Files:**
- Modify: `cyberheroes/src/App.js`

- [ ] **Step 1: Add scan-line and vignette overlays**

Replace `cyberheroes/src/App.js` with:

```jsx
import { Route, Routes } from "react-router-dom";
// Landing pages
import ExplorationMap from "./components/ExplorationMap";
import LandingPage from './components/landing.js';
import IntroPage from './components/intro.js';
import AboutPage from './components/AboutUs.js';
// Lesson pages
import LessonIntroPage from './components/lessons/LessonIntro';
import LessonPage from './components/lessons/Lesson';
import Arrival from './components/lessons/Arrival.js';
import Transition from './components/lessons/Transition';
import Certificate from './components/lessons/Certificate.js';
import Review from './components/review/review.js';
import TransitionCerts from './components/lessons/Transition_Cert.js';
import PatrickLeaving from './components/lessons/Patrick_leaving.js';
import MoonMap from './components/lessons/Moon_Map.js';
import PatrickDefeat from './components/lessons/Patrick_Defeat.js';
// Quizzes
import PrivacyPlanetQuiz from './components/quizzes/Privacy-Planet-Quiz.js';
import PrivacyPlanetQuizAnswers from './components/quizzes/Privacy-Planet-Quiz-Answers.js';
import PrivacyMoonQuizRoute from './components/quizzes/Privacy-Moon-Quiz-Route.js';
import PrivacyMoonQuiz from './components/quizzes/Privacy-Moon-Quiz.js';
import PrivacyMoonQuizAnswers from './components/quizzes/Privacy-Moon-Quiz-Answers.js';
import DragDropQuiz from './components/quizzes/Drag-Drop-Quiz.js';
import RedFlagGreenFlag from "./components/quizzes/RedFlag-GreenFlag-Quiz.js";
import GameAnswers from "./components/quizzes/game-answers.js";

const scanLine = {
  position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 998,
  background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,212,255,.022) 3px,rgba(0,212,255,.022) 4px)',
};
const vignette = {
  position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999,
  background: 'radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,.55) 100%)',
};

function App() {
  return (
    <div>
      <div style={scanLine} aria-hidden="true" />
      <div style={vignette} aria-hidden="true" />
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/exploration-map" element={<ExplorationMap />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/:planet/lesson-intro" element={<LessonIntroPage />} />
        <Route path="/:planet/arrival" element={<Arrival />} />
        <Route path="/:planet/lesson" element={<LessonPage />} />
        <Route path="/:planet/review" element={<Review />} />
        <Route path="/:planet/transition-cert" element={<TransitionCerts />} />
        <Route path="/:planet/certificate" element={<Certificate />} />
        <Route path="/:planet/transition" element={<Transition />} />
        <Route path="/:planet/patrick-leaving" element={<PatrickLeaving />} />
        <Route path="/:planet/moon-map" element={<MoonMap />} />
        <Route path="/:planet/patrick-defeat" element={<PatrickDefeat />} />
        <Route path="/privacy-planet/quiz" element={<PrivacyPlanetQuiz />} />
        <Route path="/privacy-planet/quiz/game-answers" element={<PrivacyPlanetQuizAnswers />} />
        <Route path="/privacy-moon/quiz" element={<PrivacyMoonQuizRoute />} />
        <Route path="/privacy-moon/quiz/redflag-greenflag" element={<RedFlagGreenFlag />} />
        <Route path="/privacy-moon/quiz/final-quiz" element={<PrivacyMoonQuiz />} />
        <Route path="/privacy-moon/quiz/final-quiz/game-answers" element={<PrivacyMoonQuizAnswers />} />
        <Route path="/privacy-moon/quiz/drag-drop" element={<DragDropQuiz />} />
        <Route path="/privacy-moon/drag-drop-quiz/game-answers" element={<GameAnswers />} />
      </Routes>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Verify overlays**

Start the app and navigate to any page. You should see a subtle CRT scan-line texture and a dark vignette around the edges. The overlays should not block any clicks.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/App.js
git commit -m "feat: add scan-line and vignette global overlays"
```

---

## Task 5: Navbar

**Files:**
- Modify: `cyberheroes/src/styles/navbar.css`
- Modify: `cyberheroes/src/components/util/NavBar.js`

- [ ] **Step 1: Rewrite navbar.css**

```css
/* cyberheroes/src/styles/navbar.css */

.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 56px;
  background: rgba(2,11,24,.96);
  backdrop-filter: blur(14px);
  border-bottom: 2px solid var(--border);
  box-sizing: border-box;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  image-rendering: pixelated;
}

.navbar-title {
  font-size: 10px;
  letter-spacing: 3px;
}
.navbar-title .cyber { color: var(--cyan); }
.navbar-title .heroes { color: var(--gold); }

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.home-button {
  font-family: var(--font);
  font-size: 7px;
  color: var(--dim);
  text-decoration: none;
  letter-spacing: 2px;
  padding: 8px 12px;
  border-bottom: 2px solid transparent;
  transition: all .15s;
}
.home-button:hover {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}

.logo-link, .title-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}
```

- [ ] **Step 2: Update NavBar.js to use new title markup**

```jsx
// cyberheroes/src/components/util/NavBar.js
import React from 'react';
import logo from '../../img/general/logo.png';
import { Link } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-left">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Cyberheroes Logo" className="navbar-logo" />
      </Link>
      <Link to="/" className="title-link">
        <div className="navbar-title">
          <span className="cyber">CYBER</span>
          <span className="heroes">HEROES</span>
        </div>
      </Link>
    </div>
    <div className="navbar-right">
      <Link to="/about" className="home-button">ABOUT</Link>
      <Link to="/exploration-map" className="home-button">HOME</Link>
    </div>
  </nav>
);

export default Navbar;
```

- [ ] **Step 3: Verify**

Start the app. The navbar should be dark/translucent with CYBER in cyan and HEROES in gold. Nav links should be dim and glow cyan on hover.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/navbar.css cyberheroes/src/components/util/NavBar.js
git commit -m "feat: reskin navbar with dark pixel aesthetic"
```

---

## Task 6: Landing page

**Files:**
- Modify: `cyberheroes/src/styles/landing.css`
- Modify: `cyberheroes/src/components/landing.js`

- [ ] **Step 1: Rewrite landing.css**

```css
/* cyberheroes/src/styles/landing.css */

.landing-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 56px;
  background: var(--bg);
}

.hero {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 40px 32px;
  max-width: 1100px;
  width: 100%;
}

.hero-character {
  flex-shrink: 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  max-width: 480px;
}

.tagline {
  font-size: clamp(12px, 1.8vw, 18px);
  color: var(--cyan);
  line-height: 2.2;
  letter-spacing: 2px;
  text-shadow: var(--glow-cyan);
}

.start-button {
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 16px 28px;
  font-size: 11px;
  font-family: var(--font);
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  text-transform: uppercase;
}
.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}
.start-button:active { transform: translateY(2px); box-shadow: 0 2px 0 #006080; }

@media (max-width: 768px) {
  .hero { flex-direction: column; gap: 32px; }
  .hero-content { align-items: center; text-align: center; }
  .tagline { font-size: 10px; }
}
```

- [ ] **Step 2: Update landing.js — replace hero image with Knight**

```jsx
// cyberheroes/src/components/landing.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import Navbar from './util/NavBar';
import Knight from './util/Knight';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="landing-container">
        <div className="hero">
          <div className="hero-character">
            <Knight size={180} color="cyan" animate={true} />
          </div>
          <div className="hero-content">
            <h1 className="tagline">
              A fun way to learn about proper cybersecurity practices!
            </h1>
            <button className="start-button" onClick={() => navigate('/intro')}>
              START YOUR ADVENTURE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
```

- [ ] **Step 3: Verify**

Navigate to `/`. Knight sprite should appear on the left, floating with a cyan glow. Tagline in cyan pixel font. Button dark with cyan background and pixel shadow. Background is `#020b18`.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/landing.css cyberheroes/src/components/landing.js
git commit -m "feat: reskin landing page with Knight hero and dark theme"
```

---

## Task 7: Exploration Map

**Files:**
- Modify: `cyberheroes/src/styles/map.css`

- [ ] **Step 1: Rewrite map.css**

```css
/* cyberheroes/src/styles/map.css */

body {
  background: var(--bg);
}

.exploration-heading {
  font-size: clamp(14px, 2.5vw, 22px);
  color: var(--cyan);
  text-align: center;
  letter-spacing: 4px;
  margin-bottom: 40px;
  margin-top: 80px;
  padding: 20px 0;
  text-shadow: var(--glow-cyan);
  position: sticky;
  top: 56px;
  z-index: 100;
  background: var(--bg);
}

.exploration-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: auto;
  position: relative;
  width: 100vw;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.exploration-container::-webkit-scrollbar { display: none; }

.planets-map {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 120px;
  padding: 20px;
  min-width: min-content;
}

.planet-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 200px;
  position: relative;
}
.planet-container:nth-child(odd) { margin-top: 0; }

.planet {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(0,212,255,.06);
  border: 2px solid var(--border);
  box-shadow: 0 0 20px rgba(0,212,255,.15);
  transition: transform .3s, box-shadow .3s;
  overflow: visible;
  margin-bottom: 60px;
  cursor: pointer;
}
.planet:hover {
  transform: scale(1.1);
  border-color: var(--cyan);
  box-shadow: var(--glow-cyan);
}

.planet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.planet-name {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--cyan);
  font-size: 8px;
  letter-spacing: 2px;
  text-align: center;
  white-space: nowrap;
  z-index: 2;
}

.moon-container {
  position: absolute;
  top: -120px;
  right: -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.moon {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(124,58,237,.12);
  border: 2px solid var(--border);
  box-shadow: 0 0 12px rgba(124,58,237,.2);
  transition: transform .3s, box-shadow .3s;
  overflow: visible;
  cursor: pointer;
}
.moon:hover {
  transform: scale(1.1);
  border-color: var(--purple);
  box-shadow: var(--glow-purple);
}

.moon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.moon-name {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--purple);
  font-size: 7px;
  letter-spacing: 1px;
  text-align: center;
  white-space: nowrap;
  z-index: 2;
}

.moon-connector {
  display: none;
}
.planet-connector { display: none; }

.scroll-button {
  position: fixed;
  bottom: 40px;
  background: rgba(0,212,255,.1);
  border: 2px solid var(--cyan);
  color: var(--cyan);
  padding: 12px 20px;
  font-family: var(--font);
  font-size: 9px;
  cursor: pointer;
  transition: all .2s;
  z-index: 1000;
  letter-spacing: 2px;
}
.scroll-button:hover { background: rgba(0,212,255,.2); transform: scale(1.05); }
.scroll-left { left: 40px; }
.scroll-right { right: 40px; }

.your-here-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-right: 40px;
  position: relative;
}
.your-here-rocket {
  width: 150px; height: 150px;
  border-radius: 50%;
  background: rgba(0,212,255,.06);
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.rocket-image { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.your-here-text {
  position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  color: var(--gold); font-size: 7px; letter-spacing: 2px;
  white-space: nowrap; z-index: 2;
}

.jet-container {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  position: relative; margin-left: 50px; margin-top: 200px;
}
.jet-image { width: 150px; height: 150px; object-fit: contain; transition: transform .3s; }
.jet-container:hover .jet-image { transform: scale(1.1); }
.jet-text {
  color: var(--cyan); font-size: 8px; letter-spacing: 2px;
  text-align: center; white-space: nowrap;
}
```

- [ ] **Step 2: Verify**

Navigate to `/exploration-map`. Background should be `#020b18`. Planet circles should have a dark surface with cyan border on hover. Moon circles should glow purple on hover. All text in pixel font.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/styles/map.css
git commit -m "feat: reskin exploration map with dark pixel theme"
```

---

## Task 8: Lesson Intro

**Files:**
- Modify: `cyberheroes/src/styles/intro.css`
- Modify: `cyberheroes/src/components/lessons/LessonIntro.js`

- [ ] **Step 1: Rewrite intro.css**

```css
/* cyberheroes/src/styles/intro.css */

body { background: var(--bg); }

.lesson-intro-background {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lesson-intro-side {
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lesson-intro-rocket {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-150%, 25%) rotate(10deg);
  max-width: 180px;
}

.lesson-intro-planet {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-125%, -25%);
  width: 240px;
}

.lesson-intro-message {
  width: 80%;
  background: var(--surf);
  border: 2px solid var(--cyan);
  padding: 3rem;
}

.lesson-intro-title {
  color: var(--cyan);
  font-size: clamp(12px, 2vw, 16px);
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  text-shadow: var(--glow-cyan);
}

.lesson-intro-message p {
  font-size: clamp(9px, 1.2vw, 11px);
  color: var(--text);
  line-height: 2.4;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.enter-lesson-btn {
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 14px 24px;
  font-size: 10px;
  font-family: var(--font);
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  text-transform: uppercase;
  margin: 0 auto;
  display: block;
}
.enter-lesson-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

/* Computer intro */
.computer-image {
  width: 85%;
  height: auto;
  position: relative;
  z-index: 1;
}

.computer-content {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 75%; height: 65%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.computer-content-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.computer-intro-image {
  max-width: 300px;
  height: auto;
  margin-right: 50px;
}

.computer-content .intro-message {
  color: var(--text);
  font-size: clamp(9px, 1.1vw, 11px);
  line-height: 2.2;
  text-align: left;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  letter-spacing: 1px;
}

.computer-btn-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 60px;
}

.go-back-map-btn {
  background: transparent;
  color: var(--dim);
  border: 2px solid var(--border);
  padding: 10px 18px;
  font-size: 8px;
  font-family: var(--font);
  letter-spacing: 2px;
  cursor: pointer;
  transition: all .12s;
  margin-top: 35px;
}
.go-back-map-btn:hover { border-color: var(--cyan); color: var(--cyan); }

.start-lesson-btn {
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 12px 22px;
  font-size: 9px;
  font-family: var(--font);
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  margin-top: 35px;
}
.start-lesson-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.coming-soon-message {
  color: var(--text);
  font-size: clamp(9px, 1.2vw, 11px);
  text-align: center;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  line-height: 2.2;
  letter-spacing: 1px;
}

.hidden { display: none !important; }
```

- [ ] **Step 2: Update LessonIntro.js — add Knight to the intro side**

The `lesson-intro-side` currently shows rocket + planet images. Add Knight above them. Replace only the first `return` block (the active planet view, not the computer or coming-soon states) so the `<div className="lesson-intro-side">` becomes:

```jsx
<div className="lesson-intro-side">
  <Knight size={120} color="gold" animate={true} />
  <img src={rocket} alt="Rocket Ship" className="lesson-intro-rocket" />
  {planetImage && <img src={planetImage} alt={`${planet} Planet`} className="lesson-intro-planet" />}
</div>
```

Add the import at the top of the file:
```jsx
import Knight from '../util/Knight';
```

- [ ] **Step 3: Verify**

Navigate to `/privacy-planet/lesson-intro`. Dark background, cyan-bordered message box, Knight sprite floating with gold glow on the left side.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/intro.css cyberheroes/src/components/lessons/LessonIntro.js
git commit -m "feat: reskin lesson intro with dark pixel theme and Knight"
```

---

## Task 9: Lesson pages CSS + Characters component

**Files:**
- Modify: `cyberheroes/src/styles/lesson.css`
- Modify: `cyberheroes/src/components/lessons/Characters.js`

- [ ] **Step 1: Rewrite lesson.css**

```css
/* cyberheroes/src/styles/lesson.css */

/* Container */
.lesson-container {
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

/* Remove old planet background classes — dark theme replaces them */
.privacy-planet-background,
.privacy-moon-background { background: var(--bg); }

.lesson-content {
  position: relative;
  display: flex;
  transform: translateY(56px);
}

/* Layout containers */
.message-box-bottom-container {
  position: relative;
  height: 100%;
  flex-direction: column;
}

.message-box-right-container {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
}

.alert-header-container {
  position: relative;
  height: 85%;
  flex-direction: column-reverse;
  align-self: center;
}

/* Characters */
.message-box-bottom-container .character-container {
  position: absolute;
  bottom: 25vh;
  width: 100%;
  z-index: 1;
}

.character { height: 30rem; }
.message-box-bottom-container .character { position: absolute; bottom: 0; }
.message-box-right-container .character { margin: auto; }

.character-left  { left: 5%; }
.character-center { left: 50%; transform: translateX(-50%); }
.character-right { right: 5%; }
.character-flip  { transform: scaleX(-1); }
.message-box-bottom-container .character-l { height: 40rem; }
.character-s { height: 25rem; bottom: 10%; }

.alert-header-container .character-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-left-1  { position: relative; top: 10vh; }
.character-left-last { margin-right: 200px; }

.arrow-character {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -10vh;
}
.arrow-character .character { height: 20rem; cursor: pointer; }
.arrow-character .character:hover { transform: scale(1.05); }

.character-right-1 { top: -5vh; }
.character-right-2 { top: -10vh; }
.character-right-3 { top: -15vh; }

/* Message box */
.text-container {
  font-size: clamp(10px, 1.3vw, 13px);
  color: var(--text);
}

.message-box-bottom-container .text-container {
  position: absolute;
  left: 50%; bottom: 15vh;
  transform: translateX(-50%);
  width: 90%;
  height: 17.5rem;
  z-index: 2;
}

.message-box {
  width: 100%;
  text-align: center;
  background: var(--surf);
  border: 2px solid var(--cyan);
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.message-box-bottom {
  margin-top: auto;
  max-height: 90%;
  position: absolute;
  bottom: 0;
}

.message-box-right {
  width: 90%;
  margin: 0 auto;
}

.text-container .message-box-gold {
  border-color: var(--gold);
}

/* Speaker name */
.speaker-name {
  position: absolute;
  background: var(--surf2);
  border: 2px solid var(--cyan);
  padding: 4px 16px;
  font-size: 7px;
  color: var(--cyan);
  letter-spacing: 2px;
  z-index: 2;
}
.speaker-right { right: 0; transform: translate(-20px, 50px); }
.speaker-left  { left: 0;  transform: translate(20px, 50px); }

/* Lesson text */
.message-box-bottom-container .lesson-text,
.message-box-right-container .lesson-text {
  width: 90%;
  font-size: clamp(9px, 1.1vw, 12px);
  color: var(--text);
  line-height: 2.4;
  letter-spacing: .5px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--cyan) var(--surf2);
  margin-bottom: 10px;
  margin-top: 15px;
}

.alert-header-container .text-container { position: relative; top: -10vh; }

.alert-header { background-color: transparent; }
.alert-header .lesson-text {
  font-size: 3rem;
  color: var(--red);
  text-shadow: var(--glow-red);
}

.text-header {
  font-size: 1.5rem;
  position: absolute;
  top: 0; left: 50%;
  transform: translate(-50%, -100px);
  color: var(--cyan);
}

/* Vocab */
.vocab-word { text-decoration: underline; cursor: pointer; }
.vocab-word:hover { color: var(--cyan); }

.vocab-popup-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.7);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.vocab-popup {
  background: var(--surf);
  color: var(--text);
  border: 2px solid var(--cyan);
  min-height: 15vh; max-height: 40vh;
  min-width: 15vw; max-width: 50vw;
  padding: 20px;
  position: relative;
  font-size: clamp(9px, 1.2vw, 11px);
  line-height: 2;
}
.vocab-popup h3 { color: var(--cyan); font-size: 12px; margin-bottom: 12px; letter-spacing: 2px; }
.vocab-popup p  { color: var(--text); }

.close-button {
  position: absolute; top: 10px; right: 10px;
  background: none; border: none;
  font-size: 18px; cursor: pointer;
  color: var(--dim);
}
.close-button:hover { color: var(--red); }

/* Buttons */
.button-container {
  display: flex;
  width: 90%;
  align-items: center;
  justify-content: flex-start;
  padding-top: 10px;
  margin-bottom: 20px;
  justify-self: flex-end;
  gap: 12px;
}

.lesson-button {
  font-family: var(--font);
  font-size: 8px;
  letter-spacing: 2px;
  border: 2px solid var(--border);
  padding: 10px 18px;
  background: transparent;
  color: var(--dim);
  cursor: pointer;
  transition: all .12s;
  text-transform: uppercase;
}
.lesson-button:hover { border-color: var(--cyan); color: var(--cyan); }
.next-button { margin-left: auto; }
.next-button::before { content: "NEXT"; }
.prev-button::before { content: "BACK"; }

.lesson-page-input {
  width: 5rem; height: 2rem;
  background: var(--surf2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 9px;
  text-align: center;
  align-self: center;
  display: none;
}

.default-button {
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 14px 24px;
  font-size: 10px;
  font-family: var(--font);
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  text-transform: uppercase;
  margin: 0 auto;
  display: block;
}
.default-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

/* Text reader positioning */
.text-reader-controls {
  position: relative;
  z-index: 10;
  margin-top: 5px;
  margin-bottom: 5px;
}

/* Color helpers */
.red-text   { color: var(--red); }
.gold-text  { color: var(--gold); }
.underline-text { text-decoration: underline dotted; }

ul, ol { list-style-position: inside; }
```

- [ ] **Step 2: Update Characters.js to render Knight instead of character images**

The character name is mapped to a Knight color. Replace the full file:

```jsx
// cyberheroes/src/components/lessons/Characters.js
import Knight from '../util/Knight';
import arrow from '../../img/general/arrow.png';

const COLOR_MAP = {
  'allie':     'cyan',
  'safe':      'green',
  'enemy':     'red',
  'alejandro': 'purple',
};

const getKnightColor = (name) =>
  COLOR_MAP[name.toLowerCase()] || 'cyan';

const Characters = ({ characters }) => (
  <div className="character-container">
    {characters.map((character) => {
      const color = getKnightColor(character.name);

      if (character.arrow !== undefined) {
        const handleClick = () => character.onClick && character.onClick(character.arrow);
        const handleKeyDown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        };
        return (
          <div key={character.name} className={`arrow-character ${character.style || ''}`}>
            <div className="arrow-container">
              <img src={arrow} alt="arrow" className="arrow" />
            </div>
            <div
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <Knight size={200} color={color} animate={true} />
            </div>
          </div>
        );
      }

      return (
        <div key={character.name} className={`character ${character.style || ''}`}
          style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Knight size={200} color={color} animate={true} />
        </div>
      );
    })}
  </div>
);

export default Characters;
```

- [ ] **Step 3: Verify**

Navigate to a lesson page (e.g. `/privacy-planet/lesson`). Background should be dark. Message box should have a cyan border on dark surface. Characters should render as the Knight sprite with color-coded glow.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/lesson.css cyberheroes/src/components/lessons/Characters.js
git commit -m "feat: reskin lesson pages and replace character images with Knight"
```

---

## Task 10: Table of Contents + Transitions

**Files:**
- Modify: `cyberheroes/src/styles/table-of-contents.css`
- Modify: `cyberheroes/src/styles/transitions.css`
- Modify: `cyberheroes/src/components/lessons/Transition.js`
- Modify: `cyberheroes/src/components/lessons/Transition_Cert.js`

- [ ] **Step 1: Rewrite table-of-contents.css**

```css
/* cyberheroes/src/styles/table-of-contents.css */

.table-of-contents-container {
  position: fixed;
  top: 56px;
  right: 0;
  z-index: 500;
}

.parts-container {
  background: var(--surf);
  border: 2px solid var(--border);
  border-right: none;
  min-width: 200px;
}

.toc-header {
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 2px solid var(--border);
  transition: background .15s;
}
.toc-header:hover { background: var(--surf2); }

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 7px;
  color: var(--dim);
  letter-spacing: 2px;
}

.toc-icon { width: 16px; height: 16px; image-rendering: pixelated; }

.dropdown-arrow {
  margin-left: auto;
  width: 10px;
  height: 10px;
  transition: transform .2s;
  image-rendering: pixelated;
}
.down-arrow  { transform: rotate(90deg); }
.right-arrow { transform: rotate(0deg); }

.toc-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s ease;
}
.toc-body.open { max-height: 400px; }

.part-item {
  padding: 10px 14px;
  font-size: 7px;
  color: var(--dim);
  letter-spacing: 1px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: all .15s;
}
.part-item:hover { background: var(--surf2); color: var(--cyan); }
.part-item.quiz-1,
.part-item.quiz-2,
.part-item.quiz-3 { color: var(--purple); }
.part-item.quiz-1:hover,
.part-item.quiz-2:hover,
.part-item.quiz-3:hover { color: var(--cyan); }
```

- [ ] **Step 2: Rewrite transitions.css**

```css
/* cyberheroes/src/styles/transitions.css */

.transition-container {
  width: 100vw;
  height: 100vh;
  background: var(--bg);
  position: fixed;
  top: 0; left: 0;
  overflow: hidden;
}

/* Remove planet background images */
.privacy-planet-background,
.privacy-moon-background { background: var(--bg); }

.transition-content {
  width: 100%;
  height: calc(100vh - 56px);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 56px;
}

.transition-layout {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  align-items: center;
}

/* Transition (quiz) */
.message-side-transition {
  width: 60%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 40px;
}

.transition-message-box {
  background: var(--surf);
  border: 2px solid var(--purple);
  padding: 32px;
  max-width: 80%;
}

.transition-message {
  color: var(--text);
  font-size: clamp(9px, 1.3vw, 12px);
  line-height: 2.2;
  letter-spacing: 1px;
  margin: 0 0 24px;
  text-align: center;
}

.button-container-transition {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 20px;
}

.quiz-button {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 14px 24px;
  width: 240px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  text-transform: uppercase;
}
.quiz-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.review-button {
  font-family: var(--font);
  font-size: 8px;
  letter-spacing: 2px;
  background: transparent;
  color: var(--dim);
  border: 2px solid var(--border);
  padding: 12px 24px;
  width: 240px;
  cursor: pointer;
  transition: all .12s;
}
.review-button:hover { border-color: var(--cyan); color: var(--cyan); }

.certificate-button {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--gold);
  color: #000;
  border: none;
  padding: 14px 24px;
  width: 240px;
  cursor: pointer;
  box-shadow: 0 4px 0 #806000;
  transition: all .12s;
}
.certificate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #806000, var(--glow-gold);
}

.character-side-transition {
  position: fixed;
  bottom: -10%;
  right: 2%;
  z-index: 2;
}

/* Cert transition — message side */
.message-side {
  width: 60%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 40px;
}

.message-box {
  background: var(--surf);
  border: 2px solid var(--gold);
  padding: 32px;
  max-width: 80%;
}

.character-side {
  position: fixed;
  bottom: -10%;
  right: 2%;
  z-index: 2;
}

/* Patrick leaving */
.patrick-leaving {
  width: 100vw; height: 100vh;
  position: fixed; top: 0; left: 0;
  overflow: hidden;
  background: var(--bg);
}
.patrick-leaving .bottom-content {
  position: fixed; bottom: 50px; left: 0;
  width: 100%; text-align: center;
  opacity: 0;
  animation: fadeIn .5s forwards;
  animation-delay: 2.5s;
}
.patrick-leaving .leaving-text {
  color: var(--text);
  font-size: clamp(24px, 5vw, 48px);
  margin-bottom: 20px;
  letter-spacing: 3px;
}
.patrick-leaving .continue-button-leaving {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 14px 24px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
}
.patrick-leaving .continue-button-leaving:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}
.patrick-leaving #moon {
  position: fixed; top: 100px; right: 20px;
  width: 200px; height: auto;
}
.patrick-leaving #rocket-flying {
  position: fixed; height: auto;
  animation: rocketFlight 2.75s forwards;
}

@keyframes rocketFlight {
  0%   { bottom: 100%; right: 10%; transform: rotate(0deg) scale(1); width: 600px; }
  100% { top: 15%; left: 65%; transform: rotate(0deg) scale(0.6); width: 400px; }
}
@keyframes fadeIn {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Moon/map button */
.moon-button {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 14px 24px;
  width: 240px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
}
.moon-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.polaroid {
  position: fixed; width: 250px; height: 300px;
  top: 60%; left: 2%;
  transform: rotate(-40deg);
  z-index: 2;
}
.polaroid img { width: 100%; height: 100%; object-fit: cover; }
```

- [ ] **Step 3: Update Transition.js — replace character img with Knight**

In `Transition.js`, remove the image loading code and replace the character img with Knight. The changed portions:

Remove:
```jsx
const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
// ...
const imageName = characters.toLowerCase().replace(/\s+/g, '-');
const imagePath = characterImages(`./${imageName}.png`);
```

Add import:
```jsx
import Knight from '../util/Knight';
```

Replace:
```jsx
<div className="character-side-transition">
  <img
    src={imagePath}
    alt={characters}
    className="character-image-transition"
  />
</div>
```
With:
```jsx
<div className="character-side-transition">
  <Knight size={280} color="purple" animate={true} flip={true} />
</div>
```

- [ ] **Step 4: Update Transition_Cert.js — replace character img with Knight**

Same pattern as Transition.js. Remove image loading code, add Knight import, replace:
```jsx
<div className="character-side">
  <img src={imagePath} alt={characters} className="character-image" />
</div>
```
With:
```jsx
<div className="character-side">
  <Knight size={280} color="gold" animate={true} flip={true} />
</div>
```

- [ ] **Step 5: Verify**

Navigate to a transition screen. Background should be dark. Message box should have purple border. Knight should appear on the right side with appropriate glow.

- [ ] **Step 6: Commit**

```bash
git add cyberheroes/src/styles/table-of-contents.css \
        cyberheroes/src/styles/transitions.css \
        cyberheroes/src/components/lessons/Transition.js \
        cyberheroes/src/components/lessons/Transition_Cert.js
git commit -m "feat: reskin TOC and transition screens"
```

---

## Task 11: Planet Quiz

**Files:**
- Modify: `cyberheroes/src/styles/quiz.css` (planet quiz sections)
- Modify: `cyberheroes/src/components/quizzes/Privacy-Planet-Quiz.js`

- [ ] **Step 1: Rewrite quiz.css**

```css
/* cyberheroes/src/styles/quiz.css */

/* ── BACKGROUNDS ── */
.privacy-planet-quiz-background,
.privacy-moon-quiz-background {
  background: var(--bg);
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
}

/* ── PLANET QUIZ ── */
.quiz-container {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.quiz-question {
  background: var(--surf);
  border: 3px solid var(--cyan);
  color: var(--text);
  min-height: 15vh;
  width: 70vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 32px;
  text-align: center;
  font-size: clamp(10px, 1.4vw, 13px);
  line-height: 2;
  letter-spacing: 1px;
}

.quiz-answers-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 70vw;
  padding: 0 20px;
}

.multiple-select-answer-container {
  display: grid;
  gap: 16px;
  max-width: 70vw;
  padding: 0 20px;
}
.multiple-select-answer-container:has(button:nth-child(4):last-child) {
  grid-template-columns: repeat(2, 1fr);
}
.multiple-select-answer-container:has(button:nth-child(6):last-child) {
  grid-template-columns: repeat(3, 1fr);
  margin: 0 auto;
  width: 110%;
}

.quiz-answer-btn {
  font-family: var(--font);
  font-size: clamp(8px, 1.1vw, 10px);
  letter-spacing: 1px;
  padding: 16px 18px;
  background: var(--surf2);
  border: 2px solid var(--border);
  color: var(--text);
  cursor: pointer;
  transition: all .15s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 25vw;
  line-height: 1.8;
}
.quiz-answer-btn:hover { border-color: var(--cyan); background: rgba(0,212,255,.06); }

/* Keep color-coded answer backgrounds using muted versions */
.answer-btn-1 { border-color: rgba(255,64,85,.4); }
.answer-btn-1:hover { border-color: var(--red); background: rgba(255,64,85,.08); }
.answer-btn-2 { border-color: rgba(0,212,255,.4); }
.answer-btn-2:hover { border-color: var(--cyan); background: rgba(0,212,255,.08); }
.answer-btn-3 { border-color: rgba(255,215,0,.4); }
.answer-btn-3:hover { border-color: var(--gold); background: rgba(255,215,0,.08); }
.answer-btn-4 { border-color: rgba(0,255,136,.4); }
.answer-btn-4:hover { border-color: var(--green); background: rgba(0,255,136,.08); }
.answer-btn-5 { border-color: rgba(124,58,237,.4); }
.answer-btn-5:hover { border-color: var(--purple); background: rgba(124,58,237,.08); }
.answer-btn-6 { border-color: rgba(0,212,255,.4); }

.quiz-answer-shape { width: 48px; height: 48px; flex-shrink: 0; image-rendering: pixelated; }

.quiz-submit-btn {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  margin-top: 20px;
  background: var(--purple);
  color: #fff;
  border: none;
  padding: 14px 28px;
  cursor: pointer;
  box-shadow: 0 4px 0 #3d1a7a;
  transition: all .12s;
  text-transform: uppercase;
}
.quiz-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #3d1a7a, var(--glow-purple);
}
.quiz-submit-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }

/* ── QUIZ ANSWERS ── */
.answers-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 90px;
  position: relative;
}

.health-bar-label {
  color: var(--dim);
  font-size: 7px;
  letter-spacing: 3px;
  text-align: center;
  margin: 0 0 8px;
}

.privacy-planet-health-bar {
  width: 100%;
  height: 16px;
  background: var(--surf2);
  border: 2px solid var(--border);
  position: relative;
  overflow: hidden;
}
.privacy-planet-health-bar-progress {
  display: block;
  width: 100%;
  height: 100%;
  appearance: none;
  background: transparent;
}
.privacy-planet-health-bar-progress::-webkit-progress-bar { background: var(--surf2); }
.privacy-planet-health-bar-progress::-webkit-progress-value {
  background: var(--green);
  box-shadow: 0 0 8px rgba(0,255,136,.6);
}
.privacy-planet-health-bar-progress::-moz-progress-bar {
  background: var(--green);
}

.characters-answers-img { height: 300px; margin-top: 20px; image-rendering: pixelated; }

.text-answers-container {
  background: var(--surf);
  border: 2px solid var(--cyan);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 40px;
  max-width: 600px;
  min-width: 100px;
  text-align: center;
  animation: up-in .35s ease;
}

.text-answers-title {
  color: var(--cyan);
  font-size: clamp(12px, 1.8vw, 16px);
  letter-spacing: 3px;
  margin-bottom: 16px;
}

.text-answers-text {
  color: var(--text);
  font-size: clamp(9px, 1.2vw, 11px);
  line-height: 2.2;
  margin-bottom: 12px;
  letter-spacing: .5px;
}

.answer-hint { color: var(--orange); }

.quiz-try-again-btn {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--red);
  color: #fff;
  border: none;
  padding: 12px 22px;
  cursor: pointer;
  box-shadow: 0 4px 0 #801020;
  transition: all .12s;
  margin: 16px 0 8px;
}
.quiz-try-again-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #801020, var(--glow-red);
}

.quiz-next-btn {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--cyan);
  color: #000;
  border: none;
  padding: 12px 22px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  margin: 16px 0 8px;
}
.quiz-next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

/* ── MOON SPECIFIC ── */
.privacy-moon-quiz-answers-container { padding: 0; }
.dark-answers-container {
  background: var(--surf2);
  border: 2px solid var(--border);
}
.red-text   { color: var(--red); }
.red-outline  { border-color: var(--red) !important; }
.green-text { color: var(--green); }
.green-outline { border-color: var(--green) !important; }

.reveal-letter-btn {
  background: var(--green);
  color: #000;
  box-shadow: 0 4px 0 #006840;
}
.reveal-letter-btn:hover {
  box-shadow: 0 6px 0 #006840, var(--glow-green);
}

.quiz-next-btn-revealed {
  position: absolute;
  bottom: 105px; left: 60%;
  transform: translateX(-50%);
  z-index: 2;
  background: var(--green);
  color: #000;
  box-shadow: 0 4px 0 #006840;
  padding: 10px 20px;
}
.quiz-next-btn-revealed:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 0 #006840, var(--glow-green);
}

/* ── RED FLAG / GREEN FLAG ── */
.game-container {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.flag-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.flags { max-width: 400px; }
.flags:hover { transform: scale(1.05); cursor: pointer; }

.answer-popup-container {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.7);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-text-container {
  background: var(--surf);
  border: 2px solid var(--cyan);
  color: var(--text);
  min-height: 15vh; max-height: 40vh;
  min-width: 15vw; max-width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  margin-bottom: 40px;
  flex-direction: column;
  position: relative;
  z-index: 1001;
  font-size: clamp(9px, 1.2vw, 11px);
  line-height: 2;
}

.popup-Al { max-height: 60vh; position: relative; z-index: 1001; }

/* ── DRAG AND DROP ── */
.drag-drop-quiz-title {
  text-align: center;
  color: var(--cyan);
  margin-bottom: 20px;
  font-size: clamp(12px, 1.8vw, 16px);
  letter-spacing: 3px;
  text-shadow: var(--glow-cyan);
}

.drag-drop-question-box {
  background: var(--surf);
  border: 2px solid var(--cyan);
  color: var(--text);
  padding: 24px;
  cursor: move;
  transition: transform .2s, box-shadow .2s;
  text-align: center;
  margin-bottom: 20px;
  min-height: 15vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
}
.drag-drop-question-box:hover { transform: scale(1.02); box-shadow: var(--glow-cyan); }
.drag-drop-question-text { font-size: clamp(9px, 1.2vw, 11px); color: var(--text); margin: 0; }

.drag-drop-answer-boxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 1200px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.drag-drop-answer-box {
  min-height: 200px;
  padding: 24px;
  background: var(--surf2);
  border: 2px dashed var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all .2s;
  cursor: pointer;
}
.drag-drop-answer-box:hover { border-color: var(--cyan); box-shadow: var(--glow-cyan); }
.drag-drop-answer-box h2 {
  color: var(--text);
  font-size: clamp(9px, 1.1vw, 11px);
  letter-spacing: 2px;
  text-align: center;
  margin: 0 0 16px;
  width: 100%;
}

.drag-drop-answer-box.private { border-color: var(--red);   background: rgba(255,64,85,.08);  }
.drag-drop-answer-box.public  { border-color: var(--cyan);  background: rgba(0,212,255,.06);  }
.drag-drop-answer-box.correct { border-color: var(--green); background: rgba(0,255,136,.08);  }
.drag-drop-answer-box.incorrect { border-color: var(--red); background: rgba(255,64,85,.08); }

.drag-drop-feedback-popup {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  width: 100%; height: 100%;
}
.drag-drop-feedback-popup .popup-text-container {
  background: var(--surf);
  border: 2px solid var(--cyan);
  color: var(--text);
  min-height: 20vh; max-height: 40vh;
  min-width: 30vw; max-width: 50vw;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 28px;
  position: relative;
  z-index: 1001;
  margin-right: 200px;
  font-size: clamp(9px, 1.1vw, 11px);
  line-height: 2;
}
.drag-drop-feedback-popup .popup-Al {
  position: absolute; right: 0; bottom: 50px;
  max-height: 60vh; z-index: 1001;
}
.drag-drop-next-button, .drag-drop-try-again-button {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  padding: 12px 22px;
  border: none;
  cursor: pointer;
  transition: all .12s;
}
.drag-drop-next-button {
  background: var(--cyan); color: #000; box-shadow: 0 4px 0 #006080;
}
.drag-drop-next-button:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}
.drag-drop-try-again-button {
  background: var(--red); color: #fff; box-shadow: 0 4px 0 #801020;
}
.drag-drop-try-again-button:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #801020, var(--glow-red);
}
.drag-drop-feedback-popup .popup-text-container p {
  color: var(--text);
  font-size: clamp(9px, 1.1vw, 11px);
  line-height: 2;
  margin-bottom: 16px;
}
.drag-drop-feedback-popup .popup-text-container p.incorrect-message { color: var(--red); }
```

- [ ] **Step 2: Update Privacy-Planet-Quiz.js — remove unused imports, add null guard**

The null guard already exists from the data refactor. Only visual change needed: remove inline `border` overrides if any; the CSS handles styling now. Confirm the file has:

```jsx
import { useNavigate, useLocation } from "react-router-dom";
// (useParams already removed in prior refactor)
```

No JS visual changes needed — quiz.css handles all styling.

- [ ] **Step 3: Verify**

Navigate to `/privacy-planet/quiz` (via the lesson flow). Dark background, cyan-bordered question box, dark answer buttons with colored left-border accents.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/quiz.css \
        cyberheroes/src/components/quizzes/Privacy-Planet-Quiz.js
git commit -m "feat: reskin quiz screens with dark pixel theme"
```

---

## Task 12: Planet Quiz Answers

**Files:**
- Modify: `cyberheroes/src/components/quizzes/Privacy-Planet-Quiz-Answers.js`

- [ ] **Step 1: Replace character images with Knight**

In `Privacy-Planet-Quiz-Answers.js`, replace the three character image imports and their usage:

Remove:
```jsx
import Allie from '../../img/characters/allie.png';
import Enemy from '../../img/characters/enemy.png';
import DeadEnemy from '../../img/characters/privacy-enemy-dead.png';
```

Add:
```jsx
import Knight from '../util/Knight';
```

Replace the characters column JSX:
```jsx
<div className="characters-answers-container">
  <p className="health-bar-label">Health Bar</p>
  <div className="privacy-planet-health-bar">
    <progress className="privacy-planet-health-bar-progress" value={healthBar} max="1" />
  </div>
  <img src={healthBar !== 0 ? Enemy : DeadEnemy} ... />
</div>
```

With:
```jsx
<div className="characters-answers-container">
  <p className="health-bar-label">HEALTH BAR</p>
  <div className="privacy-planet-health-bar">
    <progress className="privacy-planet-health-bar-progress" value={healthBar} max="1" />
  </div>
  <Knight
    size={200}
    color={healthBar !== 0 ? 'red' : 'white'}
    animate={healthBar !== 0}
  />
</div>
```

In the incorrect answer branch, replace Allie image:
```jsx
<div className="characters-answers-container">
  <img src={Allie} alt="Allie" className="characters-answers-img" />
</div>
```
With:
```jsx
<div className="characters-answers-container">
  <Knight size={200} color="cyan" animate={true} />
</div>
```

- [ ] **Step 2: Verify**

Go through a quiz question and answer correctly. Knight in red glow (enemy alive), health bar showing. Answer incorrectly: cyan Knight (Allie stand-in) with try-again button.

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/quizzes/Privacy-Planet-Quiz-Answers.js
git commit -m "feat: replace character images with Knight in planet quiz answers"
```

---

## Task 13: Moon Quiz and Moon Quiz Answers

**Files:**
- Modify: `cyberheroes/src/components/quizzes/Privacy-Moon-Quiz-Answers.js`

- [ ] **Step 1: Replace Alejandro image with Knight in moon answers**

In `Privacy-Moon-Quiz-Answers.js`:

Remove:
```jsx
import Alejandro from '../../img/characters/alejandro.png';
```

Add:
```jsx
import Knight from '../util/Knight';
```

Replace:
```jsx
<div className="characters-answers-container">
  <img src={Alejandro} alt="Alejandro" className="characters-answers-img" />
</div>
```
With:
```jsx
<div className="characters-answers-container">
  <Knight size={200} color="purple" animate={true} />
</div>
```

- [ ] **Step 2: Verify**

Go through the moon final quiz. Incorrect answer screen shows purple Knight. Letter-reveal screen shows the safe letter image (unchanged).

- [ ] **Step 3: Commit**

```bash
git add cyberheroes/src/components/quizzes/Privacy-Moon-Quiz-Answers.js
git commit -m "feat: replace Alejandro image with Knight in moon quiz answers"
```

---

## Task 14: Game Answers (Drag-Drop answers page)

**Files:**
- Modify: `cyberheroes/src/styles/game-answers.css`
- Modify: `cyberheroes/src/components/quizzes/game-answers.js`

- [ ] **Step 1: Rewrite game-answers.css**

```css
/* cyberheroes/src/styles/game-answers.css */

.feedback-popup {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: var(--surf);
  border: 2px solid var(--cyan);
  color: var(--text);
  padding: 32px;
  text-align: center;
  z-index: 1000;
  width: 80%;
  max-width: 500px;
  animation: up-in .35s ease;
}

.feedback-popup h2 {
  color: var(--cyan);
  margin-bottom: 16px;
  font-size: clamp(12px, 1.6vw, 14px);
  letter-spacing: 3px;
}
.feedback-popup p {
  margin-bottom: 20px;
  color: var(--text);
  font-size: clamp(9px, 1.2vw, 11px);
  line-height: 2;
}

.next-button-answers {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--cyan); color: #000;
  border: none; padding: 12px 22px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
}
.next-button-answers:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.try-again-button-answers {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  background: var(--red); color: #fff;
  border: none; padding: 12px 22px;
  cursor: pointer;
  box-shadow: 0 4px 0 #801020;
  transition: all .12s;
}
.try-again-button-answers:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #801020, var(--glow-red);
}

.drag-drop-next-button-answers {
  font-family: var(--font); font-size: 9px; letter-spacing: 2px;
  background: var(--cyan); color: #000; border: none;
  padding: 12px 22px; cursor: pointer;
  box-shadow: 0 4px 0 #006080; transition: all .12s; margin-top: 10px;
}
.drag-drop-next-button-answers:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.drag-drop-try-again-button-answers {
  font-family: var(--font); font-size: 9px; letter-spacing: 2px;
  background: var(--red); color: #fff; border: none;
  padding: 12px 22px; cursor: pointer;
  box-shadow: 0 4px 0 #801020; transition: all .12s; margin-top: 10px;
}
.drag-drop-try-again-button-answers:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #801020, var(--glow-red);
}

.drag-drop-feedback-popup {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -45%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 10; width: 100%; height: 100%;
  padding: 20px; box-sizing: border-box;
}
.drag-drop-feedback-popup .popup-text-container {
  background: var(--surf);
  border: 2px solid var(--cyan);
  min-height: fit-content; max-height: 75vh;
  width: 50vw;
  display: flex; flex-direction: column;
  text-align: center; align-items: center; justify-content: center;
  padding: 40px; position: relative; z-index: 11;
  margin-right: min(100px,10vw); overflow-y: auto;
  font-size: clamp(9px,1.1vw,11px); line-height: 2;
}
.drag-drop-feedback-popup .popup-Al {
  position: absolute; right: max(-50px,-8vw); bottom: 50px;
  height: 50vh; max-width: 30vw; z-index: 11;
  transform: scaleX(-1); object-fit: contain;
}
.drag-drop-feedback-popup .popup-text-container h2 {
  color: var(--cyan); font-size: clamp(11px,1.5vw,14px);
  letter-spacing: 3px; margin-bottom: 20px;
}
.drag-drop-feedback-popup .popup-text-container p {
  color: var(--text); font-size: clamp(9px,1.1vw,11px); line-height: 2; margin-bottom: 20px;
}
.drag-drop-feedback-popup .popup-text-container p.incorrect-message { color: var(--red); }

@media screen and (max-width:768px) {
  .drag-drop-feedback-popup .popup-text-container { width:90vw; margin-right:0; padding:25px; }
  .drag-drop-feedback-popup .popup-Al { display: none; }
}
```

- [ ] **Step 2: No JS changes needed for game-answers.js**

The component uses CSS classes and needs no structural changes. Verify the file imports `game-answers.css`.

- [ ] **Step 3: Verify**

Complete the drag-drop quiz. The feedback popup should have a dark surface, cyan border, pixel font text.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/game-answers.css
git commit -m "feat: reskin drag-drop game answers with dark pixel theme"
```

---

## Task 15: Certificate + Patrick screens + Arrival

**Files:**
- Modify: `cyberheroes/src/styles/certificate.css`
- Modify: `cyberheroes/src/styles/patrick_defeat.css`
- Modify: `cyberheroes/src/components/lessons/Arrival.js`

- [ ] **Step 1: Rewrite certificate.css**

```css
/* cyberheroes/src/styles/certificate.css */

.certificate-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  margin-top: 56px;
  background: var(--bg);
  align-items: center;
}

.certificate-content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px auto;
  padding: 8px;
  background: var(--surf);
  border: 2px solid var(--gold);
  box-shadow: var(--glow-gold);
  width: fit-content;
}
.certificate-content img {
  max-width: 95%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
}

.certificate-buttons {
  display: flex;
  gap: 20px;
  margin: 20px auto;
}
.certificate-buttons button {
  font-family: var(--font);
  font-size: 9px;
  letter-spacing: 2px;
  padding: 14px 24px;
  border: none;
  cursor: pointer;
  transition: all .12s;
  text-transform: uppercase;
}
.certificate-buttons button:first-child {
  background: var(--gold); color: #000;
  box-shadow: 0 4px 0 #806000;
}
.certificate-buttons button:first-child:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #806000, var(--glow-gold);
}
.certificate-buttons button:last-child {
  background: var(--cyan); color: #000;
  box-shadow: 0 4px 0 #006080;
}
.certificate-buttons button:last-child:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

@media print {
  body * { visibility: hidden; }
  .certificate-content, .certificate-content * { visibility: visible; }
  .certificate-content {
    position: fixed; left: 0; top: 0;
    width: 100vw; height: 100vh;
    margin: 0; padding: 0;
    box-shadow: none; border: none;
    display: flex; justify-content: center; align-items: center;
  }
  .certificate-content img {
    width: 100vw; height: 100vh;
    max-width: none; max-height: none;
    object-fit: contain;
  }
  @page { margin: 0; size: landscape; }
  html, body { width: 100vw; height: 100vh; margin: 0; padding: 0; overflow: hidden; }
}
```

- [ ] **Step 2: Rewrite patrick_defeat.css**

```css
/* cyberheroes/src/styles/patrick_defeat.css */

.patrick-defeat-container {
  width: 100vw; height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed; top: 0; left: 0;
}

.patrick-defeat-title {
  color: var(--red);
  font-size: clamp(16px, 3vw, 28px);
  letter-spacing: 4px;
  text-shadow: var(--glow-red);
  margin-bottom: 32px;
  text-align: center;
}

.patrick-defeat-btn {
  font-family: var(--font);
  font-size: 10px;
  letter-spacing: 2px;
  background: var(--cyan); color: #000;
  border: none; padding: 14px 24px;
  cursor: pointer;
  box-shadow: 0 4px 0 #006080;
  transition: all .12s;
  text-transform: uppercase;
}
.patrick-defeat-btn:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}
```

- [ ] **Step 3: Check Arrival.js for any hardcoded background/color styles**

Open `cyberheroes/src/components/lessons/Arrival.js`. If it imports `arrival.css`, open `cyberheroes/src/styles/arrival.css` and replace any hardcoded light-blue backgrounds with `var(--surf)`, any `#0F746F` buttons with `var(--cyan)`, and remove any planet background images. If the file is minimal, just confirm it uses the shared CSS classes.

- [ ] **Step 4: Verify**

Navigate to the certificate screen. Gold-bordered certificate image, gold download button, cyan continue button. Background is dark.

- [ ] **Step 5: Commit**

```bash
git add cyberheroes/src/styles/certificate.css \
        cyberheroes/src/styles/patrick_defeat.css
git commit -m "feat: reskin certificate and Patrick defeat screens"
```

---

## Task 16: Review screens

**Files:**
- Modify: `cyberheroes/src/styles/review.css`
- Modify: `cyberheroes/src/components/review/ReviewMenu.js`

- [ ] **Step 1: Rewrite review.css**

```css
/* cyberheroes/src/styles/review.css */

.review-container {
  width: 100vw; height: 100vh;
  background: var(--bg);
  position: fixed; top: 0; left: 0;
  overflow-y: auto;
}

/* Remove planet background images */
.privacy-planet-background,
.privacy-moon-background { background: var(--bg); }

.review-content {
  max-width: 100%;
  margin: 56px auto 0;
  padding: 20px;
}

.review-layout {
  display: flex;
  width: 100%; height: 100%;
  padding: 20px;
  position: relative;
}

.character-side-review {
  position: fixed;
  bottom: -10%; left: 0;
  z-index: 1;
}

.review-main-review {
  width: 40%; height: 40%;
  position: fixed;
  right: 5%; top: 100px;
  z-index: 2;
  margin-top: 80px;
}

.review-box-review {
  background: var(--surf);
  border: 2px solid var(--purple);
  padding: 20px;
  height: 50vh; width: 42vw;
  margin-left: -100px;
  display: flex; flex-direction: column;
  position: relative; z-index: 2;
}

.review-content-scroll-review {
  overflow-y: auto; flex: 1;
  display: flex; flex-direction: column; gap: 10px;
}

.review-title-review {
  color: var(--cyan);
  font-size: clamp(9px, 1.3vw, 12px);
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 16px;
}

.options-container-review {
  display: flex; flex-direction: column;
  align-items: center; gap: 10px;
  margin: 8px 0; width: 100%;
}

.option-button-review {
  font-family: var(--font);
  font-size: 8px; letter-spacing: 2px;
  background: var(--surf2);
  color: var(--text);
  border: 2px solid var(--border);
  padding: 12px 20px;
  cursor: pointer;
  transition: all .12s;
  width: 90%; max-width: 350px;
  text-align: center;
}
.option-button-review:hover { border-color: var(--cyan); color: var(--cyan); }
.option-button-review.selected { border-color: var(--purple); color: var(--purple); }

/* Computer review screen */
.computer-screen-review {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw; height: 90vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 10; margin-top: 56px;
}

.computer-content-review {
  width: 90%; height: 90%;
  position: relative;
  background-image: url('../img/general/computer.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  margin: 0 auto;
}

.computer-screen-content-review {
  position: absolute;
  width: 70%; height: 70%;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
  text-align: center;
  padding: 5px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: flex-start;
}

.computer-title-review {
  color: var(--cyan);
  font-size: clamp(10px, 1.5vw, 13px);
  letter-spacing: 3px;
  text-align: center; padding: 0; margin: 0; width: 100%;
}

.computer-message-review {
  color: var(--text);
  font-size: clamp(8px, 1.1vw, 10px);
  line-height: 2.2; letter-spacing: .5px;
  white-space: pre-line; text-align: center;
  margin: 0; padding: 0 20px; width: 80%;
  flex-grow: 1; overflow-y: auto;
}

.computer-buttons-review {
  display: flex; gap: 24px;
  margin-top: 16px; padding-bottom: 80px;
  width: 100%; justify-content: center;
}

.keep-reviewing-button-review {
  font-family: var(--font); font-size: 8px; letter-spacing: 2px;
  background: transparent; color: var(--dim);
  border: 2px solid var(--border);
  padding: 10px 18px; cursor: pointer; transition: all .12s;
}
.keep-reviewing-button-review:hover { border-color: var(--cyan); color: var(--cyan); }

.take-quiz-button-review {
  font-family: var(--font); font-size: 8px; letter-spacing: 2px;
  background: var(--cyan); color: #000;
  border: none; padding: 12px 20px;
  cursor: pointer; box-shadow: 0 4px 0 #006080; transition: all .12s;
}
.take-quiz-button-review:hover {
  transform: translateY(-2px); box-shadow: 0 6px 0 #006080, var(--glow-cyan);
}

.close-button-review {
  position: absolute; top: 20px; right: 20px;
  background: var(--red); color: #fff;
  border: none; width: 32px; height: 32px;
  font-family: var(--font); font-size: 10px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .12s; z-index: 11;
}
.close-button-review:hover { transform: scale(1.1); background: #801020; }

.back-link-review {
  color: var(--dim);
  font-size: 7px; letter-spacing: 2px;
  text-decoration: underline; cursor: pointer;
  transition: color .15s; margin: 12px auto;
  display: block; text-align: center;
}
.back-link-review:hover { color: var(--cyan); }

.overlay-review {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.6);
  z-index: 5;
}

.next-button-review, .prev-button-review {
  font-family: var(--font); font-size: 7px; letter-spacing: 2px;
  border: 2px solid var(--border);
  padding: 8px 16px; background: transparent;
  color: var(--dim); cursor: pointer;
  transition: all .12s;
  position: absolute; bottom: 10%; z-index: 20;
}
.next-button-review  { right: 10%; }
.prev-button-review  { left: 10%; }
.next-button-review:hover, .prev-button-review:hover { border-color: var(--cyan); color: var(--cyan); }
.next-button-review::before  { content: "NEXT"; }
.prev-button-review::before  { content: "BACK"; }
```

- [ ] **Step 2: Update ReviewMenu.js — replace character img with Knight**

In `ReviewMenu.js`:

Remove:
```jsx
const characterImages = require.context('../../img/characters', false, /\.(png|jpe?g|svg)$/);
// and the imageName / imagePath lines
```

Add import:
```jsx
import Knight from '../util/Knight';
```

Replace:
```jsx
<div className="character-side-review">
  <img src={imagePath} alt={character} className="character-image-review" />
</div>
```
With:
```jsx
<div className="character-side-review">
  <Knight size={220} color="cyan" animate={true} />
</div>
```

- [ ] **Step 3: Verify**

Navigate through the lesson to a transition, click review. Review menu should show dark background, purple-bordered box, Knight on left. Clicking a topic shows the computer screen with dark styling.

- [ ] **Step 4: Commit**

```bash
git add cyberheroes/src/styles/review.css \
        cyberheroes/src/components/review/ReviewMenu.js
git commit -m "feat: reskin review screens with dark pixel theme"
```

---

## Task 17: About + Intro pages + remaining CSS

**Files:**
- Modify: `cyberheroes/src/styles/about.css`
- Modify: `cyberheroes/src/styles/cyberIntro.css`
- Modify: `cyberheroes/src/styles/leaving.css` (if exists)
- Modify: `cyberheroes/src/styles/arrival.css`

- [ ] **Step 1: Rewrite about.css**

```css
/* cyberheroes/src/styles/about.css */

.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 56px;
  background: var(--bg);
  color: var(--text);
  padding-left: 40px; padding-right: 40px;
}

.about-header {
  font-size: clamp(14px, 2.5vw, 20px);
  color: var(--cyan);
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 32px;
  text-shadow: var(--glow-cyan);
}

.about-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.about-text {
  font-size: clamp(9px, 1.2vw, 11px);
  color: var(--text);
  letter-spacing: 1px;
  line-height: 2.2;
  text-align: center;
}

.about-image-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.about-person {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
}

.about-image {
  width: 160px; height: 160px;
  object-fit: cover;
  border: 2px solid var(--border);
  transition: all .2s;
}
.about-image:hover { border-color: var(--cyan); box-shadow: var(--glow-cyan); cursor: pointer; }

.name-text {
  font-size: 8px; letter-spacing: 2px;
  color: var(--cyan); margin: 10px 0 4px;
  text-align: center;
}

.role-text {
  font-size: 7px; letter-spacing: 1px;
  color: var(--dim);
  text-align: center;
}
```

- [ ] **Step 2: Update cyberIntro.css (the intro.js / CyberHeroes intro animation page)**

Open `cyberheroes/src/styles/cyberIntro.css`. Replace all `background-color: #B8DEFF` or similar light-blue values with `var(--surf)`. Replace all text colors referencing `#02101b` with `var(--text)`. Replace all `font-family: Fredoka One` with `var(--font)`. Replace all button `border-radius` with `0`.

- [ ] **Step 3: Update arrival.css**

Open `cyberheroes/src/styles/arrival.css`. Apply same token substitutions: `--bg` for backgrounds, `--surf` for card backgrounds, `--cyan` for primary buttons, `--text` for body text, `var(--font)` for all font-family. Remove `border-radius` from all elements.

- [ ] **Step 4: Verify**

Navigate to `/about`. Dark background, cyan heading, team member cards with dark border that glows cyan on hover.

- [ ] **Step 5: Commit**

```bash
git add cyberheroes/src/styles/about.css \
        cyberheroes/src/styles/cyberIntro.css \
        cyberheroes/src/styles/arrival.css
git commit -m "feat: reskin about, intro animation, and arrival screens"
```

---

## Final Verification

- [ ] **Full walkthrough:** Start at `/`, click through landing → exploration map → privacy-planet lesson-intro → lesson pages → transition → quiz → quiz answers → transition-cert → certificate → patrick-leaving
- [ ] **Moon path:** privacy-moon lesson-intro → lesson → transition → drag-drop → red-flag-green-flag → final-quiz → quiz-answers → lesson
- [ ] **Review path:** transition screen → review → select topic → take quiz
- [ ] **About page:** `/about`
- [ ] **Check:** No light-blue `#B8DEFF` backgrounds visible anywhere
- [ ] **Check:** All text in Press Start 2P font
- [ ] **Check:** Knight sprite appears on all character screens with correct color glow
- [ ] **Check:** Scan-line texture visible on all pages
- [ ] **Check:** Dark vignette at screen edges

- [ ] **Final commit**

```bash
git add -A
git commit -m "chore: final cleanup — verify all screens match dark pixel design"
```
