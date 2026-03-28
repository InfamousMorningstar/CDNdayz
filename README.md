# CDN DayZ Website

Companion website for the CDN DayZ community, built with Next.js App Router and TypeScript.

## Status

This project is actively developed and currently in beta.

## Repository

https://github.com/InfamousMorningstar/CDNdayz

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

## Local Development

Prerequisites:

- Node.js 18.17+
- npm

Install and run:

```bash
git clone https://github.com/InfamousMorningstar/CDNdayz.git
cd CDNdayz
npm install
npm run dev
```

Open http://localhost:3000

## Build and Start

```bash
npm run build
npm run start
```

## Notes

- Some server/UI data is intentionally cached in API routes to reduce upstream load.
- If upstream launcher data is unavailable, mod records are returned with per-server error details instead of failing the entire request.

## Contributing

Issues and pull requests are welcome.

Built for the CDN DayZ community.
