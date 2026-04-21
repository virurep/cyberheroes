import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllPlanets } from '../../content/loader';
import { getPlanetOverrides, savePlanet } from '../../admin/data';

const PART_STYLE_OPTIONS = [
  'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
  'quiz-1', 'quiz-2', 'quiz-3', 'quiz-4',
];

function defaultPart() {
  return {
    id: '',
    title: '',
    part_style: 'lesson-1',
    lesson_page_range: { start: '', end: '' },
    quiz_slugs: '',
    transition: { character: '', message: '' },
  };
}

function serializePart(raw) {
  // quiz_slugs stored as comma-separated string in the form, convert to array
  const quiz_slugs = raw.quiz_slugs
    ? raw.quiz_slugs.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;
  const part = {
    id: raw.id,
    title: raw.title,
    part_style: raw.part_style,
  };
  if (raw.part_style && raw.part_style.startsWith('lesson')) {
    part.lesson_page_range = {
      start: Number(raw.lesson_page_range?.start) || 1,
      end: Number(raw.lesson_page_range?.end) || 1,
    };
  }
  if (raw.part_style && raw.part_style.startsWith('quiz')) {
    if (quiz_slugs && quiz_slugs.length > 0) part.quiz_slugs = quiz_slugs;
    if (raw.transition?.character || raw.transition?.message) {
      part.transition = {
        character: raw.transition.character || '',
        message: raw.transition.message || '',
      };
    }
  }
  return part;
}

function deserializePart(part) {
  return {
    id: part.id || '',
    title: part.title || '',
    part_style: part.part_style || 'lesson-1',
    lesson_page_range: {
      start: part.lesson_page_range?.start ?? '',
      end: part.lesson_page_range?.end ?? '',
    },
    quiz_slugs: Array.isArray(part.quiz_slugs) ? part.quiz_slugs.join(', ') : '',
    transition: {
      character: part.transition?.character || '',
      message: part.transition?.message || '',
    },
  };
}

