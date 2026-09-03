import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyPaidSubscription,
  dedupeCohortSurveys,
  median,
  medianDurationsByScreen,
  summarizeMinutesBySubscription,
} from './analyticsMetrics.mjs';

test('median handles odd, even, invalid, and empty populations', () => {
  assert.equal(median([9, 1, 5]), 5);
  assert.equal(median([10, 2, 4, 8]), 6);
  assert.equal(median([null, '3', Number.NaN]), 3);
  assert.equal(median([]), null);
});

test('per-screen durations use occurrence medians instead of outlier-sensitive means', () => {
  const result = medianDurationsByScreen([
    { screens_completed: [{ screen_name: 'welcome', time_spent_seconds: 4 }] },
    { screens_completed: [{ screen_name: 'welcome', time_spent_seconds: 5 }] },
    { screens_completed: [{ screen_name: 'welcome', time_spent_seconds: 600 }] },
    { screens_completed: [{ screen_name: 'welcome', time_spent_seconds: null }] },
  ], ['welcome', 'paywall']);
  assert.equal(result.welcome, 5);
  assert.equal(result.paywall, 0);
});

test('paid subscription requires RevenueCat provenance and a future expiry', () => {
  const asOf = Date.parse('2026-09-02T00:00:00Z');
  const base = {
    subscriptionActive: true,
    subscriptionStateSource: 'revenuecat_webhook',
    subscriptionAccessSource: 'paid',
    subscriptionEnvironment: 'production',
  };
  assert.equal(classifyPaidSubscription({ ...base, subscriptionExpiresAt: '2026-09-03T00:00:00Z' }, asOf), 'verified_active');
  assert.equal(classifyPaidSubscription({ ...base, subscriptionExpiresAt: '2026-09-01T00:00:00Z' }, asOf), 'stale_active');
  assert.equal(classifyPaidSubscription({ subscriptionActive: true }, asOf), 'unverified_active');
  assert.equal(classifyPaidSubscription({ ...base, subscriptionAccessSource: 'trial', subscriptionExpiresAt: '2026-09-03T00:00:00Z' }, asOf), 'excluded');
  assert.equal(classifyPaidSubscription({ ...base, subscriptionEnvironment: 'sandbox', subscriptionExpiresAt: '2026-09-03T00:00:00Z' }, asOf), 'excluded');
});

test('cohort surveys deduplicate transitively across account and device identities', () => {
  const surveys = [
    { id: 'device-a', uid: 'user-1', age: 20, updatedAt: '2026-08-01T00:00:00Z' },
    { id: 'row-2', device_id: 'device-a', age: 21, updatedAt: '2026-08-02T00:00:00Z' },
    { id: 'row-3', device_id: 'device-b', uid: 'user-1', age: 22, updatedAt: '2026-08-03T00:00:00Z' },
    { id: 'device-c', uid: 'user-2', age: 30, updatedAt: '2026-08-01T00:00:00Z' },
  ];
  const result = dedupeCohortSurveys(surveys);
  assert.equal(result.length, 2);
  assert.equal(result.find(survey => survey.uid === 'user-1')?.age, 22);
});

test('cohort dedup preserves the linked account when the newest survey is device-only', () => {
  const result = dedupeCohortSurveys([
    { id: 'device-a', uid: 'user-1', age: 20, updatedAt: '2026-08-01T00:00:00Z' },
    { id: 'new-row', device_id: 'device-a', age: 21, updatedAt: '2026-08-02T00:00:00Z' },
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].uid, 'user-1');
  assert.equal(result[0].age, 21);
});

test('requested-time comparison uses per-user medians', () => {
  const result = summarizeMinutesBySubscription([
    { subscriptionActive: true, totalExtraMinutesRequested: 30 },
    { subscriptionActive: true, totalExtraMinutesRequested: 60 },
    { subscriptionActive: true, totalExtraMinutesRequested: 900 },
    { subscriptionActive: false, totalExtraMinutesRequested: 10 },
    { subscriptionActive: false, totalExtraMinutesRequested: 20 },
  ]);
  assert.equal(result.paying.medianMin, 60);
  assert.equal(result.paying.medianHrs, 1);
  assert.equal(result.free.medianMin, 15);
});
