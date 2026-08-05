"use client";
import React, { useMemo, useState } from 'react';
import {
  RELEASES,
  CLAUDE_PREAMBLE,
  DATA_QUIRKS_MD,
  MAPPING_NOTES_MD,
  mappingTableMarkdown,
  buildCopyText,
  estimateTokens,
} from '../data/releaseNotes';
import './ReleasesPage.css';

// ---------------------------------------------------------------------------
// Tiny markdown renderer for the subset used in release notes:
// ### headings, - bullets, **bold**, `code`, paragraphs. Content is our own
// hand-curated data (no user input), so this stays deliberately simple.
// ---------------------------------------------------------------------------
function inlineMd(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MdBlock({ md }) {
  const blocks = useMemo(() => {
    const out = [];
    let bullets = null;
    for (const raw of md.split('\n')) {
      const line = raw.trimEnd();
      const isBullet = /^\s*-\s+/.test(line);
      if (isBullet) {
        if (!bullets) bullets = [];
        bullets.push(line.replace(/^\s*-\s+/, ''));
        continue;
      }
      if (bullets) { out.push({ type: 'ul', items: bullets }); bullets = null; }
      if (!line.trim()) continue;
      if (line.startsWith('### ')) out.push({ type: 'h4', text: line.slice(4) });
      else out.push({ type: 'p', text: line });
    }
    if (bullets) out.push({ type: 'ul', items: bullets });
    return out;
  }, [md]);

  return (
    <div className="rel-md">
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul key={i}>
              {b.items.map((item, j) => <li key={j}>{inlineMd(item)}</li>)}
            </ul>
          );
        }
        if (b.type === 'h4') return <h4 key={i}>{inlineMd(b.text)}</h4>;
        return <p key={i}>{inlineMd(b.text)}</p>;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy button with "Copied ✓" feedback and a token-size hint.
// ---------------------------------------------------------------------------
function CopyButton({ label, getText, primary = false, compact = false }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => estimateTokens(getText()), [getText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
    } catch {
      // Clipboard API can fail on http/permissions — fall back to a textarea.
      const ta = document.createElement('textarea');
      ta.value = getText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      className={`rel-copy-btn ${primary ? 'primary' : ''} ${compact ? 'compact' : ''}`}
      onClick={handleCopy}
    >
      {copied ? 'Copied ✓' : label}
      <span className="rel-token-hint">~{tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : tokens} tok</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page — sticky version sidebar + one detail panel; reference material
// (mapping table, quirks) lives in collapsible sections up top.
// ---------------------------------------------------------------------------
export default function ReleasesPage() {
  const versions = RELEASES.map(r => r.version); // newest first
  const [selected, setSelected] = useState(versions[0] || '');
  const [rangeFrom, setRangeFrom] = useState(versions[versions.length - 1] || '');
  const [rangeTo, setRangeTo] = useState(versions[0] || '');

  const current = RELEASES.find(r => r.version === selected);

  const rangeReleases = useMemo(() => {
    const iFrom = versions.indexOf(rangeFrom);
    const iTo = versions.indexOf(rangeTo);
    if (iFrom === -1 || iTo === -1) return [];
    const [hi, lo] = iFrom > iTo ? [iFrom, iTo] : [iTo, iFrom];
    return RELEASES.slice(lo, hi + 1);
  }, [rangeFrom, rangeTo, versions]);

  if (!RELEASES.length) {
    return (
      <div className="rel-panel">
        <p className="rel-empty">Release notes are being generated — check back shortly.</p>
      </div>
    );
  }

  const facts = current
    ? [
        { label: 'Live window', value: `${current.releaseDate} → ${current.liveUntil || 'now'}` },
        { label: 'flow_version', value: current.flowVersions },
        { label: 'Cohorts', value: current.cohorts },
        { label: 'Paywall', value: current.paywall },
        { label: 'Pricing', value: current.pricing },
      ].filter(f => f.value && f.value !== '—')
    : [];

  return (
    <div className="rel-panel">
      <div className="rel-toolbar">
        <div className="rel-toolbar-copy">
          <h2>App Release Context</h2>
          <p>
            Per-version context packs for Claude chats — each copy includes the
            Spool preamble, the version↔funnel mapping table, and the known data
            quirks, so a fresh chat needs nothing else.
          </p>
        </div>
        <div className="rel-toolbar-actions">
          <CopyButton primary label="Copy ALL versions" getText={() => buildCopyText(RELEASES)} />
          <CopyButton
            label="Copy mapping + quirks"
            getText={() =>
              [
                CLAUDE_PREAMBLE.trim(),
                mappingTableMarkdown(),
                MAPPING_NOTES_MD.trim(),
                DATA_QUIRKS_MD.trim(),
              ].join('\n\n')
            }
          />
          <div className="rel-range">
            <select value={rangeFrom} onChange={e => setRangeFrom(e.target.value)}>
              {versions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <span>→</span>
            <select value={rangeTo} onChange={e => setRangeTo(e.target.value)}>
              {versions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <CopyButton compact label="Copy range" getText={() => buildCopyText(rangeReleases)} />
          </div>
        </div>
      </div>

      <details className="rel-collapse">
        <summary>Version ↔ funnel mapping table</summary>
        <div className="rel-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Version</th><th>Released</th><th>Live until</th>
                <th>flow_version</th><th>Cohorts</th><th>Paywall</th><th>Pricing</th>
              </tr>
            </thead>
            <tbody>
              {RELEASES.map(r => (
                <tr
                  key={r.version}
                  className={r.version === selected ? 'active' : ''}
                  onClick={() => setSelected(r.version)}
                >
                  <td className="rel-v">{r.version}</td>
                  <td>{r.releaseDate}</td>
                  <td>{r.liveUntil || 'current'}</td>
                  <td>{inlineMd(r.flowVersions || '—')}</td>
                  <td>{inlineMd(r.cohorts || '—')}</td>
                  <td>{inlineMd(r.paywall || '—')}</td>
                  <td>{inlineMd(r.pricing || '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <details className="rel-collapse">
        <summary>Data quirks & cross-version joining rules</summary>
        <div className="rel-collapse-body">
          <MdBlock md={DATA_QUIRKS_MD} />
          <MdBlock md={MAPPING_NOTES_MD} />
        </div>
      </details>

      <div className="rel-layout">
        <nav className="rel-sidebar" aria-label="App versions">
          {RELEASES.map(r => (
            <button
              key={r.version}
              className={`rel-nav-item ${r.version === selected ? 'active' : ''}`}
              onClick={() => setSelected(r.version)}
            >
              <span className="rel-nav-version">
                {r.version}
                {!r.liveUntil && <span className="rel-live-dot" title="Currently live" />}
              </span>
              <span className="rel-nav-dates">
                {r.releaseDate.slice(5)} → {r.liveUntil ? r.liveUntil.slice(5) : 'now'}
              </span>
              <span className="rel-nav-headline">{r.headline}</span>
            </button>
          ))}
        </nav>

        {current && (
          <article className="rel-detail" key={current.version}>
            <header className="rel-detail-head">
              <div className="rel-detail-title">
                <h3>
                  {current.version}
                  {!current.liveUntil && <span className="rel-live-badge">LIVE</span>}
                </h3>
                <p>{current.headline}</p>
              </div>
              <div className="rel-detail-copy">
                <CopyButton
                  primary
                  label={`Copy ${current.version} for Claude`}
                  getText={() => buildCopyText([current])}
                />
                <CopyButton
                  compact
                  label="Notes only"
                  getText={() => buildCopyText([current], { includePreamble: false })}
                />
              </div>
            </header>

            <dl className="rel-facts">
              {facts.map(f => (
                <div key={f.label} className="rel-fact">
                  <dt>{f.label}</dt>
                  <dd>{inlineMd(f.value)}</dd>
                </div>
              ))}
              <div className="rel-fact">
                <dt>Commits</dt>
                <dd>{current.commitCount}</dd>
              </div>
            </dl>

            {current.sections.map(s => (
              <section key={s.title} className="rel-section">
                <h4>{s.title}</h4>
                <MdBlock md={s.md} />
              </section>
            ))}
          </article>
        )}
      </div>
    </div>
  );
}
