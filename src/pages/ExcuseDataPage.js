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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [leaderboardSort, setLeaderboardSort] = useState({ field: 'excuseCount', dir: 'desc' });

  // Explorer filters
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
        if (ts) {
          date = ts.toDate ? ts.toDate() : new Date(ts);
        }
        return {
          id: doc.id,
          userId,
          userName: userInfo.displayName || userInfo.name || userInfo.email || userId,
          text: data.text || '',
          category: data.category || 'Uncategorized',
          date,
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
    if (user && excuses.length === 0 && !loading && !error) {
      fetchData();
    }
  }, [user, excuses.length, loading, error, fetchData]);

  // --- Computed data ---
  const userMinutesMap = useMemo(() => {
    const m = {};
    users.forEach(u => { m[u.id] = u.totalExtraMinutesRequested || 0; });
    return m;
  }, [users]);

  const activeUsers = useMemo(() => {
    return new Set(excuses.map(e => e.userId)).size;
  }, [excuses]);

  const summaryStats = useMemo(() => {
    if (excuses.length === 0) return null;
    const totalExcuses = excuses.length;
    const totalMinutes = users.reduce((sum, u) => sum + (u.totalExtraMinutesRequested || 0), 0);
    const avgPerUser = activeUsers > 0 ? (totalExcuses / activeUsers).toFixed(1) : 0;
    const avgMinPerExcuse = totalExcuses > 0 ? (totalMinutes / totalExcuses).toFixed(1) : 0;
    return { totalExcuses, activeUsers, totalMinutes, avgPerUser, avgMinPerExcuse, totalUsers: users.length };
  }, [excuses, users, activeUsers]);

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
      const key = e.date.toISOString().split('T')[0];
      byDay[key] = (byDay[key] || 0) + 1;
    });
    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    return { labels: sorted.map(([d]) => d), data: sorted.map(([, c]) => c) };
  }, [excuses]);

  const hourCounts = useMemo(() => {
    const hours = new Array(24).fill(0);
    excuses.forEach(e => {
      if (!e.date) return;
      hours[e.date.getHours()]++;
    });
    return hours;
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
      if (field === 'userName') {
        return dir === 'asc' ? (av || '').localeCompare(bv || '') : (bv || '').localeCompare(av || '');
      }
      if (field === 'lastActive') { av = av ? av.getTime() : 0; bv = bv ? bv.getTime() : 0; }
      return dir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [excuses, leaderboardSort, userMinutesMap]);

  // --- Overview charts ---
  useEffect(() => {
    if (activeTab !== 'overview' || excuses.length === 0) return;
    if (timelineInstance.current) timelineInstance.current.destroy();
    if (timelineChartRef.current) {
      timelineInstance.current = new Chart(timelineChartRef.current, {
        type: 'line',
        data: {
          labels: dailyCounts.labels,
          datasets: [{ label: 'Excuses per Day', data: dailyCounts.data,
            borderColor: '#5499C7', backgroundColor: 'rgba(84,153,199,0.08)',
            fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { maxTicksLimit: 12, font: { size: 11 } }, grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        },
      });
    }
    if (categoryInstance.current) categoryInstance.current.destroy();
    if (categoryChartRef.current) {
      const labels = CATEGORIES.filter(c => categoryCounts[c] > 0);
      categoryInstance.current = new Chart(categoryChartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data: labels.map(c => categoryCounts[c]),
            backgroundColor: labels.map(c => CATEGORY_COLORS[CATEGORIES.indexOf(c)]),
            borderWidth: 2, borderColor: '#fff' }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: { legend: { position: 'right', labels: { font: { size: 11 }, padding: 8, boxWidth: 12 } } },
        },
      });
    }
    if (hourInstance.current) hourInstance.current.destroy();
    if (hourChartRef.current) {
      const labels = Array.from({ length: 24 }, (_, i) => `${i % 12 || 12}${i < 12 ? 'a' : 'p'}`);
      hourInstance.current = new Chart(hourChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Excuses', data: hourCounts,
            backgroundColor: hourCounts.map(v => {
              const max = Math.max(...hourCounts);
              return `rgba(235,152,78,${0.15 + (max > 0 ? v / max : 0) * 0.85})`;
            }), borderRadius: 3 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } },
        },
      });
    }
    return () => {
      if (timelineInstance.current) timelineInstance.current.destroy();
      if (categoryInstance.current) categoryInstance.current.destroy();
      if (hourInstance.current) hourInstance.current.destroy();
    };
  }, [activeTab, excuses, dailyCounts, categoryCounts, hourCounts]);

  // --- Drilldown data ---
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return leaderboard.find(u => u.userId === selectedUserId) || null;
  }, [selectedUserId, leaderboard]);

  const selectedUserExcuses = useMemo(() => {
    if (!selectedUserId) return [];
    return excuses.filter(e => e.userId === selectedUserId).sort((a, b) => (b.date || 0) - (a.date || 0));
  }, [selectedUserId, excuses]);

  useEffect(() => {
    if (activeTab !== 'user' || !selectedUserId) return;
    if (drillCategoryInstance.current) drillCategoryInstance.current.destroy();
    if (drillCategoryRef.current && selectedUser) {
      const labels = CATEGORIES.filter(c => (selectedUser.categories[c] || 0) > 0);
      drillCategoryInstance.current = new Chart(drillCategoryRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data: labels.map(c => selectedUser.categories[c]),
            backgroundColor: labels.map(c => CATEGORY_COLORS[CATEGORIES.indexOf(c)]),
            borderWidth: 2, borderColor: '#fff' }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: { legend: { position: 'right', labels: { font: { size: 12 } } } },
        },
      });
    }
    if (drillTimelineInstance.current) drillTimelineInstance.current.destroy();
    if (drillTimelineRef.current) {
      const byDay = {};
      selectedUserExcuses.forEach(e => {
        if (!e.date) return;
        const key = e.date.toISOString().split('T')[0];
        byDay[key] = (byDay[key] || 0) + 1;
      });
      const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
      drillTimelineInstance.current = new Chart(drillTimelineRef.current, {
        type: 'line',
        data: {
          labels: sorted.map(([d]) => d),
          datasets: [{ label: 'Excuses per Day', data: sorted.map(([, c]) => c),
            borderColor: '#58D68D', backgroundColor: 'rgba(88,214,141,0.08)',
            fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { maxTicksLimit: 12, font: { size: 11 } }, grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
          },
        },
      });
    }
    return () => {
      if (drillCategoryInstance.current) drillCategoryInstance.current.destroy();
      if (drillTimelineInstance.current) drillTimelineInstance.current.destroy();
    };
  }, [activeTab, selectedUserId, selectedUser, selectedUserExcuses]);

  // --- Explorer ---
  const filteredExcuses = useMemo(() => {
    return excuses.filter(e => {
      if (filterCategory && e.category !== filterCategory) return false;
      if (filterUserId && e.userId !== filterUserId) return false;
      if (filterSearch && !e.text.toLowerCase().includes(filterSearch.toLowerCase())) return false;
      if (filterDateFrom && e.date && e.date < new Date(filterDateFrom)) return false;
      if (filterDateTo && e.date) {
        const end = new Date(filterDateTo); end.setHours(23, 59, 59);
        if (e.date > end) return false;
      }
      return true;
    }).sort((a, b) => (b.date || 0) - (a.date || 0));
  }, [excuses, filterCategory, filterUserId, filterSearch, filterDateFrom, filterDateTo]);

  const exportCSV = () => {
    const headers = ['Date', 'User', 'Excuse Text', 'Category'];
    const rows = filteredExcuses.map(e => [
      e.date ? e.date.toISOString() : '', e.userName,
      `"${(e.text || '').replace(/"/g, '""')}"`, e.category,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spool-excuses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Handlers ---
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setActiveTab('user');
  };

  const handleSort = (field) => {
    setLeaderboardSort(prev => ({
      field, dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleRefresh = () => {
    setExcuses([]); setUsers([]); setError(null);
    fetchData();
  };

  const closeUserTab = () => {
    setSelectedUserId(null);
    setActiveTab('overview');
  };

  const formatDate = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--';
  const formatDateTime = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '--';
  const formatTime = (d) => d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

  const topCategory = (categories) => {
    if (!categories) return '--';
    const entries = Object.entries(categories);
    if (entries.length === 0) return '--';
    entries.sort(([, a], [, b]) => b - a);
    return entries[0][0];
  };

  // --- Breadcrumb ---
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Excuse Analytics', tab: null }];
    if (activeTab === 'overview') crumbs.push({ label: 'Overview', tab: 'overview' });
    else if (activeTab === 'explorer') crumbs.push({ label: 'Excuse Explorer', tab: 'explorer' });
    else if (activeTab === 'user' && selectedUser) {
      crumbs.push({ label: 'Overview', tab: 'overview' });
      crumbs.push({ label: selectedUser.userName, tab: null });
    }
    return crumbs;
  }, [activeTab, selectedUser]);

  if (authLoading) {
    return <div className="excuse-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="excuse-page">
      {/* Header bar */}
      <header className="excuse-header">
        <div className="excuse-header-left">
          <h1>Spool Excuse Analytics</h1>
        </div>
        <div className="auth-section">
          {user ? (
            <>
              {lastFetched && <span className="last-updated">Updated {formatTime(lastFetched)}</span>}
              <button className="btn-refresh" onClick={handleRefresh} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <span className="header-divider" />
              <span className="user-email">{user.email}</span>
              <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="btn-login" onClick={handleSignIn}>Sign In with Google</button>
          )}
        </div>
      </header>

      {!user ? (
        <div className="login-prompt"><p>Sign in with an authorized Google account to view excuse analytics.</p></div>
      ) : loading ? (
        <div className="loading">Loading excuse data...</div>
      ) : error ? (
        <div className="error-msg"><p>{error}</p><button className="btn-refresh" onClick={handleRefresh}>Try Again</button></div>
      ) : (
        <>
          {/* Tab bar + breadcrumbs */}
          <div className="nav-bar">
            <nav className="excuse-tabs">
              <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => { setActiveTab('overview'); setSelectedUserId(null); }}>
                Overview
              </button>
              <button className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
                onClick={() => { setActiveTab('explorer'); setSelectedUserId(null); }}>
                Explorer
              </button>
              {selectedUserId && selectedUser && (
                <button className={`tab-btn tab-btn-user ${activeTab === 'user' ? 'active' : ''}`}
                  onClick={() => setActiveTab('user')}>
                  {selectedUser.userName}
                  <span className="tab-close" onClick={(ev) => { ev.stopPropagation(); closeUserTab(); }}>×</span>
                </button>
              )}
            </nav>
            <div className="breadcrumbs">
              {breadcrumbs.map((crumb, i) => (
                <span key={i}>
                  {i > 0 && <span className="breadcrumb-sep">/</span>}
                  {crumb.tab ? (
                    <button className="breadcrumb-link" onClick={() => { setActiveTab(crumb.tab); if (crumb.tab !== 'user') setSelectedUserId(null); }}>
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* ====== OVERVIEW ====== */}
          {activeTab === 'overview' && (
            <div className="overview-view">
              {summaryStats && (
                <div className="summary-cards">
                  <div className="summary-card accent-blue">
                    <span className="card-label">Total Excuses</span>
                    <span className="card-value">{summaryStats.totalExcuses.toLocaleString()}</span>
                  </div>
                  <div className="summary-card accent-green">
                    <span className="card-label">Active Users</span>
                    <span className="card-value">{summaryStats.activeUsers}<small> / {summaryStats.totalUsers}</small></span>
                  </div>
                  <div className="summary-card accent-orange">
                    <span className="card-label">Screen Time Requested</span>
                    <span className="card-value">{summaryStats.totalMinutes.toLocaleString()}<small> min</small></span>
                  </div>
                  <div className="summary-card accent-purple">
                    <span className="card-label">Avg / User</span>
                    <span className="card-value">{summaryStats.avgPerUser}</span>
                  </div>
                  <div className="summary-card accent-red">
                    <span className="card-label">Avg Min / Excuse</span>
                    <span className="card-value">{summaryStats.avgMinPerExcuse}</span>
                  </div>
                </div>
              )}

              <div className="panel">
                <div className="panel-header"><h2>Activity Trend</h2></div>
                <div className="panel-body">
                  <div className="chart-canvas-wrapper" style={{ height: 200 }}>
                    <canvas ref={timelineChartRef}></canvas>
                  </div>
                </div>
              </div>

              <div className="panel-row">
                <div className="panel">
                  <div className="panel-header"><h2>Categories</h2></div>
                  <div className="panel-body">
                    <div className="chart-canvas-wrapper" style={{ height: 230 }}>
                      <canvas ref={categoryChartRef}></canvas>
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-header"><h2>Peak Hours</h2></div>
                  <div className="panel-body">
                    <div className="chart-canvas-wrapper" style={{ height: 230 }}>
                      <canvas ref={hourChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h2>User Leaderboard</h2>
                  <span className="panel-subtitle">Click a row to inspect</span>
                </div>
                <div className="panel-body panel-body-flush">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('userName')} className="sortable">
                            Name {leaderboardSort.field === 'userName' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th onClick={() => handleSort('excuseCount')} className="sortable">
                            Excuses {leaderboardSort.field === 'excuseCount' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th onClick={() => handleSort('totalMinutes')} className="sortable">
                            Total Min {leaderboardSort.field === 'totalMinutes' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th onClick={() => handleSort('lastActive')} className="sortable">
                            Last Active {leaderboardSort.field === 'lastActive' ? (leaderboardSort.dir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th>Top Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map(u => (
                          <tr key={u.userId} onClick={() => handleUserClick(u.userId)} className="clickable-row">
                            <td className="user-name-cell">{u.userName}</td>
                            <td>{u.excuseCount}</td>
                            <td>{u.totalMinutes}</td>
                            <td>{formatDate(u.lastActive)}</td>
                            <td><span className="category-badge">{topCategory(u.categories)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== USER TAB ====== */}
          {activeTab === 'user' && selectedUser && (
            <div className="user-view">
              <div className="summary-cards summary-cards-compact">
                <div className="summary-card accent-blue">
                  <span className="card-label">Excuses</span>
                  <span className="card-value">{selectedUser.excuseCount}</span>
                </div>
                <div className="summary-card accent-orange">
                  <span className="card-label">Total Minutes</span>
                  <span className="card-value">{selectedUser.totalMinutes}</span>
                </div>
                <div className="summary-card accent-green">
                  <span className="card-label">Last Active</span>
                  <span className="card-value card-value-sm">{formatDate(selectedUser.lastActive)}</span>
                </div>
                <div className="summary-card accent-purple">
                  <span className="card-label">Top Category</span>
                  <span className="card-value card-value-sm">{topCategory(selectedUser.categories)}</span>
                </div>
              </div>

              <div className="panel-row">
                <div className="panel">
                  <div className="panel-header"><h2>Categories</h2></div>
                  <div className="panel-body">
                    <div className="chart-canvas-wrapper" style={{ height: 210 }}>
                      <canvas ref={drillCategoryRef}></canvas>
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-header"><h2>Activity</h2></div>
                  <div className="panel-body">
                    <div className="chart-canvas-wrapper" style={{ height: 210 }}>
                      <canvas ref={drillTimelineRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h2>Excuses</h2>
                  <span className="panel-subtitle">{selectedUserExcuses.length} total</span>
                </div>
                <div className="panel-body panel-body-flush">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Excuse Text</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserExcuses.map(e => (
                          <tr key={e.id}>
                            <td className="nowrap">{formatDateTime(e.date)}</td>
                            <td className="excuse-text-cell">{e.text || '--'}</td>
                            <td><span className="category-badge">{e.category}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== EXPLORER ====== */}
          {activeTab === 'explorer' && (
            <div className="explorer-view">
              <div className="panel">
                <div className="panel-body">
                  <div className="filter-bar">
                    <input type="text" placeholder="Search excuses..." value={filterSearch}
                      onChange={e => setFilterSearch(e.target.value)} className="filter-input" />
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="filter-select">
                      <option value="">All Categories</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={filterUserId} onChange={e => setFilterUserId(e.target.value)} className="filter-select">
                      <option value="">All Users</option>
                      {leaderboard.map(u => (
                        <option key={u.userId} value={u.userId}>{u.userName} ({u.excuseCount})</option>
                      ))}
                    </select>
                    <div className="filter-dates">
                      <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="filter-date" />
                      <span className="filter-date-sep">to</span>
                      <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="filter-date" />
                    </div>
                    <button className="btn-export" onClick={exportCSV}>Export CSV</button>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h2>Results</h2>
                  <span className="panel-subtitle">{filteredExcuses.length.toLocaleString()} excuses</span>
                </div>
                <div className="panel-body panel-body-flush">
                  <div className="table-wrapper table-wrapper-tall">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>User</th>
                          <th>Excuse Text</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExcuses.map(e => (
                          <tr key={e.id}>
                            <td className="nowrap">{formatDateTime(e.date)}</td>
                            <td className="nowrap">{e.userName}</td>
                            <td className="excuse-text-cell">{e.text || '--'}</td>
                            <td><span className="category-badge">{e.category}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExcuseDataPage;
