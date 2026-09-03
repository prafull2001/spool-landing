import test from 'node:test';
import assert from 'node:assert/strict';
import { ATTRIBUTION_LINKS, resolveAttributionTarget } from './attributionLinks.mjs';

const EXPECTED = {
  manychat: '99xx9vdy',
  'instagram-bio': '3uxzx1hc',
  alexis_instantdm: 'q1d0gdb9',
  spool_manychat: '99xx9vdy',
  sean_manychat: '3yu1dta4',
  spool_bio: '3uxzx1hc',
  sean_bio: 'tnykj47a',
  alexis_bio: '6ezr2f75',
  peyton_bio: 'tom6a7gl',
  peyton_dm: 'ponklr9l',
  simon_bio: 'rcqriaq7',
  simon_dm: 'rayxcnkh',
};

test('every public source maps to its verified OneLink slug', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(ATTRIBUTION_LINKS).map(([source, url]) => [source, url.split('/').at(-1)])),
    EXPECTED,
  );
});

test('source lookup is normalized and unknown sources fall back', () => {
  const fallback = 'https://apps.apple.com/app/id6749428484';
  assert.deepEqual(resolveAttributionTarget(' Simon_DM ', fallback), {
    url: ATTRIBUTION_LINKS.simon_dm,
    isAttributed: true,
  });
  assert.deepEqual(resolveAttributionTarget('unknown', fallback), {
    url: fallback,
    isAttributed: false,
  });
});
