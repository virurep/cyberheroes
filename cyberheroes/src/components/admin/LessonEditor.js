import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { getLessonPages } from '../../content/loader';
import { getLessonsOverride, saveLessonPage, deleteLessonPage, saveLessonsOverride } from '../../admin/data';
import LessonPreview from './LessonPreview';

const CHARACTER_NAMES = ['Cyber Hero', 'Allie', 'Alejandro', 'Patrick', 'Enemy'];
const CHARACTER_STYLES = [
  'character-left',
  'character-right character-flip',
  'character-right',
  'character-center',
  'character-left character-l',
];
const MESSAGE_STYLES = ['message-box-bottom', 'message-box-right', 'alert-header'];
const SPEAKER_STYLES = ['speaker-left', 'speaker-right'];

function defaultCharacter() {
  return { name: 'Cyber Hero', style: 'character-left' };
}

function emptyPage(existingPages) {
  const maxPage = existingPages.reduce((m, p) => Math.max(m, p.page_number || 0), 0);
  return {
    page_number: maxPage + 1,
    characters: [defaultCharacter()],
    message: {
      text: '',
      speaker: '',
      style: 'message-box-bottom',
      speaker_style: 'speaker-left',
      header: '',
      buttons: { prev: '', next: '' },
    },
  };
}

function pageToFormValues(page) {
  return {
    page_number: page.page_number ?? '',
    characters: (page.characters || []).map((c) => ({ name: c.name || '', style: c.style || '' })),
    message_text: page.message?.text || '',
    message_speaker: page.message?.speaker || '',
    message_style: page.message?.style || 'message-box-bottom',
    message_speaker_style: page.message?.speaker_style || 'speaker-left',
    message_header: page.message?.header || '',
    buttons_prev: page.message?.buttons?.prev != null ? String(page.message.buttons.prev) : '',
    buttons_next: page.message?.buttons?.next != null ? String(page.message.buttons.next) : '',
    buttons_continue_text: page.message?.buttons?.continue?.text || '',
    buttons_continue_next: page.message?.buttons?.continue?.next != null ? String(page.message.buttons.continue.next) : '',
  };
}

function formValuesToPage(data) {
  const buttons = {};
  if (data.buttons_prev !== '') buttons.prev = isNaN(Number(data.buttons_prev)) ? data.buttons_prev : Number(data.buttons_prev);
  if (data.buttons_next !== '') buttons.next = isNaN(Number(data.buttons_next)) ? data.buttons_next : Number(data.buttons_next);
  if (data.buttons_continue_text || data.buttons_continue_next !== '') {
    buttons.continue = {
      text: data.buttons_continue_text,
      next: isNaN(Number(data.buttons_continue_next)) ? data.buttons_continue_next : Number(data.buttons_continue_next),
    };
  }
  return {
    page_number: Number(data.page_number),
    characters: (data.characters || []).map((c) => ({ name: c.name, style: c.style })),
    message: {
      text: data.message_text,
      speaker: data.message_speaker || undefined,
      style: data.message_style,
      speaker_style: data.message_speaker_style || undefined,
      header: data.message_header || undefined,
      buttons: Object.keys(buttons).length > 0 ? buttons : undefined,
    },
  };
}

// Remove undefined values recursively
function clean(obj) {
  if (Array.isArray(obj)) return obj.map(clean);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, clean(v)])
    );
  }
  return obj;
}

