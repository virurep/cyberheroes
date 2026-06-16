import type { ReactNode } from 'react';
import { Knight } from '../primitives/Knight';
import { KNIGHT_PRESETS, type KnightColor } from '../primitives/knightPresets';

export interface DialogueBoxProps {
  speaker?: string;
  children?: ReactNode;
  knightColor?: KnightColor;
  side?: 'left' | 'right';
}

/** Speech bubble — the knight talks. */
export function DialogueBox({
  speaker = 'DATA PROTECTOR',
  children,
  knightColor = 'cyan',
  side = 'left',
}: DialogueBoxProps) {
  const p = KNIGHT_PRESETS[knightColor] ?? KNIGHT_PRESETS.cyan;
  const colVar = `rgb(${p.rgb})`;

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexDirection: side === 'right' ? 'row-reverse' : 'row' }}>
      <div style={{ flexShrink: 0, paddingTop: 8 }}>
        <Knight size={56} color={knightColor} flip={side === 'right'} />
      </div>
      <div style={{ flex: 1, position: 'relative', background: 'var(--surf)', border: `3px solid ${colVar}`, padding: '20px 22px' }}>
        <div
          style={{
            position: 'absolute',
            top: 18,
            ...(side === 'left' ? { left: -13 } : { right: -13 }),
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            ...(side === 'left' ? { borderRight: `13px solid ${colVar}` } : { borderLeft: `13px solid ${colVar}` }),
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -12,
            ...(side === 'left' ? { left: 14 } : { right: 14 }),
            background: 'var(--bg)',
            padding: '3px 10px',
            border: `2px solid ${colVar}`,
          }}
        >
          <span style={{ fontSize: 7, color: colVar, letterSpacing: 2 }}>⚔ {speaker}</span>
        </div>
        <div style={{ fontSize: 'clamp(10px,1.3vw,12px)', lineHeight: 2.2, color: 'var(--text)', marginTop: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
