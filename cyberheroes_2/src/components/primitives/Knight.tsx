import { KNIGHT_PRESETS, type KnightColor } from './knightPresets';

export interface KnightProps {
  size?: number;
  animate?: boolean;
  flip?: boolean;
  color?: KnightColor;
}

/** The "Data Protector" knight sprite, themable via glow color. */
export function Knight({ size = 48, animate = true, flip = false, color = 'cyan' }: KnightProps) {
  const p = KNIGHT_PRESETS[color] ?? KNIGHT_PRESETS.cyan;
  return (
    <img
      src="/knight.png"
      alt=""
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
        display: 'block',
        transform: flip ? 'scaleX(-1)' : 'none',
        filter: `${p.filter} drop-shadow(0 0 ${size * 0.08}px rgba(${p.rgb},.7)) drop-shadow(0 0 ${size * 0.16}px rgba(${p.rgb},.35))`,
        animation: animate ? 'float 3s ease-in-out infinite' : 'none',
      }}
    />
  );
}
