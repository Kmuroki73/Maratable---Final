# MaraTable final release checklist — 16 November 2026

## Requested refinements
- [x] Contact card label changed to **Reach Out To Us**; card, phone, email, WhatsApp, locations and contact form preserved.
- [x] Main navigation typography and spacing retained at the larger Nov 16 settings.
- [x] Dropdown items are alphabetically ordered in the HTML and re-sorted for the active language by `i18n.js`.
- [x] Dropdown typography retained at the larger Nov 16 setting.
- [x] Image framing uses deliberate `object-fit: cover` / centered positioning for the hero and catalogue imagery; no blanket zoom.
- [x] Removed the repeated “Premium natural foods from Africa” portfolio headline in favour of “A focused African food portfolio”.
- [x] Healthy Kids image replaced with a real Pexels photograph of two children sharing fresh fruit; image framing set to a responsive 4:5 crop.
- [x] Healthy Kids image and alt text updated on both the homepage and dedicated page, including the social preview image.
- [x] Steven Saltzmann listed as **Board Member**; description limited to sharing his experience and providing guidance.
- [x] Kunde product section continues to use the existing dedicated kunde product photograph.
- [x] Germany-facing international supply SEO metadata retained.
- [x] Existing SMTP2GO/contact API, Turnstile and contact form submission flow left unchanged.

## Verification
- [x] Repository source checked against the agreed scope before editing.
- [x] Exact replacement assertions passed for all targeted text changes.
- [x] No edits made to the contact API, environment variables or email delivery code.
- [x] Existing alphabetical dropdown sorting logic retained.
- [x] Existing live email delivery was reported successful by the site owner before this final refinement.

## Deployment-dependent checks
- [ ] Confirm the new commit has deployed to the Production domain.
- [ ] Visually verify the Healthy Kids crop on desktop and mobile after deployment.
- [ ] Submit one final live contact enquiry after deployment to confirm email delivery remains healthy.
