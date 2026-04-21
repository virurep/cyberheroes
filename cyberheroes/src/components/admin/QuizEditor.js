import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllQuizzes } from '../../content/loader';
import { getQuizOverrides, saveQuiz, deleteQuizOverride } from '../../admin/data';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const QUIZ_TYPES = ['multiple-choice', 'drag-drop', 'red-flag-green-flag'];
const QUESTION_TYPES = ['multiple-choice', 'multiple-select', 'true-false'];

function defaultQuestion(type) {
  if (type === 'drag-drop') {
    return { id: Date.now(), question: '', correctAnswer: 0, correctMessage: '', incorrectMessages: '' };
  }
  if (type === 'red-flag-green-flag') {
    return { id: Date.now(), question: '', correctAnswer: 1, correctMessage: '', incorrectMessages: '' };
  }
  // multiple-choice
  return {
    id: Date.now(),
    type: 'multiple-choice',
    question: '',
    answers: ['', '', '', ''],
    correctAnswers: [0],
    correctMessage: ['', ''],
    incorrectMessages: ['', '', '', ''],
    healthBar: 0.8,
    hint: '',
  };
}

function emptyQuiz(planetSlug) {
  return {
    slug: '',
    planet_slug: planetSlug,
    type: 'multiple-choice',
    part: 'quiz-1',
    questions: [defaultQuestion('multiple-choice')],
  };
}

// ---------------------------------------------------------------------------
// Sub-components for different question types
// ---------------------------------------------------------------------------

