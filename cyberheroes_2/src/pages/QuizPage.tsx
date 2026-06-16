import { useNavigate, useParams } from 'react-router-dom';
import { TextBox } from '../components/textboxes/TextBox';
import { getQuiz, QuizRenderer } from '../content/engine';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = id ? getQuiz(id) : undefined;

  if (!quiz) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
        <TextBox type="danger" title="QUIZ NOT FOUND">
          No quiz with id <code>{id}</code> exists in <code>src/content/quizzes/</code>.
        </TextBox>
        <div style={{ marginTop: 20 }}>
          <button className="px-btn btn-ghost" onClick={() => navigate('/map')}>
            ← BACK TO MAP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px 120px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <button className="px-btn btn-ghost btn-sm" onClick={() => navigate('/map')} style={{ alignSelf: 'flex-start' }}>
          ← MAP
        </button>
        <QuizRenderer quiz={quiz} />
      </div>
    </div>
  );
}
