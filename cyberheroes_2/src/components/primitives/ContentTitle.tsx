import type { ReactNode } from 'react';

export interface ContentTitleProps {
  eyebrow?: string;
  title: ReactNode;
  accent?: string;
}

export function ContentTitle({ eyebrow, title, accent = 'var(--cyan)' }: ContentTitleProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div
          style={{
            fontSize: 7,
            color: 'var(--dim)',
            letterSpacing: 5,
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
      )}
      <div style={{ fontSize: 'clamp(14px,2vw,20px)', color: 'var(--text)', letterSpacing: 2, lineHeight: 1.6 }}>
        {title}
      </div>
      <div
        style={{
          height: 2,
          marginTop: 14,
          maxWidth: 120,
          background: `linear-gradient(90deg,${accent},transparent)`,
        }}
      />
    </div>
  );
}
