"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import useRevenueCatOverview from '../hooks/useRevenueCatOverview';
import { formatRevenueCatTimestamp } from '../lib/revenueCatMetrics.mjs';
import useAgeCohortData from './useAgeCohortData';
import './AnalyticsPage.css';
import './AgeCohortPage.css';

Chart.register(...registerables);

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function startOfDay(s) {
  const d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(s) {
  const d = new Date(s);
  d.setHours(23, 59, 59, 999);
  return d;
}

function fmtPct(num, den) {
  if (!den) return '0%';
  return `${((num / den) * 100).toFixed(1)}%`;
}

const STEP_COLORS = {
  surveys: 'rgba(138, 201, 225, 0.85)',     // sky blue
  paywall: 'rgba(254, 114, 63, 0.85)',      // orange
  account: 'rgba(122, 201, 160, 0.85)',     // green
  sub:     'rgba(232, 168, 124, 0.85)',     // tan
};

const LIFETIME_START = '2024-01-01';

export default function AgeCohortPage({ panelMode = false, dateFrom: propsDateFrom, dateTo: propsDateTo } = {}) {
  const { user, handleSignIn, handleSignOut } = useFirebaseAuth();

  // Standalone-only date state. In panel mode the parent owns the window.
  const [dateFromStr, setDateFromStr] = useState(LIFETIME_START);
  const [dateToStr, setDateToStr] = useState(() => isoDate(new Date()));
  const [appliedFrom, setAppliedFrom] = useState(() => startOfDay(LIFETIME_START));
  const [appliedTo, setAppliedTo] = useState(() => endOfDay(new Date()));

  const effectiveFrom = panelMode ? propsDateFrom : appliedFrom;
  const effectiveTo = panelMode ? propsDateTo : appliedTo;

  const { funnel, loading, error } = useAgeCohortData(user, effectiveFrom, effectiveTo);
  const {
    overview: revenueCatOverview,
    loading: revenueCatLoading,
    error: revenueCatError,
    refetch: refetchRevenueCat,
  } = useRevenueCatOverview(user);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleApply = () => {
    setAppliedFrom(startOfDay(dateFromStr));
    setAppliedTo(endOfDay(dateToStr));
    refetchRevenueCat();
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    if (!chartRef.current || !funnel) return;

    const labels = [...funnel.rows.map(r => r.label), funnel.noAgeRow.label];
    const allRows = [...funnel.rows, funnel.noAgeRow];
    const surveys = allRows.map(r => r.surveys);
    const paywall = allRows.map(r => r.reachedPaywall);
    const account = allRows.map(r => r.completedAccount);
    const sub = allRows.map(r => r.activeSub);

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Surveys (with age)', data: surveys, backgroundColor: STEP_COLORS.surveys, borderRadius: 4 },
          { label: 'Reached paywall',    data: paywall, backgroundColor: STEP_COLORS.paywall, borderRadius: 4 },
          { label: 'Completed account',  data: account, backgroundColor: STEP_COLORS.account, borderRadius: 4 },
          { label: 'RevenueCat-sourced active Firebase identities', data: sub, backgroundColor: STEP_COLORS.sub, borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#7F6100' } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: { ticks: { color: '#7F6100' }, grid: { display: false } },
          y: { ticks: { color: '#7F6100' }, grid: { color: '#f0e8d8' }, beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [funnel]);

  const surveysWithAge = funnel ? funnel.totals.surveys - funnel.noAgeRow.surveys : 0;
  const revenueCatTimestamp = formatRevenueCatTimestamp(revenueCatOverview);

  return (
    <div className={panelMode ? 'cohort-panel' : 'analytics-page'}>
      {!panelMode && (
        <header className="analytics-header">
          <h1>Age Cohort Funnel</h1>
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
      )}

      {!user ? (
        !panelMode && (
          <div className="login-prompt">
            <p>Sign in with an authorized Google account to view age-cohort analytics.</p>
          </div>
        )
      ) : (
        <>
          {!panelMode && (
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
          )}

          <div className="summary-cards">
            <div className="summary-card">
              <h3>RevenueCat Active Subscriptions</h3>
              <span className="value">
                {revenueCatOverview
                  ? revenueCatOverview.activeSubscriptions.toLocaleString()
                  : revenueCatLoading ? '…' : 'Unavailable'}
              </span>
              <span className="card-desc">
                {revenueCatOverview
                  ? `Account-wide paid and unexpired · ${revenueCatOverview.activeTrials} active trials excluded${revenueCatTimestamp ? ` · fetched ${revenueCatTimestamp}` : ''}`
                  : revenueCatError
                    ? 'Could not reach RevenueCat; no Firestore fallback is shown'
                    : 'Loading directly from RevenueCat…'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading cohort data…</div>
          ) : error ? (
            <div className="loading">Error loading data: {error.message}</div>
          ) : !funnel ? (
            <div className="loading">No data yet.</div>
          ) : (
            <>
              <div className="summary-cards">
                <div className="summary-card">
                  <h3>Surveys (with age)</h3>
                  <span className="value">{surveysWithAge}</span>
                  <span className="card-desc">In selected window — denominator</span>
                </div>
                <div className="summary-card">
                  <h3>Reached Paywall</h3>
                  <span className="value">{funnel.totals.reachedPaywall}</span>
                  <span className="card-desc">{fmtPct(funnel.totals.reachedPaywall, funnel.totals.surveys)} of all surveys</span>
                </div>
                <div className="summary-card">
                  <h3>Completed Account</h3>
                  <span className="value">{funnel.totals.completedAccount}</span>
                  <span className="card-desc">uid backfilled at finalization</span>
                </div>
                <div className="summary-card">
                  <h3>Active Firebase Identities</h3>
                  <span className="value">{funnel.totals.activeSub}</span>
                  <span className="card-desc">Cohort diagnostic only — not a subscription total</span>
                </div>
                <div className="summary-card">
                  <h3>Legacy / Stale Active Flags</h3>
                  <span className="value">{funnel.totals.unverifiedActiveSub}</span>
                  <span className="card-desc">Excluded from verified active count</span>
                </div>
              </div>

              <div className="chart-container">
                <h2>Funnel by Age Bucket</h2>
                <canvas ref={chartRef}></canvas>
              </div>

              <div className="chart-container conversion-section">
                <h2>Cohort Breakdown</h2>
                <table className="conversion-table cohort-table">
                  <thead>
                    <tr>
                      <th>Age Bucket</th>
                      <th>Surveys</th>
                      <th>Reached Paywall</th>
                      <th>Completed Account</th>
                      <th>Active Firebase Identities</th>
                      <th>Legacy / Stale Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnel.rows.map((row) => (
                      <tr key={row.label}>
                        <td><strong>{row.label}</strong></td>
                        <td>{row.surveys}</td>
                        <td>
                          {row.reachedPaywall}
                          <span className="rate-text"> ({fmtPct(row.reachedPaywall, row.surveys)})</span>
                        </td>
                        <td>
                          {row.completedAccount}
                          <span className="rate-text"> ({fmtPct(row.completedAccount, row.reachedPaywall)})</span>
                        </td>
                        <td>
                          {row.activeSub}
                          <span className="rate-text"> ({fmtPct(row.activeSub, row.completedAccount)})</span>
                        </td>
                        <td>{row.unverifiedActiveSub}</td>
                      </tr>
                    ))}
                    <tr className="no-age-row">
                      <td><strong>{funnel.noAgeRow.label}</strong></td>
                      <td>{funnel.noAgeRow.surveys}</td>
                      <td>
                        {funnel.noAgeRow.reachedPaywall}
                        <span className="rate-text"> ({fmtPct(funnel.noAgeRow.reachedPaywall, funnel.noAgeRow.surveys)})</span>
                      </td>
                      <td>
                        {funnel.noAgeRow.completedAccount}
                        <span className="rate-text"> ({fmtPct(funnel.noAgeRow.completedAccount, funnel.noAgeRow.reachedPaywall)})</span>
                      </td>
                      <td>
                        {funnel.noAgeRow.activeSub}
                        <span className="rate-text"> ({fmtPct(funnel.noAgeRow.activeSub, funnel.noAgeRow.completedAccount)})</span>
                      </td>
                      <td>{funnel.noAgeRow.unverifiedActiveSub}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="totals-row">
                      <td><strong>Total</strong></td>
                      <td><strong>{funnel.totals.surveys}</strong></td>
                      <td>
                        <strong>{funnel.totals.reachedPaywall}</strong>
                        <span className="rate-text"> ({fmtPct(funnel.totals.reachedPaywall, funnel.totals.surveys)})</span>
                      </td>
                      <td>
                        <strong>{funnel.totals.completedAccount}</strong>
                        <span className="rate-text"> ({fmtPct(funnel.totals.completedAccount, funnel.totals.reachedPaywall)})</span>
                      </td>
                      <td>
                        <strong>{funnel.totals.activeSub}</strong>
                        <span className="rate-text"> ({fmtPct(funnel.totals.activeSub, funnel.totals.completedAccount)})</span>
                      </td>
                      <td><strong>{funnel.totals.unverifiedActiveSub}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <p className="cohort-footnote">
                  <strong>RevenueCat Active Subscriptions</strong> is the authoritative account-wide count of paid, unexpired subscriptions and refreshes automatically every five minutes. <strong>Active Firebase Identities</strong> is a cohort diagnostic: it counts linked Firebase identities whose latest Firestore snapshot is RevenueCat-sourced, production/paid, and unexpired. It can differ because one store subscription may be associated with multiple historical app identities, so it must not be used as the company&apos;s current subscriber total. Legacy booleans, expired snapshots, trials, promotional access, free codes, dev bypass, and sandbox purchases are excluded from both displayed paid counts.
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