export default function PlanetForm() {
  const { planetSlug } = useParams();
  const navigate = useNavigate();
  const isEditing = !!planetSlug;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slug: '',
      name: '',
      title: '',
      order: '',
      active: true,
      parent_planet_slug: '',
      icon: '',
      theme_primary: '#4A90D9',
      theme_secondary: '#2C5F8A',
      theme_background: '#EAF4FF',
      theme_accent: '#F5A623',
      intro_text: '',
      computer_image_name: '',
      computer_text: '',
      parts: [defaultPart()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'parts' });

  useEffect(() => {
    if (!isEditing) return;
    const loaderPlanets = getAllPlanets();
    const overrides = getPlanetOverrides();
    const base = loaderPlanets.find((p) => p.slug === planetSlug) || {};
    const override = overrides[planetSlug] || {};
    const merged = { ...base, ...override };

    reset({
      slug: merged.slug || '',
      name: merged.name || '',
      title: merged.title || '',
      order: merged.order ?? '',
      active: merged.active !== false,
      parent_planet_slug: merged.parent_planet_slug || '',
      icon: merged.icon || '',
      theme_primary: merged.theme?.primary || '#4A90D9',
      theme_secondary: merged.theme?.secondary || '#2C5F8A',
      theme_background: merged.theme?.background || '#EAF4FF',
      theme_accent: merged.theme?.accent || '#F5A623',
      intro_text: merged.intro?.intro_text || '',
      computer_image_name: merged.intro?.computer_image_name || '',
      computer_text: merged.intro?.computer_text || '',
      parts: (merged.parts || [defaultPart()]).map(deserializePart),
    });
  }, [planetSlug, isEditing, reset]);

  const onSubmit = (data) => {
    const manifest = {
      slug: data.slug.trim(),
      name: data.name.trim(),
      title: data.title.trim(),
      order: data.order !== '' ? Number(data.order) : undefined,
      active: data.active,
      icon: data.icon.trim() || undefined,
      theme: {
        primary: data.theme_primary,
        secondary: data.theme_secondary,
        background: data.theme_background,
        accent: data.theme_accent,
      },
      intro: {
        intro_text: data.intro_text,
        computer_image_name: data.computer_image_name,
        computer_text: data.computer_text,
      },
      parts: (data.parts || []).map(serializePart),
    };
    if (data.parent_planet_slug.trim()) {
      manifest.parent_planet_slug = data.parent_planet_slug.trim();
    }
    // Remove undefined keys
    Object.keys(manifest).forEach((k) => manifest[k] === undefined && delete manifest[k]);

    savePlanet(manifest);
    navigate('/admin');
  };

  const watchedParts = watch('parts') || [];

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/admin" className="btn btn-sm btn-outline-secondary">
          Back
        </Link>
        <h2 className="mb-0" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          {isEditing ? `Edit Planet: ${planetSlug}` : 'New Planet'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-4">
          {/* Left column — basic fields */}
          <div className="col-lg-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-semibold">Basic Info</div>
              <div className="card-body">

                <div className="mb-3">
                  <label className="form-label">Slug <span className="text-danger">*</span></label>
                  <input
                    className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                    {...register('slug', {
                      required: 'Slug is required',
                      pattern: { value: /^[a-z0-9-]+$/, message: 'Only lowercase letters, digits, and hyphens' },
                    })}
                    placeholder="e.g. privacy-planet"
                    readOnly={isEditing}
                  />
                  {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Name <span className="text-danger">*</span></label>
                  <input
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    {...register('name', { required: 'Name is required' })}
                    placeholder="e.g. Privacy Planet"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Title (subtitle)</label>
                  <input className="form-control" {...register('title')} placeholder="e.g. Sensitive Information" />
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Order</label>
                    <input type="number" className="form-control" {...register('order')} />
                  </div>
                  <div className="col-6 mb-3 d-flex align-items-end">
                    <div className="form-check form-switch mb-2">
                      <input className="form-check-input" type="checkbox" role="switch" id="activeToggle" {...register('active')} />
                      <label className="form-check-label" htmlFor="activeToggle">Active</label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Parent Planet Slug</label>
                  <input className="form-control" {...register('parent_planet_slug')} placeholder="e.g. privacy-planet (leave blank if none)" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Icon filename</label>
                  <input className="form-control" {...register('icon')} placeholder="e.g. privacy-planet-icon.png" />
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-semibold">Theme Colors</div>
              <div className="card-body">
                <div className="row g-3">
                  {[
                    { field: 'theme_primary', label: 'Primary' },
                    { field: 'theme_secondary', label: 'Secondary' },
                    { field: 'theme_background', label: 'Background' },
                    { field: 'theme_accent', label: 'Accent' },
                  ].map(({ field, label }) => (
                    <div className="col-6" key={field}>
                      <label className="form-label">{label}</label>
                      <div className="input-group">
                        <input type="color" className="form-control form-control-color" {...register(field)} />
                        <input type="text" className="form-control" {...register(field)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column — intro + parts */}
          <div className="col-lg-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-semibold">Intro</div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Intro Text</label>
                  <textarea className="form-control" rows={3} {...register('intro_text')} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Computer Image Name</label>
                  <input className="form-control" {...register('computer_image_name')} placeholder="e.g. patrick-wanted.png" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Computer Text</label>
                  <textarea className="form-control" rows={3} {...register('computer_text')} />
                </div>
              </div>
            </div>

            {/* Parts */}
            <div className="card shadow-sm mb-4">
              <div className="card-header d-flex justify-content-between align-items-center fw-semibold">
                Parts
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => append(defaultPart())}
                >
                  + Add Part
                </button>
              </div>
              <div className="card-body p-2">
                {fields.map((field, index) => {
                  const partStyle = watchedParts[index]?.part_style || '';
                  const isLesson = partStyle.startsWith('lesson');
                  const isQuiz = partStyle.startsWith('quiz');
                  return (
                    <div key={field.id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>Part {index + 1}</strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label small">ID</label>
                          <input className="form-control form-control-sm" {...register(`parts.${index}.id`)} placeholder="part-1" />
                        </div>
                        <div className="col-6">
                          <label className="form-label small">Style</label>
                          <select className="form-select form-select-sm" {...register(`parts.${index}.part_style`)}>
                            {PART_STYLE_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label small">Title</label>
                          <input className="form-control form-control-sm" {...register(`parts.${index}.title`)} />
                        </div>
                        {isLesson && (
                          <>
                            <div className="col-6">
                              <label className="form-label small">Page Start</label>
                              <input type="number" className="form-control form-control-sm" {...register(`parts.${index}.lesson_page_range.start`)} />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">Page End</label>
                              <input type="number" className="form-control form-control-sm" {...register(`parts.${index}.lesson_page_range.end`)} />
                            </div>
                          </>
                        )}
                        {isQuiz && (
                          <>
                            <div className="col-12">
                              <label className="form-label small">Quiz Slugs (comma-separated)</label>
                              <input className="form-control form-control-sm" {...register(`parts.${index}.quiz_slugs`)} placeholder="quiz-slug-1, quiz-slug-2" />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">Transition Character</label>
                              <input className="form-control form-control-sm" {...register(`parts.${index}.transition.character`)} />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">Transition Message</label>
                              <input className="form-control form-control-sm" {...register(`parts.${index}.transition.message`)} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2 mb-5">
          <button type="submit" className="btn btn-primary px-4">
            {isEditing ? 'Save Changes' : 'Create Planet'}
          </button>
          <Link to="/admin" className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
