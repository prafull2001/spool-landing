import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRevenueCatTimestamp,
  normalizeRevenueCatOverview,
} from './revenueCatMetrics.mjs';

const validPayload = {
  activeSubscriptions: 250,
  activeTrials: 2,
  revenueCatUpdatedAt: null,
  fetchedAt: '2026-09-03T16:00:00+00:00',
  source: 'revenuecat_overview',
};

test('normalizes the server-authorized RevenueCat overview response', () => {
  assert.deepEqual(normalizeRevenueCatOverview(validPayload), {
    activeSubscriptions: 250,
    activeTrials: 2,
    revenueCatUpdatedAt: null,
    fetchedAt: '2026-09-03T16:00:00+00:00',
  });
});

test('rejects malformed, negative, fractional, and mislabeled counts', () => {
  for (const payload of [
    null,
    { ...validPayload, source: 'firestore' },
    { ...validPayload, activeSubscriptions: -1 },
    { ...validPayload, activeSubscriptions: 1.5 },
    { ...validPayload, activeSubscriptions: '250' },
    { ...validPayload, fetchedAt: 'not-a-date' },
  ]) {
    assert.throws(() => normalizeRevenueCatOverview(payload));
  }
});

test('uses RevenueCat update time when available and fetch time otherwise', () => {
  const formatterOptions = { timeZone: 'UTC' };
  const previousDefault = process.env.TZ;
  process.env.TZ = formatterOptions.timeZone;
  try {
    assert.match(formatRevenueCatTimestamp(validPayload, 'en-US'), /Sep 3, 2026/);
    assert.match(formatRevenueCatTimestamp({
      ...validPayload,
      revenueCatUpdatedAt: '2026-09-02T10:30:00Z',
    }, 'en-US'), /Sep 2, 2026/);
  } finally {
    if (previousDefault == null) delete process.env.TZ;
    else process.env.TZ = previousDefault;
  }
});
