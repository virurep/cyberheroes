/**
 * admin/data/index.js — Data access layer for the admin UI.
 *
 * All reads/writes go through these functions.
 * localStorage is the backing store in Phase 2.
 * Replace the implementations here (not callers) to swap in Supabase in Phase 3.
 */

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const PLANETS_KEY = 'admin_planets';
const lessonKey = (slug) => `admin_lessons_${slug}`;
const quizKey = (slug) => `admin_quizzes_${slug}`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn(`[admin/data] failed to read "${key}":`, err);
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[admin/data] failed to write "${key}":`, err);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Planets
// ---------------------------------------------------------------------------

/**
 * Returns the admin overrides map: { [slug]: manifestOverride }
 * These are merged with loader data by the UI — not a full replacement list.
 */
export function getPlanetOverrides() {
  return readJSON(PLANETS_KEY) || {};
}

/**
 * Saves one planet manifest override keyed by slug.
 */
export function savePlanet(planet) {
  if (!planet || !planet.slug) throw new Error('Planet must have a slug');
  const overrides = getPlanetOverrides();
  overrides[planet.slug] = planet;
  writeJSON(PLANETS_KEY, overrides);
}

/**
 * Removes an admin override for a planet slug.
 * Does NOT delete the underlying loader data — only the override.
 */
export function deletePlanetOverride(slug) {
  const overrides = getPlanetOverrides();
  delete overrides[slug];
  writeJSON(PLANETS_KEY, overrides);
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

/**
 * Returns the stored lesson pages override for a planet, or null.
 * Shape: { planet_slug, pages: [...] }
 */
export function getLessonsOverride(planetSlug) {
  return readJSON(lessonKey(planetSlug));
}

/**
 * Saves a lesson pages override for a planet.
 */
export function saveLessonsOverride(planetSlug, lessonData) {
  writeJSON(lessonKey(planetSlug), lessonData);
}

/**
 * Saves a single lesson page into a planet's lesson override.
 * Creates the override structure if it doesn't yet exist.
 */
export function saveLessonPage(planetSlug, page, basePages) {
  const stored = getLessonsOverride(planetSlug) || { planet_slug: planetSlug, pages: basePages || [] };
  const idx = stored.pages.findIndex((p) => p.page_number === page.page_number);
  if (idx >= 0) {
    stored.pages[idx] = page;
  } else {
    stored.pages.push(page);
  }
  // Re-sort by page_number
  stored.pages.sort((a, b) => a.page_number - b.page_number);
  writeJSON(lessonKey(planetSlug), stored);
}

/**
 * Deletes a single lesson page by page_number.
 */
export function deleteLessonPage(planetSlug, pageNumber) {
  const stored = getLessonsOverride(planetSlug);
  if (!stored) return;
  stored.pages = stored.pages.filter((p) => p.page_number !== pageNumber);
  writeJSON(lessonKey(planetSlug), stored);
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

/**
 * Returns the stored quiz overrides map for a planet: { [quizSlug]: quizData }
 */
export function getQuizOverrides(planetSlug) {
  return readJSON(quizKey(planetSlug)) || {};
}

/**
 * Saves one quiz override for a planet.
 */
export function saveQuiz(planetSlug, quiz) {
  if (!quiz || !quiz.slug) throw new Error('Quiz must have a slug');
  const overrides = getQuizOverrides(planetSlug);
  overrides[quiz.slug] = quiz;
  writeJSON(quizKey(planetSlug), overrides);
}

/**
 * Removes a quiz override by slug.
 */
export function deleteQuizOverride(planetSlug, quizSlug) {
  const overrides = getQuizOverrides(planetSlug);
  delete overrides[quizSlug];
  writeJSON(quizKey(planetSlug), overrides);
}
