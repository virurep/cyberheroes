import { MAGE } from './mage';

export interface MagePortraitProps {
  size?: number;
  animate?: boolean;
  flip?: boolean;
}

/** Pixel-art mage portrait (SVG, no sprite asset needed). */
export function MagePortrait({ size = 120, animate = true, flip = false }: MagePortraitProps) {
  const m = MAGE;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{
        imageRendering: 'pixelated',
        filter: `drop-shadow(0 0 ${size * 0.06}px rgba(${m.rgb},.6)) drop-shadow(0 0 ${size * 0.12}px rgba(${m.rgb},.3))`,
        animation: animate ? 'float 3.5s ease-in-out infinite' : 'none',
        display: 'block',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
    >
      <circle cx="32" cy="32" r="30" fill={`rgba(${m.rgb},.08)`} />
      {/* robe body */}
      <rect x="14" y="34" width="36" height="26" fill={m.robe} />
      <rect x="12" y="38" width="2" height="22" fill={m.robe} />
      <rect x="50" y="38" width="2" height="22" fill={m.robe} />
      <rect x="14" y="58" width="36" height="2" fill={m.trim} />
      <rect x="30" y="34" width="4" height="26" fill={m.accent} />
      {/* sleeves */}
      <rect x="8" y="38" width="6" height="14" fill={m.robe} />
      <rect x="50" y="38" width="6" height="14" fill={m.robe} />
      <rect x="8" y="50" width="6" height="2" fill={m.trim} />
      <rect x="50" y="50" width="6" height="2" fill={m.trim} />
      {/* face */}
      <rect x="22" y="22" width="20" height="14" fill={m.skin} />
      <rect x="20" y="24" width="2" height="10" fill={m.skin} />
      <rect x="42" y="24" width="2" height="10" fill={m.skin} />
      {/* eyes */}
      <rect x="25" y="27" width="3" height="3" fill={m.trim} />
      <rect x="36" y="27" width="3" height="3" fill={m.trim} />
      <rect x="25" y="27" width="3" height="1" fill="#fff" />
      <rect x="36" y="27" width="3" height="1" fill="#fff" />
      <rect x="31" y="30" width="2" height="2" fill={m.accent} opacity={0.5} />
      {/* long beard */}
      <rect x="22" y="34" width="20" height="10" fill="#e8e0d0" />
      <rect x="20" y="36" width="2" height="8" fill="#e8e0d0" />
      <rect x="42" y="36" width="2" height="8" fill="#e8e0d0" />
      <rect x="24" y="44" width="16" height="2" fill="#d0c8b8" />
      <rect x="26" y="46" width="12" height="2" fill="#d0c8b8" />
      <rect x="28" y="48" width="8" height="3" fill="#c0b8a8" />
      {/* pointed wizard hat */}
      <polygon points="20,22 32,2 44,22" fill={m.robe} />
      <polygon points="22,22 32,6 42,22" fill={m.accent} />
      <rect x="20" y="20" width="24" height="3" fill={m.trim} />
      <rect x="30" y="4" width="4" height="2" fill={m.trim} />
      <rect x="29" y="2" width="6" height="2" fill={m.orb} />
      {/* staff with orb */}
      <rect x="6" y="34" width="2" height="30" fill={m.accent} />
      <rect x="4" y="30" width="6" height="6" fill={m.orb} />
      <rect x="3" y="31" width="1" height="4" fill={m.orb} opacity={0.7} />
      <rect x="10" y="31" width="1" height="4" fill={m.orb} opacity={0.7} />
      <rect x="2" y="29" width="1" height="2" fill={m.orb} opacity={0.5} />
      <rect x="11" y="29" width="1" height="2" fill={m.orb} opacity={0.5} />
    </svg>
  );
}
