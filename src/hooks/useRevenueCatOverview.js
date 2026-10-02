"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '../config/firebase';
import { normalizeRevenueCatOverview } from '../lib/revenueCatMetrics.mjs';
import { formatLocalDate } from '../lib/dateRange.mjs';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export default function useRevenueCatOverview(user, dateFrom, dateTo, includeConversion = false) {
  const requestId = useRef(0);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const startDate = dateFrom instanceof Date ? formatLocalDate(dateFrom) : null;
  const endDate = dateTo instanceof Date ? formatLocalDate(dateTo) : null;

  const refetch = useCallback(async () => {
    if (!user) return;
    const request = ++requestId.current;
    setOverview(null);
    setLoading(true);
    setError(null);
    try {
      const getOverview = httpsCallable(
        cloudFunctions,
        'get_revenuecat_overview_metrics',
      );
      const result = await getOverview(
        startDate && endDate ? { startDate, endDate, ...(includeConversion ? { includeConversion: true } : {}) } : {},
      );
      if (request === requestId.current) setOverview(normalizeRevenueCatOverview(result.data));
    } catch (err) {
      console.error('RevenueCat overview fetch failed:', err);
      if (request === requestId.current) setError(err);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [user, startDate, endDate, includeConversion]);

  useEffect(() => {
    requestId.current += 1;
    setOverview(null);
    if (!user) {
      setOverview(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    refetch();
    const timer = window.setInterval(refetch, REFRESH_INTERVAL_MS);
    return () => {
      requestId.current += 1;
      window.clearInterval(timer);
    };
  }, [user, refetch]);

  const matchesRange = !startDate && !endDate ||
    overview?.rangeStart === startDate && overview?.rangeEnd === endDate;
  return { overview: matchesRange ? overview : null, loading, error, refetch };
}
