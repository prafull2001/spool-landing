import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { collection, collectionGroup, getDocs } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import {
  computeTextDiversity, computeStreaks, filterUsers,
  computeHabitFormation, computeCohortRetention,
  computeCategoryEvolution, computePowerUserRankings,
  computeICPSegments,
} from './excuseDataHelpers';
import './ExcuseDataPage.css';

Chart.register(...registerables);

const CATEGORIES = [
  'Entertainment', 'Social', 'Break/Reward', 'Other',
  'Quick Check', 'Boredom', 'Procrastination', 'FOMO', 'Uncategorized'
];

const CATEGORY_COLORS = [
  '#5499C7', '#58D68D', '#F4D03F', '#AF7AC5',
  '#EB984E', '#EC7063', '#45B7D1', '#F1948A', '#BDC3C7'
];

function ExcuseDataPage() {
  const { user, authLoading, handleSignIn, handleSignOut } = useFirebaseAuth();

  const [users, setUsers] = useState([]);
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [leaderboardSort, setLeaderboardSort] = useState({ field: 'excuseCount', dir: 'desc' });
  const [collapsed, setCollapsed] = useState({});

  // Investor filter: exclude team + low-diversity users
  const [realJournalersOnly, setRealJournalersOnly] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState('overview');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Chart refs — overview
  const timelineChartRef = useRef(null);
  const timelineInstance = useRef(null);
  const habitChartRef = useRef(null);
  const habitInstance = useRef(null);
  const categoryEvoChartRef = useRef(null);
  const categoryEvoInstance = useRef(null);

  // Chart refs — ICP Explorer
  const icpTrendChartRef = useRef(null);
  const icpTrendInstance = useRef(null);
  const icpHabitChartRef = useRef(null);
  const icpHabitInstance = useRef(null);
  const [expandedICPCategory, setExpandedICPCategory] = useState(null);

  // Chart refs — deep dive
  const categoryChartRef = useRef(null);
  const categoryInstance = useRef(null);

  // Chart refs — drilldown
  const drillCategoryRef = useRef(null);
  const drillTimelineRef = useRef(null);
  const drillCategoryInstance = useRef(null);
  const drillTimelineInstance = useRef(null);

  const toggleCollapse = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Data Fetch ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const userMap = {};
      const userList = [];
      usersSnap.docs.forEach(doc => {
        const data = doc.data();
        const u = { id: doc.id, ...data };
        userMap[doc.id] = u;
        userList.push(u);
      });

      const excusesSnap = await getDocs(collectionGroup(db, 'excuses'));
      const excuseList = excusesSnap.docs.map(doc => {
        const data = doc.data();
        const userId = doc.ref.parent.parent?.id || 'unknown';
        const userInfo = userMap[userId] || {};
        const ts = data.timestamp || data.createdAt;
        let date = null;
        if (ts) { date = ts.toDate ? ts.toDate() : new Date(ts); }
        return {
          id: doc.id, userId,
          userName: userInfo.displayName || userInfo.name || userInfo.email || userId,
          text: data.text || '', category: data.category || '', date,
        };
      });

      setUsers(userList);
      setExcuses(excuseList);
      setLastFetched(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data. Check console for details.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && excuses.length === 0 && !loading && !error) fetchData();
  }, [user, excuses.length, loading, error, fetchData]);

  // ── Core Computed Data ──

  const excusesByUser = useMemo(() => {
    const m = {};
    excuses.forEach(e => {
      if (!m[e.userId]) m[e.userId] = [];
      m[e.userId].push(e);
    });
    return m;
  }, [excuses]);

  const diversityMap = useMemo(() => computeTextDiversity(excusesByUser), [excusesByUser]);
  const streakMap = useMemo(() => computeStreaks(excusesByUser), [excusesByUser]);

  const filteredUserIds = useMemo(() => {
    const allIds = Object.keys(excusesByUser);
    if (!realJournalersOnly) return new Set(allIds);
    return filterUsers(allIds, diversityMap, 0.5, true);
  }, [excusesByUser, diversityMap, realJournalersOnly]);

  // Filtered excuses for overview charts
  const filteredExcusesForCharts = useMemo(() =>
    excuses.filter(e => filteredUserIds.has(e.userId)),
    [excuses, filteredUserIds]
  );

  const userMinutesMap = useMemo(() => {
    const m = {};
    users.forEach(u => { m[u.id] = u.totalExtraMinutesRequested || 0; });
    return m;
  }, [users]);

  // ── Stat Strip ──
  const summaryStats = useMemo(() => {
    const fe = filteredExcusesForCharts;
    if (fe.length === 0) return null;
    const total = fe.length;
    const activeUsers = filteredUserIds.size;
    const totalUsers = users.length;

    // Longest streak among filtered users
    let longestStreak = 0;
    for (const uid of filteredUserIds) {
      const s = streakMap[uid];
      if (s && s.longest > longestStreak) longestStreak = s.longest;
    }

    // Count users with 7+ day streaks
    let streaksOver7 = 0;
    for (const uid of filteredUserIds) {
      const s = streakMap[uid];
      if (s && s.longest >= 7) streaksOver7++;
    }

    return {
      total, activeUsers, totalUsers, longestStreak, streaksOver7,
      avgPerUser: activeUsers > 0 ? (total / activeUsers).toFixed(1) : 0,
    };
  }, [filteredExcusesForCharts, filteredUserIds, users, streakMap]);

  // ── Daily Counts (for Activity Trend — uses filtered data) ──
  const dailyCounts = useMemo(() => {
    const byDay = {};
    filteredExcusesForCharts.forEach(e => {
      if (!e.date) return;
      const key = e.date.toISOString().split('T')[0];
      byDay[key] = (byDay[key] || 0) + 1;
    });
    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    return { labels: sorted.map(([d]) => d), data: sorted.map(([, c]) => c) };
  }, [filteredExcusesForCharts]);

  // 7-day moving average
  const movingAverage = useMemo(() => {
    const data = dailyCounts.data;
    return data.map((_, i) => {
      const start = Math.max(0, i - 6);
      const window = data.slice(start, i + 1);
      return window.reduce((s, v) => s + v, 0) / window.length;
    });
  }, [dailyCounts]);

  // ── Habit Formation ──
  const habitData = useMemo(() =>
    computeHabitFormation(excuses, filteredUserIds, 50),
    [excuses, filteredUserIds]
  );

  // ── Power Users ──
  const topCategory = (cats) => {
    if (!cats) return '--';
    const e = Object.entries(cats);
    if (!e.length) return '--';
    e.sort(([, a], [, b]) => b - a);
    return e[0][0] || '--';
  };

  const powerUsers = useMemo(() =>
    computePowerUserRankings(excusesByUser, streakMap, diversityMap, filteredUserIds, topCategory),
    [excusesByUser, streakMap, diversityMap, filteredUserIds]
  );

  // ── Cohort Retention ──
  const retentionData = useMemo(() =>
    computeCohortRetention(excuses, filteredUserIds),
    [excuses, filteredUserIds]
  );

  // ── Category Evolution ──
  const categoryEvoData = useMemo(() =>
    computeCategoryEvolution(excuses, filteredUserIds, CATEGORIES),
    [excuses, filteredUserIds]
  );

  // ── ICP Segments ──
  const icpSegments = useMemo(() =>
    computeICPSegments(excuses, filteredUserIds, CATEGORIES, streakMap, excusesByUser),
    [excuses, filteredUserIds, streakMap, excusesByUser]
  );

  const icpDrilldown = useMemo(() => {
    if (!expandedICPCategory) return null;
    const seg = icpSegments.find(s => s.category === expandedICPCategory);
    if (!seg) return null;

    // Top 10 excuse texts from segment users
    const textCounts = {};
    for (const uid of seg.segmentUserIds) {
      (excusesByUser[uid] || []).forEach(e => {
        if (!e.text) return;
        const t = e.text.trim();
        textCounts[t] = (textCounts[t] || 0) + 1;
      });
    }
    const topTexts = Object.entries(textCounts)
      .sort(([,a],[,b]) => b - a)
      .slice(0, 10)
      .map(([text, count]) => ({ text, count }));

    // Mini habit formation: segment users vs all
    const segmentUserSet = new Set(seg.segmentUserIds);
    const segHabit = computeHabitFormation(excuses, segmentUserSet, 0);
    const allHabit = computeHabitFormation(excuses, filteredUserIds, 0);

    return { segment: seg, topTexts, segHabit, allHabit };
  }, [expandedICPCategory, icpSegments, excusesByUser, excuses, filteredUserIds]);

  // ── Category Counts (for deep dive doughnut) ──
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(c => { counts[c] = 0; });
    filteredExcusesForCharts.forEach(e => {
      const cat = CATEGORIES.includes(e.category) ? e.category : 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [filteredExcusesForCharts]);

  // ── Leaderboard (for deep dive + all excuses tab) ──
  const leaderboard = useMemo(() => {
    const map = {};
    excuses.forEach(e => {
      if (!map[e.userId]) {
        map[e.userId] = {
          userId: e.userId, userName: e.userName, excuseCount: 0,
          totalMinutes: userMinutesMap[e.userId] || 0, lastActive: null, categories: {},
        };
      }
      const u = map[e.userId];
      u.excuseCount++;
      if (e.date && (!u.lastActive || e.date > u.lastActive)) u.lastActive = e.date;
      const cat = e.category || 'Uncategorized';
      u.categories[cat] = (u.categories[cat] || 0) + 1;
    });
    const list = Object.values(map)
      .filter(u => filteredUserIds.has(u.userId))
      .map(u => ({
        ...u,
        streak: streakMap[u.userId]?.longest || 0,
        diversityPct: diversityMap[u.userId]?.diversityPct || 0,
      }));
    const { field, dir } = leaderboardSort;
    list.sort((a, b) => {
      let av = a[field], bv = b[field];
      if (field === 'userName') return dir === 'asc' ? (av || '').localeCompare(bv || '') : (bv || '').localeCompare(av || '');
      if (field === 'lastActive') { av = av ? av.getTime() : 0; bv = bv ? bv.getTime() : 0; }
      return dir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [excuses, leaderboardSort, userMinutesMap, streakMap, diversityMap, filteredUserIds]);

  // Unfiltered user list for All Excuses tab dropdown
  const allUsersList = useMemo(() => {
    const map = {};
    excuses.forEach(e => {
      if (!map[e.userId]) map[e.userId] = { userId: e.userId, userName: e.userName, excuseCount: 0 };
      map[e.userId].excuseCount++;
    });
    return Object.values(map).sort((a, b) => b.excuseCount - a.excuseCount);
  }, [excuses]);

  // ── Charts ──

  // Activity Trend + Moving Average
  useEffect(() => {
    if (filteredExcusesForCharts.length === 0) return;
    if (timelineInstance.current) timelineInstance.current.destroy();
    if (timelineChartRef.current) {
      timelineInstance.current = new Chart(timelineChartRef.current, {
        type: 'line',
        data: {
          labels: dailyCounts.labels,
          datasets: [
            {
              label: 'Daily',
              data: dailyCounts.data,
              borderColor: 'rgba(84,153,199,0.3)',
              backgroundColor: 'rgba(84,153,199,0.05)',
              fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1,
            },
            {
              label: '7-day avg',
              data: movingAverage,
              borderColor: '#5499C7',
              backgroundColor: 'transparent',
              fill: false, tension: 0.4, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2.5,
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top', align: 'end',
              labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
          },
          scales: {
            x: { ticks: { maxTicksLimit: 12, font: { size: 10 } }, grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        },
      });
    }
    return () => { if (timelineInstance.current) timelineInstance.current.destroy(); };
  }, [filteredExcusesForCharts, dailyCounts, movingAverage, collapsed, activeTab]);

  // Habit Formation chart (% still active)
  useEffect(() => {
    if (habitData.weekLabels.length === 0) return;
    if (habitInstance.current) habitInstance.current.destroy();
    if (habitChartRef.current) {
      habitInstance.current = new Chart(habitChartRef.current, {
        type: 'line',
        data: {
          labels: habitData.weekLabels.map(w => `W${w}`),
          datasets: [
            {
              label: 'All users',
              data: habitData.pctAll,
              borderColor: '#B0A080', backgroundColor: 'transparent',
              tension: 0.4, pointRadius: 2, borderWidth: 1.5, borderDash: [4, 2],
            },
            {
              label: 'Power users (50+)',
              data: habitData.pctPower,
              borderColor: '#5499C7', backgroundColor: 'rgba(84,153,199,0.08)',
              fill: true, tension: 0.4, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2.5,
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top', align: 'end',
              labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
          },
          scales: {
            x: { title: { display: true, text: 'Week of Usage', font: { size: 10 }, color: '#b0a080' },
              grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { beginAtZero: true, max: 100,
              title: { display: true, text: '% Still Active', font: { size: 10 }, color: '#b0a080' },
              grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        },
      });
    }
    return () => { if (habitInstance.current) habitInstance.current.destroy(); };
  }, [habitData, collapsed, activeTab]);

  // Category Evolution: grouped bar (early vs late)
  useEffect(() => {
    if (categoryEvoData.categories.length === 0) return;
    if (categoryEvoInstance.current) categoryEvoInstance.current.destroy();
    if (categoryEvoChartRef.current) {
      const cats = categoryEvoData.categories;
      categoryEvoInstance.current = new Chart(categoryEvoChartRef.current, {
        type: 'bar',
        data: {
          labels: cats.map(c => c.name),
          datasets: [
            {
              label: 'First Half',
              data: cats.map(c => c.earlyPct),
              backgroundColor: 'rgba(176,160,128,0.5)',
              borderColor: '#B0A080',
              borderWidth: 1, borderRadius: 3,
            },
            {
              label: 'Second Half',
              data: cats.map(c => c.latePct),
              backgroundColor: 'rgba(84,153,199,0.6)',
              borderColor: '#5499C7',
              borderWidth: 1, borderRadius: 3,
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top', align: 'end',
              labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { beginAtZero: true,
              title: { display: true, text: '% of Entries', font: { size: 10 }, color: '#b0a080' },
              grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        },
      });
    }
    return () => { if (categoryEvoInstance.current) categoryEvoInstance.current.destroy(); };
  }, [categoryEvoData, collapsed, activeTab]);

  // ICP Trend: grouped bar sorted by delta, with delta annotations
  useEffect(() => {
    if (icpSegments.length === 0) return;
    if (icpTrendInstance.current) icpTrendInstance.current.destroy();
    if (icpTrendChartRef.current) {
      const sorted = [...icpSegments].sort((a, b) => b.delta - a.delta);
      const deltaLabelPlugin = {
        id: 'deltaLabels',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const meta0 = chart.getDatasetMeta(0);
          const meta1 = chart.getDatasetMeta(1);
          ctx.save();
          ctx.font = 'bold 10px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          sorted.forEach((seg, i) => {
            const bar0 = meta0.data[i];
            const bar1 = meta1.data[i];
            if (!bar0 || !bar1) return;
            const x = (bar0.x + bar1.x) / 2;
            const y = Math.min(bar0.y, bar1.y) - 8;
            const d = seg.delta;
            ctx.fillStyle = d >= 0 ? '#27ae60' : '#c0392b';
            ctx.fillText(`${d >= 0 ? '+' : ''}${d.toFixed(1)}%`, x, y);
          });
          ctx.restore();
        },
      };
      icpTrendInstance.current = new Chart(icpTrendChartRef.current, {
        type: 'bar',
        data: {
          labels: sorted.map(s => s.category),
          datasets: [
            {
              label: 'First Half',
              data: sorted.map(s => s.earlyPct),
              backgroundColor: 'rgba(176,160,128,0.5)',
              borderColor: '#B0A080',
              borderWidth: 1, borderRadius: 3,
            },
            {
              label: 'Second Half',
              data: sorted.map(s => s.latePct),
              backgroundColor: 'rgba(84,153,199,0.6)',
              borderColor: '#5499C7',
              borderWidth: 1, borderRadius: 3,
            },
          ],
        },
        plugins: [deltaLabelPlugin],
        options: {
          responsive: true, maintainAspectRatio: false,
          layout: { padding: { top: 20 } },
          plugins: {
            legend: { display: true, position: 'top', align: 'end',
              labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { beginAtZero: true,
              title: { display: true, text: '% of Entries', font: { size: 10 }, color: '#b0a080' },
              grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        },
      });
    }
    return () => { if (icpTrendInstance.current) icpTrendInstance.current.destroy(); };
  }, [icpSegments, collapsed, activeTab]);

  // ICP Drilldown: mini habit chart (segment vs all)
  useEffect(() => {
    if (!icpDrilldown) return;
    if (icpHabitInstance.current) icpHabitInstance.current.destroy();
    const timer = setTimeout(() => {
      if (icpHabitChartRef.current) {
        // Merge week labels from both datasets
        const allWeeks = new Set([...icpDrilldown.allHabit.weekLabels, ...icpDrilldown.segHabit.weekLabels]);
        const weekLabels = [...allWeeks].sort((a, b) => a - b);
        const allMap = {};
        icpDrilldown.allHabit.weekLabels.forEach((w, i) => { allMap[w] = icpDrilldown.allHabit.pctAll[i]; });
        const segMap = {};
        icpDrilldown.segHabit.weekLabels.forEach((w, i) => { segMap[w] = icpDrilldown.segHabit.pctAll[i]; });

        icpHabitInstance.current = new Chart(icpHabitChartRef.current, {
          type: 'line',
          data: {
            labels: weekLabels.map(w => `W${w}`),
            datasets: [
              {
                label: 'All users',
                data: weekLabels.map(w => allMap[w] ?? null),
                borderColor: '#B0A080', backgroundColor: 'transparent',
                tension: 0.4, pointRadius: 2, borderWidth: 1.5, borderDash: [4, 2],
                spanGaps: true,
              },
              {
                label: `${expandedICPCategory} segment`,
                data: weekLabels.map(w => segMap[w] ?? null),
                borderColor: '#5499C7', backgroundColor: 'rgba(84,153,199,0.08)',
                fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2.5,
                spanGaps: true,
              },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top', align: 'end',
                labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { beginAtZero: true, max: 100,
                title: { display: true, text: '% Still Active', font: { size: 10 }, color: '#b0a080' },
                grid: { color: 'rgba(0,0,0,0.04)' } },
            },
          },
        });
      }
    }, 50);
    return () => {
      clearTimeout(timer);
      if (icpHabitInstance.current) icpHabitInstance.current.destroy();
    };
  }, [icpDrilldown, expandedICPCategory]);

  // Deep dive: Categories doughnut
  useEffect(() => {
    if (filteredExcusesForCharts.length === 0) return;
    if (categoryInstance.current) categoryInstance.current.destroy();
    if (categoryChartRef.current) {
      const labels = CATEGORIES.filter(c => categoryCounts[c] > 0);
      categoryInstance.current = new Chart(categoryChartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: labels.map(c => categoryCounts[c]),
            backgroundColor: labels.map(c => CATEGORY_COLORS[CATEGORIES.indexOf(c)]),
            borderWidth: 2, borderColor: '#fff',
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: {
            legend: { position: 'right', labels: { font: { size: 10 }, padding: 6, boxWidth: 10 } },
          },
        },
      });
    }
    return () => { if (categoryInstance.current) categoryInstance.current.destroy(); };
  }, [filteredExcusesForCharts, categoryCounts, collapsed, activeTab]);

  // ── Drilldown ──
  const expandedUser = useMemo(() => {
    if (!expandedUserId) return null;
    return leaderboard.find(u => u.userId === expandedUserId) || null;
  }, [expandedUserId, leaderboard]);

  const expandedUserExcuses = useMemo(() => {
    if (!expandedUserId) return [];
    return excuses.filter(e => e.userId === expandedUserId).sort((a, b) => (b.date || 0) - (a.date || 0));
  }, [expandedUserId, excuses]);

  useEffect(() => {
    if (!expandedUserId || !expandedUser) return;
    const timer = setTimeout(() => {
      if (drillCategoryInstance.current) drillCategoryInstance.current.destroy();
      if (drillCategoryRef.current) {
        const labels = CATEGORIES.filter(c => (expandedUser.categories[c] || 0) > 0);
        drillCategoryInstance.current = new Chart(drillCategoryRef.current, {
          type: 'doughnut',
          data: { labels, datasets: [{ data: labels.map(c => expandedUser.categories[c]),
            backgroundColor: labels.map(c => CATEGORY_COLORS[CATEGORIES.indexOf(c)]),
            borderWidth: 2, borderColor: '#fff' }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: { legend: { position: 'right', labels: { font: { size: 10 }, padding: 6, boxWidth: 10 } } } },
        });
      }
      if (drillTimelineInstance.current) drillTimelineInstance.current.destroy();
      if (drillTimelineRef.current) {
        const byDay = {};
        expandedUserExcuses.forEach(e => {
          if (!e.date) return;
          const key = e.date.toISOString().split('T')[0];
          byDay[key] = (byDay[key] || 0) + 1;
        });
        const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
        drillTimelineInstance.current = new Chart(drillTimelineRef.current, {
          type: 'line',
          data: { labels: sorted.map(([d]) => d), datasets: [{ data: sorted.map(([, c]) => c),
            borderColor: '#58D68D', backgroundColor: 'rgba(88,214,141,0.08)',
            fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { x: { ticks: { maxTicksLimit: 10, font: { size: 10 } }, grid: { display: false } },
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } } } },
        });
      }
    }, 50);
    return () => {
      clearTimeout(timer);
      if (drillCategoryInstance.current) drillCategoryInstance.current.destroy();
      if (drillTimelineInstance.current) drillTimelineInstance.current.destroy();
    };
  }, [expandedUserId, expandedUser, expandedUserExcuses]);

  // ── All Excuses Tab ──
  const allExcusesFiltered = useMemo(() => {
    return excuses.filter(e => {
      if (filterCategory && e.category !== filterCategory) return false;
      if (filterUserId && e.userId !== filterUserId) return false;
      if (filterSearch && !e.text.toLowerCase().includes(filterSearch.toLowerCase())) return false;
      if (filterDateFrom && e.date && e.date < new Date(filterDateFrom)) return false;
      if (filterDateTo && e.date) { const end = new Date(filterDateTo); end.setHours(23, 59, 59); if (e.date > end) return false; }
      return true;
    }).sort((a, b) => (b.date || 0) - (a.date || 0));
  }, [excuses, filterCategory, filterUserId, filterSearch, filterDateFrom, filterDateTo]);

  const exportCSV = () => {
    const rows = [['Date', 'User', 'User ID', 'Excuse Text', 'Category'],
      ...allExcusesFiltered.map(e => [e.date ? e.date.toISOString() : '', e.userName, e.userId, `"${(e.text || '').replace(/"/g, '""')}"`, e.category])];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `spool-excuses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Handlers ──
  const handleSort = (field) => setLeaderboardSort(prev => ({ field, dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc' }));
  const handleRefresh = () => { setExcuses([]); setUsers([]); setError(null); fetchData(); };

  const displayName = (name, userId) => (!name || name === userId) ? 'Anonymous User' : name;

  const formatDate = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--';
  const formatDateTime = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '--';
  const formatTime = (d) => d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

  const retentionCellColor = (pct) => {
    if (pct >= 0.6) return 'rgba(88,214,141,0.25)';
    if (pct >= 0.3) return 'rgba(244,208,63,0.25)';
    return 'rgba(236,112,99,0.25)';
  };

  if (authLoading) return <div className="excuse-page"><div className="ed-loading">Loading...</div></div>;

  const spotlight = powerUsers[0] || null;

  return (
    <div className="excuse-page">
      {/* Header */}
      <header className="ed-header">
        <h1>Spool Journal Analytics</h1>
        <div className="ed-header-right">
          {user ? (
            <>
              {lastFetched && <span className="ed-updated">Updated {formatTime(lastFetched)}</span>}
              <button className="ed-btn ed-btn-ghost" onClick={handleRefresh} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <span className="ed-divider" />
              <span className="ed-email">{user.email}</span>
              <button className="ed-btn ed-btn-danger" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="ed-btn ed-btn-primary" onClick={handleSignIn}>Sign In with Google</button>
          )}
        </div>
      </header>

      {!user ? (
        <div className="ed-empty">Sign in with an authorized Google account to view analytics.</div>
      ) : loading ? (
        <div className="ed-loading">Loading data...</div>
      ) : error ? (
        <div className="ed-error"><p>{error}</p><button className="ed-btn ed-btn-ghost" onClick={handleRefresh}>Try Again</button></div>
      ) : (
        <>
          {/* ── Stat Strip ── */}
          {summaryStats && (
            <div className="stat-strip">
              <div className="stat-item"><span className="stat-value">{summaryStats.total.toLocaleString()}</span><span className="stat-label">Journal Entries</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.activeUsers}<small>/{summaryStats.totalUsers}</small></span><span className="stat-label">Active Users</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.avgPerUser}</span><span className="stat-label">Avg / User</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.longestStreak}<small> days</small></span><span className="stat-label">Longest Streak</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.streaksOver7}</span><span className="stat-label">7+ Day Streaks</span></div>
            </div>
          )}

          {/* ── Filter Toggle ── */}
          <div className="ed-filter-toggle-bar">
            <label className="ed-filter-toggle">
              <input type="checkbox" checked={realJournalersOnly} onChange={() => setRealJournalersOnly(v => !v)} />
              <span className="ed-toggle-label">Real Journalers Only</span>
            </label>
            {realJournalersOnly && (
              <span className="ed-toggle-desc">Excluding team members and bypass users (&lt;50% text diversity)</span>
            )}
          </div>

          {/* ── Tab Bar ── */}
          <div className="ed-tab-bar">
            <button className={`ed-tab ${activeTab === 'overview' ? 'ed-tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`ed-tab ${activeTab === 'icp-insights' ? 'ed-tab-active' : ''}`}
              onClick={() => setActiveTab('icp-insights')}>ICP &amp; Insights</button>
            <button className={`ed-tab ${activeTab === 'all-excuses' ? 'ed-tab-active' : ''}`}
              onClick={() => setActiveTab('all-excuses')}>All Excuses</button>
          </div>

          {/* ====== OVERVIEW TAB ====== */}
          {activeTab === 'overview' && (
            <>
              {/* ── 1. Growth ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('trend')}>
                  <div>
                    <h2>Growth</h2>
                    <span className="ed-panel-sub">Each bar = total journal entries logged that day. The blue line smooths daily noise into a 7-day rolling average.</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.trend ? '+' : '−'}</span>
                </div>
                {!collapsed.trend && (
                  <div className="ed-panel-body">
                    <div className="ed-chart-wrap" style={{ height: 170 }}><canvas ref={timelineChartRef} /></div>
                  </div>
                )}
              </div>

              {/* ── 2. Habit Formation ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('habit')}>
                  <div>
                    <h2>Habit Formation</h2>
                    <span className="ed-panel-sub">For each user, Week 0 is when they first used Spool. This shows what % of users were still logging entries at each week after signup. &quot;Power users&quot; = users with 50+ total entries.</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.habit ? '+' : '−'}</span>
                </div>
                {!collapsed.habit && (
                  <div className="ed-panel-body">
                    <div className="ed-chart-wrap" style={{ height: 200 }}><canvas ref={habitChartRef} /></div>
                    <div className="ed-chart-footnote">Only includes weeks where 3+ users have enough history. Users who joined recently won't appear in later weeks.</div>
                  </div>
                )}
              </div>

              {/* ── 3. Power User Spotlight ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('power')}>
                  <div>
                    <h2>Power Users</h2>
                    <span className="ed-panel-sub">Ranked by composite score: 40% total entries, 30% longest streak, 30% text diversity. Text diversity = % of excuses that are unique (not copy-pasted).</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.power ? '+' : '−'}</span>
                </div>
                {!collapsed.power && (
                  <div className="ed-panel-body">
                    {spotlight && (
                      <div className="ed-spotlight-card">
                        <div className="ed-spotlight-name">{displayName(spotlight.userName, spotlight.userId)}</div>
                        <div className="ed-spotlight-stats">
                          <div className="ed-spotlight-stat">
                            <span className="ed-spotlight-val">{spotlight.excuseCount}</span>
                            <span className="ed-spotlight-label">Entries</span>
                          </div>
                          <div className="ed-spotlight-stat">
                            <span className="ed-spotlight-val">{spotlight.longest}<small>d</small></span>
                            <span className="ed-spotlight-label">Longest Streak</span>
                          </div>
                          <div className="ed-spotlight-stat">
                            <span className="ed-spotlight-val">{spotlight.uniqueDays}</span>
                            <span className="ed-spotlight-label">Active Days</span>
                          </div>
                          <div className="ed-spotlight-stat">
                            <span className="ed-spotlight-val">{(spotlight.diversityPct * 100).toFixed(0)}%</span>
                            <span className="ed-spotlight-label">Diversity</span>
                          </div>
                          <div className="ed-spotlight-stat">
                            <span className="ed-spotlight-val">{spotlight.topCategory}</span>
                            <span className="ed-spotlight-label">Top Category</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {powerUsers.length > 1 && (
                      <div className="ed-top-list">
                        <table className="ed-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Entries</th>
                              <th>Streak</th>
                              <th>Active Days</th>
                              <th>Diversity</th>
                              <th>Top Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {powerUsers.slice(1, 6).map((u, i) => (
                              <tr key={u.userId}>
                                <td className="ed-bold">{i + 2}</td>
                                <td className="ed-bold">{displayName(u.userName, u.userId)}</td>
                                <td>{u.excuseCount}</td>
                                <td>{u.longest}d</td>
                                <td>{u.uniqueDays}</td>
                                <td>{(u.diversityPct * 100).toFixed(0)}%</td>
                                <td><span className="ed-badge">{u.topCategory}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── 4. Retention ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('retention')}>
                  <div>
                    <h2>Retention</h2>
                    <span className="ed-panel-sub">Users grouped by the month they first used Spool. Each cell = % of that group still logging entries at that week. Green = 60%+, yellow = 30-60%, red = &lt;30%.</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.retention ? '+' : '−'}</span>
                </div>
                {!collapsed.retention && (
                  <div className="ed-panel-body">
                    {(() => {
                      const visibleCohorts = retentionData.cohorts.filter(c => c.size >= 8);
                      const visibleCheckpoints = retentionData.weekCheckpoints.slice(1).filter(w => {
                        if (w < 8) return true;
                        return visibleCohorts.some(c => (c.retention[w] || 0) > 0);
                      });
                      return visibleCohorts.length > 0 ? (
                        <div className="ed-table-wrap">
                          <table className="ed-table ed-retention-table">
                            <thead>
                              <tr>
                                <th>Cohort</th>
                                <th>Size</th>
                                {visibleCheckpoints.map(w => (
                                  <th key={w}>Wk {w}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {visibleCohorts.map(c => (
                                <tr key={c.label}>
                                  <td className="ed-bold ed-nowrap">{c.label}</td>
                                  <td>{c.size}</td>
                                  {visibleCheckpoints.map(w => {
                                    const pct = c.retention[w] || 0;
                                    return (
                                      <td key={w} style={{ background: retentionCellColor(pct) }}>
                                        {(pct * 100).toFixed(0)}%
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="ed-chart-footnote">
                            Users may return after inactive weeks, so retention can increase in later periods.
                          </div>
                        </div>
                      ) : (
                        <div className="ed-empty-inline">Not enough cohort data yet (need 8+ users per cohort)</div>
                      );
                    })()}
                  </div>
                )}
              </div>

            </>
          )}

          {/* ====== ICP & INSIGHTS TAB ====== */}
          {activeTab === 'icp-insights' && (
            <>
              {/* ── 1. Self-Awareness ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('catevo')}>
                  <div>
                    <h2>Self-Awareness</h2>
                    <span className="ed-panel-sub">For each user, we split their excuse history at the midpoint (by date). Gold bars = category % in their first half; blue bars = second half. A rising category means users gravitate toward it over time.</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.catevo ? '+' : '−'}</span>
                </div>
                {!collapsed.catevo && (
                  <div className="ed-panel-body">
                    {categoryEvoData.categories.length > 0 ? (
                      <>
                        <div className="ed-chart-wrap" style={{ height: 220 }}><canvas ref={categoryEvoChartRef} /></div>
                        <div className="ed-chart-footnote">
                          First half: {categoryEvoData.earlySample} entries · Second half: {categoryEvoData.lateSample} entries.
                          &quot;First half&quot; and &quot;second half&quot; are relative to each user's own timeline, so join dates are normalized. Only users with 1+ week of data and excuses with a category assigned.
                        </div>
                      </>
                    ) : (
                      <div className="ed-empty-inline">Not enough categorized data yet</div>
                    )}
                  </div>
                )}
              </div>

              {/* ── 2. ICP Explorer ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('icp')}>
                  <div>
                    <h2>ICP Explorer</h2>
                    <span className="ed-panel-sub">Same first-half vs second-half comparison as Self-Awareness, but sorted by growth (biggest increase on the left). Green/red labels = percentage-point shift.</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.icp ? '+' : '−'}</span>
                </div>
                {!collapsed.icp && (
                  <div className="ed-panel-body">
                    {icpSegments.length > 0 ? (
                      <>
                        <div className="ed-chart-wrap" style={{ height: 220 }}><canvas ref={icpTrendChartRef} /></div>
                        <div className="ed-chart-footnote">Sorted by growth trend (biggest increase on left). Delta labels show percentage-point shift from first half to second half.</div>

                        <h3 className="ed-sub-heading" style={{ marginTop: 18 }}>Segment Performance</h3>
                        <div className="ed-chart-footnote" style={{ marginTop: 0, marginBottom: 10, textAlign: 'left' }}>
                          A &quot;segment&quot; = users where this category is 25%+ of their categorized excuses. Stats compare each segment against the full user population.
                        </div>
                        <div className="ed-table-wrap">
                          <table className="ed-table">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Trend</th>
                                <th>Segment Size</th>
                                <th>Avg Streak (seg / all)</th>
                                <th>14d Retention (seg / all)</th>
                                <th>Entries/User (seg / all)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {icpSegments.map(seg => {
                                const tint = seg.retentionDelta > 0.02 ? 'rgba(88,214,141,0.15)'
                                  : seg.retentionDelta < -0.05 ? 'rgba(236,112,99,0.15)' : 'transparent';
                                return (
                                  <tr key={seg.category} className="ed-clickable"
                                    style={{ background: tint }}
                                    onClick={() => setExpandedICPCategory(
                                      expandedICPCategory === seg.category ? null : seg.category
                                    )}>
                                    <td className="ed-bold">{seg.category}</td>
                                    <td style={{ color: seg.delta >= 0 ? '#27ae60' : '#c0392b', fontWeight: 600 }}>
                                      {seg.delta >= 0 ? '↑' : '↓'}{seg.delta >= 0 ? '+' : ''}{seg.delta.toFixed(1)}%
                                    </td>
                                    <td>{seg.segmentSize} users</td>
                                    <td>{seg.segmentAvgStreak.toFixed(1)}d <small style={{ color: '#b0a080' }}>/ {seg.popAvgStreak.toFixed(1)}d</small></td>
                                    <td>{(seg.segmentRetention * 100).toFixed(0)}% <small style={{ color: '#b0a080' }}>/ {(seg.popRetention * 100).toFixed(0)}%</small></td>
                                    <td>{seg.segmentAvgEntries.toFixed(1)} <small style={{ color: '#b0a080' }}>/ {seg.popAvgEntries.toFixed(1)}</small></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="ed-chart-footnote" style={{ textAlign: 'left' }}>
                          &quot;Retained&quot; = user logged at least one excuse in the last 14 days. Green rows = segment outperforms population on retention. Red = underperforms. Click a row to drill down.
                        </div>

                        {icpDrilldown && (
                          <div className="ed-drilldown">
                            <div className="ed-drill-stats">
                              <div className="ed-drill-stat">
                                <span className="ed-drill-val">{icpDrilldown.segment.segmentSize}</span>
                                <span className="ed-drill-label">Users</span>
                              </div>
                              <div className="ed-drill-stat">
                                <span className="ed-drill-val">{icpDrilldown.segment.segmentAvgStreak.toFixed(1)}d</span>
                                <span className="ed-drill-label">Avg Streak</span>
                              </div>
                              <div className="ed-drill-stat">
                                <span className="ed-drill-val">{(icpDrilldown.segment.segmentRetention * 100).toFixed(0)}%</span>
                                <span className="ed-drill-label">Retained</span>
                              </div>
                              <div className="ed-drill-stat">
                                <span className="ed-drill-val">{icpDrilldown.segment.segmentAvgEntries.toFixed(1)}</span>
                                <span className="ed-drill-label">Avg Entries</span>
                              </div>
                            </div>

                            <div style={{ marginTop: 16 }}>
                              <h3 className="ed-sub-heading">Retention Curve: {expandedICPCategory} segment vs All Users</h3>
                              <div className="ed-chart-footnote" style={{ textAlign: 'left', marginBottom: 6 }}>% of users in this segment still active at each week of usage, compared to all filtered users.</div>
                              <div className="ed-chart-wrap" style={{ height: 160 }}><canvas ref={icpHabitChartRef} /></div>
                            </div>

                            <div style={{ marginTop: 16 }}>
                              <h3 className="ed-sub-heading">Most Common Excuses</h3>
                              <div className="ed-table-wrap ed-table-wrap-scroll">
                                <table className="ed-table">
                                  <thead><tr><th>#</th><th>Excuse Text</th><th>Count</th></tr></thead>
                                  <tbody>
                                    {icpDrilldown.topTexts.map((t, i) => (
                                      <tr key={i}>
                                        <td className="ed-bold">{i + 1}</td>
                                        <td className="ed-text-cell" style={{ maxWidth: 500 }}>{t.text}</td>
                                        <td>{t.count}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="ed-empty-inline">Not enough categorized data for segment analysis</div>
                    )}
                  </div>
                )}
              </div>

              {/* ── 3. Explore ── */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('explore')}>
                  <div>
                    <h2>Explore</h2>
                    <span className="ed-panel-sub">Detailed breakdown</span>
                  </div>
                  <span className="ed-collapse-icon">{collapsed.explore ? '+' : '−'}</span>
                </div>
                {!collapsed.explore && (
                  <>
                    {/* Categories doughnut */}
                    <div className="ed-panel-body">
                      <h3 className="ed-sub-heading">Category Distribution</h3>
                      <div className="ed-chart-wrap" style={{ height: 200 }}><canvas ref={categoryChartRef} /></div>
                    </div>

                    {/* Users Table */}
                    <div className="ed-panel-head" style={{ borderTop: '1px solid #ede4d2' }}>
                      <div className="ed-panel-breadcrumb">
                        <button className={`ed-crumb ${!expandedUserId ? 'ed-crumb-active' : 'ed-crumb-link'}`}
                          onClick={() => setExpandedUserId(null)}>Users</button>
                        {expandedUser && (
                          <>
                            <span className="ed-crumb-sep">/</span>
                            <span className="ed-crumb ed-crumb-active">{displayName(expandedUser.userName, expandedUser.userId)}</span>
                          </>
                        )}
                      </div>
                      {!expandedUserId && <span className="ed-panel-sub">Click a row to inspect</span>}
                    </div>

                    {!expandedUserId && (
                      <div className="ed-panel-flush">
                        <div className="ed-table-wrap">
                          <table className="ed-table">
                            <thead>
                              <tr>
                                <th onClick={() => handleSort('userName')} className="ed-sortable">
                                  Name {leaderboardSort.field === 'userName' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('excuseCount')} className="ed-sortable">
                                  Entries {leaderboardSort.field === 'excuseCount' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('streak')} className="ed-sortable">
                                  Streak {leaderboardSort.field === 'streak' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('diversityPct')} className="ed-sortable">
                                  Diversity {leaderboardSort.field === 'diversityPct' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('totalMinutes')} className="ed-sortable">
                                  Total Min {leaderboardSort.field === 'totalMinutes' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('lastActive')} className="ed-sortable">
                                  Last Active {leaderboardSort.field === 'lastActive' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th>Top Category</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leaderboard.map(u => (
                                <tr key={u.userId} onClick={() => setExpandedUserId(u.userId)} className="ed-clickable">
                                  <td className="ed-bold">{displayName(u.userName, u.userId)}</td>
                                  <td>{u.excuseCount}</td>
                                  <td>{u.streak}d</td>
                                  <td>{(u.diversityPct * 100).toFixed(0)}%</td>
                                  <td>{u.totalMinutes}</td>
                                  <td>{formatDate(u.lastActive)}</td>
                                  <td><span className="ed-badge">{topCategory(u.categories)}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {expandedUserId && expandedUser && (
                      <div className="ed-drilldown">
                        <div className="ed-drill-stats">
                          <div className="ed-drill-stat"><span className="ed-drill-val">{expandedUser.excuseCount}</span><span className="ed-drill-label">Entries</span></div>
                          <div className="ed-drill-stat"><span className="ed-drill-val">{expandedUser.streak}d</span><span className="ed-drill-label">Streak</span></div>
                          <div className="ed-drill-stat"><span className="ed-drill-val">{(expandedUser.diversityPct * 100).toFixed(0)}%</span><span className="ed-drill-label">Diversity</span></div>
                          <div className="ed-drill-stat"><span className="ed-drill-val">{formatDate(expandedUser.lastActive)}</span><span className="ed-drill-label">Last Active</span></div>
                          <div className="ed-drill-stat"><span className="ed-drill-val">{topCategory(expandedUser.categories)}</span><span className="ed-drill-label">Top Category</span></div>
                        </div>
                        <div className="ed-drill-charts">
                          <div className="ed-drill-chart-box">
                            <h3>Categories</h3>
                            <div className="ed-chart-wrap" style={{ height: 180 }}><canvas ref={drillCategoryRef} /></div>
                          </div>
                          <div className="ed-drill-chart-box">
                            <h3>Activity</h3>
                            <div className="ed-chart-wrap" style={{ height: 180 }}><canvas ref={drillTimelineRef} /></div>
                          </div>
                        </div>
                        <div className="ed-drill-excuses">
                          <h3>Excuses ({expandedUserExcuses.length})</h3>
                          <div className="ed-table-wrap ed-table-wrap-scroll">
                            <table className="ed-table">
                              <thead><tr><th>Date</th><th>Text</th><th>Category</th></tr></thead>
                              <tbody>
                                {expandedUserExcuses.map(e => (
                                  <tr key={e.id}>
                                    <td className="ed-nowrap">{formatDateTime(e.date)}</td>
                                    <td className="ed-text-cell">{e.text || '--'}</td>
                                    <td><span className="ed-badge">{e.category || '--'}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* ====== ALL EXCUSES TAB ====== */}
          {activeTab === 'all-excuses' && (
            <>
              <div className="ed-panel">
                <div className="ed-panel-body">
                  <div className="ed-filter-bar">
                    <input type="text" placeholder="Search excuses..." value={filterSearch}
                      onChange={e => setFilterSearch(e.target.value)} className="ed-filter-input" />
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="ed-filter-select">
                      <option value="">All Categories</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={filterUserId} onChange={e => setFilterUserId(e.target.value)} className="ed-filter-select">
                      <option value="">All Users</option>
                      {allUsersList.map(u => <option key={u.userId} value={u.userId}>{u.userName} ({u.excuseCount})</option>)}
                    </select>
                    <div className="ed-filter-dates">
                      <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="ed-filter-date" />
                      <span className="ed-filter-sep">to</span>
                      <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="ed-filter-date" />
                    </div>
                    <button className="ed-btn ed-btn-export" onClick={exportCSV}>Export CSV</button>
                  </div>
                </div>
              </div>
              <div className="ed-panel">
                <div className="ed-panel-head">
                  <h2>Results</h2>
                  <span className="ed-panel-sub">{allExcusesFiltered.length.toLocaleString()} excuses</span>
                </div>
                <div className="ed-panel-flush">
                  <div className="ed-table-wrap ed-table-wrap-tall">
                    <table className="ed-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>User</th>
                          <th>User ID</th>
                          <th>Excuse Text</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allExcusesFiltered.map(e => (
                          <tr key={e.id}>
                            <td className="ed-nowrap">{formatDateTime(e.date)}</td>
                            <td className="ed-nowrap">{e.userName}</td>
                            <td className="ed-uid">{e.userId}</td>
                            <td className="ed-text-cell">{e.text || '--'}</td>
                            <td><span className="ed-badge">{e.category || '--'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ExcuseDataPage;
