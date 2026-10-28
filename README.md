# MaraTable Group — Africa-focused static website

This is a static HTML/CSS/JavaScript website. The entry point is `index.html`; no framework build is required.

## Files
- Pages: `index.html`, `company.html`, `products.html`, `resources.html`, `responsibility.html`, `export.html`, `investors.html`, `suppliers.html`, `store.html`, `contact.html`
- Styles: `styles.css`
- Behaviour: `script.js`, `contact-form.js`
- Languages: `i18n-dictionary.js`, `i18n.js` (English, German, French, Italian and Spanish)
- Analytics: `analytics.js`, `analytics-config.js` (inactive until the owner adds the real GA4 Measurement ID)
- Images and icon: `assets/`

## Contact form
The form builds an email draft addressed to `info@maratable.com` and `nancy@maratable.com`. The visitor must press Send in their email app; the static site does not send or confirm delivery itself.

## Preview deployment
Import this repository into Vercel as a static site. Leave the framework preset as `Other`, set the build command to empty, and use the repository root as the output directory. Preview first; do not attach the production domain until the owner completes the QA checks.

## GA4
Add the client's actual `G-...` ID to `analytics-config.js`. Verify page views in GA4 Realtime/Tag Assistant. The ID is deliberately blank in this package.

## Release gates
See `QA_AUDIT.md` and `RELEASE_SETUP.md`. This package is a release candidate; live email delivery and live analytics have not been tested here.
