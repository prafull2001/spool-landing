import React, { useState, useEffect, useRef } from 'react';
import { db, auth, googleProvider } from '../config/firebase';
import { collection, query, orderBy, where, getDocs, Timestamp, limit } from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { Chart, registerables } from 'chart.js';
import './AnalyticsPage.css';

Chart.register(...registerables);

const SCREEN_ORDER = [
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

function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const funnelChartRef = useRef(null);
  const dropoffChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const funnelInstance = useRef(null);
  const dropoffInstance = useRef(null);
  const timeInstance = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchSessions();
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setSessions([]);
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
      const data = snapshot.docs.map(doc => doc.data());
      setSessions(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    fetchSessions(dateFrom || null, dateTo || null);
  };

  // Compute analytics from sessions
  const computeAnalytics = () => {
    const total = sessions.length;
    if (total === 0) return null;

    const screenCounts = {};
    const screenTimes = {};
    const screenTimeCounts = {};

    SCREEN_ORDER.forEach(s => {
      screenCounts[s.name] = 0;
      screenTimes[s.name] = 0;
      screenTimeCounts[s.name] = 0;
    });

    let paywallReached = 0;
    let droppedOff = 0;
    let totalTimeSum = 0;
    let totalTimeCount = 0;

    sessions.forEach(session => {
      // Every session starts at the first screen
      screenCounts[SCREEN_ORDER[0].name]++;

      const completed = session.screens_completed || [];
      completed.forEach(sc => {
        if (screenCounts[sc.screen_name] !== undefined) {
          screenCounts[sc.screen_name]++;
        }
        if (sc.time_spent_seconds !== undefined && sc.time_spent_seconds !== null) {
          screenTimes[sc.screen_name] += sc.time_spent_seconds;
          screenTimeCounts[sc.screen_name]++;
        }
      });

      if (session.reached_paywall) {
        paywallReached++;
        screenCounts['paywall']++;
      }
      if (session.dropped_off) droppedOff++;
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
      avgTotalTime: totalTimeCount > 0 ? (totalTimeSum / totalTimeCount).toFixed(0) : 0,
      screenCounts,
      screenTimes,
      screenTimeCounts,
    };
  };

  // Render charts whenever sessions change
  useEffect(() => {
    const analytics = computeAnalytics();
    if (!analytics) return;

    const labels = SCREEN_ORDER.map(s => s.label);
    const screenNames = SCREEN_ORDER.map(s => s.name);
    const funnelData = screenNames.map(name => analytics.screenCounts[name] || 0);

    // Dropoff % per screen
    const dropoffData = [];
    for (let i = 0; i < screenNames.length - 1; i++) {
      const current = funnelData[i];
      const next = funnelData[i + 1];
      dropoffData.push(current > 0 ? (((current - next) / current) * 100).toFixed(1) : 0);
    }
    dropoffData.push(0);

    // Avg time per screen
    const avgTimeData = screenNames.map(name => {
      const count = analytics.screenTimeCounts[name] || 0;
      return count > 0 ? (analytics.screenTimes[name] / count).toFixed(1) : 0;
    });

    // Destroy old charts
    if (funnelInstance.current) funnelInstance.current.destroy();
    if (dropoffInstance.current) dropoffInstance.current.destroy();
    if (timeInstance.current) timeInstance.current.destroy();

    // Funnel chart
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

    // Dropoff chart
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

    // Time chart
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
  }, [sessions]);

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
            </div>
            <div className="summary-card">
              <h3>Paywall Reach Rate</h3>
              <span className="value">{analytics ? `${analytics.paywallRate}%` : '--'}</span>
            </div>
            <div className="summary-card">
              <h3>Avg Total Time</h3>
              <span className="value">{analytics ? `${analytics.avgTotalTime}s` : '--'}</span>
            </div>
            <div className="summary-card">
              <h3>Dropoff Rate</h3>
              <span className="value">{analytics ? `${analytics.dropoffRate}%` : '--'}</span>
            </div>
          </div>

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
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
