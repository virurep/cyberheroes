import type { ReactNode } from 'react';

export interface StepBoxProps {
  step: number;
  total?: number;
  title?: string;
  children?: ReactNode;
}

/** Step callout — for instructions. */
export function StepBox({ step, total, title, children }: StepBoxProps) {
  return (
    <div style={{ background: 'var(--surf)', border: '2px solid var(--cyan)', padding: '18px 20px 18px 64px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: -2,
          top: -2,
          bottom: -2,
          width: 50,
          background: 'var(--cyan)',
          color: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <div style={{ fontSize: 6, letterSpacing: 2 }}>STEP</div>
        <div style={{ fontSize: 14 }}>{step}</div>
        {total && <div style={{ fontSize: 6, opacity: 0.7 }}>of {total}</div>}
      </div>
      {title && <div style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 10 }}>{title}</div>}
      <div style={{ fontSize: 'clamp(9px,1.2vw,11px)', color: 'var(--text)', lineHeight: 2.2 }}>{children}</div>
    </div>
  );
}
