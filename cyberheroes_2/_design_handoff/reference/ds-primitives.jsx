/* ═══════════════════════════════════════════════
   CYBERHEROES — primitives & atoms
═══════════════════════════════════════════════ */

/* PixelFrame: classic 8-bit bevel corners */
function PxFrame({color='var(--cyan)', children, style={}, padding=18}) {
  const t = 7;
  return (
    <div style={{position:'relative', ...style}}>
      {[
        {top:0,left:0},{top:0,right:0},
        {bottom:0,left:0},{bottom:0,right:0}
      ].map((p,i) => (
        <div key={i} style={{position:'absolute',background:color,width:t,height:t,...p,zIndex:2}}/>
      ))}
      <div style={{position:'absolute',top:0,left:t,right:t,height:2,background:color}}/>
      <div style={{position:'absolute',bottom:0,left:t,right:t,height:2,background:color}}/>
      <div style={{position:'absolute',left:0,top:t,bottom:t,width:2,background:color}}/>
      <div style={{position:'absolute',right:0,top:t,bottom:t,width:2,background:color}}/>
      <div style={{padding}}>{children}</div>
    </div>
  );
}

/* Knight sprite — themable glow */
const KNIGHT_PRESETS = {
  cyan:   { rgb:'0,180,255',  filter:'brightness(1.4) contrast(1.1)' },
  purple: { rgb:'160,80,255', filter:'brightness(1.3) contrast(1.1) hue-rotate(195deg) saturate(1.4)' },
  green:  { rgb:'0,255,120',  filter:'brightness(1.4) contrast(1.1) hue-rotate(100deg) saturate(1.3)' },
  red:    { rgb:'255,60,80',  filter:'brightness(1.4) contrast(1.1) hue-rotate(300deg) saturate(1.5)' },
  gold:   { rgb:'255,200,0',  filter:'brightness(1.5) contrast(1.1) hue-rotate(248deg) saturate(1.6)' },
  white:  { rgb:'200,220,255',filter:'brightness(1.8) contrast(.9) saturate(.1)' },
};
function Knight({size=48, animate=true, flip=false, color='cyan'}) {
  const p = KNIGHT_PRESETS[color] || KNIGHT_PRESETS.cyan;
  return (
    <img src="knight.png" alt="" style={{
      width:size, height:size, imageRendering:'pixelated', display:'block',
      transform: flip ? 'scaleX(-1)' : 'none',
      filter:`${p.filter} drop-shadow(0 0 ${size*.08}px rgba(${p.rgb},.7)) drop-shadow(0 0 ${size*.16}px rgba(${p.rgb},.35))`,
      animation: animate ? 'float 3s ease-in-out infinite' : 'none',
    }}/>
  );
}

/* XP Badge */
function XPBadge({xp, color='gold'}) {
  const map = {
    gold:{c:'var(--gold)', rgb:'255,215,0'},
    cyan:{c:'var(--cyan)', rgb:'0,212,255'},
    green:{c:'var(--green)', rgb:'0,255,136'},
  };
  const m = map[color];
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:8,
      background:`rgba(${m.rgb},.12)`,border:`2px solid ${m.c}`,
      padding:'6px 12px',fontSize:8,color:m.c,letterSpacing:2,
    }}>
      <span style={{fontSize:11,lineHeight:1}}>★</span>
      <span>+{xp} XP</span>
    </span>
  );
}

/* Progress Bar — pixel notched */
function ProgressBar({value=0, max=100, color='var(--cyan)', label, height=12}) {
  const pct = Math.max(0, Math.min(100, Math.round((value/max)*100)));
  return (
    <div>
      {label && (
        <div style={{display:'flex',justifyContent:'space-between',
          marginBottom:8,fontSize:7,color:'var(--dim)',letterSpacing:2}}>
          <span>{label}</span><span style={{color}}>{pct}%</span>
        </div>
      )}
      <div style={{position:'relative',height,background:'var(--surf2)',
        border:'2px solid var(--border)'}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,
          boxShadow:`0 0 10px ${color}`,transition:'width .5s ease'}}/>
        {/* notches */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',
          background:'repeating-linear-gradient(90deg,transparent,transparent 5%,rgba(0,0,0,.25) 5%,rgba(0,0,0,.25) calc(5% + 1px))'}}/>
      </div>
    </div>
  );
}

/* HP / Stat row */
function StatRow({label, value, max, color='var(--green)', icon='♥'}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <span style={{fontSize:11,color}}>{icon}</span>
      <span style={{fontSize:7,color:'var(--dim)',letterSpacing:2,minWidth:46}}>{label}</span>
      <div style={{flex:1}}>
        <ProgressBar value={value} max={max} color={color} height={8}/>
      </div>
      <span style={{fontSize:7,color,letterSpacing:1,minWidth:48,textAlign:'right'}}>
        {value}/{max}
      </span>
    </div>
  );
}

/* Pixel chip / tag */
function Chip({children, color='cyan', solid=false, icon}) {
  const colors = {
    cyan:{c:'var(--cyan)',rgb:'0,212,255'},
    gold:{c:'var(--gold)',rgb:'255,215,0'},
    green:{c:'var(--green)',rgb:'0,255,136'},
    purple:{c:'var(--purple)',rgb:'124,58,237'},
    red:{c:'var(--red)',rgb:'255,64,85'},
    dim:{c:'var(--dim)',rgb:'74,96,128'},
  };
  const m = colors[color] || colors.cyan;
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:6,
      fontSize:7,letterSpacing:2,padding:'5px 10px',
      background: solid ? m.c : `rgba(${m.rgb},.12)`,
      color: solid ? '#000' : m.c,
      border:`2px solid ${m.c}`,
    }}>
      {icon && <span style={{fontSize:9,lineHeight:1}}>{icon}</span>}
      {children}
    </span>
  );
}

/* Inline pixel code */
function InlineCode({children, color='var(--cyan)'}) {
  return (
    <code style={{
      background:'rgba(0,212,255,.12)',border:'1px solid rgba(0,212,255,.35)',
      padding:'2px 8px',fontSize:'.85em',color,
      fontFamily:'var(--font)',whiteSpace:'nowrap',
    }}>{children}</code>
  );
}

/* Section header within content */
function ContentTitle({eyebrow, title, accent='var(--cyan)'}) {
  return (
    <div style={{marginBottom:24}}>
      {eyebrow && (
        <div style={{fontSize:7,color:'var(--dim)',letterSpacing:5,
          marginBottom:8,textTransform:'uppercase'}}>{eyebrow}</div>
      )}
      <div style={{fontSize:'clamp(14px,2vw,20px)',color:'var(--text)',
        letterSpacing:2,lineHeight:1.6}}>
        {title}
      </div>
      <div style={{height:2,marginTop:14,maxWidth:120,
        background:`linear-gradient(90deg,${accent},transparent)`}}/>
    </div>
  );
}

window.PxFrame = PxFrame;
window.Knight = Knight;
window.XPBadge = XPBadge;
window.ProgressBar = ProgressBar;
window.StatRow = StatRow;
window.Chip = Chip;
window.InlineCode = InlineCode;
window.ContentTitle = ContentTitle;
window.KNIGHT_PRESETS = KNIGHT_PRESETS;
