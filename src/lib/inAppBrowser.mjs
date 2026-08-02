function currentUserAgent() {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent;
}

function currentMaxTouchPoints() {
  return typeof navigator === 'undefined' ? 0 : navigator.maxTouchPoints;
}

export function isIOS(ua = currentUserAgent(), maxTouchPoints = currentMaxTouchPoints()) {
  return /iPad|iPhone|iPod/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1);
}

export function isAndroid(ua = currentUserAgent()) {
  return /Android/i.test(ua);
}

export function isInstagramInApp(ua = currentUserAgent()) {
  return /Instagram|Barcelona/i.test(ua);
}

export function isFacebookInApp(ua = currentUserAgent()) {
  return /FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger/i.test(ua);
}

export function isInAppBrowser(ua = currentUserAgent(), maxTouchPoints = currentMaxTouchPoints()) {
  if (isInstagramInApp(ua) || isFacebookInApp(ua) || /TikTok|musical_ly|BytedanceWebview/i.test(ua)) {
    return true;
  }

  if (isAndroid(ua)) {
    return /;\s*wv\)|\bwv\b|Version\/4\.0[^]*Chrome/i.test(ua);
  }

  return (
    isIOS(ua, maxTouchPoints) &&
    /AppleWebKit/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|Version\/[^ ]+.*Safari/i.test(ua)
  );
}

export function getInAppEscape({ href, ua = currentUserAgent(), androidPackage = null }) {
  if (isAndroid(ua)) {
    return {
      method: 'location',
      url: androidPackage
        ? `market://details?id=${encodeURIComponent(androidPackage)}`
        : `intent://${href.replace(/^https?:\/\//i, '')}#Intent;scheme=https;end`,
    };
  }

  if (isIOS(ua) && isInstagramInApp(ua)) {
    return {
      method: 'location',
      url: `instagram://extbrowser/?url=${encodeURIComponent(href)}`,
    };
  }

  if (isIOS(ua) && isFacebookInApp(ua)) {
    return { method: 'open', url: `x-safari-${href}` };
  }

  return { method: 'location', url: href };
}
