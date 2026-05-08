"use client";
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { computeAgeCohortFunnel, withConversionRates } from './ageCohortHelpers';

/**
 * Fetch + bucket the age-cohort funnel.
 * Same client-side auth pattern as ExcuseDataPage / AnalyticsPage.
 */
export default function useAgeCohortData(user, dateFrom, dateTo) {
  const [funnel, setFunnel] = useState(null);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user || !(dateFrom instanceof Date) || !(dateTo instanceof Date)) return;
    setLoading(true);
    setError(null);
    try {
      const fromTs = Timestamp.fromDate(dateFrom);
      const toTs = Timestamp.fromDate(dateTo);

      const surveysSnap = await getDocs(query(
        collection(db, 'onboarding_surveys'),
        where('updatedAt', '>=', fromTs),
        where('updatedAt', '<=', toTs),
      ));
      const surveys = surveysSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const sessionsSnap = await getDocs(query(
        collection(db, 'onboarding_sessions'),
        where('started_at', '>=', fromTs),
        where('started_at', '<=', toTs),
      ));
      const sessionsByDeviceId = new Map();
      sessionsSnap.docs.forEach(d => {
        const data = d.data();
        sessionsByDeviceId.set(d.id, data);
        if (data.device_id) sessionsByDeviceId.set(data.device_id, data);
      });

      const uids = [...new Set(surveys.map(s => s.uid).filter(Boolean))];
      const userSnaps = await Promise.all(
        uids.map(uid => getDoc(doc(db, 'users', uid)))
      );
      const usersByUid = new Map();
      userSnaps.forEach((snap, i) => {
        if (snap.exists()) usersByUid.set(uids[i], snap.data());
      });

      const base = computeAgeCohortFunnel({ surveys, sessionsByDeviceId, usersByUid });
      const decorated = withConversionRates(base);

      setRaw({ surveys, sessionsByDeviceId, usersByUid });
      setFunnel(decorated);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('useAgeCohortData error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, dateFrom, dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { funnel, raw, loading, error, refetch: fetchData };
}
