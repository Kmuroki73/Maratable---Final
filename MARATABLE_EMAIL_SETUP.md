# MaraTable contact email deployment configuration

The contact form sends through SMTP2GO and requires Cloudflare Turnstile verification on the server. Do not commit any secrets.

## Vercel project environment variables

Set these for Production (and Preview while testing):

- `SMTP2GO_API_KEY`: create an API key in SMTP2GO under Sending → API Keys. Keep it private.
- `SMTP2GO_FROM`: a sender identity authorised/verified in SMTP2GO, e.g. `MaraTable Group <no-reply@maratablegroup.com>`. Use only an identity verified in your SMTP2GO account.
- `TURNSTILE_SITE_KEY`: Cloudflare Turnstile public site key for the production hostnames.
- `TURNSTILE_SECRET_KEY`: matching Turnstile secret key. Server-only.
- `TURNSTILE_EXPECTED_HOSTNAMES`: `maratable.com,www.maratable.com` (optional; this is the default).

Recipients are fixed server-side to:
- info@maratablegroup.com
- maya@maratablegroup.com

## Cloudflare Turnstile

Create a Turnstile widget in Cloudflare dashboard, choose Managed mode, and add both `maratable.com` and `www.maratable.com` as hostnames. Copy the site key and secret into the matching Vercel environment variables. The browser receives only the public site key from `/api/turnstile-config`; the contact API verifies the one-time token with Cloudflare Siteverify before sending.

## SMTP2GO sender/domain

Verify the sending domain or sender identity in SMTP2GO. Publish the exact SPF/DKIM DNS records SMTP2GO provides for the sending domain. Do not replace existing SPF records blindly; merge authorised senders into one SPF record. Keep DMARC aligned with the domain's current policy.

## Test after deployment

1. Submit a real contact enquiry and complete Turnstile.
2. Confirm SMTP2GO reports the message accepted (one send to each recipient).
3. Confirm both inboxes receive it: info@maratablegroup.com and maya@maratablegroup.com.
4. Reply to the message and verify Reply-To goes to the visitor's submitted address.
5. Submit without CAPTCHA and with an invalid token; both must be rejected.
6. Test a valid CAPTCHA followed by a second submission using the same token; the second must fail because Turnstile tokens are single-use.

An SMTP2GO API acceptance is not the same as final inbox delivery. Confirm both inboxes and check SMTP2GO activity/bounce logs.
