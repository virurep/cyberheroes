import type { ReactNode } from 'react';

export type TextBoxType = 'info' | 'tip' | 'warning' | 'danger' | 'quest' | 'secret';

interface TextBoxTypeConfig {
  color: string;
  icon: string;
  label: string;
  bg: string;
}

// eslint-disable-next-line react-refresh/only-export-components -- config constant, intentionally co-located with TextBox
export const TEXT_BOX_TYPES: Record<TextBoxType, TextBoxTypeConfig> = {
  info: { color: 'var(--cyan)', icon: 'ℹ', label: 'INFO', bg: 'rgba(0,212,255,.07)' },
  tip: { color: 'var(--green)', icon: '★', label: 'PRO TIP', bg: 'rgba(0,255,136,.07)' },
  warning: { color: 'var(--orange)', icon: '⚠', label: 'WARNING', bg: 'rgba(255,140,0,.07)' },
  danger: { color: 'var(--red)', icon: '✖', label: 'DANGER', bg: 'rgba(255,64,85,.08)' },
  quest: { color: 'var(--gold)', icon: '⚔', label: 'QUEST', bg: 'rgba(255,215,0,.08)' },
  secret: { color: 'var(--purple)', icon: '◆', label: 'SECRET', bg: 'rgba(124,58,237,.10)' },
};

export interface TextBoxProps {
  type?: TextBoxType;
  title?: string;
  children?: ReactNode;
  animate?: boolean;
}

/** Standard alert / callout box. */
export function TextBox({ type = 'info', title, children, animate = false }: TextBoxProps) {
  const c = TEXT_BOX_TYPES[type];
  return (
    <div
      style={{
        background: c.bg,
        border: `2px solid ${c.color}`,
        borderLeft: `6px solid ${c.color}`,
        padding: '18px 22px',
        animation: animate ? 'up-in .4s ease' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: children ? 10 : 0 }}>
        <span style={{ fontSize: 14, color: c.color, lineHeight: 1 }}>{c.icon}</span>
        <span style={{ fontSize: 8, color: c.color, letterSpacing: 3 }}>{title || c.label}</span>
      </div>
      {children && (
        <div
          style={{
            fontSize: 'clamp(9px,1.2vw,11px)',
            lineHeight: 2.2,
            color: 'var(--text)',
            paddingLeft: 24,
            letterSpacing: 0.5,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
