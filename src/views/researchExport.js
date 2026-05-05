/**
 * Research Data Export Pipeline
 * Generates a ZIP bundle with anonymized CSVs, chart PNGs, and methodology note.
 * All processing happens client-side.
 */
import JSZip from 'jszip';
import { Chart } from 'chart.js';

// ─── Anonymization ───────────────────────────────────────────────────────────

const PII_PATTERNS = [
  { pattern: /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, token: '[name]' },
  { pattern: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, token: '[email]' },
  { pattern: /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, token: '[phone]' },
  { pattern: /\b(University|College|School|Academy|Institute)\s(of\s)?[A-Z][A-Za-z\s]+/g, token: '[school]' },
  { pattern: /\b(Inc|LLC|Corp|Ltd|Company|Co)\b\.?/gi, token: '[company]' },
];

function scrubPII(text) {
  if (!text) return '';
  let cleaned = text;
  for (const { pattern, token } of PII_PATTERNS) {
    cleaned = cleaned.replace(pattern, token);
  }
  return cleaned;
}

function buildAnonymizationMap(userIds) {
  const map = {};
  const sorted = [...userIds].sort();
  sorted.forEach((uid, i) => {
    map[uid] = `P${String(i + 1).padStart(3, '0')}`;
  });
  return map;
}

// ─── CSV Helpers ─────────────────────────────────────────────────────────────

function csvCell(val) {
  let s = val == null ? '' : String(val);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function csvFromRows(headers, rows) {
  const lines = [headers.map(csvCell).join(',')];
  for (const row of rows) {
    lines.push(row.map(csvCell).join(','));
  }
  return lines.join('\n');
}

// ─── CSV Generators ──────────────────────────────────────────────────────────

function generateExcusesCSV(excuses, anonMap) {
  const headers = ['participant_id', 'date', 'excuse_text', 'category', 'app', 'word_count'];
  const rows = excuses.map(e => [
    anonMap[e.userId] || 'unknown',
    e.date ? e.date.toISOString() : '',
    scrubPII(e.text),
    e.category || '',
    e.app || '',
    e.text ? e.text.split(/\s+/).length : 0,
  ]);
  return csvFromRows(headers, rows);
}

function generateUsersCSV(users, excusesByUser, onboardingSurveys, anonMap) {
  const headers = [
    'participant_id', 'age', 'referral_source', 'main_issues',
    'subscription_active', 'current_streak', 'longest_streak',
    'excuse_count', 'total_extra_minutes_requested',
    'screen_time_hours_baseline',
    'avg_daily_requested_hours', 'outcome_ratio',
    'days_active', 'account_age_days',
    'distinct_apps', 'top_app', 'top_category',
    'avg_excuses_per_day',
    'commitment_text', 'commitment_used_voice',
  ];

  // Only include users with complete data (screen time baseline + excuses)
  const qualifiedUsers = users.filter(u => {
    const survey = onboardingSurveys[u.id];
    if (!survey?.screenTimeHours) return false;
    const userExcuses = excusesByUser[u.id] || [];
    return userExcuses.length > 0;
  });

  const rows = qualifiedUsers.map(u => {
    const uid = u.id;
    const pid = anonMap[uid] || 'unknown';
    const userExcuses = excusesByUser[uid] || [];
    const survey = onboardingSurveys[uid] || {};

    // Compute per-user metrics
    const activeDates = userExcuses.filter(e => e.date).map(e => e.date);
    const daysActive = new Set(activeDates.map(d => d.toISOString().split('T')[0])).size;

    // Account age: first excuse to last excuse
    const firstDate = activeDates.length > 0 ? new Date(Math.min(...activeDates)) : null;
    const lastDate = activeDates.length > 0 ? new Date(Math.max(...activeDates)) : null;
    const accountAgeDays = firstDate && lastDate
      ? Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)))
      : 1;

    const apps = [...new Set(userExcuses.map(e => e.app).filter(Boolean))];
    const appCounts = {};
    userExcuses.forEach(e => { if (e.app) appCounts[e.app] = (appCounts[e.app] || 0) + 1; });
    const topApp = Object.entries(appCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const catCounts = {};
    userExcuses.forEach(e => { if (e.category) catCounts[e.category] = (catCounts[e.category] || 0) + 1; });
    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const avgPerDay = daysActive > 0 ? (userExcuses.length / daysActive) : 0;

    // Outcome: self-reported screen time vs actual requested time per day
    const totalMinReq = u.totalExtraMinutesRequested || 0;
    const screenTimeHrs = survey.screenTimeHours;
    const avgDailyReqHrs = accountAgeDays > 0 ? (totalMinReq / accountAgeDays / 60) : 0;
    // ratio < 1 = requesting less than baseline. Lower = better.
    const outcomeRatio = screenTimeHrs > 0 ? (avgDailyReqHrs / screenTimeHrs) : 0;

    return [
      pid,
      u.age || '',
      u.referralSource || '',
      Array.isArray(u.mainIssues) ? u.mainIssues.join('; ') : (u.mainIssues || ''),
      u.subscriptionActive ? 'true' : 'false',
      u.currentStreak || 0,
      u.longestStreak || 0,
      u.excuseCount || userExcuses.length,
      totalMinReq,
      screenTimeHrs,
      avgDailyReqHrs.toFixed(2),
      outcomeRatio.toFixed(3),
      daysActive,
      accountAgeDays,
      apps.join('; '),
      topApp,
      topCategory,
      avgPerDay.toFixed(2),
      scrubPII(survey.commitmentText || ''),
      survey.commitmentUsedVoice ? 'true' : 'false',
    ];
  });

  return csvFromRows(headers, rows);
}

