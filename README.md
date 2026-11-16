# MaraTable Group — multilingual release candidate

Static HTML/CSS/JavaScript website for MaraTable Group. The site has no front-end build step; deploy the repository root on Vercel.

## Pages
- `index.html` — homepage
- `company.html` — company story and leadership
- `products.html` — product portfolio
- `resources.html` — product quality approach
- `responsibility.html` — responsible sourcing and supply
- `export.html` — international food supply
- `investors.html` — investor enquiries
- `suppliers.html` — suppliers and partners
- `store.html` — product availability by enquiry
- `contact.html` — contact form and direct contact details
- `healthy-kids.html` — Healthy Kids initiative
- `privacy.html` — privacy information

## Languages and search
English, German, French, Italian and Spanish are supported. The language selector uses URL language parameters (for example `?lang=de`) so a selected language can be linked and crawled separately. Each page declares language alternates and updates its visible copy, page title and description when a language is selected.

German search metadata is oriented to genuine portfolio and buyer-intent terms such as Tiefkühlobst, Tiefkühlgemüse, afrikanische Lebensmittel, Rohkaffee, Großhandel and Lebensmittelversorgung. These terms describe the listed products and buyer channels; they do not imply certifications, warehouse capacity or stock guarantees.

## Images
The approved MaraTable editorial and product images are retained. The Healthy Kids feature uses a real breakfast photograph by August de Richelieu via Pexels:
https://www.pexels.com/photo/brother-and-sister-in-the-kitchen-eating-breakfast-4259711/

## Contact form — SMTP2GO, Resend fallback and Turnstile
The contact form posts to the first-party Vercel function at `/api/contact`. Cloudflare Turnstile is rendered on the contact page and its token is validated server-side before delivery. `/api/config` exposes only the public Turnstile site key; the secret remains in Vercel environment variables.

SMTP2GO is the preferred sender when `SMTP2GO_API_KEY` is configured. The existing Resend integration remains available as a fallback when SMTP2GO is not configured. The default recipients are:
- `info@maratablegroup.com`
- `nancy@maratable.com`

The visitor's email is retained as the Reply-To address. A success message is shown only after the configured provider accepts the message; inbox receipt must still be confirmed by a real test.

Configure these Vercel environment variables for Preview and Production:
- `TURNSTILE_SITE_KEY` — public Cloudflare Turnstile site key for `maratable.com` and `www.maratable.com` (add the Preview hostname when testing Preview).
- `TURNSTILE_SECRET_KEY` — private Turnstile secret key.
- `SMTP2GO_API_KEY` — private SMTP2GO sending API key.
- `SMTP2GO_FROM` — verified sender, for example `MaraTable Website <website@maratable.com>`.
- `CONTACT_TO` — optional comma-separated recipient override; defaults to the two addresses above.

Alternatively, configure `RESEND_API_KEY` and `RESEND_FROM` for the fallback route. Do not commit API keys.

Before launch:
1. Complete SMTP2GO sender/domain verification and confirm its DNS checks pass.
2. Create a Cloudflare Turnstile widget allowing `maratable.com` and `www.maratable.com`; add both Turnstile keys to Vercel.
3. Add the provider keys and sender address to Vercel Preview.
4. Deploy a Preview and submit a real enquiry from an unrelated email address.
5. Confirm both recipient inboxes receive the message and Reply-To points to the visitor.
6. Test missing/invalid fields, empty and filled honeypot, missing/expired CAPTCHA token, and repeat submissions.
7. Test responsive behaviour on mobile, tablet and desktop; inspect German and English pages and the language URLs.
8. Promote to Production only after client approval and successful end-to-end checks.

## Homepage and responsive behaviour
The homepage carousel supports four image cards and controls, pauses on interaction, and respects reduced-motion preferences. The shared navigation and footer use consistent A–Z ordering. The stylesheet includes desktop, tablet and mobile layouts.

## SEO
Page-specific titles, descriptions, canonicals, social metadata, German search terms and hreflang alternates are provided. `sitemap.xml` and `robots.txt` list the public pages and language variants. The canonical hostname is `https://www.maratable.com`; verify the apex-to-www redirect after deployment and submit the sitemap in Google Search Console.

## Vercel deployment
- Framework preset: `Other`
- Build command: leave empty
- Output directory: repository root (or `.`)
- Install command: leave empty
- Serverless functions: `api/contact.js` and `api/config.js`

## Release gates
This branch is a review candidate, not yet production-approved. Required before release:
- SMTP2GO (or Resend fallback) sender and API key configured in Vercel.
- Cloudflare Turnstile site and secret keys configured for Production.
- Real email delivery confirmed in both inboxes.
- Mobile/tablet/desktop browser checks passed on deployed Preview.
- German copy and legal/privacy wording reviewed by a fluent German reviewer.
- Final factual details and imagery approved by MaraTable Group.
