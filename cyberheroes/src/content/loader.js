/**
 * content/loader.js — Dynamic planet content loader
 *
 * Uses Webpack's `require.context` to discover and load all planet data
 * from src/data/planets/ at bundle time. This file will NOT work in plain
 * Node.js without babel-plugin-require-context-hook or a similar polyfill.
 *
 * All planet folders are discovered automatically — no manual import lists.
 * Content is loaded eagerly at module initialization and cached in memory.
 */

// ---------------------------------------------------------------------------
// Constants & require.context setup
// ---------------------------------------------------------------------------

// Discover all files under src/data/planets/ (recursive)
const planetsContext = require.context('../data/planets', true, /\.json$/);

// ---------------------------------------------------------------------------
// Schema validation
// ---------------------------------------------------------------------------

const REQUIRED_MANIFEST_FIELDS = [
  { key: 'slug', type: 'string' },
  { key: 'name', type: 'string' },
  { key: 'parts', type: 'object' }, // arrays are typeof 'object'
];

/**
 * Validates a planet manifest against the required schema.
 * Logs warnings for invalid manifests but never throws.
 *
 * @param {object} manifest - The parsed manifest object
 * @param {string} folderSlug - The slug derived from the folder name
 * @returns {boolean} true if valid, false otherwise
 */
