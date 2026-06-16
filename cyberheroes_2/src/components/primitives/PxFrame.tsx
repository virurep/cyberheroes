import type { CSSProperties, ReactNode } from 'react';

export interface PxFrameProps {
  color?: string;
  children?: ReactNode;
  style?: CSSProperties;
  padding?: number;
}

/** Classic 8-bit bevel-corner frame. */
export function PxFrame({ color = 'var(--cyan)', children, style = {}, padding = 18 }: PxFrameProps) {
  const t = 7;
  const corners: CSSProperties[] = [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ];
  return (
    <div style={{ position: 'relative', ...style }}>
      {corners.map((p, i) => (
        <div
          key={i}
          style={{ position: 'absolute', background: color, width: t, height: t, ...p, zIndex: 2 }}
        />
      ))}
      <div style={{ position: 'absolute', top: 0, left: t, right: t, height: 2, background: color }} />
      <div style={{ position: 'absolute', bottom: 0, left: t, right: t, height: 2, background: color }} />
      <div style={{ position: 'absolute', left: 0, top: t, bottom: t, width: 2, background: color }} />
      <div style={{ position: 'absolute', right: 0, top: t, bottom: t, width: 2, background: color }} />
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
