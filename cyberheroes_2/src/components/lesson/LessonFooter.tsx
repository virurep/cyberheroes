export interface LessonFooterProps {
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  nextLabel?: string;
  /** Which of the 4 footer dots should render lit (cyan). Defaults to the first two. */
  progressDots?: boolean[];
}

export function LessonFooter({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  nextLabel = 'NEXT',
  progressDots = [true, true, false, false],
}: LessonFooterProps) {
  return (
    <div
      style={{
        borderTop: '2px solid var(--border)',
        padding: '18px 24px',
        background: 'rgba(2,11,24,.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <button className="px-btn btn-ghost" onClick={onPrev} disabled={!canPrev}>
        ← BACK
      </button>
      <div style={{ display: 'flex', gap: 6 }}>
        {progressDots.map((filled, i) => (
          <span key={i} style={{ width: 8, height: 8, background: filled ? 'var(--cyan)' : 'var(--border)' }} />
        ))}
      </div>
      <button className="px-btn btn-primary" onClick={onNext} disabled={!canNext}>
        {nextLabel} →
      </button>
    </div>
  );
}
