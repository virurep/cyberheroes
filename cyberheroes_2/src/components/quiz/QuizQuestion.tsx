import { useState } from 'react';
import { XPBadge } from '../primitives/XPBadge';
import { TextBox } from '../textboxes/TextBox';

export interface QuizQuestionProps {
  question: string;
  options: string[];
  correct: number;
  xp?: number;
  onComplete?: (correct: boolean) => void;
}

/** Multiple choice — single answer. */
export function QuizQuestion({ question, options, correct, xp = 10, onComplete }: QuizQuestionProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (picked == null) return;
    setSubmitted(true);
    onComplete?.(picked === correct);
  };

  const reset = () => {
    setPicked(null);
    setSubmitted(false);
  };

  return (
    <div style={{ background: 'var(--surf)', border: '3px solid var(--cyan)', padding: 0 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,212,255,.1)',
          borderBottom: '2px solid var(--cyan)',
          padding: '10px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--cyan)', fontSize: 11 }}>?</span>
          <span style={{ fontSize: 8, color: 'var(--cyan)', letterSpacing: 3 }}>QUESTION</span>
        </div>
        <XPBadge xp={xp} />
      </div>

      <div style={{ padding: '24px 22px' }}>
        <div style={{ fontSize: 'clamp(11px,1.5vw,14px)', color: 'var(--text)', lineHeight: 2, marginBottom: 24, letterSpacing: 1 }}>
          {question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === correct;
            let borderColor = 'var(--border)';
            let bg = 'var(--surf2)';
            let labelColor = 'var(--dim)';

            if (submitted) {
              if (isCorrect) {
                borderColor = 'var(--green)';
                bg = 'rgba(0,255,136,.1)';
                labelColor = 'var(--green)';
              } else if (isPicked) {
                borderColor = 'var(--red)';
                bg = 'rgba(255,64,85,.1)';
                labelColor = 'var(--red)';
              }
            } else if (isPicked) {
              borderColor = 'var(--cyan)';
              bg = 'rgba(0,212,255,.1)';
              labelColor = 'var(--cyan)';
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => !submitted && setPicked(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  cursor: submitted ? 'default' : 'pointer',
                  fontFamily: 'var(--font)',
                  fontSize: 'clamp(9px,1.2vw,11px)',
                  color: 'var(--text)',
                  textAlign: 'left',
                  letterSpacing: 1,
                  lineHeight: 1.8,
                  transition: 'all .15s',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    border: `2px solid ${labelColor}`,
                    color: labelColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                  }}
                >
                  {submitted && isCorrect ? '✓' : submitted && isPicked && !isCorrect ? '✕' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ animation: 'up-in .35s ease', marginBottom: 20 }}>
            {picked === correct ? (
              <TextBox type="tip" title="CORRECT!">
                Well fought, brave hero! You earned <span style={{ color: 'var(--gold)' }}>+{xp} XP</span>.
              </TextBox>
            ) : (
              <TextBox type="danger" title="NOT QUITE">
                The correct answer is <span style={{ color: 'var(--green)' }}>{String.fromCharCode(65 + correct)}</span>. Try again!
              </TextBox>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {submitted ? (
            <button className="px-btn btn-ghost" onClick={reset}>
              ↻ TRY AGAIN
            </button>
          ) : (
            <button className="px-btn btn-primary" onClick={submit} disabled={picked == null}>
              SUBMIT ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
