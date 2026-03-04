import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { collection, collectionGroup, getDocs } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
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

  // Which user is expanded in the leaderboard (null = show table)
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [leaderboardSort, setLeaderboardSort] = useState({ field: 'excuseCount', dir: 'desc' });

  // Collapsible panels
  const [collapsed, setCollapsed] = useState({});

  // Tabs: 'overview' | 'all-excuses'
  const [activeTab, setActiveTab] = useState('overview');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Chart refs
  const timelineChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const hourChartRef = useRef(null);
  const timelineInstance = useRef(null);
  const categoryInstance = useRef(null);
  const hourInstance = useRef(null);
  const drillCategoryRef = useRef(null);
  const drillTimelineRef = useRef(null);
  const drillCategoryInstance = useRef(null);
  const drillTimelineInstance = useRef(null);

  const toggleCollapse = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

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
          text: data.text || '', category: data.category || 'Uncategorized', date,
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

  // --- Computed ---
  const userMinutesMap = useMemo(() => {
    const m = {};
    users.forEach(u => { m[u.id] = u.totalExtraMinutesRequested || 0; });
    return m;
  }, [users]);

  const activeUserCount = useMemo(() => new Set(excuses.map(e => e.userId)).size, [excuses]);

  const summaryStats = useMemo(() => {
    if (excuses.length === 0) return null;
    const total = excuses.length;
    const totalMin = users.reduce((s, u) => s + (u.totalExtraMinutesRequested || 0), 0);
    return {
      total, activeUsers: activeUserCount, totalUsers: users.length, totalMin,
      avgPerUser: activeUserCount > 0 ? (total / activeUserCount).toFixed(1) : 0,
      avgMinPerExcuse: total > 0 ? (totalMin / total).toFixed(1) : 0,
    };
  }, [excuses, users, activeUserCount]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(c => { counts[c] = 0; });
    excuses.forEach(e => {
      const cat = CATEGORIES.includes(e.category) ? e.category : 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [excuses]);

  const dailyCounts = useMemo(() => {
    const byDay = {};
    excuses.forEach(e => {
      if (!e.date) return;
      byDay[e.date.toISOString().split('T')[0]] = (byDay[e.date.toISOString().split('T')[0]] || 0) + 1;
    });
    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    return { labels: sorted.map(([d]) => d), data: sorted.map(([, c]) => c) };
  }, [excuses]);

  const hourCounts = useMemo(() => {
    const h = new Array(24).fill(0);
    excuses.forEach(e => { if (e.date) h[e.date.getHours()]++; });
    return h;
  }, [excuses]);

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
      const cat = CATEGORIES.includes(e.category) ? e.category : 'Uncategorized';
      u.categories[cat] = (u.categories[cat] || 0) + 1;
    });
    const list = Object.values(map);
    const { field, dir } = leaderboardSort;
    list.sort((a, b) => {
      let av = a[field], bv = b[field];
      if (field === 'userName') return dir === 'asc' ? (av || '').localeCompare(bv || '') : (bv || '').localeCompare(av || '');
      if (field === 'lastActive') { av = av ? av.getTime() : 0; bv = bv ? bv.getTime() : 0; }
      return dir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [excuses, leaderboardSort, userMinutesMap]);

  // --- Charts: trend, category, hour ---
  useEffect(() => {
    if (excuses.length === 0) return;
    if (timelineInstance.current) timelineInstance.current.destroy();
    if (timelineChartRef.current) {
      timelineInstance.current = new Chart(timelineChartRef.current, {
        type: 'line',
        data: { labels: dailyCounts.labels, datasets: [{ data: dailyCounts.data,
          borderColor: '#5499C7', backgroundColor: 'rgba(84,153,199,0.08)',
          fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { ticks: { maxTicksLimit: 12, font: { size: 10 } }, grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } } } },
      });
    }
    if (categoryInstance.current) categoryInstance.current.destroy();
    if (categoryChartRef.current) {
      const labels = CATEGORIES.filter(c => categoryCounts[c] > 0);
      categoryInstance.current = new Chart(categoryChartRef.current, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: labels.map(c => categoryCounts[c]),
          backgroundColor: labels.map(c => CATEGORY_COLORS[CATEGORIES.indexOf(c)]),
          borderWidth: 2, borderColor: '#fff' }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: { legend: { position: 'right', labels: { font: { size: 10 }, padding: 6, boxWidth: 10 } } } },
      });
    }
    if (hourInstance.current) hourInstance.current.destroy();
    if (hourChartRef.current) {
      const labels = Array.from({ length: 24 }, (_, i) => `${i % 12 || 12}${i < 12 ? 'a' : 'p'}`);
      hourInstance.current = new Chart(hourChartRef.current, {
        type: 'bar',
        data: { labels, datasets: [{ data: hourCounts,
          backgroundColor: hourCounts.map(v => { const mx = Math.max(...hourCounts); return `rgba(235,152,78,${0.15 + (mx > 0 ? v / mx : 0) * 0.85})`; }),
          borderRadius: 3 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false }, ticks: { font: { size: 9 } } } } },
      });
    }
    return () => {
      if (timelineInstance.current) timelineInstance.current.destroy();
      if (categoryInstance.current) categoryInstance.current.destroy();
      if (hourInstance.current) hourInstance.current.destroy();
    };
  }, [excuses, dailyCounts, categoryCounts, hourCounts]);

  // --- Drilldown charts (inside leaderboard panel) ---
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
    // Small delay to ensure canvas is in DOM after state change
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

  // --- Search (All Excuses) ---
  const filteredExcuses = useMemo(() => {
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
      ...filteredExcuses.map(e => [e.date ? e.date.toISOString() : '', e.userName, e.userId, `"${(e.text || '').replace(/"/g, '""')}"`, e.category])];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `spool-excuses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // --- Handlers ---
  const handleSort = (field) => setLeaderboardSort(prev => ({ field, dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc' }));
  const handleRefresh = () => { setExcuses([]); setUsers([]); setError(null); fetchData(); };

  const formatDate = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--';
  const formatDateTime = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '--';
  const formatTime = (d) => d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
  const topCategory = (cats) => { if (!cats) return '--'; const e = Object.entries(cats); if (!e.length) return '--'; e.sort(([,a],[,b]) => b - a); return e[0][0]; };

  if (authLoading) return <div className="excuse-page"><div className="ed-loading">Loading...</div></div>;

  return (
    <div className="excuse-page">
      {/* Header */}
      <header className="ed-header">
        <h1>Excuse Analytics</h1>
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
        <div className="ed-empty">Sign in with an authorized Google account to view excuse analytics.</div>
      ) : loading ? (
        <div className="ed-loading">Loading excuse data...</div>
      ) : error ? (
        <div className="ed-error"><p>{error}</p><button className="ed-btn ed-btn-ghost" onClick={handleRefresh}>Try Again</button></div>
      ) : (
        <>
          {/* ── Stat Strip ── */}
          {summaryStats && (
            <div className="stat-strip">
              <div className="stat-item"><span className="stat-value">{summaryStats.total.toLocaleString()}</span><span className="stat-label">Excuses</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.activeUsers}<small>/{summaryStats.totalUsers}</small></span><span className="stat-label">Active Users</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.totalMin.toLocaleString()}<small> min</small></span><span className="stat-label">Screen Time</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.avgPerUser}</span><span className="stat-label">Avg / User</span></div>
              <div className="stat-sep" />
              <div className="stat-item"><span className="stat-value">{summaryStats.avgMinPerExcuse}<small> min</small></span><span className="stat-label">Avg / Excuse</span></div>
            </div>
          )}

          {/* ── Tab Bar ── */}
          <div className="ed-tab-bar">
            <button className={`ed-tab ${activeTab === 'overview' ? 'ed-tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`ed-tab ${activeTab === 'all-excuses' ? 'ed-tab-active' : ''}`}
              onClick={() => setActiveTab('all-excuses')}>All Excuses</button>
          </div>

          {/* ====== OVERVIEW TAB ====== */}
          {activeTab === 'overview' && (
            <>
              {/* Activity Trend */}
              <div className="ed-panel">
                <div className="ed-panel-head" onClick={() => toggleCollapse('trend')}>
                  <h2>Activity Trend</h2>
                  <span className="ed-collapse-icon">{collapsed.trend ? '+' : '−'}</span>
                </div>
                {!collapsed.trend && (
                  <div className="ed-panel-body">
                    <div className="ed-chart-wrap" style={{ height: 170 }}><canvas ref={timelineChartRef} /></div>
                  </div>
                )}
              </div>

              {/* Insights */}
              <div className="ed-panel-row">
                <div className="ed-panel">
                  <div className="ed-panel-head" onClick={() => toggleCollapse('categories')}>
                    <h2>Categories</h2>
                    <span className="ed-collapse-icon">{collapsed.categories ? '+' : '−'}</span>
                  </div>
                  {!collapsed.categories && (
                    <div className="ed-panel-body">
                      <div className="ed-chart-wrap" style={{ height: 200 }}><canvas ref={categoryChartRef} /></div>
                    </div>
                  )}
                </div>
                <div className="ed-panel">
                  <div className="ed-panel-head" onClick={() => toggleCollapse('hours')}>
                    <h2>Peak Hours</h2>
                    <span className="ed-collapse-icon">{collapsed.hours ? '+' : '−'}</span>
                  </div>
                  {!collapsed.hours && (
                    <div className="ed-panel-body">
                      <div className="ed-chart-wrap" style={{ height: 200 }}><canvas ref={hourChartRef} /></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Users Panel */}
              <div className="ed-panel">
                <div className="ed-panel-head">
                  <div className="ed-panel-breadcrumb">
                    <button className={`ed-crumb ${!expandedUserId ? 'ed-crumb-active' : 'ed-crumb-link'}`}
                      onClick={() => setExpandedUserId(null)}>Users</button>
                    {expandedUser && (
                      <>
                        <span className="ed-crumb-sep">/</span>
                        <span className="ed-crumb ed-crumb-active">{expandedUser.userName}</span>
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
                            <th>User ID</th>
                            <th onClick={() => handleSort('excuseCount')} className="ed-sortable">
                              Excuses {leaderboardSort.field === 'excuseCount' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
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
                              <td className="ed-bold">{u.userName}</td>
                              <td className="ed-uid">{u.userId}</td>
                              <td>{u.excuseCount}</td>
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
                      <div className="ed-drill-stat"><span className="ed-drill-val">{expandedUser.excuseCount}</span><span className="ed-drill-label">Excuses</span></div>
                      <div className="ed-drill-stat"><span className="ed-drill-val">{expandedUser.totalMinutes}</span><span className="ed-drill-label">Total Min</span></div>
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
                                <td><span className="ed-badge">{e.category}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
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
                      {leaderboard.map(u => <option key={u.userId} value={u.userId}>{u.userName} ({u.excuseCount})</option>)}
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
                  <span className="ed-panel-sub">{filteredExcuses.length.toLocaleString()} excuses</span>
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
                        {filteredExcuses.map(e => (
                          <tr key={e.id}>
                            <td className="ed-nowrap">{formatDateTime(e.date)}</td>
                            <td className="ed-nowrap">{e.userName}</td>
                            <td className="ed-uid">{e.userId}</td>
                            <td className="ed-text-cell">{e.text || '--'}</td>
                            <td><span className="ed-badge">{e.category}</span></td>
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
