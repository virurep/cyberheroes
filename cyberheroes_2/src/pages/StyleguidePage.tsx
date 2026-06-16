import { useEffect, useState, type ReactNode } from 'react';
import { Knight } from '../components/primitives/Knight';
import { PxFrame } from '../components/primitives/PxFrame';
import { XPBadge } from '../components/primitives/XPBadge';
import { ProgressBar } from '../components/primitives/ProgressBar';
import { StatRow } from '../components/primitives/StatRow';
import { Chip } from '../components/primitives/Chip';
import { InlineCode } from '../components/primitives/InlineCode';
import { ContentTitle } from '../components/primitives/ContentTitle';
import { KNIGHT_PRESETS, type KnightColor } from '../components/primitives/knightPresets';
import { TextBox, type TextBoxType } from '../components/textboxes/TextBox';
import { DialogueBox } from '../components/textboxes/DialogueBox';
import { KeyTerm } from '../components/textboxes/KeyTerm';
import { QuoteBox } from '../components/textboxes/QuoteBox';
import { StepBox } from '../components/textboxes/StepBox';
import { LessonHeader } from '../components/lesson/LessonHeader';
import { LessonFooter } from '../components/lesson/LessonFooter';
import { LessonBody } from '../components/lesson/LessonBody';
import { LessonHero } from '../components/lesson/LessonHero';
import { LessonSection } from '../components/lesson/LessonSection';
import { LessonText } from '../components/lesson/LessonText';
import { MagePortrait } from '../components/convo/MagePortrait';
import { ConvoLesson } from '../components/convo/ConvoLesson';
import { QuizQuestion } from '../components/quiz/QuizQuestion';
import { SelectAllThatApply } from '../components/quiz/SelectAllThatApply';
import { TrueFalse } from '../components/quiz/TrueFalse';
import { DragDropSort } from '../components/quiz/DragDropSort';

const SECTIONS = [
  { id: 'foundation', label: 'FOUNDATION' },
  { id: 'primitives', label: 'PRIMITIVES' },
  { id: 'textboxes', label: 'TEXT BOXES' },
  { id: 'lesson', label: 'LESSON PAGE' },
  { id: 'convo', label: 'CONVO LESSON' },
  { id: 'quiz', label: 'QUIZ' },
  { id: 'dragdrop', label: 'DRAG & DROP' },
];

function Nav() {
  const [active, setActive] = useState('foundation');
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= y) {
          setActive(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className="ds-nav">
      <div className="ds-nav-logo">
        <span className="a">CYBER</span>
        <span className="b">HEROES</span>
      </div>
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={`tab ${active === s.id ? 'active' : ''}`}>
          {s.label}
        </a>
      ))}
    </nav>
  );
}

function Section({ id, eyebrow, title, desc, children }: { id: string; eyebrow: string; title: ReactNode; desc?: string; children: ReactNode }) {
  return (
    <section id={id} className="ds-section">
      <div className="ds-section-eyebrow">{eyebrow}</div>
      <div className="ds-section-title">{title}</div>
      <div className="ds-section-divider" />
      {desc && <div className="ds-section-desc">{desc}</div>}
      {children}
    </section>
  );
}

function Component({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ds-component">
      <div className="ds-component-label">{label}</div>
      <div style={{ paddingTop: 14 }}>{children}</div>
    </div>
  );
}

function ColorSwatch({ name, val, hex }: { name: string; val: string; hex: string }) {
  return (
    <div style={{ background: 'var(--surf)', border: '1px solid var(--border)', padding: 14 }}>
      <div style={{ height: 64, background: val, marginBottom: 12, boxShadow: `0 0 16px ${val}88` }} />
      <div style={{ fontSize: 8, color: 'var(--text)', letterSpacing: 2, marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 6, color: 'var(--dim)', letterSpacing: 1 }}>{hex}</div>
    </div>
  );
}

