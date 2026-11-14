(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const languageIndex = { de: 0, fr: 1, it: 2, es: 3 };
  function message(key) {
    const language = document.documentElement.lang || 'en';
    const entry = (window.MARATABLE_TRANSLATIONS || {})[key];
    return language === 'en' ? key : (entry && entry[languageIndex[language]]) || key;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      type: String(data.get('type') || 'General enquiry').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || '').trim()
    };

    if (payload.name.length < 2 || payload.name.length > 120 ||
        payload.email.length > 254 || payload.message.length < 5 ||
        payload.message.length > 5000) {
      status.textContent = message('Please check your details and try again.');
      status.classList.add('error');
      return;
    }

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = message('Sending…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');
      status.textContent = message('Thank you. Your enquiry has been sent to MaraTable. We will be in touch.');
      status.classList.add('success');
      form.reset();
      document.dispatchEvent(new CustomEvent('maratable:contact-sent'));
    } catch (error) {
      status.textContent = message('We could not send your message. Please email info@maratable.com or contact us on WhatsApp.');
      status.classList.add('error');
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = message('Send enquiry →');
    }
  });
})();
