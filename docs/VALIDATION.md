# Validation record

## Passed

- Strict TypeScript check.
- Cloudflare Worker production build.
- Six input-validation tests: owner/status override rejection, unsafe URL rejection, workflow validation, truthful export status, OpenAPI import validation, explicit reaction state.
- Local Worker + D1 integration checks: authentication rejection; same-origin enforcement; persisted workflow creation; owner-only deletion; identity/email omission from public responses; idempotent votes; private saved state isolation; persisted comments; pending connector invisibility to anonymous and other users; unauthorized moderation rejection; OpenAPI output; MCP initialization, notification handling, tool listing, successful search, invalid arguments, and cross-origin rejection.
- Server rendering for `/square`, `/town`, `/studio`, and `/saved`.

The integration runner uses only a loopback Worker and disposable test identities. It removes its entries, comments, and reactions afterward. No production user data was used.

## Not verified

The managed browser-preview service was unavailable. Interactive browser QA, visual/mobile layout inspection, browser WebMCP invocation, and hosted sign-in were not exercised. Browser WebMCP registration is feature-detected and has no effect in unsupported browsers.

Muse compatibility, marketplace acceptance, third-party OAuth, provider tool execution, payments, and load/performance at public community scale were not tested or claimed. Moderator success-path testing requires a configured `ADMIN_USER_IDS`; unauthorized moderation is covered.
