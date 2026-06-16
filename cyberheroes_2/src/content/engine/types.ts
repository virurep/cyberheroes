import type { KnightColor } from '../../components/primitives/knightPresets';
import type { TextBoxType } from '../../components/textboxes/TextBox';
import type { Bucket, Item } from '../../components/quiz/DragDropSort';
import type { Speaker } from '../../components/convo/ConvoTurn';

/* ═══════════════════════════════════════════════
   QUIZ / ASSESSMENT SCHEMA
═══════════════════════════════════════════════ */

export type QuestionType = 'multiple_choice' | 'select_all' | 'true_false' | 'drag_drop_sort';

interface QuestionBase {
  id: string;
  type: QuestionType;
  xp: number;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correct: number;
}

export interface SelectAllQuestion extends QuestionBase {
  type: 'select_all';
  question: string;
  options: string[];
  correctSet: number[];
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true_false';
  question: string;
  answer: boolean;
}

export interface DragDropSortQuestion extends QuestionBase {
  type: 'drag_drop_sort';
  title: string;
  buckets: Bucket[];
  items: Item[];
}

export type Question = MultipleChoiceQuestion | SelectAllQuestion | TrueFalseQuestion | DragDropSortQuestion;

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string;
  /** 0..1, fraction of total XP needed to pass. Defaults to 0.7. */
  passThreshold?: number;
  questions: Question[];
}

/* ═══════════════════════════════════════════════
   LESSON SCHEMA — standard (block-based)
═══════════════════════════════════════════════ */

export type BlockType = 'text' | 'textbox' | 'dialogue' | 'keyterm' | 'quote' | 'step' | 'code' | 'image';

interface BlockBase {
  type: BlockType;
}

export interface TextBlock extends BlockBase {
  type: 'text';
  content: string;
}

export interface TextBoxBlock extends BlockBase {
  type: 'textbox';
  boxType: TextBoxType;
  title?: string;
  content: string;
}

export interface DialogueBlock extends BlockBase {
  type: 'dialogue';
  speaker: string;
  knightColor: KnightColor;
  side: 'left' | 'right';
  content: string;
}

export interface KeyTermBlock extends BlockBase {
  type: 'keyterm';
  term: string;
  content: string;
}

export interface QuoteBlock extends BlockBase {
  type: 'quote';
  author?: string;
  content: string;
}

export interface StepBlock extends BlockBase {
  type: 'step';
  step: number;
  total?: number;
  title?: string;
  content: string;
}

export interface CodeBlock extends BlockBase {
  type: 'code';
  content: string;
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  src: string;
  alt?: string;
  caption?: string;
}

export type Block = TextBlock | TextBoxBlock | DialogueBlock | KeyTermBlock | QuoteBlock | StepBlock | CodeBlock | ImageBlock;

export interface LessonSection {
  number: number;
  title: string;
  blocks: Block[];
}

export interface LessonFooterConfig {
  nextLabel?: string;
  nextQuiz?: string;
}

export interface Lesson {
  id: string;
  type?: 'standard';
  chapter: string;
  chapterNum: number;
  lessonNum: number;
  title: string;
  knightColor: KnightColor;
  totalXP: number;
  hero: {
    eyebrow: string;
    title: string;
    knightColor: KnightColor;
    body: string;
  };
  sections: LessonSection[];
  footer?: LessonFooterConfig;
}

/* ═══════════════════════════════════════════════
   LESSON SCHEMA — conversational
═══════════════════════════════════════════════ */

export interface ConvoLessonTurnData {
  speaker: Speaker;
  content: string;
}

export interface ConvoLesson {
  id: string;
  type: 'conversational';
  chapter: string;
  chapterNum: number;
  title: string;
  knightColor: KnightColor;
  topic: string;
  turns: ConvoLessonTurnData[];
  footer?: LessonFooterConfig;
}

export type AnyLesson = Lesson | ConvoLesson;

export function isConvoLesson(lesson: AnyLesson): lesson is ConvoLesson {
  return lesson.type === 'conversational';
}
