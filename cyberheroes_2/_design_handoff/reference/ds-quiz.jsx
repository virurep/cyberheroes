/* ═══════════════════════════════════════════════
   CYBERHEROES — quiz components
═══════════════════════════════════════════════ */

const {useState, useRef, useEffect, useCallback} = React;

/* ────────────────────────────────────────────────
   QuizQuestion — multiple choice (single answer)
──────────────────────────────────────────────── */
function QuizQuestion({question, options, correct, xp=10, onComplete}) {
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (picked == null) return;
    setSubmitted(true);
    onComplete && onComplete(picked === correct);
  };

  const reset = () => { setPicked(null); setSubmitted(false); };

  return (
    <div style={{background:'var(--surf)',border:'3px solid var(--cyan)',padding:0}}>
      {/* header */}
      <div style={{
        display:'flex',justifyContent:'space-between',alignItems:'center',
        background:'rgba(0,212,255,.1)',
        borderBottom:'2px solid var(--cyan)',
        padding:'10px 18px',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{color:'var(--cyan)',fontSize:11}}>?</span>
          <span style={{fontSize:8,color:'var(--cyan)',letterSpacing:3}}>QUESTION</span>
        </div>
        <window.XPBadge xp={xp}/>
      </div>

      <div style={{padding:'24px 22px'}}>
        <div style={{fontSize:'clamp(11px,1.5vw,14px)',color:'var(--text)',
          lineHeight:2,marginBottom:24,letterSpacing:1}}>
          {question}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
          {options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === correct;
            let borderColor = 'var(--border)';
            let bg = 'var(--surf2)';
            let labelColor = 'var(--dim)';

            if (submitted) {
              if (isCorrect) { borderColor = 'var(--green)'; bg = 'rgba(0,255,136,.1)'; labelColor = 'var(--green)'; }
              else if (isPicked) { borderColor = 'var(--red)'; bg = 'rgba(255,64,85,.1)'; labelColor = 'var(--red)'; }
            } else if (isPicked) {
              borderColor = 'var(--cyan)'; bg = 'rgba(0,212,255,.1)'; labelColor = 'var(--cyan)';
            }

            return (
              <button key={i} disabled={submitted}
                onClick={() => !submitted && setPicked(i)}
                style={{
                  display:'flex',alignItems:'center',gap:14,
                  padding:'14px 18px',background:bg,
                  border:`2px solid ${borderColor}`,
                  cursor: submitted ? 'default' : 'pointer',
                  fontFamily:'var(--font)',fontSize:'clamp(9px,1.2vw,11px)',
                  color:'var(--text)',textAlign:'left',
                  letterSpacing:1,lineHeight:1.8,
                  transition:'all .15s',
                }}
                onMouseEnter={e=>{if(!submitted&&!isPicked)e.currentTarget.style.borderColor='var(--cyan)'}}
                onMouseLeave={e=>{if(!submitted&&!isPicked)e.currentTarget.style.borderColor='var(--border)'}}>
                <span style={{
                  width:28,height:28,flexShrink:0,
                  border:`2px solid ${labelColor}`,color:labelColor,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:9,
                }}>
                  {submitted && isCorrect ? '✓' :
                   submitted && isPicked && !isCorrect ? '✕' :
                   String.fromCharCode(65 + i)}
                </span>
                <span style={{flex:1}}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* feedback */}
        {submitted && (
          <div style={{animation:'up-in .35s ease',marginBottom:20}}>
            {picked === correct ? (
              <window.TextBox type="tip" title="CORRECT!">
                Well fought, brave hero! You earned <span style={{color:'var(--gold)'}}>+{xp} XP</span>.
              </window.TextBox>
            ) : (
              <window.TextBox type="danger" title="NOT QUITE">
                The correct answer is <span style={{color:'var(--green)'}}>{String.fromCharCode(65+correct)}</span>. Try again!
              </window.TextBox>
            )}
          </div>
        )}

        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          {submitted ? (
            <button className="px-btn btn-ghost" onClick={reset}>↻ TRY AGAIN</button>
          ) : (
            <button className="px-btn btn-primary"
              onClick={submit} disabled={picked==null}>
              SUBMIT ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   SelectAllThatApply — multiple correct answers
──────────────────────────────────────────────── */
function SelectAllThatApply({question, options, correctSet, xp=15, onComplete}) {
  const [picked, setPicked] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const submit = () => {
    setSubmitted(true);
    const correct = correctSet.length === picked.size
      && correctSet.every(i => picked.has(i));
    onComplete && onComplete(correct);
  };
  const reset = () => { setPicked(new Set()); setSubmitted(false); };

  const allCorrect = submitted && correctSet.length === picked.size
    && correctSet.every(i => picked.has(i));

  return (
    <div style={{background:'var(--surf)',border:'3px solid var(--purple)'}}>
      <div style={{
        display:'flex',justifyContent:'space-between',alignItems:'center',
        background:'rgba(124,58,237,.15)',
        borderBottom:'2px solid var(--purple)',
        padding:'10px 18px',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{color:'var(--purple)',fontSize:11}}>◆</span>
          <span style={{fontSize:8,color:'var(--purple)',letterSpacing:3}}>SELECT ALL THAT APPLY</span>
        </div>
        <window.XPBadge xp={xp} color="gold"/>
      </div>

      <div style={{padding:'24px 22px'}}>
        <div style={{fontSize:'clamp(11px,1.5vw,14px)',color:'var(--text)',
          lineHeight:2,marginBottom:14,letterSpacing:1}}>
          {question}
        </div>
        <div style={{fontSize:7,color:'var(--dim)',letterSpacing:2,marginBottom:20}}>
          ▸ MORE THAN ONE MAY BE CORRECT
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
          {options.map((opt, i) => {
            const isPicked = picked.has(i);
            const isCorrect = correctSet.includes(i);
            let borderColor = 'var(--border)';
            let bg = 'var(--surf2)';
            let boxColor = 'var(--dim)';
            let boxBg = 'transparent';

            if (submitted) {
              if (isCorrect && isPicked) { borderColor='var(--green)'; bg='rgba(0,255,136,.1)'; boxColor='var(--green)'; boxBg='var(--green)'; }
              else if (isCorrect && !isPicked) { borderColor='var(--orange)'; bg='rgba(255,140,0,.08)'; boxColor='var(--orange)'; }
              else if (!isCorrect && isPicked) { borderColor='var(--red)'; bg='rgba(255,64,85,.1)'; boxColor='var(--red)'; boxBg='var(--red)'; }
            } else if (isPicked) {
              borderColor='var(--purple)'; bg='rgba(124,58,237,.12)'; boxColor='var(--purple)'; boxBg='var(--purple)';
            }

            return (
              <button key={i} disabled={submitted}
                onClick={() => toggle(i)}
                style={{
                  display:'flex',alignItems:'center',gap:14,
                  padding:'14px 18px',background:bg,
                  border:`2px solid ${borderColor}`,
                  cursor: submitted ? 'default' : 'pointer',
                  fontFamily:'var(--font)',fontSize:'clamp(9px,1.2vw,11px)',
                  color:'var(--text)',textAlign:'left',
                  letterSpacing:1,lineHeight:1.8,
                  transition:'all .15s',
                }}>
                <span style={{
                  width:24,height:24,flexShrink:0,
                  border:`2px solid ${boxColor}`,
                  background: boxBg === 'transparent' ? 'transparent' : boxBg,
                  color:'#000',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:11,
                }}>
                  {((submitted && isCorrect && isPicked) || (!submitted && isPicked)) && '✓'}
                  {submitted && !isCorrect && isPicked && <span style={{color:'#fff'}}>✕</span>}
                  {submitted && isCorrect && !isPicked && <span style={{color:'var(--orange)',fontSize:8}}>!</span>}
                </span>
                <span style={{flex:1}}>{opt}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{animation:'up-in .35s ease',marginBottom:20}}>
            {allCorrect ? (
              <window.TextBox type="tip" title="ALL CORRECT!">
                Mighty work! You spotted every one. <span style={{color:'var(--gold)'}}>+{xp} XP</span>
              </window.TextBox>
            ) : (
              <window.TextBox type="warning" title="ALMOST!">
                Yellow boxes show answers you missed. Red shows wrong picks. Review and try again!
              </window.TextBox>
            )}
          </div>
        )}

        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          {submitted ? (
            <button className="px-btn btn-ghost" onClick={reset}>↻ TRY AGAIN</button>
          ) : (
            <button className="px-btn btn-primary"
              onClick={submit} disabled={picked.size===0}
              style={{background:'var(--purple)',color:'#fff',boxShadow:'0 4px 0 #3d1a7a'}}>
              SUBMIT ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   TrueFalse — quick binary
──────────────────────────────────────────────── */
function TrueFalse({question, answer, xp=5, onComplete}) {
  const [picked, setPicked] = useState(null);
  const submitted = picked != null;
  const correct = submitted && picked === answer;

  return (
    <div style={{background:'var(--surf)',border:'3px solid var(--gold)'}}>
      <div style={{
        display:'flex',justifyContent:'space-between',alignItems:'center',
        background:'rgba(255,215,0,.1)',
        borderBottom:'2px solid var(--gold)',
        padding:'10px 18px',
      }}>
        <span style={{fontSize:8,color:'var(--gold)',letterSpacing:3}}>⚖ TRUE OR FALSE?</span>
        <window.XPBadge xp={xp}/>
      </div>
      <div style={{padding:'22px'}}>
        <div style={{fontSize:'clamp(11px,1.5vw,13px)',color:'var(--text)',
          lineHeight:2,marginBottom:22,letterSpacing:1}}>
          {question}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[
            {val:true, label:'TRUE', color:'var(--green)', rgb:'0,255,136'},
            {val:false, label:'FALSE', color:'var(--red)', rgb:'255,64,85'},
          ].map(b => {
            const isPicked = picked === b.val;
            const isCorrect = answer === b.val;
            let bg = 'var(--surf2)';
            let bord = 'var(--border)';
            if (submitted && isPicked && isCorrect) { bg = `rgba(${b.rgb},.18)`; bord = b.color; }
            else if (submitted && isPicked) { bg='rgba(255,64,85,.18)'; bord='var(--red)'; }
            else if (submitted && isCorrect) { bg=`rgba(${b.rgb},.12)`; bord=b.color; }
            return (
              <button key={b.label} disabled={submitted}
                onClick={() => setPicked(b.val)}
                className="px-btn"
                style={{
                  padding:'18px',fontSize:14,letterSpacing:4,
                  background:bg,color: submitted&&isPicked ? (isCorrect?'var(--green)':'var(--red)') : b.color,
                  border:`3px solid ${bord}`,
                  boxShadow: submitted ? 'none' : `0 4px 0 rgba(${b.rgb},.3)`,
                }}>
                {b.label}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div style={{marginTop:20,animation:'up-in .35s ease'}}>
            {correct
              ? <window.TextBox type="tip" title="CORRECT!">+{xp} XP earned!</window.TextBox>
              : <window.TextBox type="danger" title="WRONG">
                  The correct answer was <strong style={{color:'var(--green)'}}>{answer ? 'TRUE' : 'FALSE'}</strong>.
                </window.TextBox>}
          </div>
        )}
      </div>
    </div>
  );
}

window.QuizQuestion = QuizQuestion;
window.SelectAllThatApply = SelectAllThatApply;
window.TrueFalse = TrueFalse;
