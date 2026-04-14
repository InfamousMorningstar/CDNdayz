# CDN DayZ Website

Companion website for the CDN DayZ community, built with Next.js App Router and TypeScript.

## Status

Production.

Live site: https://dayzcdn.com

## Changes Since Last README Update (April 2026)

- Released DayZ Error Codes hub at `/dayz-error-codes` with:
    - Search and category filtering.
    - Per-code troubleshooting guidance.
    - Source-linked references and inline evidence quotes.
    - Coverage disclaimer for in-progress code discovery.
- Added and refined admin/content workflows:
    - Admin authentication and editor components for news/wipe management.
    - Expanded API route coverage for admin/news/server/wipe flows.
- Improved global design consistency and UX:
    - Standardized page headers and badge patterns.
    - Updated typography system and heading behavior.
    - Refined navbar centering/alignment behavior.
    - Polished card/button styling and section spacing rhythm.
- Expanded legal/support surface:
    - Added legal pages (privacy/terms) and supporting footer/nav updates.
    - Continued rules/store/events/features content refinement.
- Released Server Intelligence dashboard and data platform:
    - Added server population intelligence UI on `/servers` with trend, volatility, peak/off-peak windows, and weekday traffic behavior.
    - Added BI-style historical charting and "Tonight at a glance" summary blocks.
    - Added cross-server comparison and reliability/anomaly indicators.
    - Added forecast panel with confidence derived from available historical coverage.
- Shipped data-quality hardening for intelligence metrics:
    - Removed synthetic/guessed values from analytics and chart rendering.
    - Enforced data sufficiency checks before producing trend/forecast signals.
    - Preserved missing buckets as missing data (no zero-fill fabrication).
- Added intelligence data retention and efficiency improvements:
    - Implemented hybrid retention: raw snapshots for recent windows plus hourly aggregates for long-range history.
    - Added single aggregated intelligence endpoint to reduce client fanout and free-tier load.
    - Added response caching on intelligence API layer.
- Store and support workflow overhaul:
    - Removed public prices from catalog listings.
    - Replaced category cards with tabbed catalog flow.
    - Routed categories to channel-specific Discord support/store links.
    - Added support CTA directly within rules experience.
- Discord UX update (global):
    - Added app-first Discord open behavior across major CTAs and support links.
    - Uses Discord deep-link attempt first, then web fallback.

## Recent Updates (March 2026)

- Information architecture updates:
    - Features page renamed to Features & Mods.
    - Live server mods overview moved to Features & Mods.
    - Rules navigation updated to Rules & FAQ.
- Rules and FAQ expansion:
    - Added dedicated Hardcore rules callout (HC exceptions).
    - Added categorized, collapsible FAQ (Gameplay, Rules, Technical).
    - Copy updates to use Donation Items/Gear terminology.
- Server and home UX updates:
    - Added HC warning context under the Servers heading.
    - Improved mobile behavior for home news ticker.
    - Refined homepage section order for clearer progression.
- Accessibility and semantics:
    - Added skip-to-content link.
    - Improved focus-visible styling and keyboard interactions.
    - Added section labeling and active navigation semantics.
    - Standardized external links with rel="noopener noreferrer".
- Platform and reliability:
    - Added canonical Discord link constant used across pages.
    - Added live launcher-verified mod endpoint at /api/server-mods.
    - Tuned cinematic background behavior for reduced-motion and lower-capability contexts.

## Core Capabilities

- Live server status via GameDig-backed API route.
- Server Intelligence system with historical snapshots, analytics, forecasts, anomalies, and compare views.
- Live per-server mod inventory via DayZSA query proxy route.
- Official DayZ news and ticker integration.
- Rules hub with hardcore policy visibility and FAQ support.
- Store, join guide, wipe information, and legal pages.

## Server Intelligence System

### What it Provides

- Near-real-time server population telemetry and history exploration.
- Actionable analytics for admins and players:
    - Current trend and momentum context.
    - Peak/off-peak hour windows.
    - Volatility and reliability markers.
    - Day-of-week traffic profiles.
    - Cross-server comparison snapshots.

### Data Pipeline

- Snapshot collection runs on a schedule (GitHub Actions every 5 minutes).
- Scheduler triggers protected snapshot API route with secret authentication.
- API queries active server populations and persists normalized records.

### Storage and Retention

- Backed by Redis/KV (`@vercel/kv`).
- Hybrid model:
    - Raw snapshots retained for short-to-mid windows (high fidelity recent analysis).
    - Hourly aggregate buckets retained for long windows (up to 1 year).
- Read path merges raw + hourly sources to keep charts accurate while controlling storage/compute costs.

### Analytics Rules

- Data-first policy: no synthetic trend or forecast generation when data coverage is insufficient.
- Forecast confidence is based on historical sample depth and consistency.
- Missing historical intervals are represented as missing, not converted into fake zero values.

### UI Surface

- Lives in the Servers page intelligence section.
- Includes:
    - BI-style charting for historical population behavior.
    - Stat cards and insight summaries.
    - Forecast panel and weekday traffic panel.
    - Server comparison panel.

### Operational Notes

