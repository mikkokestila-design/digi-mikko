function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function toAbsoluteUrl(baseUrl, href) {
  try {
    return new URL(href, baseUrl).toString();
  } catch (err) {
    return baseUrl;
  }
}

function extractFromAnchors(html, sourceUrl, keywordRegex, limit) {
  const linkRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const items = [];
  const seen = new Set();
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = String(match[1] || '').trim();
    const text = stripHtml(match[2] || '');

    if (!text || text.length < 12) continue;
    if (!keywordRegex.test(text) && !keywordRegex.test(href)) continue;

    const url = toAbsoluteUrl(sourceUrl, href);
    const key = text.toLowerCase() + '|' + url;
    if (seen.has(key)) continue;

    seen.add(key);
    items.push({ title: text, url: url });
    if (items.length >= limit) break;
  }

  return items;
}

function extractFromSerializedPairs(html, sourceUrl, keywordRegex, limit) {
  const pairRegex = /"(\/fi\/[^"]+)","([^"]{12,260})"/g;
  const items = [];
  const seen = new Set();
  let match;

  while ((match = pairRegex.exec(html)) !== null) {
    const rawPath = String(match[1] || '').trim();
    const rawTitle = String(match[2] || '').trim();

    if (!rawPath || !rawTitle) continue;
    if (/^\d+$/.test(rawTitle)) continue;

    const title = stripHtml(rawTitle.replace(/\\u[0-9a-fA-F]{4}/g, ' ').replace(/\\\//g, '/'));
    if (title.length < 12) continue;

    const isCandidatePath = /ajankohtaista|uuti|varoit|huija|petos|kalast/i.test(rawPath);
    const isCandidateText = keywordRegex.test(title);
    if (!isCandidatePath && !isCandidateText) continue;

    const url = toAbsoluteUrl(sourceUrl, rawPath);
    const key = title.toLowerCase() + '|' + url;
    if (seen.has(key)) continue;

    seen.add(key);
    items.push({ title: title, url: url });
    if (items.length >= limit) break;
  }

  return items;
}

exports.handler = async () => {
  const sourceUrl = 'https://www.traficom.fi/fi';

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Digi-Mikko-Scam-Corner/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Traficom fetch failed with status ' + response.status);
    }

    const html = await response.text();
    const keywordRegex = /(huija|petos|kalast|varoit|scam|tietojenkalast)/i;
    const highlights = [
      ...extractFromAnchors(html, sourceUrl, keywordRegex, 6),
      ...extractFromSerializedPairs(html, sourceUrl, keywordRegex, 6)
    ].slice(0, 6);

    if (!highlights.length) {
      highlights.push(
        { title: 'Traficomin ajankohtaiset varoitukset ja tiedotteet', url: sourceUrl },
        { title: 'Ole tarkkana viesteissä, jotka pyytävät tunnuksia tai maksua nopeasti', url: sourceUrl },
        { title: 'Tarkista aina lähettäjä ja verkkosivun osoite ennen kirjautumista', url: sourceUrl }
      );
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900'
      },
      body: JSON.stringify({
        source: sourceUrl,
        fetchedAt: new Date().toISOString(),
        highlights
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({
        source: sourceUrl,
        fetchedAt: new Date().toISOString(),
        highlights: [
          {
            title: 'Ajankohtaisia varoituksia ei voitu hakea automaattisesti.',
            url: sourceUrl
          }
        ],
        error: error.message
      })
    };
  }
};
