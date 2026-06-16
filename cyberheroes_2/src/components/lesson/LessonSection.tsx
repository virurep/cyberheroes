import type { ReactNode } from 'react';

export interface LessonSectionProps {
  number?: number;
  title: ReactNode;
  children?: ReactNode;
}

export function LessonSection({ number, title, children }: LessonSectionProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {number != null && (
          <div
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              background: 'var(--cyan)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              letterSpacing: 1,
            }}
          >
            {number}
          </div>
        )}
        <div style={{ fontSize: 'clamp(11px,1.5vw,14px)', color: 'var(--cyan)', letterSpacing: 2 }}>{title}</div>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg,var(--cyan),transparent)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingLeft: 46 }}>{children}</div>
    </section>
  );
}
