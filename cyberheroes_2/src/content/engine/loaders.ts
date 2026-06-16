import { AnyLessonSchema, QuizSchema } from './schemas';
import type { AnyLesson, Quiz } from './types';

/**
 * Vite glob-imports every JSON file in content/lessons and content/quizzes
 * eagerly, so dropping a new file in either folder makes it available with
 * zero code changes — no manual registration needed.
 */
const lessonModules = import.meta.glob('../lessons/*.json', { eager: true }) as Record<string, { default: unknown }>;
const quizModules = import.meta.glob('../quizzes/*.json', { eager: true }) as Record<string, { default: unknown }>;

function fail(file: string, error: unknown): never {
  const detail =
    error && typeof error === 'object' && 'issues' in error
      ? JSON.stringify((error as { issues: unknown }).issues, null, 2)
      : String(error);
  throw new Error(`[content] ${file} failed validation:\n${detail}`);
}

function loadLessons(): Map<string, AnyLesson> {
  const map = new Map<string, AnyLesson>();
  for (const [path, mod] of Object.entries(lessonModules)) {
    const parsed = AnyLessonSchema.safeParse(mod.default);
    if (!parsed.success) fail(path, parsed.error);
    const lesson = parsed.data as AnyLesson;
    if (map.has(lesson.id)) {
      throw new Error(`[content] Duplicate lesson id "${lesson.id}" — seen again in ${path}`);
    }
    map.set(lesson.id, lesson);
  }
  return map;
}

function loadQuizzes(): Map<string, Quiz> {
  const map = new Map<string, Quiz>();
  for (const [path, mod] of Object.entries(quizModules)) {
    const parsed = QuizSchema.safeParse(mod.default);
    if (!parsed.success) fail(path, parsed.error);
    const quiz = parsed.data as Quiz;
    if (map.has(quiz.id)) {
      throw new Error(`[content] Duplicate quiz id "${quiz.id}" — seen again in ${path}`);
    }
    map.set(quiz.id, quiz);
  }
  return map;
}

// Validated once, at module load (i.e. fails loudly and immediately in dev).
const LESSONS = loadLessons();
const QUIZZES = loadQuizzes();

export function getLesson(id: string): AnyLesson | undefined {
  return LESSONS.get(id);
}

export function getQuiz(id: string): Quiz | undefined {
  return QUIZZES.get(id);
}

export function listLessons(): AnyLesson[] {
  return Array.from(LESSONS.values()).sort((a, b) => {
    if (a.chapterNum !== b.chapterNum) return a.chapterNum - b.chapterNum;
    // Conversational lessons don't carry a lessonNum — push them to the end of their
    // chapter (after the numbered standard lessons) rather than to the front.
    const aNum = 'lessonNum' in a ? a.lessonNum : Number.POSITIVE_INFINITY;
    const bNum = 'lessonNum' in b ? b.lessonNum : Number.POSITIVE_INFINITY;
    return aNum - bNum;
  });
}

export function listQuizzes(): Quiz[] {
  return Array.from(QUIZZES.values());
}
