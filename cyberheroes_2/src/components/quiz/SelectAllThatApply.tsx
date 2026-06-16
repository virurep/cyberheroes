import { useState } from 'react';
import { XPBadge } from '../primitives/XPBadge';
import { TextBox } from '../textboxes/TextBox';

export interface SelectAllThatApplyProps {
  question: string;
  options: string[];
  correctSet: number[];
  xp?: number;
  onComplete?: (correct: boolean) => void;
}

/** Select-all-that-apply — multiple correct answers. */
export function SelectAllThatApply({ question, options, correctSet, xp = 15, onComplete }: SelectAllThatApplyProps) {
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const submit = () => {
    setSubmitted(true);
    const correct = correctSet.length === picked.size && correctSet.every((i) => picked.has(i));
    onComplete?.(correct);
  };
  const reset = () => {
    setPicked(new Set());
    setSubmitted(false);
  };

  const allCorrect = submitted && correctSet.length === picked.size && correctSet.every((i) => picked.has(i));

  return (
    <div style={{ background: 'var(--surf)', border: '3px solid var(--purple)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(124,58,237,.15)',
          borderBottom: '2px solid var(--purple)',
          padding: '10px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--purple)', fontSize: 11 }}>◆</span>
          <span style={{ fontSize: 8, color: 'var(--purple)', letterSpacing: 3 }}>SELECT ALL THAT APPLY</span>
        </div>
        <XPBadge xp={xp} color="gold" />
      </div>

      <div style={{ padding: '24px 22px' }}>
        <div style={{ fontSize: 'clamp(11px,1.5vw,14px)', color: 'var(--text)', lineHeight: 2, marginBottom: 14, letterSpacing: 1 }}>
          {question}
        </div>
        <div style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: 2, marginBottom: 20 }}>▸ MORE THAN ONE MAY BE CORRECT</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {options.map((opt, i) => {
            const isPicked = picked.has(i);
            const isCorrect = correctSet.includes(i);
            let borderColor = 'var(--border)';
            let bg = 'var(--surf2)';
            let boxColor = 'var(--dim)';
            let boxBg = 'transparent';

            if (submitted) {
              if (isCorrect && isPicked) {
                borderColor = 'var(--green)';
                bg = 'rgba(0,255,136,.1)';
                boxColor = 'var(--green)';
                boxBg = 'var(--green)';
              } else if (isCorrect && !isPicked) {
                borderColor = 'var(--orange)';
                bg = 'rgba(255,140,0,.08)';
                boxColor = 'var(--orange)';
              } else if (!isCorrect && isPicked) {
                borderColor = 'var(--red)';
                bg = 'rgba(255,64,85,.1)';
                boxColor = 'var(--red)';
                boxBg = 'var(--red)';
              }
            } else if (isPicked) {
              borderColor = 'var(--purple)';
              bg = 'rgba(124,58,237,.12)';
              boxColor = 'var(--purple)';
              boxBg = 'var(--purple)';
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => toggle(i)}
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
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    border: `2px solid ${boxColor}`,
                    background: boxBg === 'transparent' ? 'transparent' : boxBg,
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                  }}
                >
                  {((submitted && isCorrect && isPicked) || (!submitted && isPicked)) && '✓'}
                  {submitted && !isCorrect && isPicked && <span style={{ color: '#fff' }}>✕</span>}
                  {submitted && isCorrect && !isPicked && <span style={{ color: 'var(--orange)', fontSize: 8 }}>!</span>}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ animation: 'up-in .35s ease', marginBottom: 20 }}>
            {allCorrect ? (
              <TextBox type="tip" title="ALL CORRECT!">
                Mighty work! You spotted every one. <span style={{ color: 'var(--gold)' }}>+{xp} XP</span>
              </TextBox>
            ) : (
              <TextBox type="warning" title="ALMOST!">
                Yellow boxes show answers you missed. Red shows wrong picks. Review and try again!
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
            <button
              className="px-btn btn-primary"
              onClick={submit}
              disabled={picked.size === 0}
              style={{ background: 'var(--purple)', color: '#fff', boxShadow: '0 4px 0 #3d1a7a' }}
            >
              SUBMIT ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
