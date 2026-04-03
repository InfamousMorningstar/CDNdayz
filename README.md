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
- Live per-server mod inventory via DayZSA query proxy route.
- Official DayZ news and ticker integration.
- Rules hub with hardcore policy visibility and FAQ support.
- Store, join guide, wipe information, and legal pages.

## API Endpoints

- GET /api/servers
    - Returns server status, population, and map data.
- GET /api/server-mods
    - Returns launcher-verified mod details per server.
- GET /api/news
    - Returns official DayZ news feed data.
- GET /api/news-ticker
    - Returns condensed ticker content for hero/news bar.

## Tech Stack

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- GameDig

## Notes

- Some server/UI data is intentionally cached in API routes to reduce upstream load.
- If upstream launcher data is unavailable, mod records are returned with per-server error details instead of failing the entire request.

## Usage Notice

This website is built specifically for the CDN DayZ community and is not maintained as a public template product.

If you want a custom website for your own community, reach out to discuss a dedicated build.

Built for the CDN DayZ community.
