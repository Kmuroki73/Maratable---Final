# MaraTable static-site QA audit

## Implemented in this candidate
- Updated global positioning without country-origin claims in website copy.
- Updated contact links to use `info@maratable.com`; the form sends the visitor to an email draft addressed to `info@maratable.com` and `nancy@maratable.com`.
- Kept Berlin · Nairobi · Zürich as a location/contact line only; no legal-office status is claimed.
- Added a selector for English, German, French, Italian and Spanish, with a phrase dictionary and browser persistence.
- Added configurable GA4 code; blank ID means tracking remains inactive.
- Refreshed supporting food imagery assets and references; retained logo and the dark-green/gold visual identity.
- Resend is not used. No API keys or measurement IDs have been invented.

## Known limitations / release gates
- `mailto:` cannot send silently or confirm message delivery; visitors must press Send in their email app.
- Any phrase not listed in `i18n-dictionary.js` falls back to English; the localized content needs a final fluent-language review.
- No live-browser test, live analytics validation, or actual email-send test was performed in this build environment.
- Production deployment and domain changes are intentionally not performed here.
