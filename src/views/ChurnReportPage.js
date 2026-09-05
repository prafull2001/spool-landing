"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import useChurnReport from '../hooks/useChurnReport';
import {
  churnRowsToCsv,
  filterChurnRows,
  formatPlan,
  formatRevenueCatReason,
  summarizeChurnReasons,
  summarizeChurnRows,
  summarizeSubscriptionTypes,
} from '../lib/churnReport.mjs';
import './AnalyticsPage.css';
import './ChurnReportPage.css';

Chart.register(...registerables);

const STATUS_LABELS = {
  churned: 'Churned',
  scheduled: 'Scheduled',
  recovered: 'Recovered',
};

const STATUS_COLORS = {
  churned: '#ed7a6f',
  scheduled: '#efb85d',
  recovered: '#69b98a',
};

const REASON_COLORS = ['#8ac9e1', '#e8a87c', '#ed7a6f', '#69b98a', '#b79ad8', '#e4c45c', '#79a5d2'];
const PLAN_COLORS = ['#8ac9e1', '#b79ad8', '#e8a87c', '#69b98a'];

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
  const [reason, setReason] = useState('all');
  const [plan, setPlan] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const statusChartRef = useRef(null);
  const statusChartInstance = useRef(null);
  const reasonChartRef = useRef(null);
  const reasonChartInstance = useRef(null);
  const planChartRef = useRef(null);
  const planChartInstance = useRef(null);

  const populationRows = useMemo(() => filterChurnRows(report?.rows || [], {
    dateFrom,
    dateTo,
  }), [report, dateFrom, dateTo]);
  const rows = useMemo(
    () => filterChurnRows(populationRows, { status, reason, plan, search }),
    [populationRows, status, reason, plan, search],
  );
  const summary = useMemo(
    () => summarizeChurnRows(filterChurnRows(populationRows, { reason, plan })),
    [populationRows, reason, plan],
  );
  const reasonSummary = useMemo(
    () => summarizeChurnRows(filterChurnRows(populationRows, { status, plan })),
    [populationRows, status, plan],
  );
  const reasons = useMemo(
    () => summarizeChurnReasons(filterChurnRows(populationRows, { status, plan })),
    [populationRows, status, plan],
  );
  const reasonOptions = useMemo(() => summarizeChurnReasons(populationRows), [populationRows]);
  const plans = useMemo(
    () => summarizeSubscriptionTypes(filterChurnRows(populationRows, { status, reason })),
    [populationRows, status, reason],
  );
  const planOptions = useMemo(() => summarizeSubscriptionTypes(populationRows), [populationRows]);
  const activeReasonLabel = reason === 'in-app'
    ? 'Has an in-app reason'
    : reasonOptions.find(item => item.key === reason)?.label;
  const activePlanLabel = planOptions.find(item => item.key === plan)?.label;
  const activeFilters = [
    status !== 'all' && STATUS_LABELS[status],
    reason !== 'all' && (activeReasonLabel || 'Selected reason'),
    plan !== 'all' && (activePlanLabel || 'Selected plan'),
  ].filter(Boolean);

  useEffect(() => {
    statusChartInstance.current?.destroy();
    statusChartInstance.current = null;
    if (!statusChartRef.current || !report) return;
    const keys = ['churned', 'scheduled', 'recovered'];
    statusChartInstance.current = new Chart(statusChartRef.current, {
      type: 'doughnut',
      data: {
        labels: keys.map(key => STATUS_LABELS[key]),
        datasets: [{
          data: keys.map(key => summary[key]),
          backgroundColor: keys.map(key => status === 'all' || status === key ? STATUS_COLORS[key] : `${STATUS_COLORS[key]}55`),
          borderColor: '#fffaf3',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        onClick: (_, elements) => {
          if (!elements.length) return;
          const selected = keys[elements[0].index];
          setStatus(current => current === selected ? 'all' : selected);
          setExpandedId(null);
        },
        onHover: (event, elements) => {
          if (event.native?.target) event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
        },
        plugins: {
          legend: { position: 'bottom', labels: { color: '#7f6100', usePointStyle: true, padding: 16 } },
          tooltip: { callbacks: { label: context => `${context.label}: ${context.parsed} customers` } },
        },
      },
    });
    return () => {
      statusChartInstance.current?.destroy();
      statusChartInstance.current = null;
    };
  }, [report, status, summary]);

  useEffect(() => {
    reasonChartInstance.current?.destroy();
    reasonChartInstance.current = null;
    if (!reasonChartRef.current || !report || reasons.length === 0) return;
    reasonChartInstance.current = new Chart(reasonChartRef.current, {
      type: 'bar',
      data: {
        labels: reasons.map(item => item.label),
        datasets: [{
          data: reasons.map(item => item.count),
          backgroundColor: reasons.map((item, index) => (
            reason === 'all' || reason === item.key ? REASON_COLORS[index % REASON_COLORS.length] : '#dfd5c455'
          )),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_, elements) => {
          if (!elements.length) return;
          const selected = reasons[elements[0].index].key;
          setReason(current => current === selected ? 'all' : selected);
          setExpandedId(null);
        },
        onHover: (event, elements) => {
          if (event.native?.target) event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: context => `${context.parsed.x} customers` } },
        },
        scales: {
          x: { beginAtZero: true, ticks: { color: '#7f6100', precision: 0 }, grid: { color: '#f0e8d8' } },
          y: { ticks: { color: '#7f6100' }, grid: { display: false } },
        },
      },
    });
    return () => {
      reasonChartInstance.current?.destroy();
      reasonChartInstance.current = null;
    };
  }, [report, reason, reasons]);

  useEffect(() => {
    planChartInstance.current?.destroy();
    planChartInstance.current = null;
    if (!planChartRef.current || !report || plans.length === 0) return;
    planChartInstance.current = new Chart(planChartRef.current, {
      type: 'doughnut',
      data: {
        labels: plans.map(item => item.label),
        datasets: [{
          data: plans.map(item => item.count),
          backgroundColor: plans.map((item, index) => (
            plan === 'all' || plan === item.key ? PLAN_COLORS[index % PLAN_COLORS.length] : '#dfd5c455'
          )),
          borderColor: '#fffaf3',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        onClick: (_, elements) => {
          if (!elements.length) return;
          const selected = plans[elements[0].index].key;
          setPlan(current => current === selected ? 'all' : selected);
          setExpandedId(null);
        },
        onHover: (event, elements) => {
          if (event.native?.target) event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
        },
        plugins: {
          legend: { position: 'bottom', labels: { color: '#7f6100', usePointStyle: true, padding: 16 } },
          tooltip: { callbacks: { label: context => `${context.label}: ${context.parsed} customers` } },
        },
      },
    });
    return () => {
      planChartInstance.current?.destroy();
      planChartInstance.current = null;
    };
  }, [report, plan, plans]);

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
          <div className="summary-cards churn-summary-cards">
            <button type="button" aria-pressed={status === 'all' && reason === 'all' && plan === 'all'} className={`summary-card churn-summary-card ${status === 'all' && reason === 'all' && plan === 'all' ? 'active' : ''}`} onClick={() => { setStatus('all'); setReason('all'); setPlan('all'); }}>
              <h3>Churn History</h3>
              <span className="value">{summary.all}</span>
              <span className="card-desc">All users with a RevenueCat cancellation or expiration in this window</span>
            </button>
            <button type="button" aria-pressed={status === 'churned'} className={`summary-card churn-summary-card ${status === 'churned' ? 'active' : ''}`} onClick={() => setStatus(status === 'churned' ? 'all' : 'churned')}>
              <h3>Churned</h3>
              <span className="value">{summary.churned}</span>
              <span className="card-desc">Access ended without a later recovery</span>
            </button>
            <button type="button" aria-pressed={status === 'scheduled'} className={`summary-card churn-summary-card ${status === 'scheduled' ? 'active' : ''}`} onClick={() => setStatus(status === 'scheduled' ? 'all' : 'scheduled')}>
              <h3>Scheduled</h3>
              <span className="value">{summary.scheduled}</span>
              <span className="card-desc">Auto-renew off; access has not ended yet</span>
            </button>
            <button type="button" aria-pressed={status === 'recovered'} className={`summary-card churn-summary-card ${status === 'recovered' ? 'active' : ''}`} onClick={() => setStatus(status === 'recovered' ? 'all' : 'recovered')}>
              <h3>Recovered</h3>
              <span className="value">{summary.recovered}</span>
              <span className="card-desc">Churned or cancelled, then renewed or repurchased</span>
            </button>
            <button type="button" aria-pressed={reason === 'in-app'} className={`summary-card churn-summary-card ${reason === 'in-app' ? 'active' : ''}`} onClick={() => setReason(reason === 'in-app' ? 'all' : 'in-app')}>
              <h3>In-App Reasons</h3>
              <span className="value">{reasonSummary.withInAppReason}</span>
              <span className="card-desc">Matched a response from Spool&apos;s cancellation flow</span>
            </button>
          </div>

          <div className="churn-chart-grid">
            <section className="chart-container churn-chart-card">
              <div className="churn-chart-heading">
                <div><h2>Current churn state</h2><p>Click a segment to filter the customers below.</p></div>
                {status !== 'all' && <span className={`churn-status ${status}`}>{STATUS_LABELS[status]}</span>}
              </div>
              <div className="churn-status-chart"><canvas ref={statusChartRef} role="img" aria-label="Churned, scheduled, and recovered customers" /></div>
            </section>
            <section className="chart-container churn-chart-card">
              <div className="churn-chart-heading">
                <div><h2>Subscription type</h2><p>Click Annual, Monthly, or Weekly to filter every view below.</p></div>
                {plan !== 'all' && <span className="churn-plan-badge">{activePlanLabel}</span>}
              </div>
              {plans.length > 0
                ? <div className="churn-status-chart"><canvas ref={planChartRef} role="img" aria-label="Customers grouped by subscription type" /></div>
                : <p className="churn-no-data">No subscription types in this date range.</p>}
            </section>
            <section className="chart-container churn-chart-card churn-reason-card">
              <div className="churn-chart-heading">
                <div><h2>Why customers cancel</h2><p>In-app answers when available; RevenueCat reasons otherwise. Click a bar to drill down.</p></div>
              </div>
              {reasons.length > 0
                ? <div className="churn-reason-chart" style={{ height: Math.max(250, reasons.length * 42) }}><canvas ref={reasonChartRef} role="img" aria-label="Customers grouped by churn reason" /></div>
                : <p className="churn-no-data">No churn reasons in this date range.</p>}
            </section>
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
            <select value={reason} onChange={event => setReason(event.target.value)} aria-label="Filter churn reason">
              <option value="all">All reasons</option>
              <option value="in-app">Has an in-app reason</option>
              {reasonOptions.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            <select value={plan} onChange={event => setPlan(event.target.value)} aria-label="Filter subscription type">
              <option value="all">All subscription types</option>
              {planOptions.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            <button className="btn-refresh" onClick={refetch} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh RevenueCat'}
            </button>
            <button className="churn-export" onClick={exportCsv} disabled={rows.length === 0}>Export CSV</button>
          </div>

          {activeFilters.length > 0 && (
            <div className="churn-active-filter" role="status">
              <span>Showing {activeFilters.join(' · ')}</span>
              <strong>{rows.length} customers</strong>
              <button onClick={() => { setStatus('all'); setReason('all'); setPlan('all'); setExpandedId(null); }}>Clear drill-down</button>
            </div>
          )}

          <div className="chart-container churn-table-card">
            <div className="churn-heading">
              <div>
                <h2>Customer drill-down</h2>
                <p>Click Details for contact, subscription, cancellation-flow, and customer context.</p>
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
