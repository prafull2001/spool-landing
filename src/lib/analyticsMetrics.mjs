export function toMillis(value) {
  if (value == null) return null;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  return null;
}

export function median(values) {
  const sorted = values
    .filter(value => value != null && value !== '')
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[midpoint]
    : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
}

export function medianDurationsByScreen(sessions, screenNames) {
  const valuesByScreen = Object.fromEntries(screenNames.map(name => [name, []]));
  sessions.forEach(session => {
    (session?.screens_completed ?? []).forEach(screen => {
      if (screen?.time_spent_seconds == null || screen?.time_spent_seconds === '') return;
      const value = Number(screen?.time_spent_seconds);
      if (Object.hasOwn(valuesByScreen, screen?.screen_name) && Number.isFinite(value) && value >= 0) {
        valuesByScreen[screen.screen_name].push(value);
      }
    });
  });
  return Object.fromEntries(
    screenNames.map(name => [name, median(valuesByScreen[name]) ?? 0]),
  );
}

export function classifyPaidSubscription(userDoc, asOf = Date.now()) {
  if (userDoc?.subscriptionActive !== true) return 'inactive';

  const accessSource = userDoc.subscriptionAccessSource;
  const environment = userDoc.subscriptionEnvironment;
  const stateSource = userDoc.subscriptionStateSource;
  if (environment === 'sandbox' || (accessSource && accessSource !== 'paid')) return 'excluded';
  if (!['revenuecat_sdk', 'revenuecat_webhook'].includes(stateSource)) return 'unverified_active';

  const expiresAt = toMillis(userDoc.subscriptionExpiresAt);
  if (expiresAt == null) return 'unverified_active';
  return expiresAt > asOf ? 'verified_active' : 'stale_active';
}

export function dedupeCohortSurveys(surveys) {
  const parent = surveys.map((_, index) => index);
  const find = index => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]];
      index = parent[index];
    }
    return index;
  };
  const union = (left, right) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
  };

  const identityOwners = new Map();
  surveys.forEach((survey, index) => {
    const identifiers = [
      survey?.uid ? `uid:${survey.uid}` : null,
      survey?.device_id ? `device:${survey.device_id}` : null,
      !survey?.device_id && survey?.id ? `device:${survey.id}` : null,
    ].filter(Boolean);
    identifiers.forEach(identifier => {
      if (identityOwners.has(identifier)) union(index, identityOwners.get(identifier));
      else identityOwners.set(identifier, index);
    });
  });

  const membersByRoot = new Map();
  surveys.forEach((survey, index) => {
    const root = find(index);
    const members = membersByRoot.get(root) ?? [];
    members.push(survey);
    membersByRoot.set(root, members);
  });

  return [...membersByRoot.values()].map(members => {
    const newestFirst = [...members].sort((left, right) =>
      (toMillis(right?.updatedAt) ?? Number.NEGATIVE_INFINITY)
      - (toMillis(left?.updatedAt) ?? Number.NEGATIVE_INFINITY));
    const latest = newestFirst[0];
    return {
      ...latest,
      // A device-only follow-up may be the newest survey. Preserve the account
      // identity discovered elsewhere in the linked component for user-doc joins.
      uid: latest?.uid ?? newestFirst.find(survey => survey?.uid)?.uid,
      device_id: latest?.device_id
        ?? newestFirst.find(survey => survey?.device_id)?.device_id
        ?? latest?.id,
    };
  });
}

export function summarizeMinutesBySubscription(users) {
  const groups = { paying: [], free: [] };
  users.forEach(user => {
    const minutes = Number(user.totalExtraMinutesRequested) || 0;
    (user.subscriptionActive ? groups.paying : groups.free).push(minutes);
  });

  const summarize = values => {
    const medianMin = median(values) ?? 0;
    return {
      count: values.length,
      medianMin,
      medianHrs: medianMin / 60,
      totalMin: values.reduce((sum, value) => sum + value, 0),
    };
  };

  return { paying: summarize(groups.paying), free: summarize(groups.free) };
}
