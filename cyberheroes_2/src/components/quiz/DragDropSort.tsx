import { useState } from 'react';
import { XPBadge } from '../primitives/XPBadge';

export interface Bucket {
  id: string;
  label: string;
  color?: string;
  rgb?: string;
}

export interface Item {
  id: string;
  label: string;
  bucket: string;
}

export interface DragDropSortProps {
  title?: string;
  buckets: Bucket[];
  items: Item[];
  xp?: number;
  onComplete?: (allCorrect: boolean) => void;
}

interface Result {
  itemId: string;
  droppedInto: string;
  correct: boolean;
}

/**
 * DragDropSort — one word at a time. Shows the active item large in the
 * center; user drags (or taps) it into a bucket, then the next item appears.
 */
export function DragDropSort({ title = 'SORT THE WORDS', buckets, items, xp = 20, onComplete }: DragDropSortProps) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  const current = items[idx];
  const total = items.length;
  const correctCount = results.filter((r) => r.correct).length;

  const handleDragStart = (e: React.DragEvent) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', current.id);
  };
  const handleDragEnd = () => {
    setDragging(false);
    setHover(null);
  };

  const handleDragOver = (e: React.DragEvent, bucketId: string) => {
    e.preventDefault();
    setHover(bucketId);
  };

  const handleDrop = (bucketId: string) => {
    setHover(null);
    setDragging(false);
    if (!current) return;
    const correct = current.bucket === bucketId;
    const next = [...results, { itemId: current.id, droppedInto: bucketId, correct }];
    setResults(next);
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
    setTimeout(
      () => {
        if (idx + 1 >= total) {
          setDone(true);
          const allRight = next.every((r) => r.correct);
          onComplete?.(allRight);
        } else {
          setIdx((i) => i + 1);
        }
      },
      correct ? 380 : 520,
    );
  };

  const reset = () => {
    setIdx(0);
    setResults([]);
    setDone(false);
    setHover(null);
    setDragging(false);
  };

  if (done) {
    const allCorrect = results.every((r) => r.correct);
    return (
      <div style={{ background: 'var(--surf)', border: `3px solid ${allCorrect ? 'var(--green)' : 'var(--orange)'}` }}>
        <div style={{ padding: '28px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 14, color: allCorrect ? 'var(--green)' : 'var(--orange)' }}>
            {allCorrect ? '✓' : '⚠'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text)', letterSpacing: 3, marginBottom: 8 }}>
            {allCorrect ? 'PERFECT!' : 'COMPLETE!'}
          </div>
          <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: 2, marginBottom: 22 }}>
            {correctCount} / {total} CORRECT
          </div>
          {allCorrect && (
            <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
              <XPBadge xp={xp} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22, maxWidth: 520, margin: '0 auto 22px' }}>
            {results.map((r, i) => {
              const item = items.find((it) => it.id === r.itemId);
              const correctBucket = buckets.find((b) => b.id === item?.bucket);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    background: r.correct ? 'rgba(0,255,136,.08)' : 'rgba(255,64,85,.08)',
                    border: `2px solid ${r.correct ? 'var(--green)' : 'var(--red)'}`,
                    fontSize: 9,
                    letterSpacing: 1,
                  }}
                >
                  <span style={{ color: r.correct ? 'var(--green)' : 'var(--red)', fontSize: 11 }}>{r.correct ? '✓' : '✕'}</span>
                  <span style={{ flex: 1, textAlign: 'left', color: 'var(--text)' }}>{item?.label}</span>
                  <span style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: 2 }}>→</span>
                  <span style={{ fontSize: 7, color: correctBucket?.color ?? 'var(--cyan)', letterSpacing: 2 }}>
                    {correctBucket?.label}
                  </span>
                </div>
              );
            })}
          </div>
          <button className="px-btn btn-ghost" onClick={reset}>
            ↻ TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surf)', border: '3px solid var(--green)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,255,136,.1)',
          borderBottom: '2px solid var(--green)',
          padding: '10px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--green)', fontSize: 11 }}>⋮⋮</span>
          <span style={{ fontSize: 8, color: 'var(--green)', letterSpacing: 3 }}>{title}</span>
        </div>
        <span style={{ fontSize: 7, color: 'var(--green)', letterSpacing: 3 }}>
          {idx + 1} / {total}
        </span>
      </div>

      <div style={{ padding: '24px 22px' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
          {items.map((_, i) => {
            const r = results[i];
            const bg = r ? (r.correct ? 'var(--green)' : 'var(--red)') : i === idx ? 'var(--cyan)' : 'var(--border)';
            return <div key={i} style={{ width: 16, height: 6, background: bg, boxShadow: i === idx ? `0 0 8px ${bg}` : 'none' }} />;
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, minHeight: 120, alignItems: 'center' }}>
          <div
            key={current.id}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              padding: '24px 36px',
              background: 'var(--surf2)',
              border: '3px solid var(--cyan)',
              boxShadow: '0 0 24px rgba(0,212,255,.35), 0 6px 0 rgba(0,212,255,.4)',
              fontFamily: 'var(--font)',
              fontSize: 'clamp(14px,2.2vw,22px)',
              color: 'var(--text)',
              letterSpacing: 3,
              cursor: dragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              animation: shake ? 'shake .4s' : 'pop-in .35s ease',
              opacity: dragging ? 0.55 : 1,
              transition: 'opacity .15s',
              textAlign: 'center',
            }}
          >
            {current.label}
          </div>
        </div>

        <div style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: 3, textAlign: 'center', marginBottom: 14 }}>
          ▸ DRAG OR TAP A BUCKET BELOW
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${buckets.length},1fr)`, gap: 14 }}>
          {buckets.map((b) => {
            const isHover = hover === b.id;
            const rgb = b.rgb || '0,212,255';
            return (
              <button
                key={b.id}
                onClick={() => handleDrop(b.id)}
                onDragOver={(e) => handleDragOver(e, b.id)}
                onDragLeave={() => setHover(null)}
                onDrop={() => handleDrop(b.id)}
                style={{
                  background: isHover ? `rgba(${rgb},.22)` : `rgba(${rgb},.06)`,
                  border: `3px ${isHover ? 'solid' : 'dashed'} ${b.color || 'var(--cyan)'}`,
                  padding: '22px 14px',
                  minHeight: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font)',
                  fontSize: 'clamp(8px,1.1vw,11px)',
                  color: b.color || 'var(--cyan)',
                  letterSpacing: 2,
                  cursor: 'pointer',
                  transition: 'all .15s',
                  transform: isHover ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isHover ? `0 0 18px rgba(${rgb},.4)` : 'none',
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
