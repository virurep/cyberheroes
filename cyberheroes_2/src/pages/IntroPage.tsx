import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Knight } from '../components/primitives/Knight';
import { PxFrame } from '../components/primitives/PxFrame';
import { KNIGHT_PRESETS, type KnightColor } from '../components/primitives/knightPresets';

const COLOR_LABELS: Record<KnightColor, string> = {
  cyan: 'Cyber',
  purple: 'Void',
  green: 'Neon',
  red: 'Blaze',
  gold: 'Legend',
  white: 'Ghost',
};

interface Star {
  x: number;
  y: number;
  size: number;
  op: number;
  dur: number;
  del: number;
  col: string;
}

interface Streak {
  top: number;
  dur: number;
  del: number;
  w: number;
  op: number;
}

// Generated once at module scope, not during render: the starfield is decorative and
// doesn't need to be idempotent per render (React's purity rules apply to render-phase
// work, not module init), and re-rolling on every render would also defeat the animation.
function generateStars(): Star[] {
  const s: Star[] = [];
  for (let i = 0; i < 200; i++) {
    s.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.7 ? 1 : 2,
      op: 0.2 + Math.random() * 0.7,
      dur: 2 + Math.random() * 5,
      del: Math.random() * 6,
      col: i % 9 === 0 ? '#8b5cf6' : i % 6 === 0 ? '#00d4ff' : '#fff',
    });
  }
  return s;
}

function generateStreaks(): Streak[] {
  const s: Streak[] = [];
  for (let i = 0; i < 7; i++) {
    s.push({
      top: 10 + Math.random() * 70,
      dur: 3 + Math.random() * 6,
      del: Math.random() * 14,
      w: 80 + Math.random() * 140,
      op: 0.3 + Math.random() * 0.4,
    });
  }
  return s;
}

const STARS = generateStars();
const STREAKS = generateStreaks();

