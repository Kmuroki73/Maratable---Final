const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const requests = new Map();
const RECIPIENTS = ['info@maratablegroup.com', 'e.nyiva@maratablegroup.com'];

function sendJson(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(payload));
}
function clean(value, max) {
  return String(value || '').replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max);
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('CAPTCHA is not configured.');
  const params = new URLSearchParams({ secret, response: token });
  if (ip && ip !== 'unknown') params.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return false;
  const result = await response.json().catch(() => ({}));
  if (!result.success) return false;
  const allowedHosts = (process.env.TURNSTILE_EXPECTED_HOSTNAMES || 'maratable.com,www.maratable.com')
    .split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  if (!result.hostname || !allowedHosts.includes(String(result.hostname).toLowerCase())) return false;
  return true;
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
      if (new URL(origin).host !== host) return sendJson(res, 403, { error: 'Request origin not allowed.' });
    } catch (_) {
      return sendJson(res, 403, { error: 'Invalid request origin.' });
    }
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { return sendJson(res, 400, { error: 'Invalid form submission.' }); }
  }
  if (!body || typeof body !== 'object') return sendJson(res, 400, { error: 'Invalid form submission.' });

  // Honeypot: quietly accept bot submissions without sending mail.
  if (clean(body.website, 200)) return sendJson(res, 200, { ok: true });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return sendJson(res, 429, { error: 'Please wait a moment before sending another enquiry.' });

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const company = clean(body.company, 160);
  const type = clean(body.type || 'General enquiry', 100);
  const message = clean(body.message, 5000);
  const captchaToken = clean(body.captchaToken, 4096);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2 || !emailPattern.test(email) || message.length < 5) {
    return sendJson(res, 422, { error: 'Please provide a valid name, email address and message.' });
  }
  if (!captchaToken) return sendJson(res, 422, { error: 'Please complete the security check before sending.' });
  if (!process.env.SMTP2GO_API_KEY || !process.env.SMTP2GO_FROM) {
    return sendJson(res, 503, { error: 'The email service is not configured yet. Please try again shortly or email info@maratablegroup.com.' });
  }

  recent.push(now);
  requests.set(ip, recent);

  try {
    const captchaValid = await verifyTurnstile(captchaToken, ip);
    if (!captchaValid) return sendJson(res, 403, { error: 'The security check expired or could not be verified. Please try it again.' });
  } catch (error) {
    console.error('Turnstile verification unavailable:', error?.message || 'unknown error');
    return sendJson(res, 503, { error: 'The security check is temporarily unavailable. Please refresh and try again.' });
  }

  const html = '<h2>New MaraTable website enquiry</h2>' +
    '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>' +
    '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>' +
    '<p><strong>Company:</strong> ' + escapeHtml(company || 'Not provided') + '</p>' +
    '<p><strong>Enquiry type:</strong> ' + escapeHtml(type) + '</p>' +
    '<p><strong>Message:</strong><br>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>';

  const textBody = [
    'New MaraTable website enquiry',
    'Name: ' + name,
    'Email: ' + email,
    'Company: ' + (company || 'Not provided'),
    'Enquiry type: ' + type,
    '',
    message
  ].join('\n');

  try {
    const providerResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: process.env.SMTP2GO_FROM,
        to: RECIPIENTS,
        subject: '[MaraTable Website] ' + type,
        html_body: html,
        text_body: textBody,
        custom_headers: [{ header: 'Reply-To', value: email }],
        fastaccept: false
      }),
      signal: AbortSignal.timeout(12000)
    });
    const result = await providerResponse.json().catch(() => ({}));
    const data = result.data || result.email_response || {};
    const succeeded = Number(data.succeeded || 0);
    const failed = Number(data.failed || 0);
    if (!providerResponse.ok || succeeded < 1 || failed > 0) {
      console.error('SMTP2GO rejected contact email:', providerResponse.status, data.failures || data.error || 'provider error');
      return sendJson(res, 502, { error: 'We could not send your enquiry right now. Please try again or email info@maratablegroup.com.' });
    }
    return sendJson(res, 200, { ok: true, id: data.email_id || null });
  } catch (error) {
    console.error('SMTP2GO request failed:', error?.message || 'unknown error');
    return sendJson(res, 502, { error: 'We could not send your enquiry right now. Please try again or email info@maratablegroup.com.' });
  }
};
