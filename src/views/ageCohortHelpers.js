"use client";
// Pure computation for the Age Cohort Funnel report (SPO-176).
// No React, no Firebase, no side effects. Mirrors the helper pattern in excuseDataHelpers.js.

export const AGE_BUCKETS = ['13-17', '18-24', '25-34', '35+'];
export const NO_AGE_LABEL = 'No age recorded';

export function getAgeBucket(age) {
  if (typeof age !== 'number' || !Number.isFinite(age)) return null;
  if (age >= 13 && age <= 17) return '13-17';
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 34) return '25-34';
  if (age >= 35) return '35+';
  return null;
}

function makeRow(label) {
  return {
    label,
    surveys: 0,
    reachedPaywall: 0,
    completedAccount: 0,
    activeSub: 0,
  };
}

/**
 * Bucket onboarding surveys into age cohorts and compute funnel counts.
 *
 * The caller is responsible for date-range filtering before calling — pass only
 * surveys whose updatedAt falls in the requested window. This keeps the helper
 * pure and trivially testable.
 *
 * @param {Object} args
 * @param {Array}  args.surveys             - survey docs each with shape { id, age, uid?, device_id?, ... }
 * @param {Map}    args.sessionsByDeviceId  - Map keyed by both doc-id (IDFV) and data.device_id
 * @param {Map}    args.usersByUid          - Map: uid -> user doc (must include subscriptionActive)
 * @returns {{ rows: Array, noAgeRow: Object, totals: Object }}
 */
export function computeAgeCohortFunnel({ surveys, sessionsByDeviceId, usersByUid }) {
  const rows = {
    '13-17': makeRow('13-17'),
    '18-24': makeRow('18-24'),
    '25-34': makeRow('25-34'),
    '35+': makeRow('35+'),
  };
  const noAgeRow = makeRow(NO_AGE_LABEL);

  for (const survey of surveys) {
    const bucketKey = getAgeBucket(survey.age);
    const row = bucketKey ? rows[bucketKey] : noAgeRow;
    row.surveys++;

    const session =
      sessionsByDeviceId.get(survey.id) ||
      (survey.device_id ? sessionsByDeviceId.get(survey.device_id) : null);
    if (session?.reached_paywall === true) row.reachedPaywall++;

    if (survey.uid && survey.uid !== '') {
      row.completedAccount++;
      const userDoc = usersByUid.get(survey.uid);
      if (userDoc?.subscriptionActive === true) row.activeSub++;
    }
  }

  const orderedRows = AGE_BUCKETS.map(k => rows[k]);
  const all = [...orderedRows, noAgeRow];
  const totals = {
    label: 'Total',
    surveys: all.reduce((s, r) => s + r.surveys, 0),
    reachedPaywall: all.reduce((s, r) => s + r.reachedPaywall, 0),
    completedAccount: all.reduce((s, r) => s + r.completedAccount, 0),
    activeSub: all.reduce((s, r) => s + r.activeSub, 0),
  };

  return { rows: orderedRows, noAgeRow, totals };
}

/**
 * Decorate a funnel result with stepwise conversion rates.
 * Each rate is "this step's count / previous step's count" — not vs. surveys.
 * That makes drop-off legible at every stage instead of compounding.
 */
export function withConversionRates(funnel) {
  const decorate = (row) => ({
    ...row,
    pctReachedPaywallOfSurveys: row.surveys ? row.reachedPaywall / row.surveys : 0,
    pctCompletedOfReachedPaywall: row.reachedPaywall ? row.completedAccount / row.reachedPaywall : 0,
    pctActiveSubOfCompleted: row.completedAccount ? row.activeSub / row.completedAccount : 0,
  });
  return {
    rows: funnel.rows.map(decorate),
    noAgeRow: decorate(funnel.noAgeRow),
    totals: decorate(funnel.totals),
  };
}