// ─── Methodology Note ────────────────────────────────────────────────────────

function generateMethodology(stats) {
  return `# Spool Research Data Package — Methodology

## Export metadata
- **Generated:** ${new Date().toISOString()}
- **Export version:** 1.1
- **Tool:** Spool Admin Dashboard (client-side export)

## Sample size
- **Total users:** ${stats.totalUsers}
- **Users with complete data (in augmented CSV):** ${stats.qualifiedUsers} (have screen time baseline + at least 1 excuse)
- **Total excuses:** ${stats.totalExcuses}
- **Date range:** ${stats.dateRange}

## Coverage
- **Excuses with app field:** ${stats.appCoveragePct}%
- **Users with onboarding survey:** ${stats.surveyMatchPct}%

## Outcome metric definition

The key question: **how much screen time is a user requesting through Spool vs what they self-reported as their daily screen time?**

\`\`\`
avg_daily_requested_hours = total_extra_minutes_requested / account_age_days / 60
outcome_ratio = avg_daily_requested_hours / screen_time_hours_baseline
\`\`\`

- \`screen_time_hours_baseline\`: Self-reported daily screen time from the onboarding survey
- \`total_extra_minutes_requested\`: Cumulative unlock time requested over the account lifetime
- \`account_age_days\`: Days between first and last excuse (minimum 1)
- \`outcome_ratio\`: < 1.0 means requesting less than baseline. Lower = stronger reduction signal.

### Who is included
Only users with a non-null \`screenTimeHours\` from the onboarding survey and at least 1 excuse are included in the augmented CSV. This ensures every row has the data needed for the before/after comparison.

## Word count calculation
Word count per excuse is computed by splitting the excuse text on whitespace (\`text.split(/\\s+/)\`) and counting the resulting tokens. Empty excuses are excluded from the distribution chart.

## Anonymization
- User IDs → sequential participant IDs (P001, P002, ...)
- \`displayName\`, \`email\`, \`phoneNumber\`, \`revenuecatId\`, \`onboardingDeviceId\` stripped
- Free-text fields scanned with regex for names, emails, phones, schools, companies
- Matches replaced with bracketed tokens: \`[name]\`, \`[email]\`, \`[phone]\`, \`[school]\`, \`[company]\`
- App identifiers pass through as-is

## Known caveats
1. **Selection bias:** All users are opt-in Spool users; no control group
2. **Self-reported baseline:** \`screenTimeHours\` is user-reported during onboarding, not measured
3. **Aggregate duration:** Uses cumulative \`totalExtraMinutesRequested\` from the user doc, not per-excuse duration
4. **App coverage gap:** Excuses logged before app tracking shipped have no app field
5. **Anonymization is regex-based (v1):** May miss some PII patterns

## Charts included
1. Category distribution (bar) — which excuse categories are most common
2. Time of day — phone use distribution (area)
3. Time of day — stacked by category (stacked area)
4. Word count distribution (histogram) — how long are excuses, split by whitespace
5. Screen time: baseline vs actual (bar) — per-user before/after comparison
6. Top apps by excuse volume (bar)
7. App × category heatmap (stacked bar, % of each app's excuses)
8. Time of day per app (line, normalized %)
9. Intent vs behavior (paired bar) — onboarding goals vs actual categories
`;
}

