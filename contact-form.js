(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const captchaContainer = document.getElementById('turnstile-container');
  const captchaTokenInput = document.getElementById('captcha-token');
  let turnstileWidgetId = null;
  let captchaReady = false;

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function loadTurnstile(siteKey) {
    return new Promise((resolve, reject) => {
      if (window.turnstile) return resolve();
      const existing = document.querySelector('script[data-turnstile-script]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = 'true';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initialiseCaptcha() {
    try {
      const response = await fetch('/api/turnstile-config', { headers: { Accept: 'application/json' } });
      const config = await response.json().catch(() => ({}));
      if (!response.ok || !config.siteKey) throw new Error('The security check is not configured yet.');
      await loadTurnstile(config.siteKey);
      turnstileWidgetId = window.turnstile.render(captchaContainer, {
        sitekey: config.siteKey,
        theme: 'auto',
        callback: function (token) {
          captchaTokenInput.value = token;
          captchaReady = true;
          setStatus('', '');
        },
        'expired-callback': function () {
          captchaTokenInput.value = '';
          captchaReady = false;
          setStatus('The security check expired. Please complete it again.', 'error');
        },
        'error-callback': function () {
          captchaTokenInput.value = '';
          captchaReady = false;
          setStatus('The security check could not load. Please refresh the page.', 'error');
        }
      });
    } catch (error) {
      captchaReady = false;
      setStatus(error.message || 'The security check could not load. Please refresh the page.', 'error');
    }
  }

  initialiseCaptcha();

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    setStatus('', '');
    if (!form.reportValidity()) return;
    if (!captchaReady || !captchaTokenInput.value) {
      setStatus('Please complete the security check before sending your enquiry.', 'error');
      return;
    }
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      type: String(data.get('type') || 'Other').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || '').trim(),
      captchaToken: captchaTokenInput.value
    };
    if (payload.name.length < 2 || payload.name.length > 120 ||
        payload.email.length > 254 || payload.message.length < 5 ||
        payload.message.length > 5000) {
      setStatus('Please check your details and try again.', 'error');
      return;
    }
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending…';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');
      setStatus('Thank you. Your enquiry has been sent to MaraTable Group. We will be in touch shortly.', 'success');
      form.reset();
      captchaTokenInput.value = '';
      captchaReady = false;
      if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
      document.dispatchEvent(new CustomEvent('maratable:contact-sent'));
    } catch (error) {
      setStatus(error.message || 'We could not send your message. Please try again or email info@maratablegroup.com.', 'error');
      captchaTokenInput.value = '';
      captchaReady = false;
      if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = 'Send enquiry →';
    }
  });
})();
