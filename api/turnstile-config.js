module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end(JSON.stringify({ error: 'Method not allowed.' }));
  }
  const siteKey = process.env.TURNSTILE_SITE_KEY || '';
  if (!siteKey) return res.status(503).end(JSON.stringify({ error: 'Security check is not configured.' }));
  return res.status(200).end(JSON.stringify({ siteKey }));
};
