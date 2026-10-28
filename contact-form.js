(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const recipients = ['info@maratable.com', 'nancy@maratable.com'];

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    // Honeypot: silently ignore automated submissions.
    if (String(data.get('website') || '').trim()) return;

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const type = String(data.get('type') || 'General enquiry').trim();
    const message = String(data.get('message') || '').trim();

    if (name.length < 2 || name.length > 120 || email.length > 254 || message.length < 5 || message.length > 5000) {
      status.textContent = 'Please check your details and try again.';
      status.classList.add('error');
      return;
    }

    const subject = '[MaraTable Website] ' + type;
    const body = [
      'New MaraTable website enquiry',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Enquiry type: ' + type,
      '',
      'Message:',
      message,
      '',
      'Please reply directly to the visitor at: ' + email
    ].join('\n');

    // mailto opens the visitor's configured email application; it cannot send silently.
    const mailto = 'mailto:' + recipients.join(',') +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    status.textContent = 'Your enquiry opens in an email draft addressed to both MaraTable contacts. Review it and press Send in your email app.';
    status.classList.add('success');
    document.dispatchEvent(new CustomEvent('maratable:contact-compose'));

    // Assign after validation and synchronously from the user submit action.
    window.location.href = mailto;
  });
})();
