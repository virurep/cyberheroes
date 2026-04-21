import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPlanets, getLessonPages, getAllQuizzes } from '../../content/loader';
import { getPlanetOverrides, deletePlanetOverride } from '../../admin/data';

export default function PlanetList() {
  const [, forceUpdate] = useState(0);

  // Merge loader planets with admin overrides
  const loaderPlanets = getAllPlanets();
  const overrides = getPlanetOverrides();

  const allSlugs = Array.from(
    new Set([...loaderPlanets.map((p) => p.slug), ...Object.keys(overrides)])
  );

  const planets = allSlugs.map((slug) => {
    const base = loaderPlanets.find((p) => p.slug === slug) || {};
    const override = overrides[slug] || {};
    return { ...base, ...override, _hasOverride: !!overrides[slug] };
  }).sort((a, b) => {
    const oa = typeof a.order === 'number' ? a.order : Infinity;
    const ob = typeof b.order === 'number' ? b.order : Infinity;
    return oa - ob || (a.slug || '').localeCompare(b.slug || '');
  });

  const handleDelete = (slug) => {
    const loaderHas = loaderPlanets.some((p) => p.slug === slug);
    const msg = loaderHas
      ? `Remove admin overrides for "${slug}"? The original loader data will remain.`
      : `Permanently delete admin-created planet "${slug}"?`;
    if (!window.confirm(msg)) return;
    deletePlanetOverride(slug);
    forceUpdate((n) => n + 1);
  };

  const getLessonCount = (slug) => {
    const lesson = getLessonPages(slug);
    return lesson?.pages?.length ?? '–';
  };

  const getQuizCount = (slug) => {
    const quizzes = getAllQuizzes(slug);
    return Object.keys(quizzes).length || '–';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Planets
        </h2>
        <Link className="btn btn-primary" to="/admin/planets/new">
          + New Planet
        </Link>
      </div>

      {planets.length === 0 && (
        <div className="alert alert-info">No planets found. Create one to get started.</div>
      )}

      <div className="row g-3">
        {planets.map((planet) => (
          <div className="col-12" key={planet.slug}>
            <div
              className="card shadow-sm"
              style={{
                borderLeft: `4px solid ${planet.theme?.primary || '#4cc9f0'}`,
              }}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h5 className="mb-0" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                      {planet.name || planet.slug}
                      {planet._hasOverride && (
                        <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '0.65rem' }}>
                          Edited
                        </span>
                      )}
                      {planet.active === false && (
                        <span className="badge bg-secondary ms-2" style={{ fontSize: '0.65rem' }}>
                          Inactive
                        </span>
                      )}
                    </h5>
                    <small className="text-muted">
                      slug: <code>{planet.slug}</code>
                      {planet.title && ` — ${planet.title}`}
                    </small>
                  </div>
                  <div className="col-md-2 text-center">
                    <div className="fw-semibold">{getLessonCount(planet.slug)}</div>
                    <small className="text-muted">Lesson pages</small>
                  </div>
                  <div className="col-md-2 text-center">
                    <div className="fw-semibold">{getQuizCount(planet.slug)}</div>
                    <small className="text-muted">Quizzes</small>
                  </div>
                  <div className="col-md-3 d-flex gap-2 justify-content-end flex-wrap">
                    <Link
                      className="btn btn-sm btn-outline-secondary"
                      to={`/admin/planets/${planet.slug}/lessons`}
                    >
                      Lessons
                    </Link>
                    <Link
                      className="btn btn-sm btn-outline-secondary"
                      to={`/admin/planets/${planet.slug}/quizzes`}
                    >
                      Quizzes
                    </Link>
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to={`/admin/planets/${planet.slug}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(planet.slug)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
