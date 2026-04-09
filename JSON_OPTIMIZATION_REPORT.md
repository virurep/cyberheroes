# JSON Optimization Report
Generated: 2026-04-09

## Summary
- Files audited: 11
- Files modified: 8
- Files unchanged: 3 (`lesson_intro.json`, `table_of_contents.json`, `vocab.json` — already correctly formatted)
- Total size savings: ~4,960 bytes (~5.0% reduction across modified files)
- Build status: PASSING

## Changes Applied

### cyberheroes/src/data/lessons/lesson.json
- Normalized indentation to 2 spaces
- Removed 2 stray blank lines inside object literals (lines 120 and 275 in original)
- Size: 51,962B → 51,900B (saved ~62B)

### cyberheroes/src/data/lessons/review.json
- Normalized indentation to 2 spaces (was 4-space)
- Removed 1 trailing-whitespace line
- Size: 11,758B → 9,164B (saved ~2,594B — large savings from indent normalization on deep nesting)

### cyberheroes/src/data/lessons/transition_cert.json
- Normalized indentation to 2 spaces (was 4-space)
- Size: 575B → 531B (saved 44B)

### cyberheroes/src/data/lessons/transitions.json
- Normalized indentation to 2 spaces (was 4-space)
- Removed 1 trailing-whitespace line
- Size: 1,534B → 1,296B (saved 238B)

### cyberheroes/src/data/quizzes/drag_drop_quiz.json
- Normalized indentation to 2 spaces (was 4-space)
- Size: 3,268B → 2,961B (saved 307B)

### cyberheroes/src/data/quizzes/privacy_moon_quiz.json
- Normalized indentation to 2 spaces (was 4-space)
- Size: 6,447B → 5,857B (saved 590B)

### cyberheroes/src/data/quizzes/privacy_planet_quiz.json
- Normalized indentation to 2 spaces (was 4-space)
- Size: 16,200B → 14,877B (saved 1,323B)

### cyberheroes/src/data/quizzes/redFlag_greenFlag_quiz.json
- Normalized indentation to 2 spaces (was 4-space)
- Size: 4,298B → 3,907B (saved 391B)

---

## Flagged for Manual Review

### cyberheroes/src/data/lessons/vocab.json — Typos in definition strings
- `"Investigate"` definition: `"To look into a complex or unknownsituation in detail."` — missing space between "unknown" and "situation"
- `"Scenario"` definition: `"An imagined setting that shows a situation tha can possibly happen."` — "tha" should be "that"
- Recommendation: Correct the two typos. These are user-visible text in the vocab/glossary popup. The key names and structure do not need to change.

### cyberheroes/src/data/lessons/transition_cert.json — Typos in character messages
- `privacy_moon.message`: `"Pslease take this certificate..."` — "Pslease" should be "Please"
- `privacy_moon.message`: `"patrick is finally gone"` — "patrick" should be capitalized
- `privacy_planet.message`: `"cyber hero sensitive data protector certificate"` — inconsistent capitalization vs. the in-lesson version which capitalizes "Cyber Hero"
- `privacy_planet.message` has a leading space before "Yay!!"
- Recommendation: Fix the four typos above in the prose values only. Do not change key names.

### cyberheroes/src/data/quizzes/drag_drop_quiz.json — Double-spaces in feedback strings
- `id=4` `incorrectMessages`: contains `"  "` (double-space)
- `id=5` `incorrectMessages`: contains `"  "` (double-space)
- `id=6` `incorrectMessages`: contains `"  "` (double-space)
- `id=7` `correctMessage`: `"...at anytime.  it's..."` — double-space and lowercase "it's" after period
- `id=7` `incorrectMessages`: contains `"  "` (double-space)
- Recommendation: Collapse double-spaces to single spaces in these feedback strings. The double-space after a period in id=7 also has a sentence-case issue ("it's" should be "It's").

### cyberheroes/src/data/lessons/lesson_intro.json — Empty-string placeholder entries
- 4 inactive planet entries (Phishing Planet, Malware, Safe Browsing, Online Sharing) have empty strings for `lesson_title`, `intro_text`, and `computer_text`
- All 4 share the same `computer_image_name` value (`"patrick-wanted.png"`) even though they are placeholders
- Recommendation: This is an intentional placeholder pattern for future planets. No action required, but consider whether `active: false` entries should be filtered client-side before rendering to avoid accidentally exposing stub content.

