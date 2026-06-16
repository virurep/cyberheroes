/* eslint-disable react-refresh/only-export-components --
   Same rationale as blockRegistry.tsx: each adapter is intentionally co-located with the
   QUESTION_RENDERERS lookup table it's registered in. */
import type { ComponentType } from 'react';
import { QuizQuestion } from '../../components/quiz/QuizQuestion';
import { SelectAllThatApply } from '../../components/quiz/SelectAllThatApply';
import { TrueFalse } from '../../components/quiz/TrueFalse';
import { DragDropSort } from '../../components/quiz/DragDropSort';
import type {
  DragDropSortQuestion,
  MultipleChoiceQuestion,
  Question,
  QuestionType,
  SelectAllQuestion,
  TrueFalseQuestion,
} from './types';

export interface QuestionProps<Q extends Question = Question> {
  question: Q;
  onComplete: (correct: boolean) => void;
}

function MultipleChoiceQuestionRenderer({ question, onComplete }: QuestionProps<MultipleChoiceQuestion>) {
  return (
    <QuizQuestion
      question={question.question}
      options={question.options}
      correct={question.correct}
      xp={question.xp}
      onComplete={onComplete}
    />
  );
}

function SelectAllQuestionRenderer({ question, onComplete }: QuestionProps<SelectAllQuestion>) {
  return (
    <SelectAllThatApply
      question={question.question}
      options={question.options}
      correctSet={question.correctSet}
      xp={question.xp}
      onComplete={onComplete}
    />
  );
}

function TrueFalseQuestionRenderer({ question, onComplete }: QuestionProps<TrueFalseQuestion>) {
  return <TrueFalse question={question.question} answer={question.answer} xp={question.xp} onComplete={onComplete} />;
}

function DragDropQuestionRenderer({ question, onComplete }: QuestionProps<DragDropSortQuestion>) {
  return (
    <DragDropSort title={question.title} buckets={question.buckets} items={question.items} xp={question.xp} onComplete={onComplete} />
  );
}

/**
 * Question-type registry. To add a new question type:
 *   1. Add the type to `QuestionType` / the `Question` union in ./types.ts
 *      (and a matching branch in the zod schema in ./schemas.ts).
 *   2. Write a renderer component here, typed `QuestionProps<YourQuestion>`.
 *   3. Register it below.
 */
export const QUESTION_RENDERERS: Record<QuestionType, ComponentType<QuestionProps<never>>> = {
  multiple_choice: MultipleChoiceQuestionRenderer as ComponentType<QuestionProps<never>>,
  select_all: SelectAllQuestionRenderer as ComponentType<QuestionProps<never>>,
  true_false: TrueFalseQuestionRenderer as ComponentType<QuestionProps<never>>,
  drag_drop_sort: DragDropQuestionRenderer as ComponentType<QuestionProps<never>>,
};
