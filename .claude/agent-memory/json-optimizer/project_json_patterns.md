---
name: cyberheroes JSON data patterns
description: Key structural and schema patterns across all JSON data files in cyberheroes/src/data/
type: project
---

All JSON data files live in `cyberheroes/src/data/lessons/` and `cyberheroes/src/data/quizzes/`.

**Key naming convention**: MIXED — lessons use snake_case (planet_name, page_number, start_page), quizzes use camelCase (correctAnswer, healthBar, lessonPage). Do not attempt to unify — components depend on exact key names.

**Two distinct quiz schemas (intentional, different components)**:
- `drag_drop_quiz.json` + `redFlag_greenFlag_quiz.json`: `correctAnswer` (number), `correctMessage` (string), `incorrectMessages` (string)
- `privacy_planet_quiz.json` + `privacy_moon_quiz.json`: `correctAnswers` (array), `correctMessage` (array), `incorrectMessages` (array), `hint` (string)

**healthBar field**: Present on all questions in privacy_planet_quiz (float 0.0–1.0), absent entirely from privacy_moon_quiz. Likely intentional difference between the two components.

**lessonPage field**: Optional, present only on the LAST question of each quiz file. Sentinel value used for post-quiz navigation back to lesson.

**lesson_intro.json**: 4 inactive planet stubs (Phishing Planet, Malware, Safe Browsing, Online Sharing) with empty string values — placeholder pattern for future content.

**lesson.json**: 51KB, two planets (Privacy Planet pp 1–35, Privacy Moon pp 1–39) in one file. Candidate for future splitting. Contains smart/curly quotes in prose — intentional.

**Known typos (not yet fixed, flagged for manual review)**:
- vocab.json: "unknownsituation" (Investigate def), "tha can" (Scenario def)
- transition_cert.json: "Pslease" (privacy_moon message)
- drag_drop_quiz.json: double-spaces in incorrectMessages for ids 4, 5, 6, 7; sentence-case issue in id=7 correctMessage

**Why**: This is the first JSON optimization run (2026-04-09). Build passed after all indentation normalization edits.
**How to apply**: On future runs, skip re-normalizing indentation (already done). Focus on typo fixes above only after human approval.
