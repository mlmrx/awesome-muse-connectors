# Muse integration boundary

The user-provided submission fields informed Developer Studio: name/developer/description/example prompts; API or MCP endpoint and documentation; authentication and access requirements; privacy, terms, and support links. The app exports a portable draft for manual review. The draft is not an official Meta schema.

No authoritative public Muse connector SDK, installation URI, marketplace write API, or automated submission endpoint was verified during this build. The implementation therefore does not invent one. Official program enrollment, icon/contact requirements, payment disclosures, exact current authentication support, and acceptance criteria must be checked directly with the program before submission.

## First-party connector candidates

1. MuseSquare Discovery: published connectors via OpenAPI; no third-party credentials.
2. MuseTown Experiences: published workflow prompts through read-only MCP tools.

These interfaces are implemented and independently testable. Their compatibility with Muse is unverified. A private preview is not an externally installable connector.

## Provider references

- Notion MCP: https://developers.notion.com/guides/mcp/overview
- Notion connection endpoint and OAuth instructions: https://developers.notion.com/guides/mcp/get-started-with-mcp
- Stripe MCP endpoint and authentication: https://docs.stripe.com/mcp
- MCP transport: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports

Provider sources were inspected on 2026-09-21 for endpoint/authentication metadata. No provider credentials were supplied or stored; provider execution was not tested. Descriptions were written for this project. Starter workflows are original example prompts and do not claim demonstrated agent outcomes.
