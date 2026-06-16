/* ═══════════════════════════════════════════════
   CYBERHEROES — lesson page layout
═══════════════════════════════════════════════ */

const {useState: useStateLP} = React;

/* Lesson page header — title, progress, XP */
function LessonHeader({chapter, chapterNum, lessonTitle, currentStep, totalSteps, totalXP=0}) {
  return (
    <div style={{
      borderBottom:'2px solid var(--border)',
      padding:'16px 24px',
      background:'rgba(2,11,24,.85)',backdropFilter:'blur(8px)',
      display:'flex',alignItems:'center',gap:18,flexWrap:'wrap',
    }}>
      <button className="px-btn btn-ghost btn-sm">← MAP</button>
      <div style={{flex:1,minWidth:200}}>
        <div style={{fontSize:6,color:'var(--dim)',letterSpacing:3,marginBottom:6}}>
          CHAPTER {chapterNum} ▸ {chapter}
        </div>
        <div style={{fontSize:'clamp(10px,1.4vw,13px)',color:'var(--cyan)',letterSpacing:2}}>
          {lessonTitle}
        </div>
      </div>
      <div style={{minWidth:180}}>
        <window.ProgressBar
          value={currentStep} max={totalSteps}
          color="var(--cyan)"
          label={`STEP ${currentStep}/${totalSteps}`}/>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,
        fontSize:9,color:'var(--gold)',letterSpacing:2}}>
        <span style={{fontSize:11}}>★</span>
        <span>{totalXP}</span>
      </div>
    </div>
  );
}

function LessonFooter({onPrev, onNext, canPrev=true, canNext=true, nextLabel='NEXT'}) {
  return (
    <div style={{
      borderTop:'2px solid var(--border)',
      padding:'18px 24px',
      background:'rgba(2,11,24,.85)',backdropFilter:'blur(8px)',
      display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,
    }}>
      <button className="px-btn btn-ghost"
        onClick={onPrev} disabled={!canPrev}>← BACK</button>
      <div style={{display:'flex',gap:6}}>
        {[0,1,2,3].map(i => (
          <span key={i} style={{
            width:8,height:8,
            background: i < 2 ? 'var(--cyan)' : 'var(--border)',
          }}/>
        ))}
      </div>
      <button className="px-btn btn-primary"
        onClick={onNext} disabled={!canNext}>{nextLabel} →</button>
    </div>
  );
}

function LessonBody({children}) {
  return (
    <div style={{maxWidth:760,margin:'0 auto',padding:'40px 24px',
      display:'flex',flexDirection:'column',gap:24}}>
      {children}
    </div>
  );
}

function LessonHero({eyebrow, title, knightColor='cyan', accent='var(--cyan)', children}) {
  return (
    <div style={{
      background:'linear-gradient(135deg,rgba(0,212,255,.06),rgba(124,58,237,.06))',
      border:`2px solid ${accent}`,
      padding:'32px 28px',
      display:'grid',gridTemplateColumns:'auto 1fr',
      gap:28,alignItems:'center',
    }}>
      <window.Knight size={72} color={knightColor}/>
      <div>
        {eyebrow && (
          <div style={{fontSize:7,color:'var(--dim)',letterSpacing:5,marginBottom:10}}>
            {eyebrow}
          </div>
        )}
        <div style={{fontSize:'clamp(14px,2.2vw,20px)',color:accent,letterSpacing:3,lineHeight:1.5}}>
          {title}
        </div>
        {children && (
          <div style={{fontSize:'clamp(9px,1.2vw,11px)',color:'var(--text)',
            lineHeight:2.2,marginTop:14}}>{children}</div>
        )}
      </div>
    </div>
  );
}

function LessonSection({number, title, children}) {
  return (
    <section style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        {number != null && (
          <div style={{
            width:32,height:32,flexShrink:0,
            background:'var(--cyan)',color:'#000',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:11,letterSpacing:1,
          }}>{number}</div>
        )}
        <div style={{fontSize:'clamp(11px,1.5vw,14px)',color:'var(--cyan)',letterSpacing:2}}>
          {title}
        </div>
        <div style={{flex:1,height:2,background:'linear-gradient(90deg,var(--cyan),transparent)'}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:18,paddingLeft:46}}>
        {children}
      </div>
    </section>
  );
}

