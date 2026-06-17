<div align="center">

# 🌐 CDN DayZ — Community Website

**The official companion website for the CDN DayZ community.**  
Built with Next.js · Deployed on Vercel

[![Status](https://img.shields.io/badge/Status-Production-22c55e?style=for-the-badge&logoColor=white)](https://cdndayz.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Private](https://img.shields.io/badge/Access-Private_Community-DC143C?style=for-the-badge&logoColor=white)]()

---

**🔗 Live Site: [cdndayz.com](https://cdndayz.com)**

</div>

---

## 🗺️ Overview

CDN DayZ is a **private, production-grade community website** — not a public template. It provides members with real-time server intelligence, store access, rules, wipe information, and more. It is deployed exclusively for the **CDN DayZ** community at [cdndayz.com](https://cdndayz.com).

> [!IMPORTANT]
> This is a **private community website**. It is not designed to run on personal machines or be self-hosted by others.

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

### 📚 Terje & BoomLay Wiki
Tabbed in-game reference covering Terje Medicine conditions and BoomLay's Things craftables — fully cited from the official mod sources.

</td>
<td width="50%">

### 📊 Server Intelligence
Live population tracking with trend analysis, peak windows, weekday traffic profiles, cross-server comparison, and forecast panels.

</td>
</tr>
<tr>
<td width="50%">

### 🔴 Live Server Status
Real-time server population, map info, and online/offline state powered by GameDig queries.

</td>
<td width="50%">

### 🗓️ Wipe Information
Next wipe dates, schedules, and history — surfaced on the wipe info page.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Error Codes Hub
Full searchable DayZ error code database with troubleshooting guidance, source references, and category filtering.

</td>
<td width="50%">

### 📰 News & Ticker
Official DayZ news feed integration with a live scrolling news ticker on the homepage.

</td>
</tr>
<tr>
<td width="50%">

### 📋 Rules & FAQ
Community rules hub with hardcore policy callouts, collapsible FAQ (Gameplay, Rules, Technical), and support CTA. Includes a dedicated **Sci-fi Server** tab covering Yrtsk weapon tiers, rep progression, dungeon rules, and unique server mechanics.

</td>
<td width="50%">

### 🛒 Store & Support
Tabbed store catalog routed to channel-specific Discord links, with direct support CTAs throughout.

</td>
</tr>
</table>

---

## 📊 Server Intelligence System

[![KV](https://img.shields.io/badge/Storage-Vercel_KV_(Redis)-DC382D?style=flat-square&logo=redis&logoColor=white)]()
[![Scheduler](https://img.shields.io/badge/Scheduler-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)]()
[![Data Policy](https://img.shields.io/badge/Data_Policy-No_Fabrication-f59e0b?style=flat-square)]()

### Data Pipeline

```
GitHub Actions (every 5 min)
         │
         ▼ POST /api/population/snapshot  (auth required)
         │
         ▼ GameDig query → normalize
         │
         ▼ Vercel KV write
              ├── Raw snapshots   (short/mid-range, high fidelity)
              └── Hourly buckets  (long-range, up to 1 year)
```

### Analytics Surface (Servers Page)

| Panel | Description |
|---|---|
| **Population Chart** | BI-style historical population with time-range selector |
| **Stat Cards** | Current trend, momentum, volatility, reliability |
| **Tonight at a Glance** | Peak/off-peak hour windows and current session context |
| **Weekday Traffic** | Day-of-week traffic profiles and best-time-to-play signals |
| **Forecast Panel** | Forward-looking estimate with confidence based on sample depth |
| **Server Compare** | Side-by-side cross-server snapshot comparison |

> [!WARNING]
> **No synthetic data.** Missing historical buckets are represented as missing — never filled with zeros or estimated values. Forecasts are only generated when historical coverage is sufficient.

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Homepage with news ticker, server list, quick start, and CTAs |
| `/servers` | Live server status + full intelligence dashboard |
| `/wipe-info` | Next wipe dates, schedules, and history |
| `/features` | Features & Mods overview with live mod inventory |
| `/rules` | Community rules, hardcore policy, and collapsible FAQ |
| `/new-player` | New player onboarding guide |
| `/join` | How to join guide and launcher instructions |
| `/store` | Tabbed store catalog with Discord-routed support links |
| `/events` | Community events |
| `/dayz-error-codes` | Searchable error codes hub with troubleshooting guidance |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of service |

---

## 🔌 API Reference

<details>
<summary><strong>Server & Mods</strong></summary>

| Endpoint | Method | Description |
|---|---|---|
| `/api/servers` | `GET` | Live server status, population, and map data |
| `/api/server-mods` | `GET` | Launcher-verified mod details per server |

</details>

<details>
<summary><strong>News</strong></summary>

| Endpoint | Method | Description |
|---|---|---|
| `/api/news` | `GET` | Official DayZ news feed |
| `/api/news-ticker` | `GET` | Condensed ticker content for homepage bar |

</details>

<details>
<summary><strong>Population Intelligence</strong></summary>

| Endpoint | Method | Description |
|---|---|---|
| `/api/population/snapshot` | `POST` | 🔒 Protected — scheduler captures population snapshots |
| `/api/population/history/[serverId]` | `GET` | Historical population points for time-window selection |
| `/api/population/intelligence` | `GET` | Aggregated intelligence payload (cached) |

</details>

<details>
<summary><strong>Wipe Dates</strong></summary>

| Endpoint | Method | Description |
|---|---|---|
| `/api/wipe-dates` | `GET` | Next and recent wipe dates for all servers |

</details>

<details>
<summary><strong>Admin</strong></summary>

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/auth` | `POST` | Admin authentication |
| `/api/news` | `POST/PUT/DELETE` | 🔒 News content management |
| `/api/wipe-dates` | `POST/PUT/DELETE` | 🔒 Wipe date management |

</details>

---

## 🛠️ Tech Stack

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js_15-App_Router-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-Latest-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-Charts-22c55e?style=for-the-badge)](https://recharts.org)
[![Lucide](https://img.shields.io/badge/Lucide_React-Icons-f59e0b?style=for-the-badge)](https://lucide.dev)

[![GameDig](https://img.shields.io/badge/GameDig-Server_Query-DC2626?style=for-the-badge)](https://github.com/gamedig/node-gamedig)
[![Vercel KV](https://img.shields.io/badge/Vercel_KV-Redis%2FKV-000000?style=for-the-badge&logo=vercel)](https://vercel.com/storage/kv)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

</div>

---

## 🔄 Changelog

<details>
<summary><strong>April 2026 — Error Codes Hub</strong></summary>

- Released **DayZ Error Codes** hub at `/dayz-error-codes`:
  - Search and category filtering
  - Per-code troubleshooting guidance with source-linked references
- Admin content workflows: news/wipe editor components, expanded API coverage
- Global design system polish: standardized headers, badge patterns, typography, card/button spacing

</details>

<details>
<summary><strong>March–April 2026 — Server Intelligence & Store Overhaul</strong></summary>

- Released **Server Intelligence** dashboard on `/servers`:
  - Population telemetry, BI-style charting, trend/volatility/reliability indicators
  - Weekday traffic profiles, forecast panel, cross-server comparison
  - Hybrid KV retention (raw snapshots + hourly aggregates, up to 1 year)
  - Data-first policy: no synthetic analytics, no zero-fill fabrication
- **Store overhaul**: removed public prices, tabbed catalog flow, channel-specific Discord routing
- **Discord UX**: app-first deep-link behavior across all CTAs with web fallback
- Expanded legal surface: privacy policy, terms of service, footer/nav integration

</details>

<details>
<summary><strong>February–March 2026 — Rules, Accessibility & Platform</strong></summary>

- **Features & Mods** page with live mod inventory via DayZSA query proxy
- **Rules & FAQ** expansion: hardcore callout, categorized collapsible FAQ, donation terminology
- Accessibility: skip-to-content, focus-visible styling, keyboard interactions, section labeling
- Platform: canonical Discord link constants, reduced-motion cinematic background, `rel="noopener noreferrer"` standardization

</details>

---

<div align="center">

**Built exclusively for the CDN DayZ community · [cdndayz.com](https://cdndayz.com)**

</div>

