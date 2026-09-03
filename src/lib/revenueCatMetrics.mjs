function count(value, field) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new TypeError(`${field} must be a non-negative integer`);
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

export function normalizeRevenueCatOverview(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('RevenueCat overview payload is required');
  }
  if (payload.source !== 'revenuecat_overview') {
    throw new TypeError('RevenueCat overview payload has an unexpected source');
  }

  return {
    activeSubscriptions: count(payload.activeSubscriptions, 'activeSubscriptions'),
    activeTrials: count(payload.activeTrials, 'activeTrials'),
    revenueCatUpdatedAt: timestamp(payload.revenueCatUpdatedAt, 'revenueCatUpdatedAt'),
    fetchedAt: timestamp(payload.fetchedAt, 'fetchedAt', { required: true }),
  };
}

export function formatRevenueCatTimestamp(overview, locale) {
  const raw = overview?.revenueCatUpdatedAt ?? overview?.fetchedAt;
  if (!raw) return null;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(raw));
}
