const { getStore } = require('@netlify/blobs');

function dayKeyOffset(daysBack) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysBack);
  return d.toISOString().slice(0, 10);
}

function summarize(stats) {
  const totals = stats?.totals || {};
  const pages = Object.entries(stats?.pages || {})
    .sort((a, b) => (b[1].page_views || 0) - (a[1].page_views || 0))
    .slice(0, 10)
    .map(([path, data]) => ({
      path,
      pageViews: data.page_views || 0,
      events: data.events || 0
    }));

  return {
    date: stats?.date || null,
    totals: {
      pageViews: totals.page_views || 0,
      uniqueVisitors: totals.unique_visitors || 0,
      formSubmits: totals.form_submits || 0,
      phoneClicks: totals.phone_clicks || 0,
      emailClicks: totals.email_clicks || 0,
      buttonClicks: totals.button_clicks || 0,
      totalEvents: totals.events || 0
    },
    topPages: pages
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const date = event.queryStringParameters?.date || dayKeyOffset(0);
  const compare = event.queryStringParameters?.compare || dayKeyOffset(1);

  try {
    const store = getStore('digi_stats');
    const current = await store.get(`daily:${date}`, { type: 'json' });
    const previous = await store.get(`daily:${compare}`, { type: 'json' });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        current: summarize(current || { date }),
        previous: summarize(previous || { date: compare })
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to load stats', details: String(err.message || err) })
    };
  }
};
