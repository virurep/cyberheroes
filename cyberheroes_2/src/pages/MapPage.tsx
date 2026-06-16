import { useNavigate } from 'react-router-dom';
import { Chip } from '../components/primitives/Chip';
import { PxFrame } from '../components/primitives/PxFrame';
import { Knight } from '../components/primitives/Knight';
import { listLessons, isConvoLesson } from '../content/engine';
import type { AnyLesson } from '../content/engine';

function groupByChapter(lessons: AnyLesson[]): Map<string, AnyLesson[]> {
  const groups = new Map<string, AnyLesson[]>();
  for (const lesson of lessons) {
    const key = `${lesson.chapterNum} · ${lesson.chapter}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(lesson);
  }
  return groups;
}

export default function MapPage() {
  const navigate = useNavigate();
  const lessons = listLessons();
  const groups = groupByChapter(lessons);

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px 120px' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12 }}>
          <Knight size={48} />
          <div>
            <div style={{ fontSize: 7, color: 'var(--dim)', letterSpacing: 4 }}>CYBERHEROES</div>
            <div style={{ fontSize: 'clamp(16px,2.4vw,22px)', color: 'var(--cyan)', letterSpacing: 3 }}>EXPLORATION MAP</div>
          </div>
        </div>
        <div style={{ height: 2, background: 'linear-gradient(90deg,var(--cyan),var(--purple) 60%,transparent)', marginBottom: 40 }} />

        {lessons.length === 0 && (
          <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: 1 }}>
            No lessons found yet. Drop a JSON file into <code>src/content/lessons/</code> to see it appear here.
          </div>
        )}

        {Array.from(groups.entries()).map(([chapterKey, chapterLessons]) => (
          <div key={chapterKey} style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 16 }}>
              <Chip color="purple">CHAPTER {chapterKey}</Chip>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
              {chapterLessons.map((lesson) => {
                const convo = isConvoLesson(lesson);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                  >
                    <PxFrame color={convo ? 'var(--purple)' : 'var(--cyan)'} padding={18}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Chip color={convo ? 'purple' : 'cyan'} icon={convo ? '✦' : '⚔'}>
                          {convo ? 'CONVERSATION' : `LESSON ${lesson.lessonNum}`}
                        </Chip>
                        <div style={{ fontSize: 11, color: 'var(--text)', letterSpacing: 1, lineHeight: 1.6 }}>{lesson.title}</div>
                      </div>
                    </PxFrame>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
