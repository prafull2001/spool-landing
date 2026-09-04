"use client";
import { useCallback, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '../config/firebase';
import { normalizeChurnReport } from '../lib/churnReport.mjs';

export default function useChurnReport(user) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const getReport = httpsCallable(cloudFunctions, 'get_revenuecat_churn_report', { timeout: 300000 });
      const result = await getReport();
      setReport(normalizeChurnReport(result.data));
    } catch (err) {
      console.error('RevenueCat churn report fetch failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setReport(null);
      setError(null);
      return;
    }
    refetch();
  }, [user, refetch]);

  return { report, loading, error, refetch };
}