/** Background starfield — ported from Cyberheroes.html's StarField. */
function StarField() {
  const stars = STARS;
  const streaks = STREAKS;

  const glows: [number, number, string, string, string][] = [
    [300, 250, '#7c3aed', '15%', '10%'],
    [200, 180, '#00d4ff', '75%', '55%'],
    [400, 300, '#1e40af', '40%', '70%'],
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {glows.map(([w, h, c, l, t], i) => (
        <div
          key={i}
          style={{ position: 'absolute', width: w, height: h, left: l, top: t, background: `radial-gradient(ellipse,${c}09 0%,transparent 70%)` }}
        />
      ))}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: s.size === 1 ? 8 : 10,
            lineHeight: 1,
            color: s.col,
            opacity: s.op,
            userSelect: 'none',
            fontFamily: "'Press Start 2P',monospace",
            animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
          }}
        >
          {i % 2 === 0 ? '0' : '1'}
        </div>
      ))}
      {streaks.map((s, i) => (
        <div
          key={`sk${i}`}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: 0,
            height: 1,
            width: s.w,
            background: `linear-gradient(90deg,transparent,rgba(255,255,255,${s.op}),transparent)`,
            animation: `streak ${s.dur}s ${s.del}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: (name: string, color: KnightColor) => void }) {
  const [phase, setPhase] = useState(0);
  const [name, setName] = useState('');
  const [colorId, setColorId] = useState<KnightColor>('cyan');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          borderBottom: `2px solid ${phase === 0 ? 'var(--border)' : 'var(--cyan)'}`,
          background: 'rgba(2,11,24,.88)',
          backdropFilter: 'blur(12px)',
          flexShrink: 0,
        }}
      >
        {phase > 0 ? (
          <button className="px-btn btn-ghost" onClick={() => setPhase((p) => p - 1)} style={{ fontSize: 8, padding: '8px 14px' }}>
            ← BACK
          </button>
        ) : (
          <div style={{ width: 88 }} />
        )}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(10px,1.5vw,14px)', color: 'var(--cyan)', letterSpacing: 6, textShadow: '0 0 14px rgba(0,212,255,.5)' }}>
            CYBER
          </span>
          <span
            style={{ fontSize: 'clamp(10px,1.5vw,14px)', color: 'var(--gold)', letterSpacing: 6, textShadow: '0 0 14px rgba(255,215,0,.4)', marginLeft: 6 }}
          >
            HEROES
          </span>
        </div>
        <div style={{ width: 88, textAlign: 'right', fontSize: 7, color: 'var(--dim)' }}>{phase > 0 && `${phase} / 2`}</div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 32px', overflow: 'hidden' }}>
        {phase === 0 && (
          <div
            style={{
              animation: 'up-in .5s ease',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(24px,4vw,60px)',
              alignItems: 'center',
              maxWidth: 1100,
              width: '100%',
            }}
          >
            <div>
              <div style={{ lineHeight: 1.05, marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 'clamp(36px,6.5vw,72px)',
                    color: 'var(--cyan)',
                    letterSpacing: 8,
                    animation: 'glow-text 2.5s ease-in-out infinite',
                    textShadow: '0 0 40px rgba(0,212,255,.6),0 2px 0 rgba(0,0,0,.8)',
                  }}
                >
                  CYBER
                </div>
                <div
                  style={{
                    fontSize: 'clamp(36px,6.5vw,72px)',
                    color: 'var(--gold)',
                    letterSpacing: 8,
                    animation: 'glow-text 2.5s ease-in-out infinite',
                    animationDelay: '.5s',
                    textShadow: '0 0 40px rgba(255,215,0,.5),0 2px 0 rgba(0,0,0,.8)',
                  }}
                >
                  HEROES
                </div>
              </div>
              <div style={{ height: 3, marginBottom: 28, maxWidth: 340, background: 'linear-gradient(90deg,var(--cyan),var(--purple) 60%,transparent)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
                {['Cybersecurity Quests', 'Internet Safety Training', 'Safe AI Wisdom'].map((label) => (
                  <div key={label} style={{ fontSize: 'clamp(10px,1.3vw,14px)', color: 'var(--text)', letterSpacing: 2 }}>
                    {label}
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,.07)', maxWidth: 320, marginBottom: 36 }} />
              <button
                className="px-btn btn-gold"
                onClick={() => setPhase(1)}
                style={{ boxShadow: '0 0 30px rgba(255,215,0,.25),0 4px 0 #8a6000' }}
              >
                ▶ &nbsp;START QUEST
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'radial-gradient(circle,rgba(0,100,180,.25) 0%,rgba(0,212,255,.08) 40%, transparent 70%)',
                  padding: 20,
                  borderRadius: 8,
                  flex: 1,
                }}
              >
                <Knight size={450} animate color={colorId} />
              </div>
              <div style={{ transform: 'translate(4px, -83px)' }}>
                <PxFrame color="var(--gold)" padding={14}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(8px,1vw,11px)', color: 'var(--gold)', letterSpacing: 3 }}>DATA PROTECTOR</div>
                    <div style={{ fontSize: 'clamp(6px,.8vw,8px)', color: 'var(--dim)', marginTop: 6, letterSpacing: 2 }}>
                      TIME-LOST KNIGHT
                    </div>
                  </div>
                </PxFrame>
              </div>
            </div>
          </div>
        )}

        {phase === 1 && (
          <div style={{ maxWidth: 820, width: '100%', animation: 'up-in .4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg,transparent,var(--gold))' }} />
              <div style={{ fontSize: 'clamp(10px,1.3vw,13px)', color: 'var(--gold)', letterSpacing: 4, whiteSpace: 'nowrap' }}>
                ✦ &nbsp;THE STORY SO FAR&nbsp; ✦
              </div>
              <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg,var(--gold),transparent)' }} />
            </div>

            <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <Knight size={160} animate color={colorId} />
                <PxFrame color="var(--cyan)" padding={10}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(7px,1vw,9px)', color: 'var(--cyan)', letterSpacing: 2 }}>DATA PROTECTOR</div>
                    <div style={{ fontSize: 'clamp(5px,.7vw,7px)', color: 'var(--dim)', marginTop: 5 }}>YEAR: ???</div>
                  </div>
                </PxFrame>
              </div>

              <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  {
                    col: 'var(--cyan)',
                    text: (
                      <>
                        I am <span style={{ color: 'var(--gold)' }}>Data Protector</span>, noble knight of the Kingdom of Analogia! My
                        wizard's time machine hath malfunctioned spectacularly...
                      </>
                    ),
                  },
                  {
                    col: 'var(--purple)',
                    text: (
                      <>
                        I am surrounded by glowing rectangles, invisible messages, and mysterious creatures called{' '}
                        <span style={{ color: 'var(--purple)' }}>«AI»</span>!
                      </>
                    ),
                  },
                  {
                    col: 'var(--green)',
                    text: (
                      <>
                        Wilt thou join me on a quest to master this digital realm? Together we shall become true{' '}
                        <span style={{ color: 'var(--cyan)' }}>CYBERHEROES!</span>
                      </>
                    ),
                  },
                ].map(({ col, text }, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--surf)',
                      border: `3px solid ${col}`,
                      padding: '22px 26px',
                      position: 'relative',
                      animation: `up-in .4s ${i * 0.15}s ease both`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: -15,
                        top: 22,
                        width: 0,
                        height: 0,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderRight: `15px solid ${col}`,
                      }}
                    />
                    <div style={{ position: 'absolute', top: -12, left: 14, background: 'var(--bg)', padding: '2px 8px', border: `2px solid ${col}` }}>
                      <span style={{ fontSize: 'clamp(6px,.8vw,7px)', color: col, letterSpacing: 2 }}>⚔ DATA PROTECTOR</span>
                    </div>
                    <div style={{ fontSize: 'clamp(10px,1.2vw,12px)', lineHeight: 2.1, color: 'var(--text)' }}>{text}</div>
                  </div>
                ))}
                <div style={{ textAlign: 'right', marginTop: 4 }}>
                  <button className="px-btn btn-primary" onClick={() => setPhase(2)} style={{ padding: '14px 28px', fontSize: 11 }}>
                    I'LL HELP! →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div style={{ textAlign: 'center', animation: 'up-in .4s ease', maxWidth: 500, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: -24,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(0,212,255,.12) 0%,transparent 70%)',
                  }}
                />
                <Knight size={190} animate color={colorId} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(11px,1.5vw,15px)', color: 'var(--cyan)', letterSpacing: 3, marginBottom: 8, lineHeight: 1.8 }}>
              WHAT IS THY NAME,
            </div>
            <div style={{ fontSize: 'clamp(11px,1.5vw,15px)', color: 'var(--cyan)', letterSpacing: 3, marginBottom: 16, lineHeight: 1.8 }}>
              BRAVE HERO?
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 'clamp(6px,.9vw,8px)', color: 'var(--dim)', letterSpacing: 3, marginBottom: 12 }}>CHOOSE YOUR COLOR</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {(Object.keys(KNIGHT_PRESETS) as KnightColor[]).map((id) => {
                  const preset = KNIGHT_PRESETS[id];
                  const active = colorId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setColorId(id)}
                      style={{
                        fontFamily: "'Press Start 2P',monospace",
                        fontSize: 7,
                        cursor: 'pointer',
                        padding: '8px 10px',
                        border: active ? `2px solid rgba(${preset.rgb},1)` : '2px solid var(--border)',
                        background: active ? `rgba(${preset.rgb},0.18)` : 'var(--surf)',
                        color: active ? `rgba(${preset.rgb},1)` : 'var(--dim)',
                        letterSpacing: 1,
                        transition: 'all .15s',
                        boxShadow: active ? `0 0 10px rgba(${preset.rgb},.4)` : 'none',
                      }}
                    >
                      {COLOR_LABELS[id]}
                    </button>
                  );
                })}
              </div>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 12))}
              placeholder="Enter your name..."
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart(name.trim(), colorId)}
              style={{
                background: 'var(--surf)',
                border: '3px solid var(--cyan)',
                color: 'var(--text)',
                fontFamily: "'Press Start 2P',monospace",
                fontSize: 'clamp(12px,1.6vw,16px)',
                padding: '16px 20px',
                width: '100%',
                outline: 'none',
                textAlign: 'center',
                marginBottom: 20,
                display: 'block',
                boxShadow: '0 0 24px rgba(0,212,255,.2),inset 0 0 20px rgba(0,212,255,.04)',
              }}
            />
            <button
              className="px-btn btn-gold"
              disabled={!name.trim()}
              onClick={() => onStart(name.trim(), colorId)}
              style={{
                opacity: name.trim() ? 1 : 0.3,
                width: '100%',
                padding: '20px',
                fontSize: 'clamp(12px,1.5vw,15px)',
                boxShadow: name.trim() ? '0 0 24px rgba(255,215,0,.25),0 4px 0 #8a6000' : 'none',
              }}
            >
              ⚔️ &nbsp;LET'S GO!
            </button>
            <div style={{ marginTop: 16, fontSize: 'clamp(6px,.9vw,8px)', color: 'var(--dim)', lineHeight: 2 }}>
              Your progress saves automatically
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntroPage() {
  const navigate = useNavigate();

  const handleStart = (name: string, color: KnightColor) => {
    try {
      localStorage.setItem('cyberheroes.hero', JSON.stringify({ name, color }));
    } catch {
      // localStorage unavailable (e.g. private mode) — non-fatal, just skip persistence.
    }
    navigate('/map');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <StarField />
      <div className="vignette" />
      <IntroScreen onStart={handleStart} />
    </div>
  );
}
