import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LessonHeader } from '../components/lesson/LessonHeader';
import { LessonFooter } from '../components/lesson/LessonFooter';
import { LessonBody } from '../components/lesson/LessonBody';
import { LessonHero } from '../components/lesson/LessonHero';
import { LessonSection } from '../components/lesson/LessonSection';
import { ConvoLesson } from '../components/convo/ConvoLesson';
import { TextBox } from '../components/textboxes/TextBox';
import { getLesson, isConvoLesson, renderRichText, BlockRenderer } from '../content/engine';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = id ? getLesson(id) : undefined;
  const [sectionIndex, setSectionIndex] = useState(0);

  if (!lesson) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
        <TextBox type="danger" title="LESSON NOT FOUND">
          No lesson with id <code>{id}</code> exists in <code>src/content/lessons/</code>.
        </TextBox>
        <div style={{ marginTop: 20 }}>
          <button className="px-btn btn-ghost" onClick={() => navigate('/map')}>
            ← BACK TO MAP
          </button>
        </div>
      </div>
    );
  }

  const goToNext = () => {
    const nextQuiz = lesson.footer?.nextQuiz;
    if (nextQuiz) navigate(`/quiz/${nextQuiz}`);
    else navigate('/map');
  };

  if (isConvoLesson(lesson)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LessonHeader
          chapter={lesson.chapter}
          chapterNum={lesson.chapterNum}
          lessonTitle={lesson.title}
          currentStep={1}
          totalSteps={1}
          onMapClick={() => navigate('/map')}
        />
        <LessonBody>
          <ConvoLesson
            topic={lesson.topic}
            knightColor={lesson.knightColor}
            turns={lesson.turns.map((t) => ({ speaker: t.speaker, content: renderRichText(t.content) }))}
            onComplete={goToNext}
          />
        </LessonBody>
      </div>
    );
  }

  const totalSteps = lesson.sections.length;
  const currentSection = lesson.sections[sectionIndex];
  const isLast = sectionIndex === totalSteps - 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LessonHeader
        chapter={lesson.chapter}
        chapterNum={lesson.chapterNum}
        lessonTitle={lesson.title}
        currentStep={sectionIndex + 1}
        totalSteps={totalSteps}
        totalXP={lesson.totalXP}
        onMapClick={() => navigate('/map')}
      />
      <div style={{ flex: 1 }}>
        <LessonBody>
          {sectionIndex === 0 && (
            <LessonHero eyebrow={lesson.hero.eyebrow} title={renderRichText(lesson.hero.title)} knightColor={lesson.hero.knightColor}>
              {renderRichText(lesson.hero.body)}
            </LessonHero>
          )}
          <LessonSection number={currentSection.number} title={currentSection.title}>
            {currentSection.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </LessonSection>
        </LessonBody>
      </div>
      <LessonFooter
        canPrev={sectionIndex > 0}
        canNext
        nextLabel={isLast ? lesson.footer?.nextLabel ?? 'FINISH' : 'NEXT'}
        onPrev={() => setSectionIndex((i) => Math.max(0, i - 1))}
        onNext={() => (isLast ? goToNext() : setSectionIndex((i) => Math.min(totalSteps - 1, i + 1)))}
        progressDots={[0, 1, 2, 3].map((i) => i < Math.round(((sectionIndex + 1) / totalSteps) * 4))}
      />
    </div>
  );
}