function LessonText({children}) {
  return (
    <p style={{fontSize:'clamp(10px,1.3vw,12px)',
      color:'var(--text)',lineHeight:2.4,letterSpacing:.5}}>
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════
   CONVERSATIONAL LESSON — knight & mage
═══════════════════════════════════════════════ */

const MAGE = {
  name:'MERLINUS THE WISE',
  title:'Sage of the Digital Realm',
  color:'var(--purple)', rgb:'124,58,237',
  accent:'#1a0a2e', skin:'#e0c8a8',
  robe:'#3d1a7a', trim:'#a78bfa', orb:'#d8b4fe',
};

/* Pixel-art mage portrait */
function MagePortrait({size=120, animate=true, flip=false}) {
  const m = MAGE;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}
      style={{
        imageRendering:'pixelated',
        filter:`drop-shadow(0 0 ${size*.06}px rgba(${m.rgb},.6)) drop-shadow(0 0 ${size*.12}px rgba(${m.rgb},.3))`,
        animation: animate ? 'float 3.5s ease-in-out infinite' : 'none',
        display:'block',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}>
      <circle cx="32" cy="32" r="30" fill={`rgba(${m.rgb},.08)`}/>
      {/* robe body */}
      <rect x="14" y="34" width="36" height="26" fill={m.robe}/>
      <rect x="12" y="38" width="2" height="22" fill={m.robe}/>
      <rect x="50" y="38" width="2" height="22" fill={m.robe}/>
      <rect x="14" y="58" width="36" height="2" fill={m.trim}/>
      <rect x="30" y="34" width="4" height="26" fill={m.accent}/>
      {/* sleeves */}
      <rect x="8"  y="38" width="6" height="14" fill={m.robe}/>
      <rect x="50" y="38" width="6" height="14" fill={m.robe}/>
      <rect x="8"  y="50" width="6" height="2"  fill={m.trim}/>
      <rect x="50" y="50" width="6" height="2"  fill={m.trim}/>
      {/* face */}
      <rect x="22" y="22" width="20" height="14" fill={m.skin}/>
      <rect x="20" y="24" width="2"  height="10" fill={m.skin}/>
      <rect x="42" y="24" width="2"  height="10" fill={m.skin}/>
      {/* eyes */}
      <rect x="25" y="27" width="3" height="3" fill={m.trim}/>
      <rect x="36" y="27" width="3" height="3" fill={m.trim}/>
      <rect x="25" y="27" width="3" height="1" fill="#fff"/>
      <rect x="36" y="27" width="3" height="1" fill="#fff"/>
      <rect x="31" y="30" width="2" height="2" fill={m.accent} opacity=".5"/>
      {/* long beard */}
      <rect x="22" y="34" width="20" height="10" fill="#e8e0d0"/>
      <rect x="20" y="36" width="2"  height="8"  fill="#e8e0d0"/>
      <rect x="42" y="36" width="2"  height="8"  fill="#e8e0d0"/>
      <rect x="24" y="44" width="16" height="2"  fill="#d0c8b8"/>
      <rect x="26" y="46" width="12" height="2"  fill="#d0c8b8"/>
      <rect x="28" y="48" width="8"  height="3"  fill="#c0b8a8"/>
      {/* pointed wizard hat */}
      <polygon points="20,22 32,2 44,22" fill={m.robe}/>
      <polygon points="22,22 32,6 42,22" fill={m.accent}/>
      <rect x="20" y="20" width="24" height="3" fill={m.trim}/>
      <rect x="30" y="4"  width="4"  height="2" fill={m.trim}/>
      <rect x="29" y="2"  width="6"  height="2" fill={m.orb}/>
      {/* staff with orb */}
      <rect x="6"  y="34" width="2" height="30" fill={m.accent}/>
      <rect x="4"  y="30" width="6" height="6" fill={m.orb}/>
      <rect x="3"  y="31" width="1" height="4" fill={m.orb} opacity=".7"/>
      <rect x="10" y="31" width="1" height="4" fill={m.orb} opacity=".7"/>
      <rect x="2"  y="29" width="1" height="2" fill={m.orb} opacity=".5"/>
      <rect x="11" y="29" width="1" height="2" fill={m.orb} opacity=".5"/>
    </svg>
  );
}

/* Single conversation turn — knight or mage on a side */
function ConvoTurn({speaker='knight', side='left', knightColor='cyan', children, active=true}) {
  const isKnight = speaker === 'knight';
  const color = isKnight
    ? (window.KNIGHT_PRESETS[knightColor]?.rgb
        ? `rgb(${window.KNIGHT_PRESETS[knightColor].rgb})`
        : 'var(--cyan)')
    : MAGE.color;
  const name = isKnight ? 'DATA PROTECTOR' : MAGE.name;

  return (
    <div style={{
      display:'flex',
      flexDirection: side==='right' ? 'row-reverse' : 'row',
      gap:18,alignItems:'flex-start',
      opacity: active ? 1 : .35,
      transition:'opacity .3s',
      animation: active ? 'up-in .4s ease' : 'none',
    }}>
      <div style={{flexShrink:0,paddingTop:6}}>
        {isKnight
          ? <window.Knight size={84} color={knightColor} flip={side==='right'} animate={active}/>
          : <MagePortrait size={84} flip={side==='right'} animate={active}/>}
      </div>
      <div style={{flex:1,minWidth:0,position:'relative',
        background:'var(--surf)',
        border:`3px solid ${color}`,
        padding:'18px 22px',marginTop:14,
      }}>
        <div style={{
          position:'absolute',top:14,
          ...(side==='left' ? {left:-13} : {right:-13}),
          width:0,height:0,
          borderTop:'8px solid transparent',
          borderBottom:'8px solid transparent',
          ...(side==='left'
            ? {borderRight:`13px solid ${color}`}
            : {borderLeft:`13px solid ${color}`}),
        }}/>
        <div style={{
          position:'absolute',top:-12,
          ...(side==='left' ? {left:14} : {right:14}),
          background:'var(--bg)',padding:'3px 10px',
          border:`2px solid ${color}`,
        }}>
          <span style={{fontSize:7,color,letterSpacing:2}}>
            {isKnight ? '⚔' : '✦'} {name}
          </span>
        </div>
        <div style={{fontSize:'clamp(10px,1.3vw,12px)',
          lineHeight:2.3,color:'var(--text)',marginTop:4,letterSpacing:.5}}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Full conversational lesson — knight on left, mage on right */
function ConvoLesson({topic='', knightColor='cyan', turns=[], onComplete}) {
  const [revealed, setRevealed] = useStateLP(1);
  const done = revealed >= turns.length;

  return (
    <div style={{
      background:'linear-gradient(180deg,rgba(0,212,255,.04),rgba(124,58,237,.04) 60%,transparent)',
      border:'2px solid var(--purple)',
      padding:'28px 24px',
    }}>
      {/* header */}
      <div style={{
        display:'flex',alignItems:'center',gap:14,marginBottom:24,
        paddingBottom:16,borderBottom:'2px solid rgba(124,58,237,.3)',
      }}>
        <div style={{flex:1,height:2,
          background:'linear-gradient(90deg,transparent,var(--cyan))'}}/>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:6,color:'var(--dim)',letterSpacing:4,marginBottom:6}}>
            ⚔ KNIGHT &amp; MAGE ✦
          </div>
          <div style={{fontSize:'clamp(11px,1.5vw,14px)',color:'var(--gold)',letterSpacing:3}}>
            {topic}
          </div>
        </div>
        <div style={{flex:1,height:2,
          background:'linear-gradient(90deg,var(--purple),transparent)'}}/>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:24,marginBottom:24}}>
        {turns.slice(0, revealed).map((t, i) => {
          // Knight always on left, Mage always on right
          const side = t.speaker === 'knight' ? 'left' : 'right';
          return (
            <ConvoTurn key={i}
              speaker={t.speaker} side={side}
              knightColor={knightColor}
              active={i === revealed - 1 || done}>
              {t.content}
            </ConvoTurn>
          );
        })}
      </div>

      <div style={{display:'flex',justifyContent:'center'}}>
        {done ? (
          <button className="px-btn btn-gold"
            onClick={() => onComplete && onComplete()}>
            ⚔ CONTINUE QUEST →
          </button>
        ) : (
          <button className="px-btn btn-primary"
            onClick={() => setRevealed(r => Math.min(r+1, turns.length))}>
            ▼ THEY SPEAK ON ({revealed} / {turns.length})
          </button>
        )}
      </div>
    </div>
  );
}

window.LessonHeader = LessonHeader;
window.LessonFooter = LessonFooter;
window.LessonBody = LessonBody;
window.LessonHero = LessonHero;
window.LessonSection = LessonSection;
window.LessonText = LessonText;
window.MagePortrait = MagePortrait;
window.ConvoTurn = ConvoTurn;
window.ConvoLesson = ConvoLesson;
window.MAGE = MAGE;