// ─── Chart PNG Generation ────────────────────────────────────────────────────

const CHART_STYLE = {
  colors: ['#5499C7', '#58D68D', '#F4D03F', '#AF7AC5', '#EB984E', '#EC7063', '#45B7D1', '#F1948A'],
};

function createOffscreenCanvas(width = 800, height = 400) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function chartToDataURL(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.fillStyle = '#ffffff';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.putImageData(imageData, 0, 0);
  return tempCanvas.toDataURL('image/png');
}

function dataURLToBlob(dataURL) {
  const parts = dataURL.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new Blob([ab], { type: mimeString });
}

async function renderChartToPNG(config, width = 800, height = 400) {
  const canvas = createOffscreenCanvas(width, height);
  const chart = new Chart(canvas, {
    ...config,
    options: {
      ...config.options,
      responsive: false,
      animation: false,
      devicePixelRatio: 2,
    },
  });
  const dataURL = chartToDataURL(canvas);
  chart.destroy();
  return dataURLToBlob(dataURL);
}

// ─── Individual Chart Configs ────────────────────────────────────────────────

function categoryDistributionChart(excuses) {
  const counts = {};
  excuses.forEach(e => { if (e.category) counts[e.category] = (counts[e.category] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    type: 'bar',
    data: {
      labels: sorted.map(([c]) => c),
      datasets: [{
        data: sorted.map(([, v]) => v),
        backgroundColor: CHART_STYLE.colors.slice(0, sorted.length),
        borderWidth: 0,
      }],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Category Distribution', font: { size: 16 } },
        legend: { display: false },
      },
      scales: { y: { beginAtZero: true } },
    },
  };
}

function timeOfDayChart(excuses) {
  const hourly = new Array(24).fill(0);
  excuses.forEach(e => { if (e.date) hourly[e.date.getHours()]++; });
  return {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, h) => h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`),
      datasets: [{
        data: hourly,
        borderColor: '#5499C7',
        backgroundColor: 'rgba(84,153,199,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      }],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Time of Day — Phone Use Distribution', font: { size: 16 } },
        legend: { display: false },
      },
      scales: { y: { beginAtZero: true } },
    },
  };
}

function timeOfDayByCategoryChart(excuses) {
  const categories = ['Entertainment', 'Social', 'Break/Reward', 'Other', 'Quick Check', 'Boredom', 'Procrastination', 'FOMO'];
  const datasets = categories.map((cat, idx) => {
    const hourly = new Array(24).fill(0);
    excuses.forEach(e => { if (e.date && e.category === cat) hourly[e.date.getHours()]++; });
    return {
      label: cat,
      data: hourly,
      backgroundColor: CHART_STYLE.colors[idx],
      borderWidth: 0,
      fill: true,
    };
  }).filter(ds => ds.data.some(v => v > 0));

  return {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, h) => h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`),
      datasets,
    },
    options: {
      plugins: {
        title: { display: true, text: 'Time of Day — Stacked by Category', font: { size: 16 } },
        legend: { position: 'bottom', labels: { boxWidth: 12 } },
      },
      scales: { x: {}, y: { stacked: true, beginAtZero: true } },
    },
  };
}

