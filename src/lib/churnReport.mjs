const STATUSES = new Set(['churned', 'scheduled', 'recovered']);

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value;
}

function timestamp(value, field, { required = false } = {}) {
  if (value == null && !required) return null;
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) {
    throw new TypeError(`${field} must be an ISO-8601 timestamp`);
  }
  return value;
}

function count(value, field) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${field} must be a non-negative integer`);
  }
  return value;
}

export function normalizeChurnReport(payload) {
  if (!payload || typeof payload !== 'object' || payload.source !== 'revenuecat_customer_history') {
    throw new TypeError('Churn report payload has an unexpected source');
  }
  if (!Array.isArray(payload.rows) || !payload.counts || typeof payload.counts !== 'object') {
    throw new TypeError('Churn report payload is incomplete');
  }

  const rows = payload.rows.map((row, index) => {
    if (!row || typeof row !== 'object') throw new TypeError(`rows[${index}] must be an object`);
    if (!STATUSES.has(row.status)) throw new TypeError(`rows[${index}].status is invalid`);
    return {
      ...row,
      revenueCatCustomerId: requiredString(row.revenueCatCustomerId, `rows[${index}].revenueCatCustomerId`),
      churnedAt: timestamp(row.churnedAt, `rows[${index}].churnedAt`, { required: true }),
      accessEndsAt: timestamp(row.accessEndsAt, `rows[${index}].accessEndsAt`),
      recoveredAt: timestamp(row.recoveredAt, `rows[${index}].recoveredAt`),
      firstSeenAt: timestamp(row.firstSeenAt, `rows[${index}].firstSeenAt`),
      lastSeenAt: timestamp(row.lastSeenAt, `rows[${index}].lastSeenAt`),
      accountCreatedAt: timestamp(row.accountCreatedAt, `rows[${index}].accountCreatedAt`),
    };
  });

  return {
    rows,
    fetchedAt: timestamp(payload.fetchedAt, 'fetchedAt', { required: true }),
    counts: Object.fromEntries(
      ['all', 'churned', 'scheduled', 'recovered', 'withInAppReason']
        .map(key => [key, count(payload.counts[key], `counts.${key}`)]),
    ),
  };
}

export function churnReasonKey(row) {
  const inAppReason = row?.cancellationFlow?.reason?.trim();
  return inAppReason
    ? `in-app:${inAppReason.toLowerCase()}`
    : `revenuecat:${row?.revenueCatReason || 'UNKNOWN'}`;
}

export function churnReasonLabel(row) {
  const inAppReason = row?.cancellationFlow?.reason?.trim();
  return inAppReason || `RevenueCat · ${formatRevenueCatReason(row?.revenueCatReason)}`;
}

export function filterChurnRows(rows, {
  dateFrom,
  dateTo,
  status = 'all',
  reason = 'all',
  plan = 'all',
  search = '',
}) {
  const fromMs = dateFrom instanceof Date ? dateFrom.getTime() : Number.NEGATIVE_INFINITY;
  const toMs = dateTo instanceof Date ? dateTo.getTime() : Number.POSITIVE_INFINITY;
  const query = search.trim().toLowerCase();

  return rows.filter(row => {
    const churnMs = Date.parse(row.churnedAt);
    if (churnMs < fromMs || churnMs > toMs) return false;
    if (status !== 'all' && row.status !== status) return false;
    if (reason === 'in-app' && !row.cancellationFlow?.reason) return false;
    if (reason !== 'all' && reason !== 'in-app' && churnReasonKey(row) !== reason) return false;
    if (plan !== 'all' && subscriptionType(row).toLowerCase() !== plan) return false;
    if (!query) return true;
    return [
      row.displayName,
      row.email,
      row.phoneNumber,
      row.firebaseUid,
      row.revenueCatCustomerId,
      row.productId,
      row.cancellationFlow?.plan,
      row.cancellationFlow?.reason,
      row.cancellationFlow?.reasonText,
      row.revenueCatReason,
    ].some(value => String(value || '').toLowerCase().includes(query));
  });
}

export function summarizeChurnRows(rows) {
  return {
    all: rows.length,
    churned: rows.filter(row => row.status === 'churned').length,
    scheduled: rows.filter(row => row.status === 'scheduled').length,
    recovered: rows.filter(row => row.status === 'recovered').length,
    withInAppReason: rows.filter(row => row.cancellationFlow?.reason).length,
  };
}

export function summarizeChurnReasons(rows) {
  const groups = new Map();
  rows.forEach(row => {
    const key = churnReasonKey(row);
    const current = groups.get(key) || { key, label: churnReasonLabel(row), count: 0 };
    current.count += 1;
    groups.set(key, current);
  });
  return [...groups.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function subscriptionType(row) {
  const plan = formatPlan(row);
  const normalized = plan.toLowerCase();
  if (normalized.includes('week')) return 'Weekly';
  if (normalized.includes('month')) return 'Monthly';
  if (normalized.includes('annual') || normalized.includes('year') || normalized.includes('limited')) return 'Annual';
  return plan;
}

export function summarizeSubscriptionTypes(rows) {
  const groups = new Map();
  rows.forEach(row => {
    const label = subscriptionType(row);
    const key = label.toLowerCase();
    groups.set(key, { key, label, count: (groups.get(key)?.count || 0) + 1 });
  });
  return [...groups.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function formatPlan(row) {
  if (row?.cancellationFlow?.plan && row.cancellationFlow.plan !== 'Unknown') {
    return row.cancellationFlow.plan;
  }
  const product = String(row?.productId || '').split('.').pop();
  const plans = {
    Weekly: 'Weekly',
    Month: 'Monthly',
    Year: 'Annual',
    YearNoFreeTrial: 'Annual · no trial',
    YearNoFreeTrialLimitedTimeOffer: 'Annual · limited offer',
    LimitedTimeOffer: 'Limited offer',
  };
  return plans[product] || product || 'Unknown';
}

export function formatRevenueCatReason(reason) {
  const labels = {
    UNSUBSCRIBE: 'Cancelled by customer',
    BILLING_ERROR: 'Billing error',
    CUSTOMER_SUPPORT: 'Refund / customer support',
    DEVELOPER_INITIATED: 'Developer initiated',
    PRICE_INCREASE: 'Price increase declined',
    SUBSCRIPTION_PAUSED: 'Subscription paused',
    UNKNOWN: 'Unknown',
  };
  return labels[reason] || (reason ? String(reason).replaceAll('_', ' ').toLowerCase() : 'No reason recorded');
}

function csvCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function churnRowsToCsv(rows) {
  const header = [
    'Status', 'Name', 'Email', 'Phone', 'Plan', 'Product ID', 'Churn decision',
    'Access ended/ends', 'Recovered', 'In-app reason', 'Reason detail',
    'RevenueCat reason', 'Completed Apple handoff', 'Accepted save offer',
    'Days subscribed', 'Excuses at cancel', 'Streak at cancel', 'Current subscription status',
    'Auto-renewal status', 'Country', 'Store',
    'Firebase UID', 'RevenueCat customer ID',
  ];
  const body = rows.map(row => [
    row.status,
    row.displayName,
    row.email,
    row.phoneNumber,
    formatPlan(row),
    row.productId,
    row.churnedAt,
    row.accessEndsAt,
    row.recoveredAt,
    row.cancellationFlow?.reason,
    row.cancellationFlow?.reasonText,
    formatRevenueCatReason(row.revenueCatReason),
    row.cancellationFlow?.completedCancellation,
    row.cancellationFlow?.offerAccepted,
    row.cancellationFlow?.daysSubscribed,
    row.cancellationFlow?.excuseCountAtCancel,
    row.cancellationFlow?.streakAtCancel,
    row.currentSubscriptionStatus,
    row.autoRenewalStatus,
    row.country,
    row.store,
    row.firebaseUid,
    row.revenueCatCustomerId,
  ]);
  return [header, ...body].map(row => row.map(csvCell).join(',')).join('\n');
}
