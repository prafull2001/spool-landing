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

function isoDate(value, field, { required = false } = {}) {
  if (value == null && !required) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`${field} must be a YYYY-MM-DD date`);
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

  const hasRange = [payload.newCustomers, payload.rangeStart, payload.rangeEnd]
    .some(value => value != null);

  return {
    activeSubscriptions: count(payload.activeSubscriptions, 'activeSubscriptions'),
    activeTrials: count(payload.activeTrials, 'activeTrials'),
    newCustomers: hasRange ? count(payload.newCustomers, 'newCustomers') : null,
    rangeStart: isoDate(payload.rangeStart, 'rangeStart', { required: hasRange }),
    rangeEnd: isoDate(payload.rangeEnd, 'rangeEnd', { required: hasRange }),
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
