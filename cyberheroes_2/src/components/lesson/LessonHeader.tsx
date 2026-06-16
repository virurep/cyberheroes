import { ProgressBar } from '../primitives/ProgressBar';

export interface LessonHeaderProps {
  chapter: string;
  chapterNum: number;
  lessonTitle: string;
  currentStep: number;
  totalSteps: number;
  totalXP?: number;
  onMapClick?: () => void;
}

/** Lesson page header — title, progress, XP, back-to-map. */
export function LessonHeader({
  chapter,
  chapterNum,
  lessonTitle,
  currentStep,
  totalSteps,
  totalXP = 0,
  onMapClick,
}: LessonHeaderProps) {
  return (
    <div
      style={{
        borderBottom: '2px solid var(--border)',
        padding: '16px 24px',
        background: 'rgba(2,11,24,.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        flexWrap: 'wrap',
      }}
    >
      <button className="px-btn btn-ghost btn-sm" onClick={onMapClick}>
        ← MAP
      </button>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 6, color: 'var(--dim)', letterSpacing: 3, marginBottom: 6 }}>
          CHAPTER {chapterNum} ▸ {chapter}
        </div>
        <div style={{ fontSize: 'clamp(10px,1.4vw,13px)', color: 'var(--cyan)', letterSpacing: 2 }}>{lessonTitle}</div>
      </div>
      <div style={{ minWidth: 180 }}>
        <ProgressBar value={currentStep} max={totalSteps} color="var(--cyan)" label={`STEP ${currentStep}/${totalSteps}`} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'var(--gold)', letterSpacing: 2 }}>
        <span style={{ fontSize: 11 }}>★</span>
        <span>{totalXP}</span>
      </div>
    </div>
  );
}
