import { useState, type ReactNode } from 'react';
import type { KnightColor } from '../primitives/knightPresets';
import { ConvoTurn, type Speaker } from './ConvoTurn';

export interface ConvoTurnData {
  speaker: Speaker;
  content: ReactNode;
}

export interface ConvoLessonProps {
  topic?: string;
  knightColor?: KnightColor;
  turns?: ConvoTurnData[];
  onComplete?: () => void;
}

/** Full conversational lesson — knight on left, mage on right. */
export function ConvoLesson({ topic = '', knightColor = 'cyan', turns = [], onComplete }: ConvoLessonProps) {
  const [revealed, setRevealed] = useState(1);
  const done = revealed >= turns.length;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg,rgba(0,212,255,.04),rgba(124,58,237,.04) 60%,transparent)',
        border: '2px solid var(--purple)',
        padding: '28px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid rgba(124,58,237,.3)' }}>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg,transparent,var(--cyan))' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 6, color: 'var(--dim)', letterSpacing: 4, marginBottom: 6 }}>⚔ KNIGHT &amp; MAGE ✦</div>
          <div style={{ fontSize: 'clamp(11px,1.5vw,14px)', color: 'var(--gold)', letterSpacing: 3 }}>{topic}</div>
        </div>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg,var(--purple),transparent)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
        {turns.slice(0, revealed).map((t, i) => {
          const side = t.speaker === 'knight' ? 'left' : 'right';
          return (
            <ConvoTurn key={i} speaker={t.speaker} side={side} knightColor={knightColor} active={i === revealed - 1 || done}>
              {t.content}
            </ConvoTurn>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {done ? (
          <button className="px-btn btn-gold" onClick={() => onComplete?.()}>
            ⚔ CONTINUE QUEST →
          </button>
        ) : (
          <button className="px-btn btn-primary" onClick={() => setRevealed((r) => Math.min(r + 1, turns.length))}>
            ▼ THEY SPEAK ON ({revealed} / {turns.length})
          </button>
        )}
      </div>
    </div>
  );
}