### cyberheroes/src/data/quizzes/privacy_moon_quiz.json vs. privacy_planet_quiz.json — Schema divergence (healthBar)
- `privacy_planet_quiz.json` has `healthBar` (float 0.0–1.0) on every question — used to drive a UI health-bar component
- `privacy_moon_quiz.json` has NO `healthBar` field on any question
- This is a structural divergence. If the same quiz component renders both files, the absence of `healthBar` in moon quizzes may fall through silently or cause a rendering difference
- Recommendation: Confirm with the component team whether `Privacy-Moon-Quiz.js` uses `healthBar`. If so, add `healthBar` values to `privacy_moon_quiz.json` questions. If not, document this intentional difference.

### cyberheroes/src/data/quizzes/* — Mixed correctAnswer schema between quiz types
- `drag_drop_quiz.json` and `redFlag_greenFlag_quiz.json` use a single number: `"correctAnswer": 1`
- `privacy_planet_quiz.json` and `privacy_moon_quiz.json` use an array of numbers: `"correctAnswers": [0, 2]`
- Both `correctMessage` and `incorrectMessages` are also different types: strings in drag_drop/redFlag, arrays in privacy_planet/privacy_moon
- Recommendation: This divergence is intentional — the two quiz families are consumed by different components (Drag-Drop-Quiz vs. Privacy-Planet-Quiz). Document this clearly. Do not attempt to unify the schema without updating both components simultaneously.

### cyberheroes/src/data/quizzes/* — Optional `lessonPage` key
- All four quiz files have `lessonPage` on the last question only
- This is consistent across all quiz types and appears intentional (used to navigate back to the lesson after quiz completion)
- Recommendation: No action needed, but worth documenting this as a "sentinel on last item" pattern.

### cyberheroes/src/data/lessons/lesson.json — Smart/curly quotes in prose content
- 26 instances of curly/smart quotes in dialogue and lesson text (e.g., `'ve`, `'m`, `'t`, `"Where do you live?"`)
- These are in prose fields (`"text"`, `"intro_text"`) and are intentional typographic choices
- Recommendation: No action. If plain ASCII quotes are ever required for text-to-speech or accessibility tools, a targeted replace pass on prose fields would be needed.

---

## Structural Recommendations

### lesson.json — Candidate for file splitting
- At 51.9KB, this is the largest file and the only one approaching a threshold where lazy loading would be beneficial
- It contains two fully independent planet narratives (Privacy Planet: pages 1–35, Privacy Moon: pages 1–39)
- Recommendation: Consider splitting into `lesson_privacy_planet.json` and `lesson_privacy_moon.json`, loaded lazily based on which planet the user selects. This would halve initial load for each planet. Requires updating `Lesson.js` import logic.

### lesson_intro.json + table_of_contents.json — Redundant planet metadata
- Both files define `planet_name` and `lesson_title` for the same planets in the same order
- `lesson_intro.json` adds `active`, `intro_text`, `computer_image_name`, `computer_text`
- `table_of_contents.json` adds `parts`
- Recommendation: These could be merged into a single `planets.json` master registry, with each planet object containing both intro and TOC data. This would reduce the number of imports in components and eliminate the risk of planet names diverging between files.

### privacy_planet_quiz.json — Large nested arrays
- 14 total quiz questions across 3 sections; each question has up to 6 answer strings and parallel incorrect-message arrays
- Not yet at a pagination threshold, but the parallel-array pattern (`answers[i]` maps to `incorrectMessages[i]`) is fragile: if a question's answer count changes, the incorrect message array must be updated in sync
- Recommendation: Consider restructuring each answer as an object `{ "text": "...", "incorrectMessage": "..." }` for clarity and to eliminate the index-coupling dependency. This is a schema change and requires a coordinated component update.

---

## Files Skipped / Errors
- None. All 11 files parsed successfully before and after edits.
- 3 files required no changes: `lesson_intro.json`, `table_of_contents.json`, `vocab.json`
