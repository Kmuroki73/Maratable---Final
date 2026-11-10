const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const requests = new Map();

function sendJson(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(payload));
}
function clean(value, max) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return sendJson(res, 403, { error: 'Request origin not allowed.' });
    } catch (_) {
      return sendJson(res, 403, { error: 'Invalid request origin.' });
    }
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return sendJson(res, 429, { error: 'Please wait a moment before sending another enquiry.' });
  recent.push(now);
  requests.set(ip, recent);

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { return sendJson(res, 400, { error: 'Invalid form submission.' }); }
  }
  if (!body || typeof body !== 'object') return sendJson(res, 400, { error: 'Invalid form submission.' });

  // Quietly accept honeypot submissions without contacting the mail provider.
  if (clean(body.website, 200)) return sendJson(res, 200, { ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const type = clean(body.type || 'General enquiry', 100);
  const message = clean(body.message, 5000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2 || !emailPattern.test(email) || message.length < 5) {
    return sendJson(res, 422, { error: 'Please provide a valid name, email address and message.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    return sendJson(res, 503, { error: 'The contact service is not configured yet. Please email info@maratable.com directly.' });
  }

  const recipients = (process.env.RESEND_TO || 'info@maratable.com,nancy@maratable.com')
    .split(',').map(value => value.trim()).filter(Boolean);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeType = escapeHtml(type);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const html = `<h2>New MaraTable website enquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Enquiry type:</strong> ${safeType}</p><p><strong>Message:</strong><br>${safeMessage}</p>`;

  try {
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: recipients,
        reply_to: email,
        subject: `[MaraTable Website] ${type}`,
        html
      })
    });
    const result = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok) {
      console.error('Resend rejected contact email:', providerResponse.status, result?.message || result?.name || 'provider error');
      return sendJson(res, 502, { error: 'We could not send your enquiry right now. Please try again or email info@maratable.com.' });
    }
    return sendJson(res, 200, { ok: true, id: result.id || null });
  } catch (error) {
    console.error('Contact email provider request failed:', error?.message || 'unknown error');
    return sendJson(res, 502, { error: 'We could not send your enquiry right now. Please try again or email info@maratable.com.' });
  }
};
