import type { ReactNode } from 'react';

export interface QuoteBoxProps {
  author?: string;
  children?: ReactNode;
}

/** Quote / wisdom box. */
export function QuoteBox({ author, children }: QuoteBoxProps) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '24px 32px',
        background: 'rgba(255,215,0,.05)',
        borderTop: '2px solid var(--gold)',
        borderBottom: '2px solid var(--gold)',
      }}
    >
      <div style={{ position: 'absolute', top: -8, left: 24, background: 'var(--bg)', padding: '0 8px', color: 'var(--gold)', fontSize: 14 }}>
        &quot;
      </div>
      <div style={{ position: 'absolute', bottom: -8, right: 24, background: 'var(--bg)', padding: '0 8px', color: 'var(--gold)', fontSize: 14 }}>
        &quot;
      </div>
      <div style={{ fontSize: 'clamp(10px,1.3vw,13px)', color: 'var(--text)', lineHeight: 2.4, fontStyle: 'italic', marginBottom: 12 }}>
        {children}
      </div>
      {author && (
        <div style={{ fontSize: 7, color: 'var(--gold)', letterSpacing: 3, textAlign: 'right' }}>— {author}</div>
      )}
    </div>
  );
}
