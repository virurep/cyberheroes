import { useState } from 'react';
import { XPBadge } from '../primitives/XPBadge';
import { TextBox } from '../textboxes/TextBox';

export interface TrueFalseProps {
  question: string;
  answer: boolean;
  xp?: number;
  onComplete?: (correct: boolean) => void;
}

const CHOICES = [
  { val: true, label: 'TRUE', color: 'var(--green)', rgb: '0,255,136' },
  { val: false, label: 'FALSE', color: 'var(--red)', rgb: '255,64,85' },
] as const;

/** Quick binary true/false question. */
export function TrueFalse({ question, answer, xp = 5, onComplete }: TrueFalseProps) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const submitted = picked != null;
  const correct = submitted && picked === answer;

  const choose = (val: boolean) => {
    if (submitted) return;
    setPicked(val);
    onComplete?.(val === answer);
  };

  return (
    <div style={{ background: 'var(--surf)', border: '3px solid var(--gold)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,215,0,.1)',
          borderBottom: '2px solid var(--gold)',
          padding: '10px 18px',
        }}
      >
        <span style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: 3 }}>⚖ TRUE OR FALSE?</span>
        <XPBadge xp={xp} />
      </div>
      <div style={{ padding: '22px' }}>
        <div style={{ fontSize: 'clamp(11px,1.5vw,13px)', color: 'var(--text)', lineHeight: 2, marginBottom: 22, letterSpacing: 1 }}>
          {question}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {CHOICES.map((b) => {
            const isPicked = picked === b.val;
            const isCorrect = answer === b.val;
            let bg = 'var(--surf2)';
            let bord = 'var(--border)';
            if (submitted && isPicked && isCorrect) {
              bg = `rgba(${b.rgb},.18)`;
              bord = b.color;
            } else if (submitted && isPicked) {
              bg = 'rgba(255,64,85,.18)';
              bord = 'var(--red)';
            } else if (submitted && isCorrect) {
              bg = `rgba(${b.rgb},.12)`;
              bord = b.color;
            }
            return (
              <button
                key={b.label}
                disabled={submitted}
                onClick={() => choose(b.val)}
                className="px-btn"
                style={{
                  padding: '18px',
                  fontSize: 14,
                  letterSpacing: 4,
                  background: bg,
                  color: submitted && isPicked ? (isCorrect ? 'var(--green)' : 'var(--red)') : b.color,
                  border: `3px solid ${bord}`,
                  boxShadow: submitted ? 'none' : `0 4px 0 rgba(${b.rgb},.3)`,
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div style={{ marginTop: 20, animation: 'up-in .35s ease' }}>
            {correct ? (
              <TextBox type="tip" title="CORRECT!">
                +{xp} XP earned!
              </TextBox>
            ) : (
              <TextBox type="danger" title="WRONG">
                The correct answer was <strong style={{ color: 'var(--green)' }}>{answer ? 'TRUE' : 'FALSE'}</strong>.
              </TextBox>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