function MultipleChoiceQuestionForm({ index, control, register, errors, watch, setValue }) {
  const answersField = useFieldArray({ control, name: `questions.${index}.answers` });
  const incorrectField = useFieldArray({ control, name: `questions.${index}.incorrectMessages` });
  const correctMsgField = useFieldArray({ control, name: `questions.${index}.correctMessage` });

  return (
    <div>
      <div className="mb-2">
        <label className="form-label small">Question Type</label>
        <select className="form-select form-select-sm" {...register(`questions.${index}.type`)}>
          {QUESTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label small">Question <span className="text-danger">*</span></label>
        <textarea className="form-control form-control-sm" rows={2} {...register(`questions.${index}.question`, { required: true })} />
      </div>

      <div className="mb-2">
        <label className="form-label small">Answer Options</label>
        {answersField.fields.map((af, ai) => (
          <div key={af.id} className="d-flex gap-1 mb-1 align-items-center">
            <span className="badge bg-secondary" style={{ minWidth: 24 }}>{ai}</span>
            <input className="form-control form-control-sm" {...register(`questions.${index}.answers.${ai}`)} />
            <button type="button" className="btn btn-sm btn-outline-danger" style={{ padding: '0 6px' }} onClick={() => answersField.remove(ai)}>-</button>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline-secondary mt-1" onClick={() => answersField.append('')}>+ Answer</button>
      </div>

      <div className="mb-2">
        <label className="form-label small">Correct Answer Index(es) <span className="text-muted">(comma-separated, 0-based)</span></label>
        <input
          className="form-control form-control-sm"
          {...register(`questions.${index}.correctAnswersStr`)}
          placeholder="e.g. 0 or 0,2"
        />
      </div>

      <div className="row g-2 mb-2">
        <div className="col-12">
          <label className="form-label small">Correct Message (line 1 + line 2)</label>
          {correctMsgField.fields.map((cmf, cmi) => (
            <input key={cmf.id} className="form-control form-control-sm mb-1" {...register(`questions.${index}.correctMessage.${cmi}`)} placeholder={`Line ${cmi + 1}`} />
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label className="form-label small">Incorrect Messages (one per answer option)</label>
        {incorrectField.fields.map((imf, imi) => (
          <div key={imf.id} className="d-flex gap-1 mb-1 align-items-center">
            <span className="badge bg-danger" style={{ minWidth: 24 }}>{imi}</span>
            <input className="form-control form-control-sm" {...register(`questions.${index}.incorrectMessages.${imi}`)} />
          </div>
        ))}
      </div>

      <div className="row g-2">
        <div className="col-6">
          <label className="form-label small">Health Bar (0–1)</label>
          <input type="number" step="0.01" min="0" max="1" className="form-control form-control-sm" {...register(`questions.${index}.healthBar`)} />
        </div>
        <div className="col-6">
          <label className="form-label small">Hint</label>
          <input className="form-control form-control-sm" {...register(`questions.${index}.hint`)} />
        </div>
      </div>
    </div>
  );
}

function DragDropQuestionForm({ index, register }) {
  return (
    <div>
      <div className="mb-2">
        <label className="form-label small">Question</label>
        <input className="form-control form-control-sm" {...register(`questions.${index}.question`, { required: true })} />
      </div>
      <div className="mb-2">
        <label className="form-label small">Correct Answer <span className="text-muted">(0=Sensitive, 1=Not Sensitive)</span></label>
        <select className="form-select form-select-sm" {...register(`questions.${index}.correctAnswer`)}>
          <option value={0}>0 — Sensitive</option>
          <option value={1}>1 — Not Sensitive</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label small">Correct Message</label>
        <textarea className="form-control form-control-sm" rows={2} {...register(`questions.${index}.correctMessage`)} />
      </div>
      <div className="mb-2">
        <label className="form-label small">Incorrect Message</label>
        <textarea className="form-control form-control-sm" rows={2} {...register(`questions.${index}.incorrectMessages`)} />
      </div>
    </div>
  );
}

function RedFlagGreenFlagQuestionForm({ index, register }) {
  return (
    <div>
      <div className="mb-2">
        <label className="form-label small">Scenario</label>
        <textarea className="form-control form-control-sm" rows={2} {...register(`questions.${index}.question`, { required: true })} />
      </div>
      <div className="mb-2">
        <label className="form-label small">Correct Answer <span className="text-muted">(0=Red Flag, 1=Green Flag)</span></label>
        <select className="form-select form-select-sm" {...register(`questions.${index}.correctAnswer`)}>
          <option value={0}>0 — Red Flag</option>
          <option value={1}>1 — Green Flag</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label small">Correct Message</label>
        <textarea className="form-control form-control-sm" rows={2} {...register(`questions.${index}.correctMessage`)} />
      </div>
      <div className="mb-2">
        <label className="form-label small">Incorrect Message</label>
        <textarea className="form-control form-control-sm" rows={2} {...register(`questions.${index}.incorrectMessages`)} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function QuizEditor() {
  const { planetSlug } = useParams();
  const [quizzes, setQuizzes] = useState({});
  const [editingSlug, setEditingSlug] = useState(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const loaderQuizzes = getAllQuizzes(planetSlug) || {};
    const overrides = getQuizOverrides(planetSlug) || {};
    const merged = {};
    const allSlugs = new Set([...Object.keys(loaderQuizzes), ...Object.keys(overrides)]);
    for (const s of allSlugs) {
      merged[s] = { ...(loaderQuizzes[s] || {}), ...(overrides[s] || {}) };
    }
    setQuizzes(merged);
  }, [planetSlug, forceUpdate]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: emptyQuiz(planetSlug) });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedType = watch('type');

  const openEdit = (quiz) => {
    // Normalise quiz for form
    const normalised = {
      ...quiz,
      questions: (quiz.questions || []).map((q) => ({
        ...q,
        correctAnswersStr: Array.isArray(q.correctAnswers) ? q.correctAnswers.join(', ') : '',
        correctMessage: Array.isArray(q.correctMessage) ? q.correctMessage : [q.correctMessage || '', ''],
        incorrectMessages: Array.isArray(q.incorrectMessages) ? q.incorrectMessages : [q.incorrectMessages || ''],
        answers: Array.isArray(q.answers) ? q.answers : ['', '', '', ''],
      })),
    };
    setEditingSlug(quiz.slug);
    reset(normalised);
  };

  const openNew = () => {
    setEditingSlug('__new__');
    reset(emptyQuiz(planetSlug));
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    reset(emptyQuiz(planetSlug));
  };

  const onSubmit = (data) => {
    // Reconstruct correctAnswers from string
    const quiz = {
      ...data,
      questions: (data.questions || []).map((q, i) => {
        const base = { ...q };
        if (data.type === 'multiple-choice') {
          base.correctAnswers = (q.correctAnswersStr || '')
            .split(',')
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => !isNaN(n));
          delete base.correctAnswersStr;
          base.correctAnswer = undefined;
          base.id = q.id || i + 1;
        } else {
          base.id = q.id || i + 1;
          base.correctAnswer = Number(q.correctAnswer);
          delete base.correctAnswers;
          delete base.correctAnswersStr;
          delete base.answers;
          delete base.healthBar;
          delete base.hint;
          delete base.type;
        }
        // Remove undefined keys
        Object.keys(base).forEach((k) => base[k] === undefined && delete base[k]);
        return base;
      }),
    };

    saveQuiz(planetSlug, quiz);
    const updated = getQuizOverrides(planetSlug) || {};
    const loaderQuizzes = getAllQuizzes(planetSlug) || {};
    const allSlugs = new Set([...Object.keys(loaderQuizzes), ...Object.keys(updated)]);
    const merged = {};
    for (const s of allSlugs) {
      merged[s] = { ...(loaderQuizzes[s] || {}), ...(updated[s] || {}) };
    }
    setQuizzes(merged);
    cancelEdit();
  };

  const handleDelete = (qSlug) => {
    if (!window.confirm(`Remove admin override for quiz "${qSlug}"?`)) return;
    deleteQuizOverride(planetSlug, qSlug);
    forceUpdate((n) => n + 1);
  };

  const overrides = getQuizOverrides(planetSlug) || {};

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/admin" className="btn btn-sm btn-outline-secondary">Back</Link>
        <h2 className="mb-0" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Quiz Editor — {planetSlug}
        </h2>
        <span className="badge bg-secondary">{Object.keys(quizzes).length} quizzes</span>
      </div>

      <div className="row g-4">
        {/* Quiz list */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between fw-semibold">
              Quizzes
              <button className="btn btn-sm btn-primary" onClick={openNew}>+ New</button>
            </div>
            <div className="list-group list-group-flush">
              {Object.entries(quizzes).map(([qSlug, quiz]) => (
                <div
                  key={qSlug}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${editingSlug === qSlug ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openEdit(quiz)}
                >
                  <div>
                    <div className="fw-semibold" style={{ fontSize: 13 }}>{qSlug}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>
                      {quiz.type} &nbsp;&middot;&nbsp; {(quiz.questions || []).length} questions
                      {overrides[qSlug] && <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.6rem' }}>edited</span>}
                    </div>
                  </div>
                  <button
                    className="btn btn-xs btn-outline-danger"
                    style={{ padding: '0 6px', fontSize: 11 }}
                    onClick={(e) => { e.stopPropagation(); handleDelete(qSlug); }}
                  >
                    Del
                  </button>
                </div>
              ))}
              {Object.keys(quizzes).length === 0 && (
                <div className="list-group-item text-muted">No quizzes found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz form */}
        <div className="col-lg-8">
          {editingSlug !== null && (
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">
                {editingSlug === '__new__' ? 'New Quiz' : `Editing: ${editingSlug}`}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3 mb-3">
                    <div className="col-5">
                      <label className="form-label small">Slug <span className="text-danger">*</span></label>
                      <input
                        className={`form-control form-control-sm ${errors.slug ? 'is-invalid' : ''}`}
                        {...register('slug', { required: 'Slug is required', pattern: { value: /^[a-z0-9-]+$/, message: 'Lowercase, digits, hyphens only' } })}
                        readOnly={editingSlug !== '__new__'}
                      />
                      {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Type</label>
                      <select className="form-select form-select-sm" {...register('type')}>
                        {QUIZ_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-3">
                      <label className="form-label small">Part</label>
                      <input className="form-control form-control-sm" {...register('part')} placeholder="quiz-1" />
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Questions</strong>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => appendQuestion(defaultQuestion(watchedType))}
                    >
                      + Question
                    </button>
                  </div>

                  {questionFields.map((qf, qi) => (
                    <div key={qf.id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <strong style={{ fontSize: 13 }}>Q{qi + 1}</strong>
                        <button type="button" className="btn btn-sm btn-outline-danger" style={{ padding: '0 8px' }} onClick={() => removeQuestion(qi)}>
                          Remove
                        </button>
                      </div>

                      {watchedType === 'multiple-choice' && (
                        <MultipleChoiceQuestionForm
                          index={qi}
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                        />
                      )}
                      {watchedType === 'drag-drop' && (
                        <DragDropQuestionForm index={qi} register={register} />
                      )}
                      {watchedType === 'red-flag-green-flag' && (
                        <RedFlagGreenFlagQuestionForm index={qi} register={register} />
                      )}
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-2">
                    <button type="submit" className="btn btn-primary btn-sm">Save Quiz</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editingSlug === null && (
            <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: 200 }}>
              Select a quiz to edit, or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