function validateManifest(manifest, folderSlug) {
  if (!manifest || typeof manifest !== 'object') {
    console.warn(`[loader] "${folderSlug}": manifest is not a valid object`);
    return false;
  }

  for (const { key, type } of REQUIRED_MANIFEST_FIELDS) {
    if (!(key in manifest)) {
      console.warn(`[loader] "${folderSlug}": missing required field "${key}"`);
      return false;
    }
    // eslint-disable-next-line valid-typeof
    if (typeof manifest[key] !== type) {
      console.warn(
        `[loader] "${folderSlug}": field "${key}" should be ${type}, got ${typeof manifest[key]}`
      );
      return false;
    }
  }

  // parts must be an array specifically (typeof check above only catches 'object')
  if (!Array.isArray(manifest.parts)) {
    console.warn(`[loader] "${folderSlug}": "parts" must be an array`);
    return false;
  }

  if (manifest.slug !== folderSlug) {
    console.warn(
      `[loader] "${folderSlug}": manifest slug "${manifest.slug}" does not match folder name`
    );
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Extract the planet folder slug from a context key.
 * e.g. "./privacy-planet/manifest.json" -> "privacy-planet"
 */
function extractSlug(contextKey) {
  const match = contextKey.match(/^\.\/([^/]+)\//);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Cache population (runs once at module load time)
// ---------------------------------------------------------------------------

/** @type {Map<string, object>} slug -> planet data bundle */
const planetCache = new Map();

/** @type {Map<string, object>} "slug/quizSlug" -> quiz data */
const quizCache = new Map();

/** @type {Map<string, object>} slug -> lesson data */
const lessonCache = new Map();

/** @type {Map<string, object>} slug -> vocab data */
const vocabCache = new Map();

// Discover all manifest files and build the cache
const allKeys = planetsContext.keys();

// First pass: load and validate manifests
for (const key of allKeys) {
  if (!key.endsWith('/manifest.json')) continue;

  const slug = extractSlug(key);
  if (!slug) continue;

  try {
    const manifest = planetsContext(key);
    if (!validateManifest(manifest, slug)) continue;
    planetCache.set(slug, manifest);
  } catch (err) {
    console.warn(`[loader] "${slug}": failed to load manifest — ${err.message}`);
  }
}

// Second pass: load lessons, vocab, and quizzes for valid planets
for (const key of allKeys) {
  const slug = extractSlug(key);
  if (!slug || !planetCache.has(slug)) continue;
  if (key.endsWith('/manifest.json')) continue;

  try {
    if (key.endsWith('/lesson.json')) {
      lessonCache.set(slug, planetsContext(key));
    } else if (key.endsWith('/vocab.json')) {
      vocabCache.set(slug, planetsContext(key));
    } else {
      // Quiz files live under quizzes/<quizSlug>.json
      const quizMatch = key.match(/\/quizzes\/([^/]+)\.json$/);
      if (quizMatch) {
        const quizSlug = quizMatch[1];
        quizCache.set(`${slug}/${quizSlug}`, planetsContext(key));
      }
    }
  } catch (err) {
    console.warn(`[loader] "${slug}": failed to load ${key} — ${err.message}`);
  }
}

// Build a sorted planet list (by manifest "order" field, then slug)
const sortedPlanets = Array.from(planetCache.values()).sort((a, b) => {
  const orderA = typeof a.order === 'number' ? a.order : Infinity;
  const orderB = typeof b.order === 'number' ? b.order : Infinity;
  if (orderA !== orderB) return orderA - orderB;
  return a.slug.localeCompare(b.slug);
});

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------

/**
 * Returns an array of all valid planet manifest objects, sorted by `order`.
 * @returns {object[]}
 */
export function getAllPlanets() {
  return sortedPlanets;
}

/**
 * Returns only planets where `active` is true, sorted by `order`.
 * @returns {object[]}
 */
export function getActivePlanets() {
  return sortedPlanets.filter((p) => p.active === true);
}

/**
 * Returns a single planet manifest by slug.
 * @param {string} slug - The planet slug (folder name)
 * @returns {object|undefined} The manifest object, or undefined if not found
 */
export function getPlanet(slug) {
  return planetCache.get(slug);
}

/**
 * Returns the lesson pages for a planet (parsed lesson.json content).
 * @param {string} slug - The planet slug
 * @returns {object|undefined} The lesson data, or undefined if not found
 */
export function getLessonPages(slug) {
  return lessonCache.get(slug);
}

/**
 * Returns the vocabulary data for a planet.
 * @param {string} slug - The planet slug
 * @returns {object|undefined} The vocab data, or undefined if not found
 */
export function getVocab(slug) {
  return vocabCache.get(slug);
}

/**
 * Returns a specific quiz object for a planet.
 * @param {string} slug - The planet slug
 * @param {string} quizSlug - The quiz identifier (filename without .json)
 * @returns {object|undefined} The quiz data, or undefined if not found
 */
export function getQuiz(slug, quizSlug) {
  return quizCache.get(`${slug}/${quizSlug}`);
}

/**
 * Returns all quiz objects for a planet, keyed by quiz slug.
 * @param {string} slug - The planet slug
 * @returns {object} An object mapping quizSlug -> quiz data
 */
export function getAllQuizzes(slug) {
  const result = {};
  const prefix = `${slug}/`;
  for (const [key, value] of quizCache.entries()) {
    if (key.startsWith(prefix)) {
      const quizSlug = key.slice(prefix.length);
      result[quizSlug] = value;
    }
  }
  return result;
}

/**
 * Returns the next planet in order after the given slug, or undefined if last.
 * @param {string} currentSlug - The current planet slug
 * @returns {object|undefined} The next planet manifest, or undefined
 */
export function getNextPlanet(currentSlug) {
  const idx = sortedPlanets.findIndex((p) => p.slug === currentSlug);
  if (idx === -1 || idx === sortedPlanets.length - 1) return undefined;
  return sortedPlanets[idx + 1];
}

/**
 * Returns the previous planet in order before the given slug, or undefined if first.
 * @param {string} currentSlug - The current planet slug
 * @returns {object|undefined} The previous planet manifest, or undefined
 */
export function getPreviousPlanet(currentSlug) {
  const idx = sortedPlanets.findIndex((p) => p.slug === currentSlug);
  if (idx <= 0) return undefined;
  return sortedPlanets[idx - 1];
}

/**
 * Returns the quiz slugs for a given part (by quizPart like "quiz-1") from the manifest.
 * @param {string} planetSlug - The planet slug
 * @param {string} quizPart - The part style, e.g. "quiz-1"
 * @returns {string[]} Array of quiz slugs for that part, or empty array
 */
export function getQuizSlugsForPart(planetSlug, quizPart) {
  const manifest = planetCache.get(planetSlug);
  if (!manifest) return [];
  const part = manifest.parts.find((p) => p.part_style === quizPart);
  return part?.quiz_slugs || [];
}

/**
 * Returns the transition data for a given quiz part from the manifest.
 * @param {string} planetSlug - The planet slug
 * @param {string} quizPart - The part style, e.g. "quiz-1"
 * @returns {object|undefined} The transition data { character, message }
 */
export function getTransition(planetSlug, quizPart) {
  const manifest = planetCache.get(planetSlug);
  if (!manifest) return undefined;
  const part = manifest.parts.find((p) => p.part_style === quizPart);
  return part?.transition;
}

/**
 * Returns the lesson page range end for a quiz part (used for "go back to lesson").
 * @param {string} planetSlug - The planet slug
 * @param {string} quizPart - The part style, e.g. "quiz-1"
 * @returns {number|undefined} The end page number for the lesson part before this quiz
 */
export function getQuizEndPage(planetSlug, quizPart) {
  const manifest = planetCache.get(planetSlug);
  if (!manifest) return undefined;
  // Find the quiz part index, then look at the lesson part before it
  const partIndex = manifest.parts.findIndex((p) => p.part_style === quizPart);
  if (partIndex <= 0) return undefined;
  const lessonPart = manifest.parts[partIndex - 1];
  return lessonPart?.lesson_page_range?.end;
}
