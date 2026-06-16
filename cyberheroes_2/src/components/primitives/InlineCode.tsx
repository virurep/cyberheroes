import type { ReactNode } from 'react';

export interface InlineCodeProps {
  children?: ReactNode;
  color?: string;
}

export function InlineCode({ children, color = 'var(--cyan)' }: InlineCodeProps) {
  return (
    <code
      style={{
        background: 'rgba(0,212,255,.12)',
        border: '1px solid rgba(0,212,255,.35)',
        padding: '2px 8px',
        fontSize: '.85em',
        color,
        fontFamily: 'var(--font)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </code>
  );
}
