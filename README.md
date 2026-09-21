# MuseTown × MuseSquare

An independent, open-source community and connector directory for personal AI agents.

- **MuseSquare** (`/square`): search connectors by outcome and category; inspect endpoints, authorization, and provider documentation; save useful connections.
- **MuseTown** (`/town`): share reusable workflow prompts or requests, discuss them, vote on usefulness, and build a personal collection.
- **Developer Studio** (`/studio`): import an OpenAPI 3.x JSON document, prepare a connector listing, export a review packet, and submit to community moderation.
- **Your collection** (`/saved`): persistent bookmarks and your contributions, including pending submissions.

Both products share one TypeScript application, identity boundary, database, and discovery API. They can later be separated behind different domains without duplicating the domain model.

**Independent project. Not affiliated with or endorsed by Meta or Muse.** No listing asserts official Muse approval. The submission packet is this project's format, not a claimed Muse manifest. There is no automatic marketplace submission, Muse installation deep link, credential proxy, or third-party tool execution.

## What works in v0.1

Persistent posts, comments, bookmarks, votes, connector submissions, author deletion, moderation authorization, read-only MCP discovery, OpenAPI discovery, and optional browser WebMCP search. Anonymous visitors can browse where hosting access permits; writes require a trusted authenticated identity. Six first-party starter prompts are visibly labeled as guides; Notion and Stripe are provider references with documentation links, not claimed Muse integrations. No simulated users, adoption counts, reviews, or successful task runs are seeded.

## Run locally

Requires Node 22.13+ and pnpm 10. Dependencies are pinned in `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_milky_exiles.sql
pnpm dev
```

The portable development server uses port 5173. Its starter authentication helper supports local-only mock sign-in at `/signin-with-chatgpt?return_to=/`. The managed Sites environment uses its own sign-in and preview lifecycle. D1 state persists in `.wrangler/state` (never commit it).

```sh
pnpm typecheck
pnpm test
```

A built Worker can be exercised through `pnpm start -- --port 4173`. Stop it before running the integration test; `pnpm test:api` starts its own local Worker and checks authentication boundaries, persistent writes, pending visibility, isolation of saved collections, reactions, comments, OpenAPI, and MCP. The API test deliberately refuses non-loopback hosts and uses disposable local identities. It does not test the hosted identity provider.

## Deployment and authentication

The application targets Cloudflare Workers with a D1 binding named `DB`. `.openai/hosting.json` declares logical storage only in the public repository. Sites assigns its own project ID and resources. Schema changes use Drizzle migrations; never seed example data into schema migrations.

The hosted identity contract is the Sites dispatcher: it supplies verified `oai-authenticated-user-id` and `oai-authenticated-user-email` headers. **Do not expose this Worker directly to the internet with untrusted identity headers.** For a non-Sites deployment, replace the authentication adapter with verified session/OIDC handling, strip client identity headers at a trusted boundary, configure sign-in routes, and map the D1 resource before deployment. The development mock is not a production authentication provider.

Configure `ADMIN_USER_IDS` as a comma-separated allowlist of trusted identity IDs for moderation. Empty by default: no user can self-promote. A signed-in operator can retrieve their own ID from `/api/me`; set it through the hosting environment configuration. Publishing a community listing does not certify the connector or submit it to Muse.

New Sites deployments are private previews. Outside agents cannot use a private preview without supported site authentication. A public or appropriately authenticated endpoint, current Muse requirements, and provider-side testing are necessary before any external marketplace integration can be claimed.

## Discovery interfaces

| Interface | Path | Scope |
|---|---|---|
| Catalog | `GET /api/catalog?q=...&category=...` | Published connectors only |
| Experiences | `GET /api/experiences?q=...` | Published workflows and requests |
| OpenAPI 3.1 | `GET /api/openapi` | Discovery API description |
| MCP | `POST /api/mcp` | `search_connectors`, `find_workflows` |
| Browser WebMCP | `search_muse_community` | Filters the visible page; feature-detected |

The MCP endpoint implements a bounded stateless JSON response transport and protocol negotiation for `2025-06-18`, initialization notifications, ping, tool listing, and validated tool calls. It has no write tools and does not execute prompts or remote connectors. Unsupported streaming GET requests return 405. This is a focused implementation, not a claim of complete MCP certification. Example:

```sh
curl -H 'MCP-Protocol-Version: 2025-06-18' -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_connectors","arguments":{"query":"Notion"}}}' \
  http://127.0.0.1:4173/api/mcp
```

## Data and permission model

- Author IDs and email addresses never appear in public listing/comment responses.
- Only the author or a configured moderator can delete an entry.
- Connector submissions start pending; only their owner or a moderator sees them until publication. Rejected entries remain visible to the owner.
- Votes and saves use a unique `(owner, entry, type)` key and explicit desired state; retries cannot create duplicate votes.
- Community writes validate the signed-in user, same-origin request, input schema, and a database-backed 30-actions/minute limit.
- URLs reject non-HTTPS schemes, credentials, query strings, and fragments. The application never fetches submitted remote URLs.
- Comments and prompts render as text. User content is untrusted input to agents.

## Source layout

`app/` routes and UI; `lib/domain.ts` validation and portable packet format; `lib/server.ts` API; `lib/seeds.ts` reference catalog and starter prompts; `db/` schema/storage; `drizzle/` schema migrations; `tests/` validation and local integration tests; `docs/` integration boundaries and validation evidence.

## Next launch decisions

Before a public community launch, configure moderator IDs and identity delivery, verify Muse's official submission and authentication requirements, define operating policies/support ownership, and decide the public deployment audience. Public scale will require pagination beyond the initial 500-record view, abuse/reporting operations, backups, and email-free display-name policy enforcement. Payments, ratings, billing, agent execution, and official Muse certification are intentionally not represented as implemented features.

Licensed under Apache-2.0, retaining the repository's original license.
