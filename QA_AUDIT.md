# MaraTable technical, visual, functional and content audit

## Source corrections completed
- Replaced the old product/editorial photographs with the eight approved image assets: mango, pineapple, mixed berries, vegetables, green peas, natural honey, farm harvest and farm sunrise.
- Removed superseded product photos from the deployable assets folder. The existing logo and Nancy's original portrait remain.
- Updated the homepage hero while retaining its three-image layered composition. Three approved images are connected to the rotation and dot controls.
- Added pause-on-hover/focus, accessible control labels, responsive positions and reduced-motion support.
- Retained Nancy's existing portrait and introduced a premium founder profile card without inventing credentials or achievements.
- Replaced the unrelated founder portrait on the responsibility page with approved farm imagery.
- Applied a shared editorial card treatment to product, statistic, panel, feature and profile cards.
- Updated the store enquiry cards to include the visible product range.
- Added page-specific SEO titles, descriptions, canonical URLs, Open Graph/Twitter metadata and keyword phrases.
- Added `sitemap.xml`, `robots.txt`, homepage Organization JSON-LD and Vercel security headers.
- Replaced the old mailto handoff with a first-party Vercel API endpoint connected to Resend.
- Added server-side validation, honeypot handling, same-origin checks, basic per-instance rate limiting and escaped email content.
- Updated form success/error handling so the site only reports success after Resend accepts the send request.
- Updated the lead analytics event to fire after accepted form submission.
- Added translations for new profile, green-pea and contact-form strings.
- Improved WhatsApp icon presentation and safe `noopener noreferrer` attributes on external tabs.
- Removed the old Netlify catch-all rewrite that could route every page to the homepage.

## Automated/static checks performed
- All 10 HTML pages have a title, one H1, meta description, canonical URL and Open Graph image metadata.
- No broken local image, script or stylesheet references found.
- Only approved product/hero photographs are referenced by the pages; the original logo and Nancy portrait are retained.
- All JavaScript files pass `node --check`.
- `sitemap.xml` parses as valid XML and contains 10 page URLs.
- `vercel.json` parses as valid JSON.
- Resend function mock tests passed for accepted submission, honeypot, invalid form data and rejected origin.
- A 390px mobile visual preview was generated and inspected.

## Not yet independently verified
- A real Resend API key and verified sender domain are not included in this package.
- Real delivery to `info@maratable.com` and `nancy@maratable.com` has not been tested.
- Full cross-device/browser QA must be repeated on a Vercel Preview deployment.
- Production hostname redirects and live canonical behaviour need checking against DNS/Vercel configuration.
- Google Search Console indexing and sitemap submission have not been performed.
- GA4 remains disabled because the client's actual Measurement ID is blank.
- German, French, Italian and Spanish copy needs final fluent-speaker review.
- Maya's profile is intentionally pending her approved image, name/title and biography.

## Release decision
This is a corrected Vercel-ready release candidate, not a certified production handover yet. Production approval depends on configuring Resend, confirming real email receipt and completing Preview QA. No credentials or external account changes have been fabricated.
