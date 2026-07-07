# Weekly Stats Email Setup

This setup records simple site events and sends a weekly email summary.

## What is tracked

- Page views
- Unique visitors (approx, based on browser localStorage id)
- Contact form submits
- Phone link clicks
- Email link clicks
- Button clicks

## Files added/updated

- `script.js` (frontend event sender)
- `netlify/functions/track.js` (event collector)
- `netlify/functions/daily-stats.js` (weekly aggregate email sender)
- `netlify.toml` (weekly scheduled function)
- `package.json` (dependency: `@netlify/blobs`)

## 1. Set Netlify environment variables

In Netlify dashboard -> Site configuration -> Environment variables, add:

- `RESEND_API_KEY` = your Resend API key
- `STATS_EMAIL_TO` = `mikko.kestila@gmail.com`
- `STATS_EMAIL_FROM` = e.g. `Digi-Mikko Stats <onboarding@resend.dev>`
- `STATS_DASHBOARD_KEY` = optional long random secret (used for admin page)

Notes:
- `STATS_EMAIL_TO` defaults to `mikko.kestila@gmail.com` if not set.
- `STATS_EMAIL_FROM` defaults to `Digi-Mikko Stats <onboarding@resend.dev>`.

## 2. Deploy

Deploy latest code to Netlify (push to repo or manual deploy).

## 3. Trigger a test event

Open your site and click a few buttons/links to generate events.

## 4. Optional: run weekly report manually

Open this URL once after deploy to test email sending:

- `/.netlify/functions/daily-stats`

If there is data and env vars are set, an email is sent.

## Stats dashboard pages

Two pages are available:

- `/stats.html` (site-styled public dashboard)
- `/admin-stats.html` (minimal admin dashboard)

Both call `/.netlify/functions/stats-read`.
`/stats.html` is public. `/admin-stats.html` can still use `STATS_DASHBOARD_KEY` in the page UI.

## 5. Automatic weekly schedule

`netlify.toml` includes:

```toml
[functions."daily-stats"]
  schedule = "@weekly"
```

Netlify invokes the function weekly and sends a 7-day summary (previous 7 UTC days).

## Troubleshooting

- If no email arrives:
  - Check function logs for `daily-stats` and `track` in Netlify.
  - Verify `RESEND_API_KEY` is correct.
  - Verify sender domain/address is allowed by your Resend account.
- If stats look empty:
  - Ensure visitors loaded pages after deployment.
  - Confirm requests to `/.netlify/functions/track` return HTTP 200.
