# JSON Data File Audit
Generated: 2026-04-09

## Files Found

### cyberheroes/src/data/lessons/lesson_intro.json
- **Size**: 2282 bytes
- **Shape**: Object with `intros` array of 6 objects; keys: `planet_name`, `lesson_title`, `intro_text`, `computer_image_name`, `computer_text`, `active`
- **Used by**: `src/components/lessons/LessonIntro.js`

### cyberheroes/src/data/lessons/lesson.json
- **Size**: 51962 bytes (largest file)
- **Shape**: Object with `planets` array of 2 objects (Privacy Planet, Privacy Moon); each has `planet_name` and `pages` array of page objects with `page_number`, `characters`, and `message`
- **Used by**: `src/components/lessons/Lesson.js`

### cyberheroes/src/data/lessons/review.json
- **Size**: 11758 bytes
- **Shape**: Object with `planet` containing `privacy_planet` and `privacy_moon` sub-objects, each with quiz-keyed sections (`quiz-1`, `quiz-2`, `quiz-3`), each having `options` array and `character` string
- **Used by**: `src/components/review/review.js`

### cyberheroes/src/data/lessons/table_of_contents.json
- **Size**: 2283 bytes
- **Shape**: Object with `table_of_contents` array of 2 planet objects; each has `planet_name`, `lesson_title`, and `parts` array
- **Used by**: `src/components/lessons/TableOfContents.js`

### cyberheroes/src/data/lessons/transition_cert.json
- **Size**: 575 bytes
- **Shape**: Object with `planets` containing `privacy_planet` and `privacy_moon` sub-objects; each has `character` and `message`
- **Used by**: `src/components/lessons/Transition_Cert.js`

### cyberheroes/src/data/lessons/transitions.json
- **Size**: 1534 bytes
- **Shape**: Object with `planets` containing `privacy_planet` and `privacy_moon` sub-objects; each has quiz-keyed entries (`quiz-1`, `quiz-2`, `quiz-3`) with `character`, `message`, and `end_page`
- **Used by**: `src/components/lessons/Transition.js`

### cyberheroes/src/data/lessons/vocab.json
- **Size**: 1336 bytes
- **Shape**: Object with `words` array of 11 objects; each has `word` and `definition`
- **Used by**: `src/components/lessons/Message.js`

### cyberheroes/src/data/quizzes/drag_drop_quiz.json
- **Size**: 3268 bytes
- **Shape**: Object with `quiz` array of 7 objects; keys: `id`, `question`, `correctAnswer` (number), `correctMessage` (string), `incorrectMessages` (string); last item has optional `lessonPage`
- **Used by**: `src/components/quizzes/Drag-Drop-Quiz.js`

### cyberheroes/src/data/quizzes/redFlag_greenFlag_quiz.json
- **Size**: 4298 bytes
- **Shape**: Object with `quiz` array of 10 objects; same schema as drag_drop_quiz; last item has optional `lessonPage`
- **Used by**: `src/components/quizzes/RedFlag-GreenFlag-Quiz.js`

### cyberheroes/src/data/quizzes/privacy_moon_quiz.json
- **Size**: 6447 bytes
- **Shape**: Object with `quizzes` array of 1 section (`quiz-1`); each section has `part` and `quiz` array; quiz items have `id`, `type`, `question`, `answers` (array), `correctAnswers` (array of indices), `correctMessage` (array), `incorrectMessages` (array), `hint`; last item has `lessonPage`. No `healthBar` fields (unlike privacy_planet)
- **Used by**: `src/components/quizzes/Privacy-Moon-Quiz.js`

### cyberheroes/src/data/quizzes/privacy_planet_quiz.json
- **Size**: 16200 bytes
- **Shape**: Object with `quizzes` array of 3 sections (`quiz-1`, `quiz-2`, `quiz-3`); same per-item schema as privacy_moon but with additional `healthBar` (float 0–1) on every question; last item per section has `lessonPage`
- **Used by**: `src/components/quizzes/Privacy-Planet-Quiz.js`