export default function LessonEditor() {
  const { planetSlug } = useParams();
  const [pages, setPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null); // page_number or null
  const [, forceUpdate] = useState(0);

  // Load and merge pages
  useEffect(() => {
    const loaderData = getLessonPages(planetSlug);
    const override = getLessonsOverride(planetSlug);
    const base = loaderData?.pages || [];
    const overridePages = override?.pages || base;
    setPages(overridePages);
  }, [planetSlug, forceUpdate]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: pageToFormValues(emptyPage([])),
  });

  const { fields: charFields, append: appendChar, remove: removeChar } = useFieldArray({
    control,
    name: 'characters',
  });

  // Watch all form values for live preview
  const watchedValues = useWatch({ control });

  const previewPage = (() => {
    if (editingPage === null) return null;
    try {
      return clean(formValuesToPage(watchedValues));
    } catch {
      return null;
    }
  })();

  const openEdit = (page) => {
    setEditingPage(page.page_number);
    reset(pageToFormValues(page));
  };

  const openNew = () => {
    const newPage = emptyPage(pages);
    setEditingPage('new');
    reset(pageToFormValues(newPage));
  };

  const cancelEdit = () => {
    setEditingPage(null);
    reset(pageToFormValues(emptyPage(pages)));
  };

  const onSubmit = (data) => {
    const page = clean(formValuesToPage(data));
    // Initialise override from loader if not yet edited
    const loaderData = getLessonPages(planetSlug);
    const current = getLessonsOverride(planetSlug) || { planet_slug: planetSlug, pages: loaderData?.pages || [] };
    saveLessonPage(planetSlug, page, current.pages);
    // Refresh
    const updated = getLessonsOverride(planetSlug);
    setPages(updated?.pages || []);
    setEditingPage(null);
    reset(pageToFormValues(emptyPage(updated?.pages || [])));
  };

  const handleDelete = (pageNumber) => {
    if (!window.confirm(`Delete page ${pageNumber}?`)) return;
    // Ensure override exists before deleting
    const loaderData = getLessonPages(planetSlug);
    const current = getLessonsOverride(planetSlug) || { planet_slug: planetSlug, pages: loaderData?.pages || [] };
    if (!getLessonsOverride(planetSlug)) {
      saveLessonsOverride(planetSlug, current);
    }
    deleteLessonPage(planetSlug, pageNumber);
    const updated = getLessonsOverride(planetSlug);
    setPages(updated?.pages || []);
    if (editingPage === pageNumber) cancelEdit();
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/admin" className="btn btn-sm btn-outline-secondary">
          Back
        </Link>
        <h2 className="mb-0" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Lesson Editor — {planetSlug}
        </h2>
        <span className="badge bg-secondary">{pages.length} pages</span>
      </div>

      <div className="row g-4">
        {/* Left: page list + form */}
        <div className="col-xl-7">
          {/* Page list */}
          <div className="card shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center fw-semibold">
              Pages
              <button className="btn btn-sm btn-primary" onClick={openNew}>+ Add Page</button>
            </div>
            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              <table className="table table-sm table-hover mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Characters</th>
                    <th>Message preview</th>
                    <th style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr
                      key={page.page_number}
                      className={editingPage === page.page_number ? 'table-primary' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => openEdit(page)}
                    >
                      <td>{page.page_number}</td>
                      <td>
                        <small>{(page.characters || []).map((c) => c.name).join(', ')}</small>
                      </td>
                      <td style={{ maxWidth: 220, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <small className="text-muted">{page.message?.text?.slice(0, 60)}</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-xs btn-outline-danger"
                          style={{ padding: '0 6px', fontSize: 11 }}
                          onClick={(e) => { e.stopPropagation(); handleDelete(page.page_number); }}
                        >
                          Del
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editor form */}
          {editingPage !== null && (
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">
                {editingPage === 'new' ? 'New Page' : `Editing Page ${editingPage}`}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-3">
                      <label className="form-label">Page #</label>
                      <input
                        type="number"
                        className={`form-control ${errors.page_number ? 'is-invalid' : ''}`}
                        {...register('page_number', { required: 'Required', min: 1 })}
                      />
                      {errors.page_number && <div className="invalid-feedback">{errors.page_number.message}</div>}
                    </div>

                    {/* Characters */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Characters</label>
                      {charFields.map((f, idx) => (
                        <div key={f.id} className="row g-2 mb-2 align-items-center">
                          <div className="col-5">
                            <select className="form-select form-select-sm" {...register(`characters.${idx}.name`)}>
                              {CHARACTER_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                              <option value="">Custom…</option>
                            </select>
                          </div>
                          <div className="col-5">
                            <select className="form-select form-select-sm" {...register(`characters.${idx}.style`)}>
                              {CHARACTER_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="col-2">
                            <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeChar(idx)}>-</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => appendChar(defaultCharacter())}>
                        + Character
                      </button>
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Message</label>
                    </div>

                    <div className="col-6">
                      <label className="form-label small">Speaker</label>
                      <input className="form-control form-control-sm" {...register('message_speaker')} placeholder="e.g. Allie" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small">Speaker Style</label>
                      <select className="form-select form-select-sm" {...register('message_speaker_style')}>
                        {SPEAKER_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small">Message Style</label>
                      <select className="form-select form-select-sm" {...register('message_style')}>
                        {MESSAGE_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Header (optional)</label>
                      <input className="form-control form-control-sm" {...register('message_header')} />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Text <span className="text-danger">*</span>
                        <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>Use &lt;v&gt;word** for vocab, &lt;b&gt;text** for bold</span>
                      </label>
                      <textarea
                        className={`form-control ${errors.message_text ? 'is-invalid' : ''}`}
                        rows={4}
                        {...register('message_text', { required: 'Message text is required' })}
                      />
                      {errors.message_text && <div className="invalid-feedback">{errors.message_text.message}</div>}
                    </div>

                    {/* Buttons */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Buttons</label>
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Prev page</label>
                      <input type="number" className="form-control form-control-sm" {...register('buttons_prev')} placeholder="page #" />
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Next page</label>
                      <input type="number" className="form-control form-control-sm" {...register('buttons_next')} placeholder="page #" />
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Continue → page</label>
                      <input type="number" className="form-control form-control-sm" {...register('buttons_continue_next')} placeholder="page #" />
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Continue button text</label>
                      <input className="form-control form-control-sm" {...register('buttons_continue_text')} placeholder="e.g. Let's go!" />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary btn-sm">Save Page</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live preview */}
        <div className="col-xl-5">
          <div style={{ position: 'sticky', top: 16 }}>
            <LessonPreview page={previewPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
