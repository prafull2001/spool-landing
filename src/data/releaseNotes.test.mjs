import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const dataSource = readFileSync(new URL('./releaseNotes.js', import.meta.url), 'utf8');
const dataModule = await import(
  `data:text/javascript;base64,${Buffer.from(dataSource).toString('base64')}`
);
const pageSource = readFileSync(
  new URL('../views/ReleasesPage.js', import.meta.url),
  'utf8',
);
const cssSource = readFileSync(
  new URL('../views/ReleasesPage.css', import.meta.url),
  'utf8',
);

function contrastWithWhite(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return 1.05 / (luminance + 0.05);
}

test('4.32 is the newest merged-main snapshot, not the current live release', () => {
  const snapshot = dataModule.RELEASES[0];
  assert.equal(snapshot.version, '4.32');
  assert.equal(snapshot.stage, 'main');
  assert.equal(snapshot.releaseDate, '2026-08-25');
  assert.equal(snapshot.commitCount, 4);
  assert.match(snapshot.flowVersions, /14 \/ `prayer_lock_carousel_v14`/);
  assert.match(snapshot.flowVersions, /`existing_account_setup_v14`/);

  const currentLive = dataModule.RELEASES.filter(
    release => !release.liveUntil && release.stage !== 'main',
  );
  assert.deepEqual(currentLive.map(release => release.version), ['4.27']);
});

test('copy payloads label the main snapshot without inventing a live window', () => {
  const snapshot = dataModule.RELEASES[0];
  const mapping = dataModule.mappingTableMarkdown();
  const notes = dataModule.releaseMarkdown(snapshot);

  assert.match(mapping, /\| 4\.32 \| 2026-08-25 \(main snapshot\) \| not released \|/);
  assert.match(mapping, /\| 4\.30 \| 2026-08-24 \(main snapshot\) \| not released \|/);
  assert.match(mapping, /\| 4\.27 \| 2026-08-05 \| current \|/);
  assert.match(notes, /Main snapshot: 2026-08-25 · Not yet released · 4 commits/);
  assert.doesNotMatch(notes, /Live until: current/);
});

test('release context preserves assigned resumers and treats v5 as a fallback', () => {
  const currentLive = dataModule.RELEASES.find(release => release.version === '4.27');
  const snapshot = dataModule.RELEASES.find(release => release.version === '4.32');

  assert.match(currentLive.flowVersions, /persisted assignment on resume/);
  assert.match(snapshot.flowVersions, /only for unassigned legacy resumes/);
  assert.match(snapshot.cohorts, /existing_account_setup_v14/);
  assert.match(dataModule.DATA_QUIRKS_MD, /only a resume without a valid stored assignment falls/);
  assert.doesNotMatch(dataModule.DATA_QUIRKS_MD, /currently-deployed App Store build stamps/);
});

test('release context distinguishes Firestore exit rows from PostHog entry events', () => {
  assert.match(dataModule.DATA_QUIRKS_MD, /Firestore `onboarding_sessions\.screens_completed`/);
  assert.match(dataModule.DATA_QUIRKS_MD, /PostHog `onboarding_step_viewed` instead fires on \*\*entry\*\*/);
  assert.match(dataModule.DATA_QUIRKS_MD, /`time_on_previous_step_ms`/);
});

test('release UI renders MAIN separately from LIVE', () => {
  assert.match(pageSource, /release\.stage === 'main'/);
  assert.match(pageSource, /rel-main-badge">MAIN/);
  assert.match(pageSource, /rel-live-badge">LIVE/);
  assert.match(pageSource, /not released/);
});

test('the MAIN badge meets normal-text contrast against white', () => {
  const badge = cssSource.match(/\.rel-main-badge \{\s*background: (#[0-9a-f]{6});/i);
  assert.ok(badge, 'MAIN badge color is missing');
  assert.ok(contrastWithWhite(badge[1]) >= 4.5);
});
