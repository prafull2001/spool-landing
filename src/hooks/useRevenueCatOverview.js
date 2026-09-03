"use client";
import { useCallback, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '../config/firebase';
import { normalizeRevenueCatOverview } from '../lib/revenueCatMetrics.mjs';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export default function useRevenueCatOverview(user) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const getOverview = httpsCallable(
        cloudFunctions,
        'get_revenuecat_overview_metrics',
      );
      const result = await getOverview();
      setOverview(normalizeRevenueCatOverview(result.data));
    } catch (err) {
      console.error('RevenueCat overview fetch failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setOverview(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    refetch();
    const timer = window.setInterval(refetch, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [user, refetch]);

  return { overview, loading, error, refetch };
}
