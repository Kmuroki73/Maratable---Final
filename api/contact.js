const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const requests = new Map();
const DEFAULT_RECIPIENTS = ['info@maratablegroup.com', 'nancy@maratable.com'];

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
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}
function recipients() {
  const configured = process.env.CONTACT_TO || process.env.SMTP2GO_TO || process.env.RESEND_TO;
  const list = configured
    ? configured.split(',').map(value => value.trim()).filter(Boolean)
    : DEFAULT_RECIPIENTS;
  return [...new Set(list)].filter(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

async function verifyTurnstile(token, ip, host) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return { ok: false, status: 503, error: 'Spam protection is not configured yet. Please contact us directly by email or WhatsApp.' };
  }
  if (!token) return { ok: false, status: 422, error: 'Please complete the spam-protection check and try again.' };

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      return { ok: false, status: 403, error: 'The verification check expired or could not be completed. Please try again.' };
    }
    const expectedHost = String(host || '').split(':')[0].toLowerCase();
    const verifiedHost = String(result.hostname || '').toLowerCase();
    if (!verifiedHost || (expectedHost && expectedHost !== verifiedHost)) {
      return { ok: false, status: 403, error: 'The verification check did not match this website. Please refresh and try again.' };
    }
    return { ok: true };
  } catch (_) {
    return { ok: false, status: 503, error: 'Spam protection is temporarily unavailable. Please email us directly or try again shortly.' };
  }
}

async function sendWithSmtp2Go({ from, to, subject, html, text, replyTo }) {
  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: from,
      to,
      subject,
      html_body: html,
      text_body: text,
      custom_headers: [{ header: 'Reply-To', value: replyTo }],
      fastaccept: true
    })
  });
  const result = await response.json().catch(() => ({}));
  const data = result.data || result.email_response || result;
  const failedRaw = data.failed;
  const failedCount = Array.isArray(failedRaw) ? failedRaw.length : Number(failedRaw || 0);
  const failures = Array.isArray(data.failures) ? data.failures : [];
  const succeededCount = Number(data.succeeded || 0);
  if (!response.ok || succeededCount < to.length || failedCount > 0 || failures.length > 0 || result.error || data.error) {
    throw new Error('SMTP2GO did not accept the message.');
  }
  return result;
}

async function sendWithResend({ from, to, subject, html, replyTo }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      html
    })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error('Resend did not accept the message.');
  return result;
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
  if (clean(body.website, 200)) return sendJson(res, 200, { ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const company = clean(body.company, 160);
  const type = clean(body.type || 'General enquiry', 100);
  const message = clean(body.message, 5000);
  const token = clean(body.turnstileToken, 2048);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2 || !emailPattern.test(email) || message.length < 5) {
    return sendJson(res, 422, { error: 'Please provide a valid name, email address and message.' });
  }

  const verification = await verifyTurnstile(token, ip, host);
  if (!verification.ok) return sendJson(res, verification.status, { error: verification.error });

  const to = recipients();
  if (!to.length) return sendJson(res, 503, { error: 'The enquiry recipients are not configured. Please contact MaraTable Group directly.' });

  const html = '<h2>New MaraTable website enquiry</h2>' +
    '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>' +
    '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>' +
    '<p><strong>Company:</strong> ' + escapeHtml(company || 'Not provided') + '</p>' +
    '<p><strong>Enquiry type:</strong> ' + escapeHtml(type) + '</p>' +
    '<p><strong>Message:</strong><br>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>';
  const text = [
    'New MaraTable website enquiry',
    'Name: ' + name,
    'Email: ' + email,
    'Company: ' + (company || 'Not provided'),
    'Enquiry type: ' + type,
    '',
    'Message:',
    message
  ].join('\n');

  try {
    if (process.env.SMTP2GO_API_KEY) {
      const from = process.env.SMTP2GO_FROM || 'MaraTable Website <website@maratable.com>';
      await sendWithSmtp2Go({ from, to, subject: '[MaraTable Website] ' + type, html, text, replyTo: email });
      return sendJson(res, 200, { ok: true, provider: 'smtp2go' });
    }

    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      await sendWithResend({
        from: process.env.RESEND_FROM,
        to,
        subject: '[MaraTable Website] ' + type,
        html,
        replyTo: email
      });
      return sendJson(res, 200, { ok: true, provider: 'resend' });
    }

    return sendJson(res, 503, { error: 'The contact service is not configured yet. Please contact info@maratablegroup.com directly.' });
  } catch (error) {
    console.error('MaraTable contact delivery failed:', error?.message || 'provider error');
    return sendJson(res, 502, { error: 'We could not send your enquiry right now. Please try again or contact us directly.' });
  }
};
