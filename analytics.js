(function () {
  function startAnalytics() {
    var id = window.MARATABLE_GA_ID;
    // Deliberately remain inactive until the client supplies the real GA4 ID.
    if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: true, anonymize_ip: true });

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(tag);

    // A lead event is sent only when the visitor opens a pre-addressed email draft.
    // mailto does not confirm that the visitor actually pressed Send.
    document.addEventListener('maratable:contact-compose', function () {
      window.gtag('event', 'contact_email_draft_opened', {
        event_category: 'contact',
        event_label: 'website_contact_form'
      });
    });
  }

  var config = document.createElement('script');
  config.src = 'analytics-config.js';
  config.onload = startAnalytics;
  config.onerror = function () { /* Analytics stays disabled if configuration cannot load. */ };
  document.head.appendChild(config);
})();
