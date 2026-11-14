# MaraTable Group — Final Submission QA

Audit date: 14 November 2026  
Package: MaraTable final responsive release candidate

## Scope of this pass

Reviewed all 10 HTML pages, shared stylesheet, JavaScript files, product image references, sitemap, Vercel configuration, navigation targets, page headings, image alt text, duplicate IDs and repeated legacy brand phrases.

## Changes made

- Repositioned the site around African foods and international supply rather than frozen-food-only messaging.
- Updated the shared top banner and footer language and refreshed the translation dictionary entries for those phrases.
- Updated the homepage statement to “Food should look as good as it tastes.”
- Preserved “Good food. Made memorable.”
- Added a responsive CSS hardening layer for narrow viewports, grid/flex shrink behaviour, navigation, product rails, leadership cards, board profile and long text.
- Standardised executive portrait dimensions and mobile stacking rules.
- Converted the Kunde product image from PNG to WebP.
- Restored the existing `_redirects` file from the repository source.
- Retained the multi-page site structure and existing Vercel configuration.

## Static checks completed

- All 10 HTML pages contain exactly one H1.
- No duplicate HTML IDs found.
- All local image and navigation references checked in the pages resolve to files in the package.
- All HTML images have alt text.
- All JavaScript files pass `node --check`.
- `styles.css` parses without top-level CSS syntax errors.
- `sitemap.xml` parses as valid XML.
- `vercel.json` parses as valid JSON.
- The old homepage statement and old frozen-food top-banner/footer phrases are no longer present in the active page copy or corresponding translation entries.
- The Kunde image is included as `assets/kunde-leaves.webp`.
- Existing `_redirects` configuration is retained.

## Not verified in this environment

- Live browser rendering at mobile/tablet/desktop breakpoints. An automated Chromium run was attempted but browser navigation was blocked by the execution environment; therefore no claim of a completed visual device test is made.
- Real Vercel Preview deployment and production-domain redirects.
- Real Resend email delivery; deployment environment variables and verified sender domain must be configured.
- Actual customer enquiry receipt and reply workflow.
- Google Analytics reporting; the real GA4 Measurement ID must be supplied.
- Search Console submission and indexing.
- Human review of German, French, Italian and Spanish translations.
- Final approval of board portrait and all leadership profile content by MaraTable.

## Release recommendation

This package has passed the static checks listed above and includes the responsive overflow hardening changes. Before production, deploy it to a Vercel Preview and test every page at 360px, 390px, 430px, tablet and desktop widths. Submit one test contact enquiry and verify delivery. Production should only be promoted after those two checks and client approval.

No production deployment or GitHub branch update was performed as part of this packaging pass.


## Final heading and search-language pass
- Replaced slogan-led page headings with plain-language headings describing MaraTable's actual services and product range.
- Homepage H1 now targets African food products for global markets; supporting headings describe wholesale/retail, product range, sourcing and food supply enquiries.
- Updated About, Products, International Supply, Quality, Responsibility, Store, Suppliers, Contact and Investors page headings.
- Kept “Good food. Made memorable.” as a short brand tagline rather than using it as the main SEO heading.
- Removed the old “Food should look as good as it feels” headline and replaced the category-strip labels with clear product/channel language.
