import { z } from 'zod';

/* ═══════════════════════════════════════════════
   Shared
═══════════════════════════════════════════════ */

export const KnightColorSchema = z.enum(['cyan', 'purple', 'green', 'red', 'gold', 'white']);
export const TextBoxTypeSchema = z.enum(['info', 'tip', 'warning', 'danger', 'quest', 'secret']);
export const SpeakerSchema = z.enum(['knight', 'mage']);

/* ═══════════════════════════════════════════════
   Quiz / questions
═══════════════════════════════════════════════ */

const QuestionBaseSchema = z.object({
  id: z.string(),
  xp: z.number().int().positive(),
});

export const MultipleChoiceQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal('multiple_choice'),
  question: z.string(),
  options: z.array(z.string()).min(2),
  correct: z.number().int().nonnegative(),
});

export const SelectAllQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal('select_all'),
  question: z.string(),
  options: z.array(z.string()).min(2),
  correctSet: z.array(z.number().int().nonnegative()).min(1),
});

export const TrueFalseQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal('true_false'),
  question: z.string(),
  answer: z.boolean(),
});

const BucketSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string().optional(),
  rgb: z.string().optional(),
});

const ItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  bucket: z.string(),
});

export const DragDropSortQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal('drag_drop_sort'),
  title: z.string(),
  buckets: z.array(BucketSchema).min(2),
  items: z.array(ItemSchema).min(1),
});

export const QuestionSchema = z.discriminatedUnion('type', [
  MultipleChoiceQuestionSchema,
  SelectAllQuestionSchema,
  TrueFalseQuestionSchema,
  DragDropSortQuestionSchema,
]);

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessonId: z.string().optional(),
  passThreshold: z.number().min(0).max(1).optional(),
  questions: z.array(QuestionSchema).min(1),
});

/* ═══════════════════════════════════════════════
   Lesson / blocks
═══════════════════════════════════════════════ */

export const TextBlockSchema = z.object({ type: z.literal('text'), content: z.string() });

export const TextBoxBlockSchema = z.object({
  type: z.literal('textbox'),
  boxType: TextBoxTypeSchema,
  title: z.string().optional(),
  content: z.string(),
});

export const DialogueBlockSchema = z.object({
  type: z.literal('dialogue'),
  speaker: z.string(),
  knightColor: KnightColorSchema,
  side: z.enum(['left', 'right']),
  content: z.string(),
});

export const KeyTermBlockSchema = z.object({
  type: z.literal('keyterm'),
  term: z.string(),
  content: z.string(),
});

export const QuoteBlockSchema = z.object({
  type: z.literal('quote'),
  author: z.string().optional(),
  content: z.string(),
});

export const StepBlockSchema = z.object({
  type: z.literal('step'),
  step: z.number().int().positive(),
  total: z.number().int().positive().optional(),
  title: z.string().optional(),
  content: z.string(),
});

export const CodeBlockSchema = z.object({ type: z.literal('code'), content: z.string() });

export const ImageBlockSchema = z.object({
  type: z.literal('image'),
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const BlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  TextBoxBlockSchema,
  DialogueBlockSchema,
  KeyTermBlockSchema,
  QuoteBlockSchema,
  StepBlockSchema,
  CodeBlockSchema,
  ImageBlockSchema,
]);

export const LessonSectionSchema = z.object({
  number: z.number().int().nonnegative(),
  title: z.string(),
  blocks: z.array(BlockSchema).min(1),
});

const LessonFooterConfigSchema = z.object({
  nextLabel: z.string().optional(),
  nextQuiz: z.string().optional(),
});

export const LessonSchema = z.object({
  id: z.string(),
  type: z.literal('standard').optional(),
  chapter: z.string(),
  chapterNum: z.number().int().positive(),
  lessonNum: z.number().int().positive(),
  title: z.string(),
  knightColor: KnightColorSchema,
  totalXP: z.number().int().nonnegative(),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    knightColor: KnightColorSchema,
    body: z.string(),
  }),
  sections: z.array(LessonSectionSchema).min(1),
  footer: LessonFooterConfigSchema.optional(),
});

export const ConvoLessonSchema = z.object({
  id: z.string(),
  type: z.literal('conversational'),
  chapter: z.string(),
  chapterNum: z.number().int().positive(),
  title: z.string(),
  knightColor: KnightColorSchema,
  topic: z.string(),
  turns: z
    .array(
      z.object({
        speaker: SpeakerSchema,
        content: z.string(),
      }),
    )
    .min(1),
  footer: LessonFooterConfigSchema.optional(),
});

export const AnyLessonSchema = z.union([ConvoLessonSchema, LessonSchema]);
