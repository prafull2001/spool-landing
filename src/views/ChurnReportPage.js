"use client";
import React, { useMemo, useState } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import useChurnReport from '../hooks/useChurnReport';
import {
  churnRowsToCsv,
  filterChurnRows,
  formatPlan,
  formatRevenueCatReason,
  summarizeChurnRows,
} from '../lib/churnReport.mjs';
import './AnalyticsPage.css';
import './ChurnReportPage.css';

const STATUS_LABELS = {
  churned: 'Churned',
  scheduled: 'Scheduled',
  recovered: 'Recovered',
};

function formatDate(value, includeTime = false) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }).format(new Date(value));
}

function yesNo(value) {
  return value == null ? '—' : value ? 'Yes' : 'No';
}

function displayReason(row) {
  const flow = row.cancellationFlow;
  if (!flow?.reason) return formatRevenueCatReason(row.revenueCatReason);
  if (!flow.reasonText || flow.reasonText === flow.reason) return flow.reason;
  return `${flow.reason}: ${flow.reasonText}`;
}

export default function ChurnReportPage({ panelMode = false, dateFrom, dateTo } = {}) {
  const { user, handleSignIn, handleSignOut } = useFirebaseAuth();
  const { report, loading, error, refetch } = useChurnReport(user);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const rows = useMemo(() => filterChurnRows(report?.rows || [], {
    dateFrom,
    dateTo,
    status,
    search,
  }), [report, dateFrom, dateTo, status, search]);
  const summary = useMemo(() => summarizeChurnRows(rows), [rows]);

  const exportCsv = () => {
    const blob = new Blob([churnRowsToCsv(rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spool-churn-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={panelMode ? 'churn-panel' : 'analytics-page'}>
      {!panelMode && (
        <header className="analytics-header">
          <h1>Churn Report</h1>
          <div className="auth-section">
            {user ? (
              <>
                <span className="user-email">{user.email}</span>
                <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
              </>
            ) : <button className="btn-login" onClick={handleSignIn}>Sign In</button>}
          </div>
        </header>
      )}

      {!user ? (
        !panelMode && <div className="login-prompt">Sign in to view churn history.</div>
      ) : loading && !report ? (
        <div className="loading">Loading lifetime RevenueCat churn history…</div>
      ) : error && !report ? (
        <div className="churn-error">
          <p>Could not load the churn report.</p>
          <button className="btn-refresh" onClick={refetch}>Try Again</button>
        </div>
      ) : report && (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Churn History</h3>
              <span className="value">{summary.all}</span>
              <span className="card-desc">All users with a RevenueCat cancellation or expiration in this window</span>
            </div>
            <div className="summary-card">
              <h3>Churned</h3>
              <span className="value">{summary.churned}</span>
              <span className="card-desc">Access ended without a later recovery</span>
            </div>
            <div className="summary-card">
              <h3>Scheduled</h3>
              <span className="value">{summary.scheduled}</span>
              <span className="card-desc">Auto-renew off; access has not ended yet</span>
            </div>
            <div className="summary-card">
              <h3>Recovered</h3>
              <span className="value">{summary.recovered}</span>
              <span className="card-desc">Churned or cancelled, then renewed or repurchased</span>
            </div>
            <div className="summary-card">
              <h3>In-App Reasons</h3>
              <span className="value">{summary.withInAppReason}</span>
              <span className="card-desc">Matched a response from Spool&apos;s cancellation flow</span>
            </div>
          </div>

          <div className="churn-toolbar">
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search name, contact, plan, reason, or ID…"
              aria-label="Search churn report"
            />
            <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter churn status">
              <option value="all">All statuses</option>
              <option value="churned">Churned</option>
              <option value="scheduled">Scheduled</option>
              <option value="recovered">Recovered</option>
            </select>
            <button className="btn-refresh" onClick={refetch} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh RevenueCat'}
            </button>
            <button className="churn-export" onClick={exportCsv} disabled={rows.length === 0}>Export CSV</button>
          </div>

          <div className="chart-container churn-table-card">
            <div className="churn-heading">
              <div>
                <h2>Customers who churned</h2>
                <p>Lifetime RevenueCat history, enriched with Firebase contact and cancellation-flow data.</p>
              </div>
              <span>{rows.length} shown · fetched {formatDate(report.fetchedAt, true)}</span>
            </div>

            <div className="churn-table-wrap">
              <table className="conversion-table churn-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Plan</th>
                    <th>Churn decision</th>
                    <th>Access ended / ends</th>
                    <th>Why they left</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const rowId = `${row.revenueCatCustomerId}:${row.churnedAt}`;
                    const expanded = expandedId === rowId;
                    return (
                      <React.Fragment key={rowId}>
                        <tr className={expanded ? 'churn-row expanded' : 'churn-row'}>
                          <td>
                            <strong>{row.displayName || 'Unnamed customer'}</strong>
                            <span>{row.email || row.phoneNumber || row.firebaseUid || row.revenueCatCustomerId}</span>
                          </td>
                          <td><span className={`churn-status ${row.status}`}>{STATUS_LABELS[row.status]}</span></td>
                          <td>{formatPlan(row)}</td>
                          <td>{formatDate(row.churnedAt)}</td>
                          <td>{formatDate(row.accessEndsAt)}</td>
                          <td className="churn-reason">{displayReason(row)}</td>
                          <td>
                            <button
                              className="churn-details-button"
                              onClick={() => setExpandedId(expanded ? null : rowId)}
                              aria-expanded={expanded}
                            >
                              {expanded ? 'Hide' : 'Details'}
                            </button>
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="churn-detail-row">
                            <td colSpan="7">
                              <div className="churn-detail-grid">
                                <section>
                                  <h3>Contact</h3>
                                  <dl>
                                    <div><dt>Name</dt><dd>{row.displayName || '—'}</dd></div>
                                    <div><dt>Email</dt><dd>{row.email || '—'}</dd></div>
                                    <div><dt>Phone</dt><dd>{row.phoneNumber || '—'}</dd></div>
                                    <div><dt>Account created</dt><dd>{formatDate(row.accountCreatedAt)}</dd></div>
                                    <div><dt>Firebase UID</dt><dd className="churn-id">{row.firebaseUid || '—'}</dd></div>
                                    <div><dt>RevenueCat ID</dt><dd className="churn-id">{row.revenueCatCustomerId}</dd></div>
                                  </dl>
                                </section>
                                <section>
                                  <h3>Subscription</h3>
                                  <dl>
                                    <div><dt>Plan</dt><dd>{formatPlan(row)}</dd></div>
                                    <div><dt>Product</dt><dd className="churn-id">{row.productId || '—'}</dd></div>
                                    <div><dt>Period</dt><dd>{row.periodType || '—'}</dd></div>
                                    <div><dt>Current status</dt><dd>{row.currentSubscriptionStatus || '—'}</dd></div>
                                    <div><dt>Auto-renewal</dt><dd>{row.autoRenewalStatus || '—'}</dd></div>
                                    <div><dt>Store</dt><dd>{row.store || '—'}</dd></div>
                                    <div><dt>Country</dt><dd>{row.country || '—'}</dd></div>
                                    <div><dt>RevenueCat reason</dt><dd>{formatRevenueCatReason(row.revenueCatReason)}</dd></div>
                                    <div><dt>Recovered</dt><dd>{formatDate(row.recoveredAt)}</dd></div>
                                  </dl>
                                </section>
                                <section>
                                  <h3>Cancellation flow</h3>
                                  {row.cancellationFlow ? (
                                    <dl>
                                      <div><dt>Reason</dt><dd>{row.cancellationFlow.reason || '—'}</dd></div>
                                      <div><dt>Detail</dt><dd>{row.cancellationFlow.reasonText || '—'}</dd></div>
                                      <div><dt>Completed Apple handoff</dt><dd>{yesNo(row.cancellationFlow.completedCancellation)}</dd></div>
                                      <div><dt>Accepted save offer</dt><dd>{yesNo(row.cancellationFlow.offerAccepted)}</dd></div>
                                      <div><dt>Days subscribed</dt><dd>{row.cancellationFlow.daysSubscribed ?? '—'}</dd></div>
                                      <div><dt>Excuses at cancel</dt><dd>{row.cancellationFlow.excuseCountAtCancel ?? '—'}</dd></div>
                                      <div><dt>Streak at cancel</dt><dd>{row.cancellationFlow.streakAtCancel ?? '—'}</dd></div>
                                      <div><dt>Flow app version</dt><dd>{row.cancellationFlow.appVersion || '—'}</dd></div>
                                    </dl>
                                  ) : <p className="churn-no-data">No in-app cancellation response matched this RevenueCat customer.</p>}
                                </section>
                                <section>
                                  <h3>Customer context</h3>
                                  <dl>
                                    <div><dt>First seen</dt><dd>{formatDate(row.firstSeenAt)}</dd></div>
                                    <div><dt>Last seen</dt><dd>{formatDate(row.lastSeenAt)}</dd></div>
                                    <div><dt>Last app version</dt><dd>{row.lastAppVersion || '—'}</dd></div>
                                    <div><dt>Extra minutes requested</dt><dd>{row.totalExtraMinutesRequested ?? '—'}</dd></div>
                                    <div><dt>Current streak</dt><dd>{row.currentStreak ?? '—'}</dd></div>
                                    <div><dt>Longest streak</dt><dd>{row.longestStreak ?? '—'}</dd></div>
                                  </dl>
                                </section>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && <p className="churn-empty">No churn records match these filters.</p>}
            <p className="churn-footnote">
              This report reads RevenueCat&apos;s lifetime production customer-event history, so it includes churn from before Spool&apos;s July webhook ledger. “Scheduled” means auto-renew is off while paid access remains; “Churned” means access ended without a later recovery; “Recovered” preserves a historical churn decision followed by a renewal or repurchase. In-app reasons exist only when the customer entered Spool&apos;s cancellation flow and could be linked to the same Firebase identity.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