function wordCountDistributionChart(excuses) {
  const wordCounts = excuses.map(e => e.text ? e.text.split(/\s+/).length : 0).filter(w => w > 0);
  const bins = [1, 5, 10, 15, 20, 30, 50, 75, 100, 150, 200];
  const binLabels = bins.map((b, i) => i < bins.length - 1 ? `${b}-${bins[i + 1] - 1}` : `${b}+`);
  const binCounts = bins.map((b, i) => {
    const upper = i < bins.length - 1 ? bins[i + 1] : Infinity;
    return wordCounts.filter(w => w >= b && w < upper).length;
  });

  const median = [...wordCounts].sort((a, b) => a - b)[Math.floor(wordCounts.length / 2)] || 0;
  const avg = wordCounts.length > 0 ? (wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length).toFixed(1) : 0;

  return {
    type: 'bar',
    data: {
      labels: binLabels,
      datasets: [{
        data: binCounts,
        backgroundColor: '#5499C7',
        borderWidth: 0,
      }],
    },
    options: {
      plugins: {
        title: { display: true, text: `Word Count Distribution (median: ${median}, mean: ${avg} words per excuse, split on whitespace)`, font: { size: 14 } },
        legend: { display: false },
      },
      scales: {
        x: { title: { display: true, text: 'Words per excuse' } },
        y: { beginAtZero: true, title: { display: true, text: 'Number of excuses' } },
      },
    },
  };
}

function screenTimeComparisonChart(users, excusesByUser, onboardingSurveys) {
  // Per-user: baseline screen time vs avg daily requested hours
  // Only users with complete data
  const userData = [];
  users.forEach(u => {
    const survey = onboardingSurveys[u.id];
    if (!survey?.screenTimeHours) return;
    const userExcuses = excusesByUser[u.id] || [];
    if (userExcuses.length === 0) return;

    const activeDates = userExcuses.filter(e => e.date).map(e => e.date);
    const firstDate = activeDates.length > 0 ? new Date(Math.min(...activeDates)) : null;
    const lastDate = activeDates.length > 0 ? new Date(Math.max(...activeDates)) : null;
    const accountAgeDays = firstDate && lastDate
      ? Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)))
      : 1;

    const totalMinReq = u.totalExtraMinutesRequested || 0;
    const avgDailyReqHrs = totalMinReq / accountAgeDays / 60;

    userData.push({
      baseline: survey.screenTimeHours,
      actual: avgDailyReqHrs,
    });
  });

  // Sort by baseline descending for readability
  userData.sort((a, b) => b.baseline - a.baseline);
  const labels = userData.map((_, i) => `P${String(i + 1).padStart(3, '0')}`);

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Self-Reported Baseline (hrs/day)',
          data: userData.map(d => d.baseline),
          backgroundColor: 'rgba(84,153,199,0.7)',
        },
        {
          label: 'Avg Daily Requested via Spool (hrs/day)',
          data: userData.map(d => Math.round(d.actual * 100) / 100),
          backgroundColor: 'rgba(88,214,141,0.7)',
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Screen Time: Self-Reported Baseline vs Actual Requested (per user)', font: { size: 14 } },
        subtitle: { display: true, text: 'Green bar < blue bar = user requesting less than their baseline. Sorted by baseline.', font: { size: 11 }, color: '#888' },
        legend: { position: 'bottom' },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Hours / day' } },
      },
    },
  };
}

function topAppsByVolumeChart(excuses) {
  const appCounts = {};
  excuses.forEach(e => { if (e.app) appCounts[e.app] = (appCounts[e.app] || 0) + 1; });
  const sorted = Object.entries(appCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  if (sorted.length === 0) {
    return {
      type: 'bar',
      data: { labels: ['No app data'], datasets: [{ data: [0], backgroundColor: '#ccc' }] },
      options: { plugins: { title: { display: true, text: 'Top Apps by Excuse Volume (No Data)', font: { size: 16 } } } },
    };
  }

  return {
    type: 'bar',
    data: {
      labels: sorted.map(([app]) => app),
      datasets: [{
        data: sorted.map(([, v]) => v),
        backgroundColor: CHART_STYLE.colors.slice(0, sorted.length),
        borderWidth: 0,
      }],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Top Apps by Excuse Volume', font: { size: 16 } },
        legend: { display: false },
      },
      scales: { y: { beginAtZero: true } },
    },
  };
}

