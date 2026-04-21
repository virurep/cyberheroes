import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getAllPlanets, getLessonPages, getVocab, getAllQuizzes } from '../../content/loader';
import { getPlanetOverrides, getLessonsOverride, getQuizOverrides } from '../../admin/data';
import PlanetList from './PlanetList';
import PlanetForm from './PlanetForm';
import LessonEditor from './LessonEditor';
import QuizEditor from './QuizEditor';

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

async function buildAndDownloadZip() {
  const zip = new JSZip();
  const planetsFolder = zip.folder('planets');

  const loaderPlanets = getAllPlanets();
  const overrides = getPlanetOverrides();

  // Build the merged planet list: loader planets updated with any admin overrides,
  // plus any brand-new planets that only exist in admin overrides.
  const allSlugs = new Set([
    ...loaderPlanets.map((p) => p.slug),
    ...Object.keys(overrides),
  ]);

  for (const slug of allSlugs) {
    const loaderManifest = loaderPlanets.find((p) => p.slug === slug) || {};
    const override = overrides[slug] || {};
    const manifest = { ...loaderManifest, ...override };

    const planetFolder = planetsFolder.folder(slug);
    planetFolder.file('manifest.json', JSON.stringify(manifest, null, 2));

    // lessons
    const loaderLessons = getLessonPages(slug) || { planet_slug: slug, pages: [] };
    const lessonOverride = getLessonsOverride(slug);
    const lessons = lessonOverride || loaderLessons;
    planetFolder.file('lesson.json', JSON.stringify(lessons, null, 2));

    // vocab (pass through — admin doesn't edit vocab yet)
    const vocab = getVocab(slug);
    if (vocab) {
      planetFolder.file('vocab.json', JSON.stringify(vocab, null, 2));
    }

    // quizzes
    const loaderQuizzes = getAllQuizzes(slug) || {};
    const quizOverrides = getQuizOverrides(slug) || {};
    const allQuizSlugs = new Set([
      ...Object.keys(loaderQuizzes),
      ...Object.keys(quizOverrides),
    ]);
    const quizzesFolder = planetFolder.folder('quizzes');
    for (const quizSlug of allQuizSlugs) {
      const merged = { ...(loaderQuizzes[quizSlug] || {}), ...(quizOverrides[quizSlug] || {}) };
      quizzesFolder.file(`${quizSlug}.json`, JSON.stringify(merged, null, 2));
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  saveAs(blob, `planets-export-${ts}.zip`);
  return true;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminLayout() {
  const location = useLocation();
  const [exportStatus, setExportStatus] = useState(null); // null | 'exporting' | 'done' | 'error'

  const handleExport = async () => {
    setExportStatus('exporting');
    try {
      await buildAndDownloadZip();
      setExportStatus('done');
      setTimeout(() => setExportStatus(null), 4000);
    } catch (err) {
      console.error('[admin] export failed:', err);
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 4000);
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top navbar */}
      <nav className="navbar navbar-dark" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/admin" style={{ color: '#4cc9f0' }}>
            CyberHeroes Admin
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link
              className={`nav-link ${isActive('/admin') ? 'text-white' : 'text-white-50'}`}
              to="/admin"
            >
              Planets
            </Link>
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: exportStatus === 'done' ? '#2ecc71' : exportStatus === 'error' ? '#e74c3c' : '#4cc9f0',
                color: '#1a1a2e',
                fontWeight: 600,
              }}
              onClick={handleExport}
              disabled={exportStatus === 'exporting'}
            >
              {exportStatus === 'exporting' && (
                <span className="spinner-border spinner-border-sm me-1" role="status" />
              )}
              {exportStatus === 'done' ? 'Exported!' : exportStatus === 'error' ? 'Export Failed' : 'Export ZIP'}
            </button>
            <Link className="nav-link text-white-50" to="/" title="Back to app">
              Back to App
            </Link>
          </div>
        </div>
      </nav>

      {exportStatus === 'done' && (
        <div className="alert alert-success alert-dismissible m-3 mb-0" role="alert">
          <strong>Export complete.</strong> Drop the extracted <code>planets/</code> folder into <code>src/data/</code> to apply your changes.
          <button type="button" className="btn-close" onClick={() => setExportStatus(null)} />
        </div>
      )}

      {/* Main content */}
      <div className="container-fluid py-4 px-4">
        <Routes>
          <Route index element={<PlanetList />} />
          <Route path="planets/new" element={<PlanetForm />} />
          <Route path="planets/:planetSlug/edit" element={<PlanetForm />} />
          <Route path="planets/:planetSlug/lessons" element={<LessonEditor />} />
          <Route path="planets/:planetSlug/quizzes" element={<QuizEditor />} />
        </Routes>
      </div>
    </div>
  );
}
