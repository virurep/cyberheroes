/* ═══════════════════════════════════════════════
   CYBERHEROES — text boxes
═══════════════════════════════════════════════ */

const TEXT_BOX_TYPES = {
  info:    { color:'var(--cyan)',   icon:'ℹ', label:'INFO',    bg:'rgba(0,212,255,.07)',  rgb:'0,212,255' },
  tip:     { color:'var(--green)',  icon:'★', label:'PRO TIP', bg:'rgba(0,255,136,.07)',  rgb:'0,255,136' },
  warning: { color:'var(--orange)', icon:'⚠', label:'WARNING', bg:'rgba(255,140,0,.07)',  rgb:'255,140,0' },
  danger:  { color:'var(--red)',    icon:'✖', label:'DANGER',  bg:'rgba(255,64,85,.08)',  rgb:'255,64,85' },
  quest:   { color:'var(--gold)',   icon:'⚔', label:'QUEST',   bg:'rgba(255,215,0,.08)',  rgb:'255,215,0' },
  secret:  { color:'var(--purple)', icon:'◆', label:'SECRET',  bg:'rgba(124,58,237,.10)', rgb:'124,58,237' },
};

/* Standard alert / callout box */
function TextBox({type='info', title, children, animate=false}) {
  const c = TEXT_BOX_TYPES[type];
  return (
    <div style={{
      background:c.bg,
      border:`2px solid ${c.color}`,
      borderLeft:`6px solid ${c.color}`,
      padding:'18px 22px',
      animation: animate ? 'up-in .4s ease' : 'none',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:10,
        marginBottom: children ? 10 : 0}}>
        <span style={{fontSize:14,color:c.color,lineHeight:1}}>{c.icon}</span>
        <span style={{fontSize:8,color:c.color,letterSpacing:3}}>
          {title || c.label}
        </span>
      </div>
      {children && (
        <div style={{fontSize:'clamp(9px,1.2vw,11px)',
          lineHeight:2.2,color:'var(--text)',paddingLeft:24,letterSpacing:.5}}>
          {children}
        </div>
      )}
    </div>
  );
}

/* Dialogue / speech bubble — the knight talks */
function DialogueBox({speaker='DATA PROTECTOR', children, knightColor='cyan', side='left'}) {
  const p = window.KNIGHT_PRESETS[knightColor] || window.KNIGHT_PRESETS.cyan;
  const colVar = `rgb(${p.rgb})`;

  return (
    <div style={{display:'flex',gap:18,alignItems:'flex-start',
      flexDirection: side==='right' ? 'row-reverse' : 'row'}}>
      <div style={{flexShrink:0,paddingTop:8}}>
        <window.Knight size={56} color={knightColor} flip={side==='right'}/>
      </div>
      <div style={{flex:1,position:'relative',background:'var(--surf)',
        border:`3px solid ${colVar}`,padding:'20px 22px'}}>
        {/* arrow */}
        <div style={{
          position:'absolute',top:18,
          ...(side==='left' ? {left:-13} : {right:-13}),
          width:0,height:0,
          borderTop:'8px solid transparent',
          borderBottom:'8px solid transparent',
          ...(side==='left'
            ? {borderRight:`13px solid ${colVar}`}
            : {borderLeft:`13px solid ${colVar}`}),
        }}/>
        {/* speaker tag */}
        <div style={{position:'absolute',top:-12,
          ...(side==='left' ? {left:14} : {right:14}),
          background:'var(--bg)',padding:'3px 10px',
          border:`2px solid ${colVar}`}}>
          <span style={{fontSize:7,color:colVar,letterSpacing:2}}>⚔ {speaker}</span>
        </div>
        <div style={{fontSize:'clamp(10px,1.3vw,12px)',
          lineHeight:2.2,color:'var(--text)',marginTop:2}}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Key term — vocabulary callout */
function KeyTerm({term, children}) {
  return (
    <div style={{
      display:'flex',gap:18,alignItems:'flex-start',
      background:'rgba(124,58,237,.10)',
      border:'2px solid var(--purple)',
      padding:'18px 20px',
    }}>
      <div style={{flexShrink:0,minWidth:70,textAlign:'center'}}>
        <div style={{
          background:'var(--purple)',color:'#fff',
          fontSize:6,letterSpacing:2,padding:'4px 8px',marginBottom:4,
        }}>NEW WORD</div>
        <div style={{fontSize:9,color:'var(--purple)',letterSpacing:1}}>◆◆◆</div>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color:'var(--gold)',letterSpacing:2,marginBottom:8}}>
          {term}
        </div>
        <div style={{fontSize:'clamp(9px,1.2vw,11px)',
          color:'var(--text)',lineHeight:2.2}}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Quote / Wisdom box */
function QuoteBox({author, children}) {
  return (
    <div style={{
      position:'relative',padding:'24px 32px',
      background:'rgba(255,215,0,.05)',
      borderTop:'2px solid var(--gold)',
      borderBottom:'2px solid var(--gold)',
    }}>
      <div style={{position:'absolute',top:-8,left:24,
        background:'var(--bg)',padding:'0 8px',color:'var(--gold)',fontSize:14}}>"</div>
      <div style={{position:'absolute',bottom:-8,right:24,
        background:'var(--bg)',padding:'0 8px',color:'var(--gold)',fontSize:14}}>"</div>
      <div style={{fontSize:'clamp(10px,1.3vw,13px)',
        color:'var(--text)',lineHeight:2.4,fontStyle:'italic',marginBottom:12}}>
        {children}
      </div>
      {author && (
        <div style={{fontSize:7,color:'var(--gold)',letterSpacing:3,textAlign:'right'}}>
          — {author}
        </div>
      )}
    </div>
  );
}

/* Step callout — for instructions */
function StepBox({step, total, title, children}) {
  return (
    <div style={{
      background:'var(--surf)',border:'2px solid var(--cyan)',
      padding:'18px 20px 18px 64px',position:'relative',
    }}>
      <div style={{
        position:'absolute',left:-2,top:-2,bottom:-2,width:50,
        background:'var(--cyan)',color:'#000',
        display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',gap:2,
      }}>
        <div style={{fontSize:6,letterSpacing:2}}>STEP</div>
        <div style={{fontSize:14}}>{step}</div>
        {total && <div style={{fontSize:6,opacity:.7}}>of {total}</div>}
      </div>
      {title && (
        <div style={{fontSize:10,color:'var(--cyan)',letterSpacing:2,marginBottom:10}}>
          {title}
        </div>
      )}
      <div style={{fontSize:'clamp(9px,1.2vw,11px)',
        color:'var(--text)',lineHeight:2.2}}>
        {children}
      </div>
    </div>
  );
}

window.TextBox = TextBox;
window.DialogueBox = DialogueBox;
window.KeyTerm = KeyTerm;
window.QuoteBox = QuoteBox;
window.StepBox = StepBox;
window.TEXT_BOX_TYPES = TEXT_BOX_TYPES;
