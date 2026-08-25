import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  addUserToLookup,
  classifyABGroup,
  filterSessionsByVersion,
  findSessionUser,
} from './analyticsModel.mjs';

const source = readFileSync(new URL('./AnalyticsPage.js', import.meta.url), 'utf8');

function catalogNames(name) {
  const catalog = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\];`));
  assert.ok(catalog, `${name} is missing`);
  return [...catalog[1].matchAll(/name: '([^']+)'/g)].map(match => match[1]);
}

test('v14 dashboard catalog matches the Firestore screen-name contract', () => {
  assert.deepEqual(catalogNames('SCREEN_ORDER_V14'), [
    'opening_carousel',
    'display_name',
    'age_selection',
    'screen_time_slider',
    'phone_usage_stats',
    'lifetime_stats',
    'average_lifespan',
    'review_request',
    'goal',
    'when_rot',
    'notification_priming',
    'referral_source',
    'thirty_day_transformation',
    'commitment_reason',
    'commitment_hold',
    'before_after',
    'first_week_roadmap',
    'personalized_plan',
    'sky_paywall',
    'welcome_to_spool',
    'name_collection',
    'create_account',
    'notification_permission',
    'schedule_selection',
    'choose_apps',
    'daily_limit_explanation',
    'daily_request_pool',
    'excuse_explanation',
    'pattern_explanation',
    'focus_hub_alternative',
    'blocking_confirmation',
  ]);
});

test('v10 dashboard catalog matches the current 4.27 Firestore contract', () => {
  assert.deepEqual(catalogNames('SCREEN_ORDER_V10'), [
    'welcome',
    'meet_spooli',
    'thread_unravel',
    'see_for_yourself',
    'modern_apps',
    'focus_web_intro',
    'instagram_reels_demo',
    'focus_web_apps',
    'how_did_you_hear',
    'chat_onboarding',
    'goal',
    'screen_time_affect',
    'profession',
    'when_rot',
    'tried_before',
    'age_selection',
    'screen_time_slider',
    'screen_time_connect',
    'screen_time_dialog',
    'notification_priming',
    'progress_bar',
    'grounding_breath',
    'archetype_reveal',
    'review_request',
    'top_app_demon',
    'phone_usage_stats',
    'lifetime_stats',
    'average_lifespan',
    'academic_studies',
    'weekly_benefits',
    'commitment_reason',
    'commitment_hold',
    'before_after',
    'personalized_plan',
    'sky_paywall',
    'welcome_to_spool',
    'name_collection',
    'create_account',
    'notification_permission',
    'schedule_selection',
    'choose_apps',
    'daily_limit_explanation',
    'daily_request_pool',
    'excuse_explanation',
    'pattern_explanation',
    'focus_hub_alternative',
    'blocking_confirmation',
  ]);
});

test('current v10 traffic is the default while v14 remains independently selectable', () => {
  const sessions = [
    { id: 'legacy' },
    { id: 'v6', flow_version: 6 },
    { id: 'v9', flow_version: 9 },
    { id: 'v10', flow_version: 10 },
    { id: 'v14', flow_version: 14 },
  ];

  assert.deepEqual(filterSessionsByVersion(sessions, 'v6').map(s => s.id), ['v6', 'v9']);
  assert.deepEqual(filterSessionsByVersion(sessions, 'v10').map(s => s.id), ['v10']);
  assert.deepEqual(filterSessionsByVersion(sessions, 'v14').map(s => s.id), ['v14']);
  assert.match(source, /useState\('v10'\)/);
  assert.match(source, /\{ id: 'v10', label: 'Current \(v10\)'/);
  assert.match(source, /\{ id: 'v14', label: 'New Carousel \(v14\)'/);
});

test('legacy A/B membership is explicit and unavailable on later deterministic flows', () => {
  const surveys = new Map([
    ['group-a', { ab_showVideoIntro: true }],
    ['group-b', { ab_showVideoIntro: false }],
    ['missing', {}],
  ]);
  const randomizedSession = device_id => ({
    device_id,
    started_at: { toDate: () => new Date('2026-03-20T12:00:00Z') },
  });

  assert.equal(classifyABGroup(randomizedSession('group-a'), surveys, 'v2'), 'A');
  assert.equal(classifyABGroup(randomizedSession('group-b'), surveys, 'v2'), 'B');
  assert.equal(classifyABGroup(randomizedSession('missing'), surveys, 'v2'), null);
  assert.equal(classifyABGroup({ ...randomizedSession('group-a'), started_at: '2026-04-10' }, surveys, 'v2'), null);
  assert.equal(classifyABGroup({ device_id: 'group-a' }, surveys, 'v2'), null);
  assert.equal(classifyABGroup(randomizedSession('group-a'), surveys, 'v14'), null);
  assert.match(source, /const showABControls = supportsABSplit && \(abGroups\.groupA\.length > 0 \|\| abGroups\.groupB\.length > 0\)/);
  assert.match(source, /splitByAB && showABControls/);
  assert.match(source, /\{showABControls && \(/);
  assert.match(source, /showABControls && <td>\{row\.abGroup\}<\/td>/);
  assert.match(source, /row\.abGroup !== '--' && row\.survey\.ab_showVideoIntro !== undefined/);
});

test('device fallback exposes a user only when the identifier is unambiguous', () => {
  const users = new Map();
  addUserToLookup(users, 'uid-1', { email: 'one@example.com', onboardingDeviceId: 'shared' });
  addUserToLookup(users, 'uid-2', { email: 'two@example.com', onboardingDeviceId: 'shared' });
  addUserToLookup(users, 'uid-3', { email: 'three@example.com', onboardingDeviceId: 'unique' });

  assert.equal(findSessionUser({ uid: 'uid-1', device_id: 'shared' }, users)?.email, 'one@example.com');
  assert.equal(findSessionUser({ uid: 'missing', device_id: 'unique' }, users), null);
  assert.equal(findSessionUser({ device_id: 'shared' }, users), null);
  assert.equal(findSessionUser({ device_id: 'unique' }, users)?.email, 'three@example.com');
});

test('the active cohort is revealed inside the horizontal selector', () => {
  assert.match(source, /const revealSelectedVersion = useCallback\(node =>/);
  assert.match(source, /container\.scrollLeft \+= offset - \(container\.clientWidth - node\.clientWidth\) \/ 2/);
  assert.match(source, /ref=\{version === v\.id \? revealSelectedVersion : null\}/);
});

test('session explorer reports the persisted stop screen when available', () => {
  assert.match(source, /let lastScreen = s\.last_screen_name \|\| '--'/);
});
