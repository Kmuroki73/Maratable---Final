# MaraTable final release setup

## Required Vercel environment variables
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Private Resend sending API key |
| `RESEND_FROM` | Sender address on a domain verified by Resend |
| `RESEND_TO` | Optional comma-separated inboxes; defaults to `info@maratablegroup.com` |

Use a sender such as `MaraTable Website <website@maratablegroup.com>` only after Resend verifies the domain and its DNS records are published. Do not commit API credentials.

## Contact verification
1. Configure environment variables for Preview.
2. Deploy a Preview.
3. Submit a test from a real email address.
4. Confirm the API response is successful and both recipient inboxes receive the message.
5. Reply to the test to verify the visitor email is set as Reply-To.
6. Test invalid inputs, an empty honeypot and a filled honeypot.
7. Repeat against Production after approval.

A successful Resend API response means the provider accepted the send request; verify actual inbox receipt separately.

## Deployment
Deploy the repository root with Vercel's `Other` framework preset, no build command and no install command. `api/contact.js` is deployed as a Vercel Function.

## Remaining client-owned items
- Resend API key and verified sending domain
- Final approval of Nancy's public profile copy and portrait crop
- Maya's approved photo, title and biography
- GA4 Measurement ID, if analytics is wanted
- Fluent review of German, French, Italian and Spanish translations
- Confirmation of the preferred canonical hostname (`maratable.com` or `www.maratable.com`)
