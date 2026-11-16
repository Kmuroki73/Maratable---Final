(function () {
  const languages = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    it: 'Italiano',
    es: 'Español'
  };
  const languageIndex = { de: 0, fr: 1, it: 2, es: 3 };
  const dictionary = window.MARATABLE_TRANSLATIONS || {};
  const currentUrl = new URL(window.location.href);
  const queryLanguage = currentUrl.searchParams.get('lang');
  let language = languages[queryLanguage]
    ? queryLanguage
    : 'en';

  if (!languages[queryLanguage]) {
    try {
      const saved = localStorage.getItem('maratable-language');
      if (languages[saved]) language = saved;
    } catch (_) {}
  }

  function translated(value, lang) {
    const entry = dictionary[value.replace(/\\s+/g, ' ').trim()];
    return lang === 'en' ? value : (entry ? (entry[languageIndex[lang]] || value) : value);
  }

  function translateTextNodes(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement &&
          !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName) &&
          node.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      if (node.__mtOriginal === undefined) node.__mtOriginal = node.nodeValue;
      const original = node.__mtOriginal;
      const leading = (original.match(/^\\s*/) || [''])[0];
      const trailing = (original.match(/\\s*$/) || [''])[0];
      const end = trailing.length ? original.length - trailing.length : original.length;
      const text = original.slice(leading.length, end);
      const key = text.replace(/\\s+/g, ' ').trim();
      const entry = dictionary[key];
      const value = lang === 'en' ? text : (entry ? (entry[languageIndex[lang]] || text) : text);
      node.nodeValue = leading + value + trailing;
    }
  }

  function translateAttributes(lang) {
    const names = ['placeholder', 'aria-label', 'title', 'alt'];
    document.querySelectorAll('*').forEach(element => {
      names.forEach(name => {
        if (!element.hasAttribute(name)) return;
        const key = 'mtOriginal' + name[0].toUpperCase() + name.slice(1);
        if (element.dataset[key] === undefined) element.dataset[key] = element.getAttribute(name);
        const original = element.dataset[key];
        element.setAttribute(name, translated(original, lang));
      });
    });

    document.querySelectorAll('meta[name],meta[property]').forEach(meta => {
      const identity = meta.getAttribute('name') || meta.getAttribute('property');
      if (!['description', 'keywords', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(identity)) return;
      if (meta.dataset.mtOriginalContent === undefined) meta.dataset.mtOriginalContent = meta.content;
      meta.content = translated(meta.dataset.mtOriginalContent, lang);
    });

    const title = document.querySelector('title');
    if (title) {
      if (title.dataset.mtOriginal === undefined) title.dataset.mtOriginal = title.textContent;
      title.textContent = translated(title.dataset.mtOriginal, lang);
    }

    const locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.content = ({ en: 'en_GB', de: 'de_DE', fr: 'fr_FR', it: 'it_IT', es: 'es_ES' })[lang];
  }

  function updateLanguageUrls(lang) {
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.delete('lang');
    const localizedUrl = new URL(pageUrl.href);
    if (lang !== 'en') localizedUrl.searchParams.set('lang', lang);
    if (canonical) canonical.href = localizedUrl.href;
    if (ogUrl) ogUrl.content = localizedUrl.href;

    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
      try {
        const destination = new URL(href, window.location.href);
        if (destination.origin !== window.location.origin) return;
        destination.searchParams.delete('lang');
        if (lang !== 'en') destination.searchParams.set('lang', lang);
        anchor.setAttribute('href', destination.pathname + destination.search + destination.hash);
      } catch (_) {}
    });
  }

  function applyLanguage(lang, updateUrl) {
    if (!languages[lang]) return;
    language = lang;
    document.documentElement.lang = lang;
    translateTextNodes(lang);
    translateAttributes(lang);
    try { localStorage.setItem('maratable-language', lang); } catch (_) {}
    document.querySelectorAll('[data-language-select]').forEach(select => { select.value = lang; });
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
    updateLanguageUrls(lang);
    document.dispatchEvent(new CustomEvent('maratable:language-changed', { detail: { language: lang } }));
  }

  function addSelector() {
    const nav = document.querySelector('.nav-inner');
    if (!nav || nav.querySelector('[data-language-select]')) return;
    const select = document.createElement('select');
    select.className = 'language-select';
    select.setAttribute('data-language-select', '');
    select.setAttribute('aria-label', 'Website language');
    Object.entries(languages).forEach(([code, name]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = code.toUpperCase() + ' · ' + name;
      select.appendChild(option);
    });
    select.value = language;
    select.addEventListener('change', () => applyLanguage(select.value, true));
    const menu = nav.querySelector('[data-menu]');
    if (menu) nav.insertBefore(select, menu);
    else nav.appendChild(select);
  }

  document.addEventListener('DOMContentLoaded', () => {
    addSelector();
    applyLanguage(language, false);
  });
})();