function appCategoryHeatmapChart(excuses) {
  const categories = ['Entertainment', 'Social', 'Break/Reward', 'Other', 'Quick Check', 'Boredom', 'Procrastination', 'FOMO'];
  const appCounts = {};
  excuses.forEach(e => { if (e.app) appCounts[e.app] = (appCounts[e.app] || 0) + 1; });
  const topApps = Object.entries(appCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([a]) => a);

  if (topApps.length === 0) {
    return {
      type: 'bar',
      data: { labels: ['No app data'], datasets: [{ data: [0], backgroundColor: '#ccc' }] },
      options: { plugins: { title: { display: true, text: 'App × Category (No Data)', font: { size: 16 } } } },
    };
  }

  const datasets = categories.map((cat, idx) => {
    const data = topApps.map(app => {
      const appExcuses = excuses.filter(e => e.app === app);
      const catCount = appExcuses.filter(e => e.category === cat).length;
      return appExcuses.length > 0 ? Math.round((catCount / appExcuses.length) * 100) : 0;
    });
    return {
      label: cat,
      data,
      backgroundColor: CHART_STYLE.colors[idx],
    };
  }).filter(ds => ds.data.some(v => v > 0));

  return {
    type: 'bar',
    data: { labels: topApps, datasets },
    options: {
      plugins: {
        title: { display: true, text: 'App × Category (% of each app\'s excuses)', font: { size: 16 } },
        legend: { position: 'bottom', labels: { boxWidth: 12 } },
      },
      scales: { x: {}, y: { stacked: true, max: 100, title: { display: true, text: '%' } } },
    },
  };
}

