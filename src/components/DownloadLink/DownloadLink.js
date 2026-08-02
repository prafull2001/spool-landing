"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { APP_CONFIG } from '@/config/appConfig';
import { getInAppEscape, isInAppBrowser, isInstagramInApp } from '@/lib/inAppBrowser.mjs';
import styles from './DownloadLink.module.css';

const FALLBACK_DELAY_MS = 1500;

function isAppStoreLink(href) {
  try {
    return new URL(href).hostname === 'apps.apple.com';
  } catch {
    return false;
  }
}

function manualInstructions(ua) {
  return isInstagramInApp(ua)
    ? 'Tap the ••• menu, then Open in external browser.'
    : 'Tap the ••• menu, then Open in browser.';
}

function copyToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  input.remove();
  return Promise.resolve();
}

export function DownloadLink({ href = APP_CONFIG.APP_STORE_URL, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function DownloadLinkProvider({ children }) {
  const [fallback, setFallback] = useState(null);
  const [copied, setCopied] = useState(false);
  const cleanupRef = useRef(() => {});
  const retryRef = useRef(null);

  const startEscape = (href, ua) => {
    cleanupRef.current();
    setFallback(null);
    setCopied(false);

    let timer;
    const cleanup = () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleAppSwitch);
      window.removeEventListener('blur', handleAppSwitch);
    };
    const handleAppSwitch = () => {
      cleanup();
      cleanupRef.current = () => {};
    };
    const handleVisibilityChange = () => {
      if (document.hidden) handleAppSwitch();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleAppSwitch, { once: true });
    window.addEventListener('blur', handleAppSwitch, { once: true });
    timer = window.setTimeout(() => {
      cleanup();
      cleanupRef.current = () => {};
      setFallback({ href, ua });
    }, FALLBACK_DELAY_MS);
    cleanupRef.current = cleanup;

    const escape = getInAppEscape({
      href,
      ua,
      androidPackage: APP_CONFIG.ANDROID_PACKAGE,
    });

    if (escape.method === 'open') {
      window.open(escape.url, '_blank');
    } else {
      window.location.href = escape.url;
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      const href = anchor?.href;
      const ua = navigator.userAgent;

      if (!href || !isAppStoreLink(href) || !isInAppBrowser(ua, navigator.maxTouchPoints)) {
        return;
      }

      event.preventDefault();
      startEscape(href, ua);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      cleanupRef.current();
    };
  }, []);

  useEffect(() => {
    if (!fallback) return undefined;

    retryRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setFallback(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [fallback]);

  return (
    <>
      {children}
      {fallback && (
        <div
          className={styles.backdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setFallback(null);
          }}
        >
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="download-fallback-title">
            <button className={styles.close} type="button" aria-label="Close" onClick={() => setFallback(null)}>
              ×
            </button>
            <Image className={styles.logo} src="/spooli-app-icon.png" alt="" width={72} height={72} />
            <h2 id="download-fallback-title">Open Spool in the App Store</h2>
            <p>The app switch did not open automatically.</p>
            <button
              ref={retryRef}
              className={styles.primary}
              type="button"
              onClick={() => startEscape(fallback.href, fallback.ua)}
            >
              Try again
            </button>
            <p className={styles.instructions}>{manualInstructions(fallback.ua)}</p>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => {
                copyToClipboard(fallback.href)
                  .then(() => setCopied(true))
                  .catch(() => setCopied(false));
              }}
            >
              {copied ? 'Link copied' : 'Copy App Store link'}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
