export type XPBadgeColor = 'gold' | 'cyan' | 'green';

export interface XPBadgeProps {
  xp: number;
  color?: XPBadgeColor;
}

const XP_COLOR_MAP: Record<XPBadgeColor, { c: string; rgb: string }> = {
  gold: { c: 'var(--gold)', rgb: '255,215,0' },
  cyan: { c: 'var(--cyan)', rgb: '0,212,255' },
  green: { c: 'var(--green)', rgb: '0,255,136' },
};

export function XPBadge({ xp, color = 'gold' }: XPBadgeProps) {
  const m = XP_COLOR_MAP[color];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: `rgba(${m.rgb},.12)`,
        border: `2px solid ${m.c}`,
        padding: '6px 12px',
        fontSize: 8,
        color: m.c,
        letterSpacing: 2,
      }}
    >
      <span style={{ fontSize: 11, lineHeight: 1 }}>★</span>
      <span>+{xp} XP</span>
    </span>
  );
}
