<div align="center">

# 🌐 CDN DayZ — Community Website

**The official companion website for the CDN DayZ community.**  
Built with Next.js · Powered by OpenAI · Deployed on Vercel

[![Status](https://img.shields.io/badge/Status-Production-22c55e?style=for-the-badge&logoColor=white)](https://cdndayz.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![OpenAI](https://img.shields.io/badge/AI-GPT--5.4_mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Private](https://img.shields.io/badge/Access-Private_Community-DC143C?style=for-the-badge&logoColor=white)]()

---

**🔗 Live Site: [cdndayz.com](https://cdndayz.com)**

</div>

---

## 🗺️ Overview

CDN DayZ is a **private, production-grade community website** — not a public template. It provides members with real-time server intelligence, AI-assisted support, store access, rules, wipe information, and more. It is deployed exclusively for the **CDN DayZ** community at [cdndayz.com](https://cdndayz.com).

> [!IMPORTANT]
> This is a **private community website**. It is not designed to run on personal machines or be self-hosted by others.

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

### 🤖 CDN AI Concierge
AI-powered support chatbot using a full RAG pipeline — answers questions about servers, wipes, rules, store, mods, and error codes directly from indexed site content.

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
Next wipe dates, schedules, and history — surfaced in the chat and on the wipe info page.

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

## 🤖 CDN AI Concierge

[![Chatbot](https://img.shields.io/badge/Model-GPT--5.4_mini-412991?style=flat-square&logo=openai&logoColor=white)]()
[![Retrieval](https://img.shields.io/badge/Retrieval-Hybrid_RAG-22c55e?style=flat-square)]()
[![Grounding](https://img.shields.io/badge/Grounding-Validated-3178C6?style=flat-square)]()
[![Intent](https://img.shields.io/badge/Intent_Routing-ChatGPT--First-f59e0b?style=flat-square)]()

The CDN AI Concierge is a **production-grade RAG chatbot** embedded site-wide. It understands natural language questions about the community and answers using only content indexed from the actual website — no hallucination, no guessing.

### How It Works

```
User Message
     │
     ▼
┌─────────────────────────────────┐
│   ChatGPT Intent Classifier     │  ← Understands natural phrasing
│  TOP_SERVER_POPULATION          │
│  TOP_SERVER_TRAFFIC_OVER_TIME   │
│  NONE → RAG path                │
└────────────┬────────────────────┘
             │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
Live API Fast-Path    RAG Pipeline
/api/servers         Query Rewriting
/api/population      Hybrid Retrieval
 /intelligence       Grounding Check
                     GPT Completion
```

### Intelligence Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Intent Router** | GPT-5.4 mini (classifier) | Semantic intent detection before retrieval |
| **Query Rewriting** | `lib/chatbot/query.ts` | Synonym expansion + intent-aware enrichment |
| **Retrieval** | BM25-style lexical + cosine embedding | Hybrid scoring with route-priority and rerank |
| **Grounding** | `lib/chatbot/grounding.ts` | Rejects answers with < 45% sentence coverage |
| **Completion** | GPT-5.4 mini | Strict, grounded website Q&A responses |
| **Fallback** | Deterministic heuristics | Covers edge cases when model classifier returns `NONE` |

> [!NOTE]
> If information is not found in the indexed site content, the chatbot responds with exactly: **"I couldn't find that on the website."** — never a guess.

### Retrieval Scoring Formula

```
score = (embedding × 0.45) + (lexical × 0.35) + (title × 0.12) + (density × 0.08) + routeBoost
```

### Quality & CI

[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)]()
[![Retrieval Eval](https://img.shields.io/badge/Retrieval_Eval-17%2F17_Passing-22c55e?style=flat-square)]()
[![E2E Eval](https://img.shields.io/badge/Local_E2E-25%2F25_Passing-16a34a?style=flat-square)]()

- **Offline retrieval eval** — `npm run chatbot:eval` against `data/chatbot/eval-set.json`
- **Live E2E eval** — `npm run chatbot:eval:e2e` against the deployed site endpoint
- **GitHub Actions workflow** — `.github/workflows/chatbot-quality.yml` runs on schedule (every 12h) and manual trigger

### Hardening Highlights (Latest)

- **Intent split for rules**: building-rule intents are separated from general/support rules intents to avoid cross-contamination.
- **Corpus cleanup**: admin/internal source noise is excluded from chatbot indexing.
- **Paraphrase resilience**: expanded query rewriting for trader-distance, ticket/support, and VE_DATA/PBO phrasing.
- **Answer discipline**: improved yes/no handling and recommendation-vs-requirement phrasing safeguards.
- **Evaluator upgrades**:
  - Retrieval evaluator aligned closer to runtime fallback logic.
  - E2E evaluator now supports semantic answer assertions (`must include` / `must exclude`).
  - E2E evaluator rotates request IP headers to avoid local rate-limit false failures.

### Security

- `OPENAI_API_KEY` is server-only. Never exposed to the client.
- No secrets hardcoded in source. `.env.local` is gitignored.
- Analytics endpoint protected by `CHATBOT_ANALYTICS_TOKEN` bearer auth.
- Rate limiting is applied per runtime instance.

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
<summary><strong>AI Concierge</strong></summary>

| Endpoint | Method | Description |
|---|---|---|
| `/api/chatbot` | `POST` | Website support assistant — RAG + OpenAI |
| `/api/chatbot/analytics` | `GET` | 🔒 Top questions (requires `Authorization: Bearer <token>`) |

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

[![OpenAI](https://img.shields.io/badge/OpenAI_SDK-4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com)
[![GameDig](https://img.shields.io/badge/GameDig-Server_Query-DC2626?style=for-the-badge)](https://github.com/gamedig/node-gamedig)
[![Vercel KV](https://img.shields.io/badge/Vercel_KV-Redis%2FKV-000000?style=for-the-badge&logo=vercel)](https://vercel.com/storage/kv)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

</div>

---

## 🔄 Changelog

<details>
<summary><strong>April 2026 — AI Concierge & Error Codes</strong></summary>

- Shipped **CDN AI Concierge** chatbot with full RAG pipeline:
  - Hybrid lexical + embedding retrieval with BM25-style scoring and rerank
  - ChatGPT-first semantic intent routing (`classifyRealtimeIntentWithModel`)
  - Query rewriting, grounding validation, model fallback chain
  - Live API fast-paths for real-time server population questions
  - Offline + live E2E evaluation harness with GitHub Actions CI
- Released **DayZ Error Codes** hub at `/dayz-error-codes`:
  - Search and category filtering
  - Per-code troubleshooting guidance with source-linked references
- Admin content workflows: news/wipe editor components, expanded API coverage
- Global design system polish: standardized headers, badge patterns, typography, card/button spacing
- Post-launch **chatbot hardening pass**:
  - Split rules routing into `rules_building` and `rules_general` intent families.
  - Expanded rules/support/error intent coverage (`ticket`, `DM admins`, `VE_DATA`, `PBO`, `more recent version`).
  - Strengthened prompt guardrails for binary questions and recommendation phrasing.
  - Removed admin/index noise from chatbot corpus generation.
  - Expanded evaluation datasets with broad paraphrases and adversarial prompts.
  - Latest local validation: **17/17 retrieval** and **25/25 E2E** passing.

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

