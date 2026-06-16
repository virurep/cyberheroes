import type { ReactNode } from 'react';

export interface KeyTermProps {
  term: string;
  children?: ReactNode;
}

/** Vocabulary callout. */
export function KeyTerm({ term, children }: KeyTermProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 18,
        alignItems: 'flex-start',
        background: 'rgba(124,58,237,.10)',
        border: '2px solid var(--purple)',
        padding: '18px 20px',
      }}
    >
      <div style={{ flexShrink: 0, minWidth: 70, textAlign: 'center' }}>
        <div style={{ background: 'var(--purple)', color: '#fff', fontSize: 6, letterSpacing: 2, padding: '4px 8px', marginBottom: 4 }}>
          NEW WORD
        </div>
        <div style={{ fontSize: 9, color: 'var(--purple)', letterSpacing: 1 }}>◆◆◆</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 2, marginBottom: 8 }}>{term}</div>
        <div style={{ fontSize: 'clamp(9px,1.2vw,11px)', color: 'var(--text)', lineHeight: 2.2 }}>{children}</div>
      </div>
    </div>
  );
}
