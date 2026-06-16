import type { ReactNode } from 'react';

export type ChipColor = 'cyan' | 'gold' | 'green' | 'purple' | 'red' | 'dim';

export interface ChipProps {
  children?: ReactNode;
  color?: ChipColor;
  solid?: boolean;
  icon?: ReactNode;
}

const CHIP_COLORS: Record<ChipColor, { c: string; rgb: string }> = {
  cyan: { c: 'var(--cyan)', rgb: '0,212,255' },
  gold: { c: 'var(--gold)', rgb: '255,215,0' },
  green: { c: 'var(--green)', rgb: '0,255,136' },
  purple: { c: 'var(--purple)', rgb: '124,58,237' },
  red: { c: 'var(--red)', rgb: '255,64,85' },
  dim: { c: 'var(--dim)', rgb: '74,96,128' },
};

export function Chip({ children, color = 'cyan', solid = false, icon }: ChipProps) {
  const m = CHIP_COLORS[color] ?? CHIP_COLORS.cyan;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 7,
        letterSpacing: 2,
        padding: '5px 10px',
        background: solid ? m.c : `rgba(${m.rgb},.12)`,
        color: solid ? '#000' : m.c,
        border: `2px solid ${m.c}`,
      }}
    >
      {icon && <span style={{ fontSize: 9, lineHeight: 1 }}>{icon}</span>}
      {children}
    </span>
  );
}
