import assert from 'node:assert/strict';
import test from 'node:test';
import {
  endOfLocalDay,
  formatLocalDate,
  startOfLocalDay,
} from './dateRange.mjs';

test('HTML date strings remain the selected local calendar day', () => {
  const start = startOfLocalDay('2026-08-27');
  const end = endOfLocalDay('2026-09-24');

  assert.deepEqual(
    [start.getFullYear(), start.getMonth(), start.getDate(), start.getHours()],
    [2026, 7, 27, 0],
  );
  assert.deepEqual(
    [end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMilliseconds()],
    [2026, 8, 24, 23, 999],
  );
  assert.equal(formatLocalDate(start), '2026-08-27');
  assert.equal(formatLocalDate(end), '2026-09-24');
});

test('calendar helpers reject rolled-over or ambiguous dates', () => {
  for (const value of ['2026-09-31', '09/24/2026', '2026-9-24', '', null]) {
    assert.throws(() => startOfLocalDay(value));
  }
});
