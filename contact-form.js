(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const widgetElement = document.getElementById('turnstile-widget');
  let widgetId = null;
  let turnstileToken = '';
  let widgetReady = false;
  let widgetError = 'The secure contact form is not configured yet. Please email info@maratablegroup.com or contact us on WhatsApp.';

  function translate(message) {
    const map = { de: 0, fr: 1, it: 2, es: 3 };
    const language = document.documentElement.lang || 'en';
    const entry = (window.MARATABLE_TRANSLATIONS || {})[message];
    return language === 'en' || !entry ? message : (entry[map[language]] || message);
  }

  function showStatus(message, kind) {
    status.textContent = translate(message);
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function loadScript() {
    if (window.turnstile && typeof window.turnstile.render === 'function') return Promise.resolve();
    return new Promise((resolve, reject) => {
      let script = document.querySelector('script[data-turnstile-api]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileApi = 'true';
        document.head.appendChild(script);
      }
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', () => reject(new Error('Could not load spam protection.')), { once: true });
      if (window.turnstile) resolve();
    });
  }

  async function configureTurnstile() {
    if (!widgetElement) throw new Error('The verification area is missing.');
    const response = await fetch('/api/config', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    const config = await response.json().catch(() => ({}));
    if (!response.ok || !config.turnstileSiteKey) {
      throw new Error(widgetError);
    }

    await loadScript();
    widgetId = window.turnstile.render(widgetElement, {
      sitekey: config.turnstileSiteKey,
      theme: 'light',
      size: 'normal',
      callback(token) {
        turnstileToken = token;
        widgetReady = true;
        showStatus('', '');
      },
      'expired-callback'() {
        turnstileToken = '';
        showStatus('The verification expired. Please complete the check again.', 'error');
      },
      'error-callback'() {
        turnstileToken = '';
        widgetReady = false;
        showStatus('Spam protection could not be loaded. Please refresh or contact us directly.', 'error');
      }
    });
    widgetReady = true;
    return true;
  }

  const turnstileReady = configureTurnstile().catch(error => {
    widgetReady = false;
    widgetError = error.message || widgetError;
    showStatus(widgetError, 'error');
    return false;
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    showStatus('', '');
    if (!form.reportValidity()) return;

    const ready = await turnstileReady;
    if (!ready || !widgetReady) {
      showStatus(widgetError, 'error');
      return;
    }
    if (!turnstileToken) {
      showStatus('Please complete the spam-protection check before sending.', 'error');
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
      turnstileToken
    };

    if (payload.name.length < 2 || payload.name.length > 120 ||
        payload.email.length > 254 || payload.message.length < 5 ||
        payload.message.length > 5000) {
      showStatus('Please check your details and try again.', 'error');
      return;
    }

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = translate('Sending…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');

      showStatus('Thank you. Your enquiry has been accepted by our email service. Our team will be in touch.', 'success');
      form.reset();
      turnstileToken = '';
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
      document.dispatchEvent(new CustomEvent('maratable:contact-sent'));
    } catch (error) {
      showStatus(error.message || 'We could not send your message. Please try again or email info@maratablegroup.com.', 'error');
      turnstileToken = '';
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = translate('Send enquiry →');
    }
  });
})();
