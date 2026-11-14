(function () {
  var started = false;
  function hasConsent() {
    try { return localStorage.getItem('maratable-cookie-consent') === 'accepted'; }
    catch (error) { return false; }
  }
  function startAnalytics() {
    if (started || !hasConsent()) return;
    var id = window.MARATABLE_GA_ID;
    if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: true, anonymize_ip: true });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(tag);
    document.addEventListener('maratable:contact-sent', function () {
      window.gtag('event', 'generate_lead', { event_category: 'contact', event_label: 'website_contact_form' });
    });
  }
  document.addEventListener('maratable:cookie-consent', function (event) {
    if (event.detail && event.detail.consent === 'accepted') startAnalytics();
  });
  var config = document.createElement('script');
  config.src = 'analytics-config.js';
  config.onload = startAnalytics;
  config.onerror = function () {};
  document.head.appendChild(config);
})();
