const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function dateParts(value) {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) throw new TypeError('Invalid date');
    return [value.getFullYear(), value.getMonth(), value.getDate()];
  }
  if (typeof value !== 'string') throw new TypeError('Expected a Date or YYYY-MM-DD');
  const match = ISO_DATE.exec(value);
  if (!match) throw new TypeError('Expected YYYY-MM-DD');
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const candidate = new Date(year, monthIndex, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== monthIndex ||
    candidate.getDate() !== day
  ) {
    throw new TypeError('Invalid calendar date');
  }
  return [year, monthIndex, day];
}

export function formatLocalDate(value) {
  const [year, monthIndex, day] = dateParts(value);
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function startOfLocalDay(value) {
  const [year, monthIndex, day] = dateParts(value);
  return new Date(year, monthIndex, day, 0, 0, 0, 0);
}

export function endOfLocalDay(value) {
  const [year, monthIndex, day] = dateParts(value);
  return new Date(year, monthIndex, day, 23, 59, 59, 999);
}

export function normalizeDateInput(value, fallback) {
  try {
    return formatLocalDate(value);
  } catch {
    return formatLocalDate(fallback);
  }
}