const COLORS: { name: string; val: string; hex: string }[] = [
  { name: 'BG', val: 'var(--bg)', hex: '#020b18' },
  { name: 'SURF', val: 'var(--surf)', hex: '#071525' },
  { name: 'SURF2', val: 'var(--surf2)', hex: '#0d1f35' },
  { name: 'CYAN', val: 'var(--cyan)', hex: '#00d4ff' },
  { name: 'PURPLE', val: 'var(--purple)', hex: '#7c3aed' },
  { name: 'GOLD', val: 'var(--gold)', hex: '#ffd700' },
  { name: 'GREEN', val: 'var(--green)', hex: '#00ff88' },
  { name: 'RED', val: 'var(--red)', hex: '#ff4055' },
  { name: 'ORANGE', val: 'var(--orange)', hex: '#ff8c00' },
];

const TEXT_BOX_TYPES: TextBoxType[] = ['info', 'tip', 'warning', 'danger', 'quest', 'secret'];
const KNIGHT_COLORS: KnightColor[] = Object.keys(KNIGHT_PRESETS) as KnightColor[];

export default function StyleguidePage() {
  return (
    <>
      <div className="scan-overlay" />
      <div className="vignette" />
      <Nav />

      <main className="ds-page">
        <Section id="foundation" eyebrow="01 / FOUNDATION" title={<>DESIGN <span className="accent">TOKENS</span></>} desc="The full CSS-variable palette and the Press Start 2P type system every component pulls from. No hardcoded hex values anywhere downstream.">
          <div className="ds-grid ds-grid-3" style={{ marginBottom: 32 }}>
            {COLORS.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
          <Component label="TYPE — PRESS START 2P">
            {[9, 11, 14, 18].map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: 18, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: size, color: 'var(--text)', letterSpacing: 2 }}>DATA PROTECTOR</div>
                <div style={{ fontSize: 6, color: 'var(--dim)', marginLeft: 'auto' }}>{size}px</div>
              </div>
            ))}
          </Component>
        </Section>

        <Section id="primitives" eyebrow="02 / PRIMITIVES" title={<>ATOMS &amp; <span className="accent">PRIMITIVES</span></>}>
          <div className="ds-grid ds-grid-3">
            <Component label="KNIGHT — ALL COLORS">
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {KNIGHT_COLORS.map((c) => (
                  <Knight key={c} size={48} color={c} />
                ))}
              </div>
            </Component>
            <Component label="PXFRAME">
              <PxFrame color="var(--gold)">
                <div style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: 2 }}>8-BIT BEVEL</div>
              </PxFrame>
            </Component>
            <Component label="XP BADGE">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <XPBadge xp={5} color="cyan" />
                <XPBadge xp={10} color="gold" />
                <XPBadge xp={15} color="green" />
              </div>
            </Component>
            <Component label="PROGRESS BAR">
              <ProgressBar value={65} max={100} color="var(--cyan)" label="QUEST PROGRESS" />
            </Component>
            <Component label="STAT ROW">
              <StatRow label="HP" value={7} max={10} color="var(--green)" />
            </Component>
            <Component label="CHIP">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Chip color="cyan">CYAN</Chip>
                <Chip color="gold" solid>
                  GOLD
                </Chip>
                <Chip color="purple" icon="◆">
                  PURPLE
                </Chip>
              </div>
            </Component>
            <Component label="INLINE CODE">
              <div style={{ fontSize: 10, color: 'var(--text)' }}>
                Use <InlineCode>12 characters</InlineCode> minimum.
              </div>
            </Component>
            <Component label="CONTENT TITLE">
              <ContentTitle eyebrow="SECTION 1" title="The Basics of Passwords" />
            </Component>
          </div>
        </Section>

        <Section id="textboxes" eyebrow="03 / TEXT BOXES" title={<>CALLOUTS &amp; <span className="accent">DIALOGUE</span></>}>
          <div className="ds-grid ds-grid-2">
            {TEXT_BOX_TYPES.map((t) => (
              <Component key={t} label={`TEXTBOX — ${t.toUpperCase()}`}>
                <TextBox type={t}>This is a {t} callout box, rendered straight from the design system tokens.</TextBox>
              </Component>
            ))}
            <Component label="DIALOGUE BOX">
              <DialogueBox speaker="DATA PROTECTOR" knightColor="cyan" side="left">
                Hark! A stranger approaches the gate. State thy business!
              </DialogueBox>
            </Component>
            <Component label="KEY TERM">
              <KeyTerm term="PASSWORD">A secret string of characters that proves your identity.</KeyTerm>
            </Component>
            <Component label="QUOTE BOX">
              <QuoteBox author="Data Protector">A kingdom is only as safe as its weakest gate.</QuoteBox>
            </Component>
            <Component label="STEP BOX">
              <StepBox step={1} total={3} title="MAKE IT LONG">
                Aim for at least <InlineCode>12 characters</InlineCode>.
              </StepBox>
            </Component>
          </div>
        </Section>

        <Section id="lesson" eyebrow="04 / LESSON" title={<>LESSON PAGE <span className="accent">LAYOUT</span></>}>
          <Component label="LESSON HEADER + FOOTER">
            <div style={{ border: '1px solid var(--border)' }}>
              <LessonHeader chapter="Privacy & Passwords" chapterNum={1} lessonTitle="What Is a Password?" currentStep={2} totalSteps={3} totalXP={40} />
              <LessonBody>
                <LessonHero eyebrow="CHAPTER 1 · LESSON 2" title="What Is a Password?" knightColor="cyan">
                  Every brave hero needs a way to prove who they are.
                </LessonHero>
                <LessonSection number={1} title="THE BASICS">
                  <LessonText>A password is a secret string of characters that proves your identity.</LessonText>
                </LessonSection>
              </LessonBody>
              <LessonFooter progressDots={[true, true, false, false]} />
            </div>
          </Component>
        </Section>

        <Section id="convo" eyebrow="05 / CONVO LESSON" title={<>KNIGHT &amp; <span className="accent">MAGE</span></>}>
          <div className="ds-grid ds-grid-2" style={{ marginBottom: 24 }}>
            <Component label="MAGE PORTRAIT">
              <MagePortrait size={120} />
            </Component>
            <Component label="KNIGHT (FOR COMPARISON)">
              <Knight size={120} />
            </Component>
          </div>
          <Component label="FULL CONVO LESSON">
            <ConvoLesson
              topic="PASSWORD WISDOM"
              knightColor="cyan"
              turns={[
                { speaker: 'knight', content: 'Merlinus! How does a machine break a weak password?' },
                { speaker: 'mage', content: 'Machines try thousands of guesses per second, starting with common words.' },
              ]}
            />
          </Component>
        </Section>

        <Section id="quiz" eyebrow="06 / QUIZ" title={<>ASSESSMENT <span className="accent">TYPES</span></>}>
          <div className="ds-grid ds-grid-2">
            <Component label="MULTIPLE CHOICE">
              <QuizQuestion question="Which password is strongest?" options={['password123', 'Tr3k!Moss&Falcon', 'qwerty', '111111']} correct={1} xp={10} />
            </Component>
            <Component label="SELECT ALL THAT APPLY">
              <SelectAllThatApply
                question="Select every quality of a strong password."
                options={['At least 12 characters', "Your pet's name", 'Mixes symbols & numbers', 'Unique per account']}
                correctSet={[0, 2, 3]}
                xp={15}
              />
            </Component>
            <Component label="TRUE / FALSE">
              <TrueFalse question="Using your birthday as a password is safe." answer={false} xp={5} />
            </Component>
          </div>
        </Section>

        <Section id="dragdrop" eyebrow="07 / DRAG & DROP" title={<>BUCKET <span className="accent">SORT</span></>}>
          <Component label="DRAG DROP SORT">
            <DragDropSort
              title="SORT: STRONG OR WEAK"
              buckets={[
                { id: 'strong', label: 'STRONG', color: 'var(--green)', rgb: '0,255,136' },
                { id: 'weak', label: 'WEAK', color: 'var(--red)', rgb: '255,64,85' },
              ]}
              items={[
                { id: 'i1', label: '123456', bucket: 'weak' },
                { id: 'i2', label: 'Tr3k!Moss&Falcon', bucket: 'strong' },
              ]}
              xp={20}
            />
          </Component>
        </Section>
      </main>
    </>
  );
}
