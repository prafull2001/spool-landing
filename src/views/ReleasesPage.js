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
function CopyButton({ label, getText, primary = false }) {
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
    <button className={`rel-copy-btn ${primary ? 'primary' : ''}`} onClick={handleCopy}>
      {copied ? 'Copied ✓' : label}
      <span className="rel-token-hint">~{tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : tokens} tok</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ReleasesPage() {
  const [expanded, setExpanded] = useState(() =>
    RELEASES.length ? { [RELEASES[0].version]: true } : {}
  );
  const versions = RELEASES.map(r => r.version); // newest first
  const [rangeFrom, setRangeFrom] = useState(versions[versions.length - 1] || '');
  const [rangeTo, setRangeTo] = useState(versions[0] || '');

  const rangeReleases = useMemo(() => {
    const iFrom = versions.indexOf(rangeFrom);
    const iTo = versions.indexOf(rangeTo);
    if (iFrom === -1 || iTo === -1) return [];
    const [hi, lo] = iFrom > iTo ? [iFrom, iTo] : [iTo, iFrom];
    return RELEASES.slice(lo, hi + 1);
  }, [rangeFrom, rangeTo, versions]);

  const toggle = v => setExpanded(e => ({ ...e, [v]: !e[v] }));

  if (!RELEASES.length) {
    return (
      <div className="rel-panel">
        <p className="rel-empty">Release notes are being generated — check back shortly.</p>
      </div>
    );
  }

  return (
    <div className="rel-panel">
      <div className="rel-intro">
        <h2>App Release Context</h2>
        <p>
          What shipped in each iOS app version, written to be pasted into Claude
          chats next to RevenueCat or PostHog data. Every copy includes a
          preamble explaining Spool, the version↔funnel mapping table, and the
          known data quirks — so a fresh chat needs nothing else.
        </p>
        <div className="rel-actions">
          <CopyButton
            primary
            label="Copy ALL versions for Claude"
            getText={() => buildCopyText(RELEASES)}
          />
          <CopyButton
            label="Copy mapping table + quirks only"
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
            <span>Copy range:</span>
            <select value={rangeFrom} onChange={e => setRangeFrom(e.target.value)}>
              {versions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <span>→</span>
            <select value={rangeTo} onChange={e => setRangeTo(e.target.value)}>
              {versions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <CopyButton
              label="Copy range"
              getText={() => buildCopyText(rangeReleases)}
            />
          </div>
        </div>
      </div>

      <div className="rel-mapping">
        <h3>Version ↔ funnel mapping</h3>
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
                <tr key={r.version}>
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
      </div>

      <div className="rel-quirks">
        <MdBlock md={DATA_QUIRKS_MD} />
      </div>

      <div className="rel-quirks">
        <MdBlock md={MAPPING_NOTES_MD} />
      </div>

      <div className="rel-timeline">
        {RELEASES.map(r => (
          <div key={r.version} className={`rel-card ${expanded[r.version] ? 'open' : ''}`}>
            <button className="rel-card-head" onClick={() => toggle(r.version)}>
              <div className="rel-card-title">
                <span className="rel-version">{r.version}</span>
                <span className="rel-headline">{r.headline}</span>
              </div>
              <div className="rel-card-meta">
                <span>{r.releaseDate} → {r.liveUntil || 'now'}</span>
                <span>{r.commitCount} commits</span>
                <span className="rel-chevron">{expanded[r.version] ? '▾' : '▸'}</span>
              </div>
            </button>
            {expanded[r.version] && (
              <div className="rel-card-body">
                <div className="rel-card-actions">
                  <CopyButton
                    primary
                    label={`Copy ${r.version} for Claude`}
                    getText={() => buildCopyText([r])}
                  />
                  <CopyButton
                    label="Copy notes only (no preamble)"
                    getText={() => buildCopyText([r], { includePreamble: false })}
                  />
                </div>
                {r.sections.map(s => (
                  <div key={s.title} className="rel-section">
                    <h4>{s.title}</h4>
                    <MdBlock md={s.md} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
