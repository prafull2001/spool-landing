"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, where, getDocs, Timestamp, limit } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import './AnalyticsPage.css';

Chart.register(...registerables);

const SCREEN_ORDER_V1 = [
  { number: -1, name: 'video_outro', label: 'Video Outro' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'enable_screen_time', label: 'Enable ST' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 10, name: 'paywall', label: 'Paywall' },
];

const SCREEN_ORDER_V2 = [
  { number: 0, name: 'video_intro', label: 'Video Intro' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

const SCREEN_ORDER_V3 = [
  { number: 0, name: 'video_intro', label: 'Video Intro' },
  { number: 0.5, name: 'how_did_you_hear', label: 'How Heard' },
  { number: 1, name: 'checkbox_selection', label: 'Checkbox' },
  { number: 3, name: 'age_selection', label: 'Age' },
  { number: 4, name: 'screen_time_slider', label: 'Screen Time' },
  { number: 4.5, name: 'screen_time_connect', label: 'ST Connect' },
  { number: 4.75, name: 'screen_time_dialog', label: 'ST Dialog' },
  { number: 5, name: 'progress_bar', label: 'Progress Bar' },
  { number: 5.5, name: 'top_app_demon', label: 'App Demon' },
  { number: 6, name: 'phone_usage_stats', label: 'Usage Stats' },
  { number: 7, name: 'lifetime_stats', label: 'Lifetime Stats' },
  { number: 8, name: 'average_lifespan', label: 'Avg Lifespan' },
  { number: 8.5, name: 'review_request', label: 'Review' },
  { number: 8.75, name: 'academic_studies', label: 'Studies' },
  { number: 9, name: 'weekly_benefits', label: 'Benefits' },
  { number: 9.5, name: 'commitment_ritual', label: 'Commitment' },
  { number: 9.75, name: 'before_after', label: 'Before/After' },
  { number: 10.5, name: 'sky_paywall', label: 'Paywall' },
  { number: 11, name: 'welcome_to_spool', label: 'Welcome' },
  { number: 12, name: 'name_collection', label: 'Name' },
  { number: 13, name: 'create_account', label: 'Account' },
  { number: 14, name: 'notification_permission', label: 'Notifications' },
  { number: 16, name: 'schedule_selection', label: 'Schedule' },
  { number: 17, name: 'choose_apps', label: 'Choose Apps' },
  { number: 18, name: 'daily_limit_explanation', label: 'Limit Explain' },
  { number: 19, name: 'daily_request_pool', label: 'Daily Pool' },
  { number: 20, name: 'excuse_explanation', label: 'Excuse' },
  { number: 21, name: 'pattern_explanation', label: 'Pattern' },
  { number: 22, name: 'blocking_confirmation', label: 'Confirm' },
];

// Paywall screen names per version
const PAYWALL_SCREEN_V1 = 'paywall';
const PAYWALL_SCREEN_V2 = 'sky_paywall';

function AnalyticsPage() {
  const { user, handleSignIn, handleSignOut: signOutBase } = useFirebaseAuth();
  const [allSessions, setAllSessions] = useState([]);
  const [surveys, setSurveys] = useState(new Map());
  const [usersMap, setUsersMap] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [version, setVersion] = useState('v2');
  const [splitByAB, setSplitByAB] = useState(false);
  const [expandedSessionIdx, setExpandedSessionIdx] = useState(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionSortField, setSessionSortField] = useState('date');
  const [sessionSortDir, setSessionSortDir] = useState('desc');

  const funnelChartRef = useRef(null);
  const dropoffChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const funnelInstance = useRef(null);
  const dropoffInstance = useRef(null);
  const timeInstance = useRef(null);

  const screenOrder = version === 'v1' ? SCREEN_ORDER_V1 : version === 'v3' ? SCREEN_ORDER_V3 : SCREEN_ORDER_V2;

  // Filter sessions by version
  const sessions = useMemo(() => {
    if (version === 'v1') {
      return allSessions.filter(s => !s.flow_version);
    }
    if (version === 'v3') {
      return allSessions.filter(s => s.flow_version === 3);
    }
    return allSessions.filter(s => s.flow_version === 2);
  }, [allSessions, version]);

  useEffect(() => {
    if (user) {
      fetchSessions();
      fetchSurveys();
      fetchUsers();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOutBase();
    setAllSessions([]);
    setSurveys(new Map());
    setUsersMap(new Map());
  };

  const fetchSessions = async (startDate, endDate) => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'onboarding_sessions'),
        orderBy('started_at', 'desc'),
        limit(5000)
      );

      if (startDate) {
        q = query(
          collection(db, 'onboarding_sessions'),
          orderBy('started_at', 'desc'),
          where('started_at', '>=', Timestamp.fromDate(new Date(startDate))),
          limit(5000)
        );
      }

      if (startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        q = query(
          collection(db, 'onboarding_sessions'),
          orderBy('started_at', 'desc'),
          where('started_at', '>=', Timestamp.fromDate(new Date(startDate))),
          where('started_at', '<=', Timestamp.fromDate(end)),
          limit(5000)
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSessions(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const fetchSurveys = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'onboarding_surveys'));
      const map = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Key by document ID (which IS the device ID) and also by data.device_id if present
        map.set(doc.id, data);
        if (data.device_id) {
          map.set(data.device_id, data);
        }
      });
      setSurveys(map);
    } catch (err) {
      console.error('Fetch surveys error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const map = new Map();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        map.set(doc.id, data);
      });
      setUsersMap(map);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleRefresh = () => {
    fetchSessions(dateFrom || null, dateTo || null);
    fetchSurveys();
  };

  // Get A/B group for a session
  const getABGroup = useCallback((session) => {
    if (!session.device_id) return null;
    const survey = surveys.get(session.device_id);
    if (!survey) return null;
    return survey.ab_showVideoIntro === true ? 'A' : 'B';
  }, [surveys]);

  // Compute analytics for a given set of sessions
  const computeForSessions = useCallback((sessionList, order) => {
    const total = sessionList.length;
    if (total === 0) return null;

    const screenCounts = {};
    const screenTimes = {};
    const screenTimeCounts = {};

    order.forEach(s => {
      screenCounts[s.name] = 0;
      screenTimes[s.name] = 0;
      screenTimeCounts[s.name] = 0;
    });

    let paywallReached = 0;
    let droppedOff = 0;
    let prePaywallDropoff = 0;
    let totalTimeSum = 0;
    let totalTimeCount = 0;

    const firstScreen = order[0].name;
    const pw = version === 'v1' ? PAYWALL_SCREEN_V1 : PAYWALL_SCREEN_V2;

    sessionList.forEach(session => {
      // Every session starts at the first screen
      screenCounts[firstScreen]++;

      const completed = session.screens_completed || [];
      const seenScreens = new Set();
      completed.forEach(sc => {
        // Track time for all occurrences
        if (sc.time_spent_seconds !== undefined && sc.time_spent_seconds !== null) {
          if (screenTimes[sc.screen_name] !== undefined) {
            screenTimes[sc.screen_name] += sc.time_spent_seconds;
            screenTimeCounts[sc.screen_name]++;
          }
        }
        // But only count each screen once per session for the funnel
        if (screenCounts[sc.screen_name] !== undefined && !seenScreens.has(sc.screen_name)) {
          seenScreens.add(sc.screen_name);
          // Don't double-count the first screen (already counted above)
          if (sc.screen_name !== firstScreen) {
            screenCounts[sc.screen_name]++;
          }
        }
      });

      if (session.reached_paywall) {
        paywallReached++;
        // Only count paywall if not already counted from screens_completed
        if (screenCounts[pw] !== undefined && !seenScreens.has(pw)) {
          screenCounts[pw]++;
        }
      }
      if (session.dropped_off) {
        droppedOff++;
        if (!session.reached_paywall) {
          prePaywallDropoff++;
        }
      }
      if (session.total_time_seconds > 0) {
        totalTimeSum += session.total_time_seconds;
        totalTimeCount++;
      }
    });

    return {
      total,
      paywallReached,
      paywallRate: ((paywallReached / total) * 100).toFixed(1),
      droppedOff,
      dropoffRate: ((droppedOff / total) * 100).toFixed(1),
      prePaywallDropoff,
      prePaywallDropoffRate: ((prePaywallDropoff / total) * 100).toFixed(1),
      completionRate: (((total - droppedOff) / total) * 100).toFixed(1),
      avgTotalTime: totalTimeCount > 0 ? (totalTimeSum / totalTimeCount).toFixed(0) : 0,
      screenCounts,
      screenTimes,
      screenTimeCounts,
    };
  }, [version]);

  const computeAnalytics = useCallback(() => {
    return computeForSessions(sessions, screenOrder);
  }, [sessions, screenOrder, computeForSessions]);

  // Split sessions by A/B
  const abGroups = useMemo(() => {
    const groupA = [];
    const groupB = [];
    sessions.forEach(s => {
      const group = getABGroup(s);
      if (group === 'A') groupA.push(s);
      else if (group === 'B') groupB.push(s);
    });
    return { groupA, groupB };
  }, [sessions, getABGroup]);

  // Helper to build chart datasets
  const buildFunnelData = useCallback((sessionList, order) => {
    const analytics = computeForSessions(sessionList, order);
    if (!analytics) return null;
    const screenNames = order.map(s => s.name);
    return screenNames.map(name => analytics.screenCounts[name] || 0);
  }, [computeForSessions]);

  const buildDropoffData = (funnelData) => {
    const result = [];
    for (let i = 0; i < funnelData.length - 1; i++) {
      const current = funnelData[i];
      const next = funnelData[i + 1];
      result.push(current > 0 ? (((current - next) / current) * 100).toFixed(1) : 0);
    }
    result.push(0);
    return result;
  };

  const buildAvgTimeData = useCallback((sessionList, order) => {
    const analytics = computeForSessions(sessionList, order);
    if (!analytics) return null;
    const screenNames = order.map(s => s.name);
    return screenNames.map(name => {
      const count = analytics.screenTimeCounts[name] || 0;
      return count > 0 ? (analytics.screenTimes[name] / count).toFixed(1) : 0;
    });
  }, [computeForSessions]);

  // Render charts whenever sessions/version/splitByAB change
  useEffect(() => {
    const analytics = computeAnalytics();
    if (!analytics) return;

    const labels = screenOrder.map(s => s.label);
    const screenNames = screenOrder.map(s => s.name);

    // Destroy old charts
    if (funnelInstance.current) funnelInstance.current.destroy();
    if (dropoffInstance.current) dropoffInstance.current.destroy();
    if (timeInstance.current) timeInstance.current.destroy();

    if (splitByAB) {
      const funnelA = buildFunnelData(abGroups.groupA, screenOrder) || screenNames.map(() => 0);
      const funnelB = buildFunnelData(abGroups.groupB, screenOrder) || screenNames.map(() => 0);
      const dropoffA = buildDropoffData(funnelA);
      const dropoffB = buildDropoffData(funnelB);
      const timeA = buildAvgTimeData(abGroups.groupA, screenOrder) || screenNames.map(() => 0);
      const timeB = buildAvgTimeData(abGroups.groupB, screenOrder) || screenNames.map(() => 0);

      // Funnel
      if (funnelChartRef.current) {
        funnelInstance.current = new Chart(funnelChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Group A (Video Intro)',
                data: funnelA,
                backgroundColor: 'rgba(84, 153, 199, 0.7)',
                borderColor: 'rgba(84, 153, 199, 1)',
                borderWidth: 1,
              },
              {
                label: 'Group B (No Video)',
                data: funnelB,
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      // Dropoff
      if (dropoffChartRef.current) {
        dropoffInstance.current = new Chart(dropoffChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Group A Dropoff %',
                data: dropoffA,
                backgroundColor: 'rgba(84, 153, 199, 0.7)',
                borderColor: 'rgba(84, 153, 199, 1)',
                borderWidth: 1,
              },
              {
                label: 'Group B Dropoff %',
                data: dropoffB,
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true, max: 100 } },
          },
        });
      }

      // Time
      if (timeChartRef.current) {
        timeInstance.current = new Chart(timeChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Group A Avg seconds',
                data: timeA,
                backgroundColor: 'rgba(84, 153, 199, 0.7)',
                borderColor: 'rgba(84, 153, 199, 1)',
                borderWidth: 1,
              },
              {
                label: 'Group B Avg seconds',
                data: timeB,
                backgroundColor: 'rgba(243, 156, 18, 0.7)',
                borderColor: 'rgba(243, 156, 18, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }
    } else {
      // Single dataset (original behavior)
      const funnelData = screenNames.map(name => analytics.screenCounts[name] || 0);
      const dropoffData = buildDropoffData(funnelData);
      const avgTimeData = screenNames.map(name => {
        const count = analytics.screenTimeCounts[name] || 0;
        return count > 0 ? (analytics.screenTimes[name] / count).toFixed(1) : 0;
      });

      if (funnelChartRef.current) {
        funnelInstance.current = new Chart(funnelChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Users reaching screen',
              data: funnelData,
              backgroundColor: 'rgba(84, 153, 199, 0.7)',
              borderColor: 'rgba(84, 153, 199, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      if (dropoffChartRef.current) {
        dropoffInstance.current = new Chart(dropoffChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Dropoff %',
              data: dropoffData,
              backgroundColor: 'rgba(231, 76, 60, 0.7)',
              borderColor: 'rgba(231, 76, 60, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } },
          },
        });
      }

      if (timeChartRef.current) {
        timeInstance.current = new Chart(timeChartRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Avg seconds',
              data: avgTimeData,
              backgroundColor: 'rgba(46, 204, 113, 0.7)',
              borderColor: 'rgba(46, 204, 113, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }
    }
  }, [sessions, computeAnalytics, splitByAB, abGroups, screenOrder, buildFunnelData, buildAvgTimeData]);

  // Conversion breakdown data
  const conversionData = useMemo(() => {
    const buildRow = (label, list) => {
      const total = list.length;
      if (total === 0) return { label, sessions: 0, completionRate: '0.0', avgTime: 0, paywallRate: '0.0' };
      const completed = list.filter(s => s.dropped_off === false).length;
      const paywall = list.filter(s => s.reached_paywall === true).length;
      let timeSum = 0;
      let timeCount = 0;
      list.forEach(s => {
        if (s.total_time_seconds > 0) {
          timeSum += s.total_time_seconds;
          timeCount++;
        }
      });
      return {
        label,
        sessions: total,
        completionRate: ((completed / total) * 100).toFixed(1),
        avgTime: timeCount > 0 ? (timeSum / timeCount).toFixed(0) : 0,
        paywallRate: ((paywall / total) * 100).toFixed(1),
      };
    };

    const rows = [];

    // A/B groups
    rows.push({ header: 'A/B Group' });
    rows.push(buildRow('Video Intro (A)', abGroups.groupA));
    rows.push(buildRow('No Video (B)', abGroups.groupB));

    // Referral source
    rows.push({ header: 'Referral Source' });
    const referralBuckets = { Instagram: [], TikTok: [], Reddit: [], Friend: [], Other: [] };
    sessions.forEach(s => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;
      const source = survey?.referralSource || survey?.referral_source || survey?.how_did_you_hear || '';
      const srcLower = source.toLowerCase();
      if (srcLower.includes('instagram')) referralBuckets.Instagram.push(s);
      else if (srcLower.includes('tiktok')) referralBuckets.TikTok.push(s);
      else if (srcLower.includes('reddit')) referralBuckets.Reddit.push(s);
      else if (srcLower.includes('friend')) referralBuckets.Friend.push(s);
      else referralBuckets.Other.push(s);
    });
    Object.entries(referralBuckets).forEach(([key, list]) => {
      rows.push(buildRow(key, list));
    });

    // Age bracket
    rows.push({ header: 'Age Bracket' });
    const ageBuckets = { '13-17': [], '18-24': [], '25-34': [], '35+': [] };
    sessions.forEach(s => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;
      const age = survey?.age || s.age;
      if (age == null) return;
      const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
      if (isNaN(ageNum)) return;
      if (ageNum >= 13 && ageNum <= 17) ageBuckets['13-17'].push(s);
      else if (ageNum >= 18 && ageNum <= 24) ageBuckets['18-24'].push(s);
      else if (ageNum >= 25 && ageNum <= 34) ageBuckets['25-34'].push(s);
      else if (ageNum >= 35) ageBuckets['35+'].push(s);
    });
    Object.entries(ageBuckets).forEach(([key, list]) => {
      rows.push(buildRow(key, list));
    });

    return rows;
  }, [sessions, surveys, abGroups]);

  // Survey overview stats
  const surveyOverview = useMemo(() => {
    const total = sessions.length;
    if (total === 0) return null;

    // Referral source counts
    const referralCounts = {};
    // Age counts
    const ageCounts = {};
    // Reason (main issue) counts
    const reasonCounts = {};
    // Paywall pass-through (reached paywall and didn't drop off there)
    let paywallPassed = 0;
    // Converted (has uid linked = created account, or dropped_off === false)
    let converted = 0;

    sessions.forEach(s => {
      const survey = s.device_id ? surveys.get(s.device_id) : null;

      // Referral
      const source = survey?.referralSource || survey?.referral_source || survey?.how_did_you_hear || 'Unknown';
      referralCounts[source] = (referralCounts[source] || 0) + 1;

      // Age
      const age = survey?.age || s.age;
      if (age != null) {
        const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
        if (!isNaN(ageNum)) {
          let bracket;
          if (ageNum <= 17) bracket = '13-17';
          else if (ageNum <= 24) bracket = '18-24';
          else if (ageNum <= 34) bracket = '25-34';
          else bracket = '35+';
          ageCounts[bracket] = (ageCounts[bracket] || 0) + 1;
        }
      }

      // Reason
      const reason = survey?.mainIssue || survey?.main_issue || null;
      if (reason) {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }

      // Paywall pass-through: reached paywall AND didn't drop off
      if (s.reached_paywall && s.dropped_off === false) {
        paywallPassed++;
      }

      // Converted: completed onboarding (didn't drop off)
      if (s.dropped_off === false) {
        converted++;
      }
    });

    return {
      referralCounts,
      ageCounts,
      reasonCounts,
      paywallPassed,
      paywallPassRate: ((paywallPassed / total) * 100).toFixed(1),
      converted,
      conversionRate: ((converted / total) * 100).toFixed(1),
    };
  }, [sessions, surveys]);

  // Session explorer data
  const sessionExplorerData = useMemo(() => {
    let filtered = sessions.map((s, idx) => {
      const userData = s.uid ? usersMap.get(s.uid) : null;
      const displayName = userData?.displayName || userData?.name || '';
      const email = userData?.email || '';
      const survey = s.device_id ? surveys.get(s.device_id) : null;
      const abGroup = getABGroup(s);

      const completedScreens = s.screens_completed || [];
      let lastScreen = '--';
      if (completedScreens.length > 0) {
        const lastSc = completedScreens[completedScreens.length - 1];
        const found = screenOrder.find(o => o.name === lastSc.screen_name);
        lastScreen = found ? found.label : lastSc.screen_name;
      }

      const startedAt = s.started_at?.toDate ? s.started_at.toDate() : (s.started_at ? new Date(s.started_at) : null);

      return {
        originalIdx: idx,
        session: s,
        date: startedAt,
        displayName,
        email,
        userLabel: displayName || email || 'Anonymous',
        lastScreen,
        totalTime: s.total_time_seconds || 0,
        droppedOff: s.dropped_off === true,
        abGroup: abGroup || '--',
        survey,
        userData,
        completedScreens,
      };
    });

    // Search filter
    if (sessionSearch.trim()) {
      const q = sessionSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.userLabel.toLowerCase().includes(q)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sessionSortField) {
        case 'date':
          cmp = (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
          break;
        case 'user':
          cmp = a.userLabel.localeCompare(b.userLabel);
          break;
        case 'lastScreen':
          cmp = a.lastScreen.localeCompare(b.lastScreen);
          break;
        case 'totalTime':
          cmp = a.totalTime - b.totalTime;
          break;
        case 'dropoff':
          cmp = (a.droppedOff ? 1 : 0) - (b.droppedOff ? 1 : 0);
          break;
        case 'abGroup':
          cmp = a.abGroup.localeCompare(b.abGroup);
          break;
        default:
          cmp = 0;
      }
      return sessionSortDir === 'desc' ? -cmp : cmp;
    });

    return filtered;
  }, [sessions, usersMap, surveys, getABGroup, screenOrder, sessionSearch, sessionSortField, sessionSortDir]);

  const handleSort = (field) => {
    if (sessionSortField === field) {
      setSessionSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSessionSortField(field);
      setSessionSortDir('desc');
    }
  };

  const sortIndicator = (field) => {
    if (sessionSortField !== field) return '';
    return sessionSortDir === 'desc' ? ' \u25BC' : ' \u25B2';
  };

  const formatDate = (d) => {
    if (!d) return '--';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const analytics = computeAnalytics();

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1>Spool Onboarding Analytics</h1>
        <div className="auth-section">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="btn-login" onClick={handleSignIn}>Sign In</button>
          )}
        </div>
      </header>

      {!user ? (
        <div className="login-prompt">
          <p>Sign in with an authorized Google account to view analytics.</p>
        </div>
      ) : loading ? (
        <div className="loading">Loading sessions...</div>
      ) : (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Sessions</h3>
              <span className="value">{analytics ? analytics.total : '--'}</span>
              <span className="card-desc">Unique devices that started onboarding</span>
            </div>
            <div className="summary-card">
              <h3>Pre-Paywall Dropoff</h3>
              <span className="value">{analytics ? `${analytics.prePaywallDropoffRate}%` : '--'}</span>
              <span className="card-desc">Left before ever seeing the paywall</span>
            </div>
            <div className="summary-card">
              <h3>Paywall Reach Rate</h3>
              <span className="value">{analytics ? `${analytics.paywallRate}%` : '--'}</span>
              <span className="card-desc">Made it to the paywall screen</span>
            </div>
            <div className="summary-card">
              <h3>Completion Rate</h3>
              <span className="value">{analytics ? `${analytics.completionRate}%` : '--'}</span>
              <span className="card-desc">Finished entire onboarding (account created + setup done)</span>
            </div>
            <div className="summary-card">
              <h3>Avg Total Time</h3>
              <span className="value">{analytics ? `${analytics.avgTotalTime}s` : '--'}</span>
              <span className="card-desc">Average time from first screen to last screen seen</span>
            </div>
          </div>

          {/* Survey Overview */}
          {surveyOverview && (
            <div className="survey-overview">
              <h2>Survey Overview</h2>
              <div className="survey-grid">
                <div className="survey-section">
                  <h3>Referral Source</h3>
                  <div className="survey-bars">
                    {Object.entries(surveyOverview.referralCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([source, count]) => (
                        <div key={source} className="survey-bar-row">
                          <span className="survey-bar-label">{source}</span>
                          <div className="survey-bar-track">
                            <div
                              className="survey-bar-fill"
                              style={{ width: `${(count / sessions.length) * 100}%` }}
                            />
                          </div>
                          <span className="survey-bar-value">{count} ({((count / sessions.length) * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="survey-section">
                  <h3>Main Reason</h3>
                  <div className="survey-bars">
                    {Object.entries(surveyOverview.reasonCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([reason, count]) => (
                        <div key={reason} className="survey-bar-row">
                          <span className="survey-bar-label">{reason}</span>
                          <div className="survey-bar-track">
                            <div
                              className="survey-bar-fill reason"
                              style={{ width: `${(count / sessions.length) * 100}%` }}
                            />
                          </div>
                          <span className="survey-bar-value">{count} ({((count / sessions.length) * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="survey-section">
                  <h3>Age Breakdown</h3>
                  <div className="survey-bars">
                    {['13-17', '18-24', '25-34', '35+'].map(bracket => {
                      const count = surveyOverview.ageCounts[bracket] || 0;
                      return (
                        <div key={bracket} className="survey-bar-row">
                          <span className="survey-bar-label">{bracket}</span>
                          <div className="survey-bar-track">
                            <div
                              className="survey-bar-fill age"
                              style={{ width: `${sessions.length > 0 ? (count / sessions.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="survey-bar-value">{count} ({sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(0) : 0}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="survey-section">
                  <h3>Funnel Outcomes</h3>
                  <div className="outcome-stats">
                    <div className="outcome-row">
                      <span className="outcome-label">Got past paywall</span>
                      <span className="outcome-value">{surveyOverview.paywallPassed} ({surveyOverview.paywallPassRate}%)</span>
                      <span className="outcome-desc">Saw paywall and continued onboarding</span>
                    </div>
                    <div className="outcome-row">
                      <span className="outcome-label">Completed onboarding</span>
                      <span className="outcome-value">{surveyOverview.converted} ({surveyOverview.conversionRate}%)</span>
                      <span className="outcome-desc">Finished all screens and created account</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="filters">
            <label>
              From:
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </label>
            <label>
              To:
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </label>
            <button className="btn-refresh" onClick={handleRefresh}>Refresh</button>

            <div className="version-toggle">
              <button
                className={`version-btn ${version === 'v1' ? 'active' : ''}`}
                onClick={() => setVersion('v1')}
              >
                Pre-Update (v1)
              </button>
              <button
                className={`version-btn ${version === 'v2' ? 'active' : ''}`}
                onClick={() => setVersion('v2')}
              >
                Post-Update (v2)
              </button>
              <button
                className={`version-btn ${version === 'v3' ? 'active' : ''}`}
                onClick={() => setVersion('v3')}
              >
                Commitment (v3)
              </button>
            </div>

            <label className="ab-checkbox">
              <input
                type="checkbox"
                checked={splitByAB}
                onChange={e => setSplitByAB(e.target.checked)}
              />
              Split by A/B Group
            </label>
          </div>

          <div className="chart-container">
            <h2>Onboarding Funnel</h2>
            <canvas ref={funnelChartRef}></canvas>
          </div>

          <div className="chart-container">
            <h2>Dropoff Rate by Screen</h2>
            <canvas ref={dropoffChartRef}></canvas>
          </div>

          <div className="chart-container">
            <h2>Average Time per Screen (seconds)</h2>
            <canvas ref={timeChartRef}></canvas>
          </div>

          {/* Conversion Breakdown Table */}
          <div className="chart-container conversion-section">
            <h2>Conversion Breakdown</h2>
            <table className="conversion-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Sessions</th>
                  <th>Completion Rate</th>
                  <th>Avg Time (s)</th>
                  <th>Paywall Rate</th>
                </tr>
              </thead>
              <tbody>
                {conversionData.map((row, i) => {
                  if (row.header) {
                    return (
                      <tr key={`h-${i}`} className="conversion-header-row">
                        <td colSpan={5}>{row.header}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={`r-${i}`}>
                      <td>{row.label}</td>
                      <td>{row.sessions}</td>
                      <td>{row.completionRate}%</td>
                      <td>{row.avgTime}</td>
                      <td>{row.paywallRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Session Explorer */}
          <div className="chart-container session-explorer">
            <h2>Session Explorer</h2>
            <div className="session-search">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={sessionSearch}
                onChange={e => setSessionSearch(e.target.value)}
              />
            </div>
            <div className="session-table-wrapper">
              <table className="session-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')} className="sortable">
                      Date{sortIndicator('date')}
                    </th>
                    <th onClick={() => handleSort('user')} className="sortable">
                      User{sortIndicator('user')}
                    </th>
                    <th onClick={() => handleSort('lastScreen')} className="sortable">
                      Last Screen{sortIndicator('lastScreen')}
                    </th>
                    <th onClick={() => handleSort('totalTime')} className="sortable">
                      Total Time (s){sortIndicator('totalTime')}
                    </th>
                    <th onClick={() => handleSort('dropoff')} className="sortable">
                      Drop-off{sortIndicator('dropoff')}
                    </th>
                    <th onClick={() => handleSort('abGroup')} className="sortable">
                      A/B Group{sortIndicator('abGroup')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessionExplorerData.slice(0, 200).map((row, i) => {
                    const isExpanded = expandedSessionIdx === row.originalIdx;
                    return (
                      <React.Fragment key={`se-${row.originalIdx}`}>
                        <tr
                          className={`session-row ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => setExpandedSessionIdx(isExpanded ? null : row.originalIdx)}
                        >
                          <td>{formatDate(row.date)}</td>
                          <td>{row.userLabel}</td>
                          <td>{row.lastScreen}</td>
                          <td>{row.totalTime > 0 ? row.totalTime : '--'}</td>
                          <td>{row.droppedOff ? 'Yes' : 'No'}</td>
                          <td>{row.abGroup}</td>
                        </tr>
                        {isExpanded && (
                          <tr className="session-detail-row">
                            <td colSpan={6}>
                              <div className="session-detail">
                                {/* Screen timeline */}
                                <div className="detail-section">
                                  <h4>Screen Timeline</h4>
                                  <div className="screen-timeline">
                                    {row.completedScreens.map((sc, j) => {
                                      const screenInfo = screenOrder.find(o => o.name === sc.screen_name);
                                      const ts = sc.completed_at?.toDate ? sc.completed_at.toDate() : null;
                                      return (
                                        <div key={j} className="timeline-item">
                                          <span className="timeline-screen">{screenInfo?.label || sc.screen_name}</span>
                                          <span className="timeline-time">
                                            {sc.time_spent_seconds != null ? `${sc.time_spent_seconds}s` : '--'}
                                          </span>
                                          {ts && (
                                            <span className="timeline-timestamp">
                                              {ts.toLocaleTimeString()}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                    {row.completedScreens.length === 0 && (
                                      <span className="no-data">No screen data recorded</span>
                                    )}
                                  </div>
                                </div>

                                {/* Survey answers */}
                                {row.survey && (
                                  <div className="detail-section">
                                    <h4>Survey Answers</h4>
                                    <div className="detail-kv">
                                      {(row.survey.referralSource || row.survey.referral_source) && (
                                        <div><strong>Referral:</strong> {row.survey.referralSource || row.survey.referral_source}</div>
                                      )}
                                      {(row.survey.mainIssue || row.survey.main_issue) && (
                                        <div><strong>Main issue:</strong> {row.survey.mainIssue || row.survey.main_issue}</div>
                                      )}
                                      {row.survey.age && (
                                        <div><strong>Age:</strong> {row.survey.age}</div>
                                      )}
                                      {row.survey.ab_showVideoIntro !== undefined && (
                                        <div><strong>A/B Video Intro:</strong> {row.survey.ab_showVideoIntro ? 'Yes' : 'No'}</div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* User info */}
                                {row.userData && (
                                  <div className="detail-section">
                                    <h4>User Info</h4>
                                    <div className="detail-kv">
                                      {(row.userData.displayName || row.userData.name) && (
                                        <div><strong>Name:</strong> {row.userData.displayName || row.userData.name}</div>
                                      )}
                                      {row.userData.email && (
                                        <div><strong>Email:</strong> {row.userData.email}</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {sessionExplorerData.length > 200 && (
                <p className="session-truncated">Showing 200 of {sessionExplorerData.length} sessions</p>
              )}
              {sessionExplorerData.length === 0 && (
                <p className="session-truncated">No sessions found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
