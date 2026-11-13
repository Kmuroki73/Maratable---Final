# MaraTable Group — final release candidate

Static HTML/CSS/JavaScript website for MaraTable Group. The site has no front-end build step; deploy the repository root on Vercel.

## Pages
- `index.html` — homepage
- `company.html` — company story and Nancy Hauschild profile
- `products.html` — frozen fruits, vegetables, berries, peas, honey, roasted coffee, unroasted green coffee and foodservice
- `resources.html` — quality approach
- `responsibility.html` — responsibility and sourcing
- `export.html` — international supply
- `investors.html` — investor enquiries
- `suppliers.html` — suppliers and partners
- `store.html` — product availability by enquiry
- `contact.html` — contact form and direct contact details

## Images
Approved MaraTable editorial images are in `assets/`:
- `hero-farm-harvest.webp`, `hero-farm-sunrise.webp`
- `mango.webp`, `pineapple.webp`, `mixed-berries.webp`
- `vegetables.webp`, `green-peas.webp`, `natural-honey.webp`

The existing brand logo and Nancy portrait are retained. Esther Nyiva's Operations profile is placed directly below Nancy's profile on the company page. The product and editorial photography references use the approved image set.

## Contact form — Resend
The contact form posts to the first-party Vercel function at `/api/contact`, which sends through Resend's API. No Resend key is included in source control.

Configure these environment variables in Vercel (Preview and Production as appropriate):
- `RESEND_API_KEY` — private Resend API key
- `RESEND_FROM` — sender using a domain verified in Resend, e.g. `MaraTable Website <website@maratable.com>`
- `RESEND_TO` — optional comma-separated recipients; defaults to `info@maratablegroup.com,nancy@maratable.com`

Before launch:
1. Verify `maratable.com` (or the chosen sending subdomain) in Resend and publish the DNS records Resend supplies.
2. Create a restricted Resend API key for sending.
3. Add the environment variables in Vercel. Never commit the key or paste it into front-end JavaScript.
4. Redeploy after adding variables.
5. Submit a real enquiry from the deployed website and confirm both intended inboxes receive it. Reply to the test email to confirm `Reply-To` points to the visitor.
6. Confirm the visitor sees a success message only after Resend accepts the message. A provider acceptance response is not proof that the recipient inbox delivered it; verify the inbox.

If Resend is not configured, the API returns a clear service-unavailable response and the form shows the direct email fallback. It must not show a false success state.

## Homepage hero
The existing three-image layered composition is retained. Its rotation, dot controls, pause-on-hover/focus and reduced-motion behaviour are implemented in `script.js`.

## SEO
- Page-specific titles, descriptions, canonical URLs and social metadata, including coffee product search terms
- `sitemap.xml` and `robots.txt`
- Organization JSON-LD on the homepage

Submit `https://www.maratable.com/sitemap.xml` in Google Search Console after production deployment. The live apex currently redirects to `www.maratable.com`; keep canonical URLs and sitemap on the www hostname and verify the redirect after deployment.

## Vercel deployment
- Framework preset: `Other`
- Build command: leave empty
- Output directory: repository root (or `.`)
- Install command: leave empty
- Serverless function: `api/contact.js`

The Vercel function uses the Node.js runtime and built-in `fetch`; no npm dependencies are required.

## Release gates
This package is a release candidate until:
- Vercel Preview is deployed with Resend environment variables.
- Contact delivery is tested end-to-end.
- Mobile/tablet/desktop browser checks pass on the deployed preview.
- Nancy reviews the factual company/profile details and Maya's approved profile is supplied before her section is published.
- Analytics Measurement ID and consent requirements are confirmed before analytics is enabled.
