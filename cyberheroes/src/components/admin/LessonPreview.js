/**
 * LessonPreview — shows a visual approximation of how a lesson page will
 * look in the actual lesson, updating live as the form fields change.
 *
 * Characters are shown as styled placeholder boxes (the real images use
 * require.context which can't be called with dynamic values at admin time).
 */
import React from 'react';

const COLORS = {
  'Cyber Hero': '#4cc9f0',
  'Allie': '#f72585',
  'Alejandro': '#7209b7',
  'Patrick': '#e63946',
};

function CharacterPlaceholder({ name, style }) {
  const color = COLORS[name] || '#999';
  const isRight = style && style.includes('character-right');
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        [isRight ? 'right' : 'left']: '5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 60,
          height: 80,
          borderRadius: '8px 8px 0 0',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 10,
          textAlign: 'center',
          padding: 4,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function renderPreviewText(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(<[^*]+>[^*]+\*\*)/g);
    return (
      <p key={i} style={{ margin: '0 0 4px' }}>
        {parts.map((part, j) => {
          if (part.startsWith('<v>') && part.endsWith('**')) {
            return (
              <span key={j} style={{ color: '#f5a623', fontWeight: 700, cursor: 'pointer', borderBottom: '1px dashed #f5a623' }}>
                {part.slice(3, -2)}
              </span>
            );
          }
          if (part.startsWith('<b>') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(3, -2)}</strong>;
          }
          if (part.startsWith('<red>') && part.endsWith('**')) {
            return <span key={j} style={{ color: '#e63946' }}>{part.slice(5, -2)}</span>;
          }
          if (part.startsWith('<gold>') && part.endsWith('**')) {
            return <span key={j} style={{ color: '#f5a623' }}>{part.slice(6, -2)}</span>;
          }
          if (part.startsWith('<u>') && part.endsWith('**')) {
            return <span key={j} style={{ textDecoration: 'underline' }}>{part.slice(3, -2)}</span>;
          }
          return part;
        })}
      </p>
    );
  });
}

export default function LessonPreview({ page }) {
  if (!page) {
    return (
      <div className="card shadow-sm h-100" style={{ minHeight: 300 }}>
        <div className="card-header fw-semibold">Live Preview</div>
        <div className="card-body d-flex align-items-center justify-content-center text-muted">
          Select or fill a page to preview.
        </div>
      </div>
    );
  }

  const characters = page.characters || [];
  const message = page.message || {};
  const hasCharacters = characters.length > 0;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header fw-semibold d-flex justify-content-between">
        <span>Live Preview</span>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Page {page.page_number}</span>
      </div>
      <div className="card-body p-0 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #1a1a4e, #0d0d2b)' }}>
        <div
          style={{
            position: 'relative',
            height: 380,
            overflow: 'hidden',
            padding: 0,
          }}
        >
          {/* Characters */}
          {hasCharacters && (
            <div style={{ position: 'absolute', bottom: 120, width: '100%', left: 0 }}>
              {characters.map((ch, i) => (
                <CharacterPlaceholder key={i} name={ch.name} style={ch.style} />
              ))}
            </div>
          )}

          {/* Message box */}
          {message.text && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255,255,255,0.95)',
                borderTop: '3px solid #4cc9f0',
                padding: '12px 16px 10px',
                fontSize: 13,
                color: '#1a1a2e',
                lineHeight: 1.5,
              }}
            >
              {message.speaker && (
                <div
                  style={{
                    position: 'absolute',
                    top: -28,
                    left: message.speaker_style && message.speaker_style.includes('speaker-right') ? 'auto' : 16,
                    right: message.speaker_style && message.speaker_style.includes('speaker-right') ? 16 : 'auto',
                    background: '#4cc9f0',
                    color: '#1a1a2e',
                    fontWeight: 700,
                    fontSize: 11,
                    padding: '2px 10px',
                    borderRadius: '4px 4px 0 0',
                  }}
                >
                  {message.speaker.toUpperCase()}
                </div>
              )}
              {message.header && (
                <div style={{ fontWeight: 700, marginBottom: 6, color: '#1a1a2e' }}>
                  {renderPreviewText(message.header)}
                </div>
              )}
              <div>{renderPreviewText(message.text)}</div>
              {/* Button indicators */}
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                {message.buttons?.prev && (
                  <span style={{ padding: '2px 10px', background: '#dee2e6', borderRadius: 4, fontSize: 11 }}>prev</span>
                )}
                {message.buttons?.next && (
                  <span style={{ padding: '2px 10px', background: '#4cc9f0', color: '#1a1a2e', borderRadius: 4, fontSize: 11 }}>next</span>
                )}
                {message.buttons?.continue && (
                  <span style={{ padding: '2px 10px', background: '#4A90D9', color: '#fff', borderRadius: 4, fontSize: 11 }}>
                    {message.buttons.continue.text || 'continue'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
