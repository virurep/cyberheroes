import type { ReactNode } from 'react';
import { Knight } from '../primitives/Knight';
import { KNIGHT_PRESETS, type KnightColor } from '../primitives/knightPresets';
import { MagePortrait } from './MagePortrait';
import { MAGE } from './mage';

export type Speaker = 'knight' | 'mage';

export interface ConvoTurnProps {
  speaker?: Speaker;
  side?: 'left' | 'right';
  knightColor?: KnightColor;
  children?: ReactNode;
  active?: boolean;
}

/** Single conversation turn — knight or mage on a side. */
export function ConvoTurn({ speaker = 'knight', side = 'left', knightColor = 'cyan', children, active = true }: ConvoTurnProps) {
  const isKnight = speaker === 'knight';
  const color = isKnight ? `rgb(${(KNIGHT_PRESETS[knightColor] ?? KNIGHT_PRESETS.cyan).rgb})` : MAGE.color;
  const name = isKnight ? 'DATA PROTECTOR' : MAGE.name;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: side === 'right' ? 'row-reverse' : 'row',
        gap: 18,
        alignItems: 'flex-start',
        opacity: active ? 1 : 0.35,
        transition: 'opacity .3s',
        animation: active ? 'up-in .4s ease' : 'none',
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: 6 }}>
        {isKnight ? (
          <Knight size={84} color={knightColor} flip={side === 'right'} animate={active} />
        ) : (
          <MagePortrait size={84} flip={side === 'right'} animate={active} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, position: 'relative', background: 'var(--surf)', border: `3px solid ${color}`, padding: '18px 22px', marginTop: 14 }}>
        <div
          style={{
            position: 'absolute',
            top: 14,
            ...(side === 'left' ? { left: -13 } : { right: -13 }),
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            ...(side === 'left' ? { borderRight: `13px solid ${color}` } : { borderLeft: `13px solid ${color}` }),
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -12,
            ...(side === 'left' ? { left: 14 } : { right: 14 }),
            background: 'var(--bg)',
            padding: '3px 10px',
            border: `2px solid ${color}`,
          }}
        >
          <span style={{ fontSize: 7, color, letterSpacing: 2 }}>
            {isKnight ? '⚔' : '✦'} {name}
          </span>
        </div>
        <div style={{ fontSize: 'clamp(10px,1.3vw,12px)', lineHeight: 2.3, color: 'var(--text)', marginTop: 4, letterSpacing: 0.5 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
