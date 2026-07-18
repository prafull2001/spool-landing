"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./page.module.css";

const HANDLE = "spool.screentime.app";
const APP_URL = `instagram://user?username=${HANDLE}`;
const WEB_URL = `https://www.instagram.com/${HANDLE}/`;
const FALLBACK_DELAY_MS = 1500;
const SOURCE_PATTERN = /^[a-zA-Z0-9._@-]{1,64}$/;

function logSource(source) {
  const normalizedSource = source?.trim();

  if (!normalizedSource || !SOURCE_PATTERN.test(normalizedSource)) {
    return;
  }

  const endpoint = `/api/ig-click?src=${encodeURIComponent(normalizedSource)}`;

  if (
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(endpoint)
  ) {
    return;
  }

  fetch(endpoint, {
    method: "POST",
    keepalive: true,
  }).catch(() => {
    // Redirecting is the priority; analytics must never block the handoff.
  });
}

export default function IgRedirect() {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("src");
    logSource(source);

    let fallbackTimer = window.setTimeout(() => {
      window.location.replace(WEB_URL);
    }, FALLBACK_DELAY_MS);

    const cancelFallback = () => {
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelFallback();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", cancelFallback);

    window.location.href = APP_URL;

    return () => {
      cancelFallback();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", cancelFallback);
    };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Image
          className={styles.logo}
          src="/images/spooli_logo.jpg"
          alt="Spool"
          width={112}
          height={112}
          priority
        />
        <h1>Opening Instagram…</h1>
        <a className={styles.button} href={APP_URL}>
          Open Instagram
        </a>
      </div>
    </main>
  );
}
