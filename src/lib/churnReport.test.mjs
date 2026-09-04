import test from 'node:test';
import assert from 'node:assert/strict';
import {
  churnRowsToCsv,
  filterChurnRows,
  formatPlan,
  normalizeChurnReport,
  summarizeChurnRows,
} from './churnReport.mjs';

const rows = [
  {
    revenueCatCustomerId: 'rc-1',
    firebaseUid: 'uid-1',
    status: 'churned',
    churnedAt: '2026-06-01T12:00:00Z',
    accessEndsAt: '2026-06-03T12:00:00Z',
    recoveredAt: null,
    firstSeenAt: '2026-01-01T00:00:00Z',
    lastSeenAt: '2026-06-03T12:00:00Z',
    accountCreatedAt: null,
    displayName: 'Alex Example',
    email: 'alex@example.com',
    phoneNumber: null,
    productId: 'com.stopscrollingwith.Spool.Weekly',
    revenueCatReason: 'UNSUBSCRIBE',
    cancellationFlow: { reason: 'Too expensive', reasonText: 'Too expensive', plan: 'Weekly' },
  },
  {
    revenueCatCustomerId: 'rc-2',
    status: 'recovered',
    churnedAt: '2025-02-01T12:00:00Z',
    accessEndsAt: '2025-02-03T12:00:00Z',
    recoveredAt: '2025-02-02T12:00:00Z',
    firstSeenAt: null,
    lastSeenAt: null,
    accountCreatedAt: null,
    productId: 'com.stopscrollingwith.Spool.YearNoFreeTrial',
    cancellationFlow: null,
  },
];

const payload = {
  source: 'revenuecat_customer_history',
  fetchedAt: '2026-09-04T12:00:00Z',
  rows,
  counts: { all: 2, churned: 1, scheduled: 0, recovered: 1, withInAppReason: 1 },
};

test('normalizes the server-authorized lifetime churn payload', () => {
  assert.deepEqual(normalizeChurnReport(payload), {
    fetchedAt: payload.fetchedAt,
    rows,
    counts: payload.counts,
  });
});

test('rejects mislabeled, malformed, and invalid churn payloads', () => {
  for (const invalid of [
    null,
    { ...payload, source: 'firestore' },
    { ...payload, counts: { ...payload.counts, all: -1 } },
    { ...payload, rows: [{ ...rows[0], status: 'active' }] },
    { ...payload, rows: [{ ...rows[0], churnedAt: 'not-a-date' }] },
  ]) {
    assert.throws(() => normalizeChurnReport(invalid));
  }
});

test('filters lifetime rows by decision date, status, and any customer detail', () => {
  const dateFiltered = filterChurnRows(rows, {
    dateFrom: new Date('2026-01-01T00:00:00Z'),
    dateTo: new Date('2026-12-31T23:59:59Z'),
  });
  assert.deepEqual(dateFiltered.map(row => row.revenueCatCustomerId), ['rc-1']);
  assert.deepEqual(filterChurnRows(rows, { status: 'recovered' }), [rows[1]]);
  assert.deepEqual(filterChurnRows(rows, { search: 'too expensive' }), [rows[0]]);
  assert.deepEqual(filterChurnRows(rows, { search: 'alex@example.com' }), [rows[0]]);
});

test('summarizes the currently filtered rows and presents plan labels', () => {
  assert.deepEqual(summarizeChurnRows(rows), {
    all: 2,
    churned: 1,
    scheduled: 0,
    recovered: 1,
    withInAppReason: 1,
  });
  assert.equal(formatPlan(rows[0]), 'Weekly');
  assert.equal(formatPlan(rows[1]), 'Annual · no trial');
});

test('CSV export includes hidden detail and neutralizes spreadsheet formulas', () => {
  const csv = churnRowsToCsv([{ ...rows[0], displayName: '=IMPORTXML("bad")' }]);
  assert.match(csv, /In-app reason/);
  assert.match(csv, /Too expensive/);
  assert.match(csv, /"'=IMPORTXML\(""bad""\)"/);
});
