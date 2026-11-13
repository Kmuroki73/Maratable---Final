# MaraTable Group — final release handover

## Included
- Existing MaraTable Group website pages and visual identity retained
- Updated product catalogue imagery from the approved image set
- Four-image rotating homepage hero, including premium roasted coffee
- Healthy Kids landing-page feature and dedicated page using the approved two-child breakfast image
- General child-health and nutrition messaging (not school-programme positioning)
- Esther Nyiva's updated Head of Operations profile and contact details
- Public contact form recipient fixed to `info@maratablegroup.com`
- Updated sitemap and robots reference
- Responsive CSS and carousel support for four slides
- Vercel serverless contact endpoint

## Deployment
The website is static HTML and does not require a build command. Use Vercel preset `Other`, repository root as the project root and output directory, with no install/build command.

## Contact form configuration
Set `RESEND_API_KEY` and `RESEND_FROM` in Vercel. The sender address must belong to a domain verified in Resend. The recipient is fixed in the API to `info@maratablegroup.com`; no `RESEND_TO` override is used.

A mocked API test passed. A real Preview submission is still required after credentials are configured.
