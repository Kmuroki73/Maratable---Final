# MaraTable Group — final production release

This ZIP is the complete static-site project for the final MaraTable Group release.

## GitHub upload
1. Download and extract `MaraTable_Group_Final_Production_Release_20261113.zip`.
2. Open the existing MaraTable repository on GitHub.
3. Upload/replace the project files at the repository root. Preserve the `assets/` and `api/` folders.
4. Do not upload `.env` files or API credentials.
5. Commit with: `Finalise MaraTable Group website and Healthy Kids update`.

## Vercel deployment
- Framework preset: `Other`
- Root directory: repository root
- Build command: leave empty
- Output directory: repository root
- Install command: leave empty

This project is static HTML/CSS/JavaScript. Vercel serves the root HTML pages and deploys `api/contact.js` as a serverless function.

## Contact form
The API recipient is fixed to `info@maratablegroup.com`.
Configure these Vercel environment variables before production:
- `RESEND_API_KEY`
- `RESEND_FROM` (a sender address on a domain verified in Resend)

The form has been tested with a mocked Resend response; perform a real Preview enquiry after configuring the credentials and confirm delivery to `info@maratablegroup.com` before promoting the deployment.
