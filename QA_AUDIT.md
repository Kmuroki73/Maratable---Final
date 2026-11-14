# MaraTable Group — Final Release QA

Audit date: 14 November 2026  
Source: User-provided `MaraTable_Final_Polished_Release_Candidate_20261114.zip`

## Scope and preservation

This release is based on the supplied website package. Existing pages, visual identity, product catalogue structure, image assets, navigation system, contact form integration and Vercel configuration were retained. Changes were limited to the requested MaraTable/Nancy/Maya updates and corrections identified in the supplied screenshots.

## Changes included

- Corrected the page-width overflow safeguards across the site to address the white strip on the right on narrow screens.
- Fixed the leadership-card grid sizing. The portrait's aspect ratio no longer forces the image column wider than its grid track and cover the text. Mobile cards stack cleanly.
- Restored the Healthy Kids navigation link, homepage feature section and dedicated `healthy-kids.html` page using the previously approved Healthy Kids breakfast image. The content is about children's nutrition and healthy eating generally, not a school programme.
- Updated public contact email references to `info@maratablegroup.com`.
- Removed the public mobile number and its WhatsApp/tel links from website pages and structured data. Esther's approved work email `e.nyiva@maratablegroup.com` is shown on her Operations profile.
- Retained Nancy Hauschild and Esther Nyiva leadership profiles and the separate Board of Directors section for Steve Saltzman, with a concise governance-focused profile.
- Added/retained Kunde (Cowpea Leaves) in the product catalogue and optimised its image to WebP.
- Retained the requested tea, coffee, cocoa, avocados, maize and sweet potatoes in the product catalogue.
- Updated the homepage statement to “Food should look as good as it tastes.”
- Retained “Good food. Made memorable.” as the brand line.
- Removed “food sourcing” wording from the homepage and About page.
- Updated page H1s and page-specific SEO titles/descriptions to use clear search language around African food products, wholesale supply, retail, foodservice and international distribution.
- Updated Open Graph and Twitter metadata and added Healthy Kids to the sitemap.

## Static checks performed

- 11 HTML pages present.
- Exactly one H1 per page.
- No duplicate HTML IDs.
- All image elements have alt text.
- Local image, script, stylesheet and page links resolve.
- The previous public contact mailbox has been replaced throughout the live site files.
- No public phone number, `tel:` link or WhatsApp phone destination remains.
- All JavaScript files pass `node --check`.
- CSS parses without syntax errors.
- `sitemap.xml` parses as valid XML and includes Healthy Kids.
- `vercel.json` parses as valid JSON.
- Kunde WebP asset exists and is referenced by the product page.
- Healthy Kids page and image exist and are linked from the main navigation, mobile menu, homepage and footer.

## Not independently verified

- Visual browser testing on physical phones/tablets.
- Vercel Preview deployment and live domain redirects.
- Live Resend email delivery. Configure/verify `RESEND_API_KEY`, `RESEND_FROM` and `RESEND_TO` in Vercel before relying on the contact form.
- Search Console indexing after deployment.
- Translation review by fluent speakers.

## Release status

This is the consolidated source release candidate. No GitHub commit or production deployment was performed. Deploy to Vercel Preview first, inspect mobile widths and submit one real contact enquiry before merging to production.
