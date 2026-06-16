export interface ProgressBarProps {
  value?: number;
  max?: number;
  color?: string;
  label?: string;
  height?: number;
}

/** Pixel-notched progress bar. */
export function ProgressBar({ value = 0, max = 100, color = 'var(--cyan)', label, height = 12 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
            fontSize: 7,
            color: 'var(--dim)',
            letterSpacing: 2,
          }}
        >
          <span>{label}</span>
          <span style={{ color }}>{pct}%</span>
        </div>
      )}
      <div
        style={{
          position: 'relative',
          height,
          background: 'var(--surf2)',
          border: '2px solid var(--border)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 10px ${color}`,
            transition: 'width .5s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'repeating-linear-gradient(90deg,transparent,transparent 5%,rgba(0,0,0,.25) 5%,rgba(0,0,0,.25) calc(5% + 1px))',
          }}
        />
      </div>
    </div>
  );
}