function timeOfDayPerAppChart(excuses) {
  const appCounts = {};
  excuses.forEach(e => { if (e.app) appCounts[e.app] = (appCounts[e.app] || 0) + 1; });
  const topApps = Object.entries(appCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([a]) => a);

  if (topApps.length === 0) {
    return {
      type: 'line',
      data: { labels: ['No data'], datasets: [{ data: [0] }] },
      options: { plugins: { title: { display: true, text: 'Time of Day per App (No Data)', font: { size: 16 } } } },
    };
  }

  const labels = Array.from({ length: 24 }, (_, h) => h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`);
  const datasets = topApps.map((app, idx) => {
    const hourly = new Array(24).fill(0);
    excuses.forEach(e => { if (e.app === app && e.date) hourly[e.date.getHours()]++; });
    const total = hourly.reduce((s, v) => s + v, 0);
    const normalized = total > 0 ? hourly.map(v => Math.round((v / total) * 100)) : hourly;
    return {
      label: app,
      data: normalized,
      borderColor: CHART_STYLE.colors[idx],
      tension: 0.3,
      pointRadius: 2,
      borderWidth: 2,
      fill: false,
    };
  });

  return {
    type: 'line',
    data: { labels, datasets },
    options: {
      plugins: {
        title: { display: true, text: 'Time of Day per App (% of app\'s excuses)', font: { size: 16 } },
        legend: { position: 'bottom', labels: { boxWidth: 12 } },
      },
      scales: { y: { beginAtZero: true, title: { display: true, text: '%' } } },
    },
  };
}

function intentVsBehaviorChart(users, excusesByUser, onboardingSurveys) {
  const intentCounts = {};
  const behaviorCounts = {};

  users.forEach(u => {
    const survey = onboardingSurveys[u.id];
    const issues = u.mainIssues || survey?.mainIssues;
    if (!issues) return;
    const issueList = Array.isArray(issues) ? issues : [issues];
    issueList.forEach(issue => { intentCounts[issue] = (intentCounts[issue] || 0) + 1; });

    const userExcuses = excusesByUser[u.id] || [];
    userExcuses.forEach(e => { if (e.category) behaviorCounts[e.category] = (behaviorCounts[e.category] || 0) + 1; });
  });

  const allLabels = [...new Set([...Object.keys(intentCounts), ...Object.keys(behaviorCounts)])].slice(0, 10);

  return {
    type: 'bar',
    data: {
      labels: allLabels,
      datasets: [
        {
          label: 'Onboarding Intent (user count)',
          data: allLabels.map(l => intentCounts[l] || 0),
          backgroundColor: 'rgba(84,153,199,0.7)',
        },
        {
          label: 'Actual Behavior (excuse count)',
          data: allLabels.map(l => behaviorCounts[l] || 0),
          backgroundColor: 'rgba(88,214,141,0.7)',
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Intent vs Behavior: Onboarding Goals vs Actual Categories', font: { size: 16 } },
        legend: { position: 'bottom' },
      },
      scales: { y: { beginAtZero: true } },
    },
  };
}

// ─── Main Export Function ────────────────────────────────────────────────────

export async function generateResearchPackage({ users, excuses, excusesByUser, onboardingSurveys, onProgress }) {
  const zip = new JSZip();
  const chartsFolder = zip.folder('charts');

  onProgress?.('Building anonymization map...');
  const allUserIds = users.map(u => u.id);
  const anonMap = buildAnonymizationMap(allUserIds);

  // ─── CSVs ───
  onProgress?.('Generating excuses CSV...');
  zip.file('excuses_anonymized.csv', generateExcusesCSV(excuses, anonMap));

  onProgress?.('Generating users CSV...');
  zip.file('users_augmented.csv', generateUsersCSV(users, excusesByUser, onboardingSurveys, anonMap));

  // ─── Charts (9 total) ───
  onProgress?.('Generating charts (1/9)...');
  chartsFolder.file('01_category_distribution.png', await renderChartToPNG(categoryDistributionChart(excuses)));

  onProgress?.('Generating charts (2/9)...');
  chartsFolder.file('02_time_of_day.png', await renderChartToPNG(timeOfDayChart(excuses)));

  onProgress?.('Generating charts (3/9)...');
  chartsFolder.file('03_time_of_day_by_category.png', await renderChartToPNG(timeOfDayByCategoryChart(excuses)));

  onProgress?.('Generating charts (4/9)...');
  chartsFolder.file('04_word_count_distribution.png', await renderChartToPNG(wordCountDistributionChart(excuses)));

  onProgress?.('Generating charts (5/9)...');
  chartsFolder.file('05_screen_time_baseline_vs_actual.png', await renderChartToPNG(screenTimeComparisonChart(users, excusesByUser, onboardingSurveys)));

  onProgress?.('Generating charts (6/9)...');
  chartsFolder.file('06_top_apps_volume.png', await renderChartToPNG(topAppsByVolumeChart(excuses)));

  onProgress?.('Generating charts (7/9)...');
  chartsFolder.file('07_app_category_heatmap.png', await renderChartToPNG(appCategoryHeatmapChart(excuses)));

  onProgress?.('Generating charts (8/9)...');
  chartsFolder.file('08_time_of_day_per_app.png', await renderChartToPNG(timeOfDayPerAppChart(excuses)));

  onProgress?.('Generating charts (9/9)...');
  chartsFolder.file('09_intent_vs_behavior.png', await renderChartToPNG(intentVsBehaviorChart(users, excusesByUser, onboardingSurveys)));

  // ─── Methodology ───
  onProgress?.('Generating methodology note...');

  const excusesWithApp = excuses.filter(e => e.app).length;
  const datesWithData = excuses.filter(e => e.date).map(e => e.date);
  const minDate = datesWithData.length > 0 ? new Date(Math.min(...datesWithData)).toISOString().split('T')[0] : 'N/A';
  const maxDate = datesWithData.length > 0 ? new Date(Math.max(...datesWithData)).toISOString().split('T')[0] : 'N/A';

  const usersWithSurvey = users.filter(u => onboardingSurveys[u.id]).length;
  const qualifiedUsers = users.filter(u => {
    const survey = onboardingSurveys[u.id];
    if (!survey?.screenTimeHours) return false;
    const userExcuses = excusesByUser[u.id] || [];
    return userExcuses.length > 0;
  }).length;

  zip.file('methodology.md', generateMethodology({
    totalUsers: users.length,
    qualifiedUsers,
    totalExcuses: excuses.length,
    dateRange: `${minDate} to ${maxDate}`,
    appCoveragePct: excuses.length > 0 ? ((excusesWithApp / excuses.length) * 100).toFixed(1) : '0',
    surveyMatchPct: ((usersWithSurvey / Math.max(users.length, 1)) * 100).toFixed(1),
  }));

  // ─── Generate ZIP ───
  onProgress?.('Compressing ZIP...');
  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spool-research-package-${new Date().toISOString().split('T')[0]}.zip`;
  a.click();
  URL.revokeObjectURL(url);

  onProgress?.('Done!');
}
