const { getStore } = require('@netlify/blobs');

function dayKeyOffset(daysBack) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysBack);
  return d.toISOString().slice(0, 10);
}

function weekRangeEndingYesterday() {
  const end = dayKeyOffset(1);
  const start = dayKeyOffset(7);
  return { start, end };
}

function weekIdFromEndDate(endDate) {
  return endDate;
}

function topPages(pages, limit = 5) {
  return Object.entries(pages || {})
    .sort((a, b) => (b[1].page_views || 0) - (a[1].page_views || 0))
    .slice(0, limit)
    .map(([path, data]) => ({ path, pageViews: data.page_views || 0, events: data.events || 0 }));
}

async function sendWithResend({ apiKey, from, to, subject, text, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to: [to], subject, text, html })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed: ${response.status} ${body}`);
  }
}

exports.handler = async () => {
  const range = weekRangeEndingYesterday();
  const weekId = weekIdFromEndDate(range.end);
  const store = getStore('digi_stats');
  const sentKey = `weekly:${weekId}:email_sent`;

  const alreadySent = await store.get(sentKey, { type: 'json' });
  if (alreadySent && alreadySent.sent) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, skipped: true, reason: 'already_sent', week: range })
    };
  }

  const to = process.env.STATS_EMAIL_TO || 'mikko.kestila@gmail.com';
  const from = process.env.STATS_EMAIL_FROM || 'Digi-Mikko Stats <onboarding@resend.dev>';
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Missing RESEND_API_KEY. Set it in Netlify environment variables.'
      })
    };
  }

  const mergedTotals = {
    page_views: 0,
    unique_visitors: 0,
    form_submits: 0,
    phone_clicks: 0,
    email_clicks: 0,
    button_clicks: 0,
    events: 0
  };

  const mergedPages = {};
  const uniqueVisitors = new Set();

  for (let daysBack = 7; daysBack >= 1; daysBack -= 1) {
    const date = dayKeyOffset(daysBack);
    const stats = await store.get(`daily:${date}`, { type: 'json' });
    if (!stats) {
      continue;
    }

    const totals = stats.totals || {};
    mergedTotals.page_views += totals.page_views || 0;
    mergedTotals.form_submits += totals.form_submits || 0;
    mergedTotals.phone_clicks += totals.phone_clicks || 0;
    mergedTotals.email_clicks += totals.email_clicks || 0;
    mergedTotals.button_clicks += totals.button_clicks || 0;
    mergedTotals.events += totals.events || 0;

    Object.keys(stats.visitors || {}).forEach((id) => uniqueVisitors.add(id));

    Object.entries(stats.pages || {}).forEach(([path, data]) => {
      if (!mergedPages[path]) {
        mergedPages[path] = { page_views: 0, events: 0 };
      }
      mergedPages[path].page_views += data.page_views || 0;
      mergedPages[path].events += data.events || 0;
    });
  }

  mergedTotals.unique_visitors = uniqueVisitors.size;

  if (mergedTotals.events === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, skipped: true, reason: 'no_stats', week: range })
    };
  }

  const pages = topPages(mergedPages);

  const lines = [
    `Digi-Mikko Weekly Stats (${range.start} to ${range.end})`,
    '',
    `Page views: ${mergedTotals.page_views || 0}`,
    `Unique visitors: ${mergedTotals.unique_visitors || 0}`,
    `Form submits: ${mergedTotals.form_submits || 0}`,
    `Phone clicks: ${mergedTotals.phone_clicks || 0}`,
    `Email clicks: ${mergedTotals.email_clicks || 0}`,
    `Button clicks: ${mergedTotals.button_clicks || 0}`,
    `Total events: ${mergedTotals.events || 0}`,
    '',
    'Top pages:'
  ];

  pages.forEach((p, idx) => {
    lines.push(`${idx + 1}. ${p.path} - views: ${p.pageViews}, events: ${p.events}`);
  });

  const text = lines.join('\n');
  const html = `
    <h2>Digi-Mikko Weekly Stats (${range.start} to ${range.end})</h2>
    <ul>
      <li><strong>Page views:</strong> ${mergedTotals.page_views || 0}</li>
      <li><strong>Unique visitors:</strong> ${mergedTotals.unique_visitors || 0}</li>
      <li><strong>Form submits:</strong> ${mergedTotals.form_submits || 0}</li>
      <li><strong>Phone clicks:</strong> ${mergedTotals.phone_clicks || 0}</li>
      <li><strong>Email clicks:</strong> ${mergedTotals.email_clicks || 0}</li>
      <li><strong>Button clicks:</strong> ${mergedTotals.button_clicks || 0}</li>
      <li><strong>Total events:</strong> ${mergedTotals.events || 0}</li>
    </ul>
    <h3>Top pages</h3>
    <ol>
      ${pages
        .map((p) => `<li><code>${p.path}</code> - views: ${p.pageViews}, events: ${p.events}</li>`)
        .join('')}
    </ol>
  `;

  await sendWithResend({
    apiKey: resendApiKey,
    from,
    to,
    subject: `Digi-Mikko Weekly Stats - ${range.start} to ${range.end}`,
    text,
    html
  });

  await store.setJSON(sentKey, {
    sent: true,
    at: new Date().toISOString(),
    to
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, sent: true, week: range })
  };
};
