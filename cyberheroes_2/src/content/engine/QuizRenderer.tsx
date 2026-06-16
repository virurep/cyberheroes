import { useState, type ComponentType } from 'react';
import { TextBox } from '../../components/textboxes/TextBox';
import { XPBadge } from '../../components/primitives/XPBadge';
import { ProgressBar } from '../../components/primitives/ProgressBar';
import { QUESTION_RENDERERS } from './questionRegistry';
import type { Question, Quiz } from './types';

export interface QuizResult {
  earnedXP: number;
  totalXP: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
}

export interface QuizRendererProps {
  quiz: Quiz;
  onComplete?: (result: QuizResult) => void;
}

/** Renders every question in a quiz, tracks correctness/XP, and shows a pass/fail summary. */
export function QuizRenderer({ quiz, onComplete }: QuizRendererProps) {
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const passThreshold = quiz.passThreshold ?? 0.7;
  const totalXP = quiz.questions.reduce((sum, q) => sum + q.xp, 0);

  const allAnswered = quiz.questions.every((q) => q.id in answered);
  const earnedXP = quiz.questions.reduce((sum, q) => sum + (answered[q.id] ? q.xp : 0), 0);
  const correctCount = Object.values(answered).filter(Boolean).length;
  const passed = totalXP > 0 ? earnedXP / totalXP >= passThreshold : false;

  const markAnswered = (id: string, correct: boolean) => {
    setAnswered((prev) => {
      const next = { ...prev, [id]: correct };
      const nextEarned = quiz.questions.reduce((sum, q) => sum + (next[q.id] ? q.xp : 0), 0);
      const nextAllAnswered = quiz.questions.every((q) => q.id in next);
      if (nextAllAnswered) {
        onComplete?.({
          earnedXP: nextEarned,
          totalXP,
          correctCount: Object.values(next).filter(Boolean).length,
          totalCount: quiz.questions.length,
          passed: totalXP > 0 ? nextEarned / totalXP >= passThreshold : false,
        });
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 'clamp(14px,2.2vw,20px)', color: 'var(--cyan)', letterSpacing: 3, marginBottom: 14 }}>{quiz.title}</div>
        <ProgressBar value={Object.keys(answered).length} max={quiz.questions.length} color="var(--cyan)" label="PROGRESS" />
      </div>

      {quiz.questions.map((question) => {
        // Same widening rationale as BlockRenderer — see the comment there.
        const Renderer = QUESTION_RENDERERS[question.type] as
          | ComponentType<{ question: Question; onComplete: (correct: boolean) => void }>
          | undefined;
        if (!Renderer) {
          return (
            <TextBox key={question.id} type="danger" title="UNKNOWN QUESTION TYPE">
              Question <strong>{question.id}</strong> has type <code>{question.type}</code>, which has no registered renderer. Add
              one in <code>src/content/engine/questionRegistry.tsx</code>.
            </TextBox>
          );
        }
        return <Renderer key={question.id} question={question} onComplete={(correct) => markAnswered(question.id, correct)} />;
      })}

      {allAnswered && (
        <div style={{ animation: 'up-in .4s ease' }}>
          <TextBox type={passed ? 'tip' : 'warning'} title={passed ? 'QUEST COMPLETE!' : 'NOT QUITE THERE'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                {correctCount} / {quiz.questions.length} correct — {earnedXP} / {totalXP} XP earned (
                {Math.round((earnedXP / Math.max(totalXP, 1)) * 100)}%, threshold {Math.round(passThreshold * 100)}%)
              </div>
              <div>
                <XPBadge xp={earnedXP} color={passed ? 'green' : 'gold'} />
              </div>
            </div>
          </TextBox>
        </div>
      )}
    </div>
  );
}
