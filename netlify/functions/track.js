const { getStore } = require('@netlify/blobs');

const ALLOWED_EVENTS = new Set([
  'page_view',
  'Click',
  'Phone Link Click',
  'Email Link Click',
  'form_submit'
]);

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function sanitizePath(input) {
  if (!input || typeof input !== 'string') {
    return '/unknown';
  }
  try {
    const url = new URL(input, 'https://digi-mikko.fi');
    return url.pathname || '/';
  } catch {
    return input.startsWith('/') ? input : '/unknown';
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const eventName = String(body.event || '').trim();
    const clientId = String(body.clientId || '').trim();
    const page = sanitizePath(body.page);

    if (!eventName || !clientId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing event or clientId' })
      };
    }

    const normalizedEvent = ALLOWED_EVENTS.has(eventName) ? eventName : 'custom_event';
    const store = getStore('digi_stats');
    const key = `daily:${todayKey()}`;

    const stats = (await store.get(key, { type: 'json' })) || {
      date: todayKey(),
      totals: {
        events: 0,
        page_views: 0,
        unique_visitors: 0,
        phone_clicks: 0,
        email_clicks: 0,
        form_submits: 0,
        button_clicks: 0
      },
      visitors: {},
      pages: {},
      events: {}
    };

    stats.totals.events += 1;

    if (!stats.events[normalizedEvent]) {
      stats.events[normalizedEvent] = 0;
    }
    stats.events[normalizedEvent] += 1;

    if (!stats.pages[page]) {
      stats.pages[page] = { page_views: 0, events: 0 };
    }
    stats.pages[page].events += 1;

    if (normalizedEvent === 'page_view') {
      stats.totals.page_views += 1;
      stats.pages[page].page_views += 1;

      if (!stats.visitors[clientId]) {
        stats.visitors[clientId] = {
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          pages: [page]
        };
        stats.totals.unique_visitors += 1;
      } else {
        stats.visitors[clientId].lastSeen = new Date().toISOString();
        if (!stats.visitors[clientId].pages.includes(page)) {
          stats.visitors[clientId].pages.push(page);
        }
      }
    }

    if (normalizedEvent === 'Phone Link Click') {
      stats.totals.phone_clicks += 1;
    }

    if (normalizedEvent === 'Email Link Click') {
      stats.totals.email_clicks += 1;
    }

    if (normalizedEvent === 'form_submit') {
      stats.totals.form_submits += 1;
    }

    if (normalizedEvent === 'Click') {
      stats.totals.button_clicks += 1;
    }

    // Keep data size bounded.
    const visitorIds = Object.keys(stats.visitors);
    if (visitorIds.length > 1000) {
      const overflow = visitorIds.slice(0, visitorIds.length - 1000);
      overflow.forEach((id) => delete stats.visitors[id]);
      stats.totals.unique_visitors = Object.keys(stats.visitors).length;
    }

    await store.setJSON(key, stats);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to record event', details: String(err.message || err) })
    };
  }
};
