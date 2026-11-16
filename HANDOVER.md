# MaraTable Group — review handover

## Included in the current review branch
- Existing MaraTable Group page structure and approved photography retained.
- Homepage, company, products, quality, responsibility, supply, investor, supplier, store, contact, Healthy Kids and privacy pages covered.
- Desktop and mobile navigation use matching A–Z dropdown order.
- Footer link groups and contact details are consistently ordered.
- Contact navigation action wording is standardized to “Talk to us”.
- Page titles, descriptions and German-market search terms updated.
- English, German, French, Italian and Spanish language switching supports shareable language URLs.
- Healthy Kids uses a real breakfast editorial photograph; other approved photo sources have not been replaced.
- Contact function supports SMTP2GO first and Resend fallback, two default recipients and Reply-To.
- Cloudflare Turnstile token is validated server-side before email delivery.

## Deployment
The website is static HTML/CSS/JavaScript and does not require a front-end build step. Deploy the repository root on Vercel using preset `Other`, no install command and no build command.

## Required environment configuration
Set these in Vercel Preview and Production:
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `SMTP2GO_API_KEY`
- `SMTP2GO_FROM`
- Optional `CONTACT_TO` (otherwise sends to `info@maratablegroup.com` and `nancy@maratable.com`)

Resend fallback:
- `RESEND_API_KEY`
- `RESEND_FROM`

Do not commit keys. The contact form must not be called production-ready until both recipient inboxes have received a real test.

## Release gate
This branch must be deployed to Preview, tested on real mobile and desktop browsers, reviewed by the client and checked for successful Turnstile validation and two-inbox delivery before merge or Production promotion.
