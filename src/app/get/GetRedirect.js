"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { APP_CONFIG } from '@/config/appConfig';
import { DownloadLink } from '@/components/DownloadLink/DownloadLink';
import { getInAppEscape, isAndroid, isIOS, isInstagramInApp } from '@/lib/inAppBrowser.mjs';
import styles from './page.module.css';

const FALLBACK_DELAY_MS = 1800;

function getAttributionTarget(source) {
  const attributionUrl = source && Object.hasOwn(APP_CONFIG.ATTRIBUTION_LINKS, source)
    ? APP_CONFIG.ATTRIBUTION_LINKS[source]
    : null;
  return {
    url: attributionUrl || APP_CONFIG.APP_STORE_URL,
    isAttributed: Boolean(attributionUrl),
  };
}

export default function GetRedirect() {
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const source = new URLSearchParams(window.location.search).get('src')?.trim().toLowerCase();
    const attribution = getAttributionTarget(source);
    const mobile = isIOS(ua, navigator.maxTouchPoints) || isAndroid(ua) || /Mobile|IEMobile|Opera Mini/i.test(ua);

    if (!mobile) {
      window.location.replace(APP_CONFIG.APP_STORE_URL);
      return undefined;
    }

    let timer = window.setTimeout(() => setNeedsTap(true), FALLBACK_DELAY_MS);
    const cancelFallback = () => {
      window.clearTimeout(timer);
      timer = undefined;
    };
    const handleVisibilityChange = () => {
      if (document.hidden) cancelFallback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', cancelFallback, { once: true });
    window.addEventListener('blur', cancelFallback, { once: true });

    if (isIOS(ua, navigator.maxTouchPoints) && isInstagramInApp(ua)) {
      if (attribution.isAttributed) {
        fetch(attribution.url, { mode: 'no-cors', keepalive: true }).catch(() => {});
      }

      const escape = getInAppEscape({ href: APP_CONFIG.APP_STORE_URL, ua });
      window.location.href = escape.url;
    } else {
      window.location.replace(attribution.url);
    }

    return () => {
      cancelFallback();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', cancelFallback);
      window.removeEventListener('blur', cancelFallback);
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Image
          className={styles.logo}
          src="/spooli-app-icon.png"
          alt="Spool"
          width={96}
          height={96}
          priority
        />
        <p className={styles.eyebrow}>Spool for iPhone</p>
        <h1>{needsTap ? 'Tap below to continue' : 'Opening the App Store…'}</h1>
        <p className={styles.status} aria-live="polite">
          {needsTap
            ? 'If nothing opened, use the button below.'
            : 'You’ll be sent to the Spool download page.'}
        </p>
        <DownloadLink className={styles.button} href={APP_CONFIG.APP_STORE_URL}>
          Download Spool
        </DownloadLink>
        <p className={styles.help}>Still here? Tap the ••• menu and choose Open in browser.</p>
      </section>
    </main>
  );
}
