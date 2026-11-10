# MaraTable Group — website handover

## What is included
- Ten static website pages
- Responsive stylesheet and front-end JavaScript
- Approved editorial product and farm photography
- Nancy's existing portrait and the MaraTable logo
- English, German, French, Italian and Spanish phrase dictionary
- Resend-backed Vercel contact endpoint
- SEO metadata, sitemap, robots file and Organization structured data
- QA report and deployment configuration

## Deploy
Import the project into Vercel:
- Framework preset: `Other`
- Root directory: repository root
- Build command: empty
- Output directory: repository root
- Install command: empty

The website is static HTML and does not need a build command. Vercel detects `api/contact.js` as a serverless function.

## Configure Resend before testing the form
In Vercel Project Settings → Environment Variables, add:
- `RESEND_API_KEY`
- `RESEND_FROM`
- `RESEND_TO` (optional; defaults to `info@maratable.com,nancy@maratable.com`)

The sender domain must first be verified in Resend and its DNS records published. Never place the API key in HTML, browser JavaScript or Git.

After adding variables, redeploy Preview and send a real test enquiry. Confirm both inboxes receive it and that Reply-To uses the visitor's address. Do not connect Production until this test passes.

## Client items still required
1. Resend API key and verified sender setup.
2. Approval of Nancy's final portrait crop and profile copy.
3. Maya's approved photo, role/title and biography.
4. GA4 Measurement ID, if tracking is required.
5. Fluent review of the four non-English translations.
6. Confirmation that `maratable.com` (without `www`) is the preferred canonical domain.

## Important functional scope
- The Store page is an enquiry catalogue, not an online checkout.
- WhatsApp links open a conversation with the existing MaraTable contact number.
- The contact form sends email through Resend only after the Vercel environment variables are configured.
