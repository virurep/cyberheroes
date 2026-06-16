import { ProgressBar } from './ProgressBar';

export interface StatRowProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  icon?: string;
}

export function StatRow({ label, value, max, color = 'var(--green)', icon = '♥' }: StatRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 11, color }}>{icon}</span>
      <span style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: 2, minWidth: 46 }}>{label}</span>
      <div style={{ flex: 1 }}>
        <ProgressBar value={value} max={max} color={color} height={8} />
      </div>
      <span style={{ fontSize: 7, color, letterSpacing: 1, minWidth: 48, textAlign: 'right' }}>
        {value}/{max}
      </span>
    </div>
  );
}
