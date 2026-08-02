import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInAppEscape,
  isAndroid,
  isFacebookInApp,
  isIOS,
  isInAppBrowser,
  isInstagramInApp,
} from './inAppBrowser.mjs';

const IOS_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1';
const INSTAGRAM = `${IOS_SAFARI} Instagram 390.0.0.0.0`;
const THREADS = `${IOS_SAFARI} Barcelona 390.0.0.0.0`;
const FACEBOOK = `${IOS_SAFARI} [FBAN/FBIOS;FBAV/520.0.0.0.0]`;
const ANDROID_WEBVIEW =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9 Build/AP3A; wv) AppleWebKit/537.36 Version/4.0 Chrome/138.0 Mobile Safari/537.36';
const STORE_URL = 'https://apps.apple.com/us/app/spool/id6749428484';

test('detects supported platforms and Meta in-app browsers', () => {
  assert.equal(isIOS(IOS_SAFARI), true);
  assert.equal(isAndroid(ANDROID_WEBVIEW), true);
  assert.equal(isInstagramInApp(INSTAGRAM), true);
  assert.equal(isInstagramInApp(THREADS), true);
  assert.equal(isFacebookInApp(FACEBOOK), true);
  assert.equal(isInAppBrowser(INSTAGRAM), true);
  assert.equal(isInAppBrowser(FACEBOOK), true);
  assert.equal(isInAppBrowser(ANDROID_WEBVIEW), true);
  assert.equal(isInAppBrowser(IOS_SAFARI), false);
});

test('detects iPads that request the desktop site', () => {
  assert.equal(
    isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15', 5),
    true,
  );
});

test('builds the synchronous Instagram and Facebook iOS escapes', () => {
  assert.deepEqual(getInAppEscape({ href: STORE_URL, ua: INSTAGRAM }), {
    method: 'location',
    url: `instagram://extbrowser/?url=${encodeURIComponent(STORE_URL)}`,
  });
  assert.deepEqual(getInAppEscape({ href: STORE_URL, ua: FACEBOOK }), {
    method: 'open',
    url: `x-safari-${STORE_URL}`,
  });
});

test('builds Android market and external-browser intents', () => {
  assert.deepEqual(
    getInAppEscape({ href: STORE_URL, ua: ANDROID_WEBVIEW, androidPackage: 'com.spool.app' }),
    { method: 'location', url: 'market://details?id=com.spool.app' },
  );
  assert.deepEqual(getInAppEscape({ href: STORE_URL, ua: ANDROID_WEBVIEW }), {
    method: 'location',
    url: 'intent://apps.apple.com/us/app/spool/id6749428484#Intent;scheme=https;end',
  });
});
