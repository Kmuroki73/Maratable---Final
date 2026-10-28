# MaraTable website release notes

## Current implementation
- Static HTML/CSS/JavaScript site. No framework build is required.
- Contact form uses a `mailto:` handoff to `info@maratable.com` and `nancy@maratable.com`. The visitor must send the message in their own email application; website delivery cannot be guaranteed in this mode.
- Google Analytics 4 is configurable in `analytics-config.js`. The Measurement ID is intentionally blank; the site collects no GA events until the owner sets the real `G-...` ID.
- Language selector provides English, German, French, Italian and Spanish phrase translations across all pages. The selected language is remembered in the browser. Review the translation dictionary before production; unknown text intentionally falls back to English rather than being machine-translated.
- Footer contact/location text lists Berlin · Nairobi · Zürich, without claiming those are registered offices.
- Logo and existing dark-green/gold layout are retained. Supporting imagery has been refreshed/reselected and rewritten as optimized editorial image assets.

## Before production
1. Nancy should add the actual GA4 Measurement ID in `analytics-config.js` and verify page views using GA4 Realtime/Tag Assistant.
2. Test the email form with an email app configured and confirm both addresses appear as recipients. The visitor must press Send.
3. Review all translations with a fluent speaker for final commercial nuance.
4. Test desktop/mobile rendering, navigation, image loading and accessibility in a browser preview before connecting production.
5. Review consent/privacy requirements for the intended markets before enabling analytics.

## Release status
Candidate for repository preview; not declared production-verified. No deployment to the live domain was performed by this package preparation.
