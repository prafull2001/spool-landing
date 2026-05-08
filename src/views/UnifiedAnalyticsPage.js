"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import AgeCohortPage from './AgeCohortPage';
import AnalyticsPage from './AnalyticsPage';
import ExcuseDataPage from './ExcuseDataPage';
import './AnalyticsPage.css';
import './UnifiedAnalyticsPage.css';

const TABS = [
  { id: 'age-cohort',  label: 'Age Cohort' },
  { id: 'excuse-data', label: 'Excuse Data' },
  { id: 'analytics',   label: 'Onboarding Funnel' },
];

const LIFETIME_START = '2024-01-01';

function isoDate(d) { return d.toISOString().slice(0, 10); }
function startOfDay(s) { const d = new Date(s); d.setHours(0, 0, 0, 0); return d; }
function endOfDay(s)   { const d = new Date(s); d.setHours(23, 59, 59, 999); return d; }

function UnifiedAnalyticsInner() {
  const { user, handleSignIn, handleSignOut } = useFirebaseAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const requestedTab = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.id === requestedTab) ? requestedTab : 'age-cohort'
  );

  const [dateFromStr, setDateFromStr] = useState(LIFETIME_START);
  const [dateToStr, setDateToStr] = useState(() => isoDate(new Date()));
  const [appliedFrom, setAppliedFrom] = useState(() => startOfDay(LIFETIME_START));
  const [appliedTo, setAppliedTo] = useState(() => endOfDay(new Date()));

  const handleApply = () => {
    setAppliedFrom(startOfDay(dateFromStr));
    setAppliedTo(endOfDay(dateToStr));
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', id);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="analytics-page unified-analytics">
      <header className="analytics-header">
        <h1>Spool Admin Dashboard</h1>
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
          <p>Sign in with an authorized Google account to view the dashboard.</p>
        </div>
      ) : (
        <>
          <div className="filters">
            <label>
              From:
              <input type="date" value={dateFromStr} onChange={e => setDateFromStr(e.target.value)} />
            </label>
            <label>
              To:
              <input type="date" value={dateToStr} onChange={e => setDateToStr(e.target.value)} />
            </label>
            <button className="btn-refresh" onClick={handleApply}>Apply</button>
          </div>

          <div className="unified-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`unified-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => handleTabChange(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="unified-panel">
            {activeTab === 'age-cohort' && (
              <AgeCohortPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
            {activeTab === 'excuse-data' && (
              <ExcuseDataPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function UnifiedAnalyticsPage() {
  // useSearchParams requires a Suspense boundary above it during render in Next 16.
  return (
    <Suspense fallback={<div className="analytics-page"><div className="loading">Loading dashboard…</div></div>}>
      <UnifiedAnalyticsInner />
    </Suspense>
  );
}
