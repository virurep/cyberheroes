import knightImg from '../../img/characters/knight.png';

const PRESETS = {
  cyan:   { rgb: '0,180,255',   filter: 'brightness(1.4) contrast(1.1)' },
  purple: { rgb: '160,80,255',  filter: 'brightness(1.3) contrast(1.1) hue-rotate(195deg) saturate(1.4)' },
  green:  { rgb: '0,255,120',   filter: 'brightness(1.4) contrast(1.1) hue-rotate(100deg) saturate(1.3)' },
  red:    { rgb: '255,60,80',   filter: 'brightness(1.4) contrast(1.1) hue-rotate(300deg) saturate(1.5)' },
  gold:   { rgb: '255,200,0',   filter: 'brightness(1.5) contrast(1.1) hue-rotate(248deg) saturate(1.6)' },
  white:  { rgb: '200,220,255', filter: 'brightness(1.8) contrast(.9) saturate(.1)' },
};

const Knight = ({ size = 64, color = 'cyan', animate = true, flip = false }) => {
  const p = PRESETS[color] || PRESETS.cyan;
  return (
    <img
      src={knightImg}
      alt="Knight"
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
};

export default Knight;
