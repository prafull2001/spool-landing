export const ATTRIBUTION_LINKS = Object.freeze({
  manychat: 'https://spool.onelink.me/c5xQ/99xx9vdy',
  'instagram-bio': 'https://spool.onelink.me/c5xQ/3uxzx1hc',
  alexis_instantdm: 'https://spool.onelink.me/c5xQ/q1d0gdb9',
  spool_manychat: 'https://spool.onelink.me/c5xQ/99xx9vdy',
  sean_manychat: 'https://spool.onelink.me/c5xQ/3yu1dta4',
  spool_bio: 'https://spool.onelink.me/c5xQ/3uxzx1hc',
  sean_bio: 'https://spool.onelink.me/c5xQ/tnykj47a',
  alexis_bio: 'https://spool.onelink.me/c5xQ/6ezr2f75',
  peyton_bio: 'https://spool.onelink.me/c5xQ/tom6a7gl',
  peyton_dm: 'https://spool.onelink.me/c5xQ/ponklr9l',
  simon_bio: 'https://spool.onelink.me/c5xQ/rcqriaq7',
  simon_dm: 'https://spool.onelink.me/c5xQ/rayxcnkh',
});

export function resolveAttributionTarget(source, fallbackUrl) {
  const normalized = typeof source === 'string' ? source.trim().toLowerCase() : '';
  const url = Object.hasOwn(ATTRIBUTION_LINKS, normalized)
    ? ATTRIBUTION_LINKS[normalized]
    : fallbackUrl;
  return { url, isAttributed: url !== fallbackUrl };
}
