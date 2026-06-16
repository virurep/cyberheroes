import type { ReactNode } from 'react';
import { Knight } from '../primitives/Knight';
import type { KnightColor } from '../primitives/knightPresets';

export interface LessonHeroProps {
  eyebrow?: string;
  title: ReactNode;
  knightColor?: KnightColor;
  accent?: string;
  children?: ReactNode;
}

export function LessonHero({ eyebrow, title, knightColor = 'cyan', accent = 'var(--cyan)', children }: LessonHeroProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg,rgba(0,212,255,.06),rgba(124,58,237,.06))',
        border: `2px solid ${accent}`,
        padding: '32px 28px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 28,
        alignItems: 'center',
      }}
    >
      <Knight size={72} color={knightColor} />
      <div>
        {eyebrow && <div style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: 5, marginBottom: 10 }}>{eyebrow}</div>}
        <div style={{ fontSize: 'clamp(14px,2.2vw,20px)', color: accent, letterSpacing: 3, lineHeight: 1.5 }}>{title}</div>
        {children && (
          <div style={{ fontSize: 'clamp(9px,1.2vw,11px)', color: 'var(--text)', lineHeight: 2.2, marginTop: 14 }}>{children}</div>
        )}
      </div>
    </div>
  );
}
