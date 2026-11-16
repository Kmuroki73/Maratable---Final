# MaraTable website — release setup

## Required Vercel environment variables

| Variable | Purpose |
|---|---|
| `TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Private server-side Turnstile secret |
| `SMTP2GO_API_KEY` | Preferred SMTP2GO sending API key |
| `SMTP2GO_FROM` | Sender address verified in SMTP2GO |
| `CONTACT_TO` | Optional comma-separated recipients; defaults to both inboxes below |

The default recipients are `info@maratablegroup.com` and `nancy@maratable.com`. The website uses `MaraTable Website <website@maratable.com>` as the suggested SMTP2GO sender only after that sender/domain has been verified in SMTP2GO.

Resend remains as an optional fallback when SMTP2GO is not configured:
- `RESEND_API_KEY`
- `RESEND_FROM`

Never commit credentials or expose secret keys in browser code.

## SMTP2GO DNS and sender verification
1. In SMTP2GO, verify `maratable.com` as a sending domain and publish the exact CNAME records it supplies in the authoritative DNS zone.
2. Confirm SMTP2GO reports the sending domain and sender as verified.
3. Create a restricted API key under SMTP2GO Sending / API Keys.
4. Add the API key and verified sender to Vercel Preview and Production environment variables.

Publishing CNAME records alone does not prove that the sender is verified or that messages reach inboxes.

## Cloudflare Turnstile
1. Create a Turnstile widget in Cloudflare with the managed challenge mode.
2. Allow `maratable.com` and `www.maratable.com`. Add the Vercel Preview hostname when Preview testing is required.
3. Add the public site key as `TURNSTILE_SITE_KEY` and the secret as `TURNSTILE_SECRET_KEY` in Vercel.
4. The browser obtains a short-lived token; `api/contact.js` validates it using Cloudflare Siteverify before sending.
5. A missing or invalid token is rejected. The API does not trust a browser-only challenge result.

## Contact delivery test
1. Configure Preview variables and deploy a Preview.
2. Submit a real test from an external email address.
3. Confirm both `info@maratablegroup.com` and `nancy@maratable.com` receive the enquiry.
4. Reply to the test and confirm the visitor's address is in Reply-To.
5. Test invalid inputs, the empty honeypot, a filled honeypot, failed/expired Turnstile tokens and repeated submissions.
6. Repeat against Production after approval.

An accepted response from SMTP2GO or Resend is not proof of inbox delivery. Confirm receipt in both mailboxes.

## Vercel deployment
Use Vercel preset `Other`, repository root as the project root and output directory, no install command and no build command. The functions are:
- `api/config.js` — public Turnstile site-key configuration
- `api/contact.js` — challenge validation, rate limiting and email delivery

## Search and language checks
The site supports English, German, French, Italian and Spanish. German URLs use `?lang=de`; page metadata and hreflang links are present. Test language switching, internal navigation and metadata on a deployed Preview.

The canonical host is `www.maratable.com`. Check the apex-to-www redirect and submit the updated sitemap in Google Search Console after production release.

## Remaining client review
- Verify SMTP2GO sender/domain and add live API key.
- Create the Turnstile widget and configure both keys in Vercel.
- Confirm both inboxes and the visitor Reply-To in a real test.
- Have a fluent German reviewer approve the translated sales and privacy copy.
- Confirm final canonical hostname and client approval before Production promotion.
