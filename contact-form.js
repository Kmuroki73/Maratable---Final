(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      type: String(data.get('type') || 'Other').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || '').trim()
    };
    if (payload.name.length < 2 || payload.name.length > 120 ||
        payload.email.length > 254 || payload.message.length < 5 ||
        payload.message.length > 5000) {
      status.textContent = 'Please check your details and try again.';
      status.classList.add('error');
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
      status.textContent = 'Thank you. Your enquiry has been sent to MaraTable Group. We will be in touch.';
      status.classList.add('success');
      form.reset();
      document.dispatchEvent(new CustomEvent('maratable:contact-sent'));
    } catch (error) {
      status.textContent = error.message || 'We could not send your message. Please try again or email info@maratablegroup.com.';
      status.classList.add('error');
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = 'Send enquiry →';
    }
  });
})();