- Snapshot scheduling is performed outside platform cron constraints using GitHub Actions.
- Intelligence API is aggregated and cached to reduce client request fanout and free-tier pressure.
- Storage path includes diagnostics/fail-fast handling to prevent silent persistence failures.

## API Endpoints

- GET /api/servers
    - Returns server status, population, and map data.
- GET /api/server-mods
    - Returns launcher-verified mod details per server.
- GET /api/news
    - Returns official DayZ news feed data.
- GET /api/news-ticker
    - Returns condensed ticker content for hero/news bar.
- POST /api/population/snapshot
    - Protected endpoint used by scheduler to capture population snapshots.
- GET /api/population/history/[serverId]
    - Returns historical population points for the selected server and time window.
- GET /api/population/intelligence
    - Returns aggregated intelligence payload used by the Servers intelligence UI.
- POST /api/chatbot
     - Website-only support assistant using retrieval + OpenAI. Answers only from indexed website content.
- GET /api/chatbot/analytics
     - Returns top chatbot questions (requires `Authorization: Bearer <CHATBOT_ANALYTICS_TOKEN>`).

## Website Chatbot (RAG)

This project includes a production-ready website support chatbot:

- UI widget: fixed chat launcher and panel on all pages.
- Secure API: server-only OpenAI usage (`/api/chatbot`).
- Model: ChatGPT-5.4 mini for concise website Q&A responses.
- RAG retrieval: local vector index stored at `data/chatbot/site-index.json` (gitignored).
- Hybrid retrieval + rerank: combines lexical, title, route-priority, and optional embedding scores.
- Query rewriting: expands user phrasing into retrieval-friendly terms before search.
- Grounding validation: weakly supported generated answers are rejected and replaced with fallback.
- Strict behavior: if content is not found in indexed pages, response is exactly:
  - `I couldn't find that on the website.`

### Security Model

- `OPENAI_API_KEY` is used only on the server.
- No secrets are hardcoded in source.
- `.env.local` stays uncommitted.
- `.env.example` contains placeholders only.

### Setup

1. Install dependencies:
    - `npm install`
2. Copy env template and set values:
    - `cp .env.example .env.local` (PowerShell: `Copy-Item .env.example .env.local`)
3. Set at minimum:
    - `OPENAI_API_KEY`
    - `WEBSITE_BASE_URL` (your canonical site URL)
4. Build the retrieval index:
    - `npm run chatbot:index`
5. Run app:
    - `npm run dev`

Production note:

- `npm run build` now runs `npm run chatbot:index` automatically before `next build`.
- Ensure `WEBSITE_BASE_URL` is available in the build environment (for example in Vercel Environment Variables).
- `OPENAI_API_KEY` is still required at runtime for response generation.

### Refreshing Website Knowledge

Whenever website content changes, rebuild the index:

- `npm run chatbot:index`
- Then run retrieval quality checks:
    - `npm run chatbot:eval`

This re-crawls configured website pages, re-chunks content, and overwrites the local index file.

### Evaluation Harness

- Eval dataset: `data/chatbot/eval-set.json`
- Eval script: `scripts/eval-chatbot-retrieval.mjs`
- Goal: maintain/improve pass rate before deploying chatbot changes.

### Live E2E Chatbot Evaluation

- E2E dataset: `data/chatbot/e2e-eval-set.json`
- E2E script: `scripts/eval-chatbot-e2e.mjs`
- Run locally against a deployed site:
    - `CHATBOT_EVAL_BASE_URL=https://cdndayz.com npm run chatbot:eval:e2e`

GitHub Actions workflow:

- File: `.github/workflows/chatbot-quality.yml`
- Runs retrieval eval + live e2e eval (when secret is configured).
- Required repository secret:
    - `CHATBOT_EVAL_BASE_URL` (your deployed site URL, e.g. `https://cdndayz.com`)

### Routed Intent Priority

Before vector retrieval, the chatbot applies lightweight keyword routing:

- Status questions prioritize `/status` (fallback `/servers`)
- Wipe questions prioritize `/wipes` (fallback `/wipe-info`)
- Error questions prioritize `/dayz-error-codes`
- Join/mods questions prioritize `/join`

### Deployment Notes

- Set environment variables in your hosting provider (for example Vercel project settings).
- Run `npm run chatbot:index` as part of a deployment pipeline step, or run it on a trusted server and deploy the generated index artifact outside git.
- The analytics endpoint is protected by `CHATBOT_ANALYTICS_TOKEN`.
- Rate limiting is in-memory per runtime instance; for globally shared limits in multi-instance environments, swap to Redis/KV-based counters.

## Tech Stack

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- GameDig
- Recharts
- @vercel/kv (Redis/KV)
- GitHub Actions (snapshot scheduler)

## Notes

- Some server/UI data is intentionally cached in API routes to reduce upstream load.
- If upstream launcher data is unavailable, mod records are returned with per-server error details instead of failing the entire request.
- Server Intelligence uses strict data-coverage checks and intentionally avoids guessed analytics output.
- Discord support/store/invite links are centralized and support app-first open behavior with web fallback.

## Usage Notice

This website is built specifically for the CDN DayZ community and is not maintained as a public template product.

If you want a custom website for your own community, reach out to discuss a dedicated build.

Built for the CDN DayZ community.
