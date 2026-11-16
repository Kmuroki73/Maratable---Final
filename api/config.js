module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || null
  });
};
