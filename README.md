# sport_enginuity

Unified sports data platform that ingests, normalizes, and serves multi-sport stats, fantasy, and betting data through an API, CLI, and AI chatbot.

## The Problem

Sports data is fragmented across dozens of providers with inconsistent schemas, no universal entity IDs, and a massive price gap between free/unreliable APIs ($0-20/mo) and enterprise-grade official data ($50K+/yr). Developers spend 30%+ of their time wrangling data instead of building products.

## The Solution

Ingest from multiple reputable providers, normalize into a unified data model with **universal entity IDs**, and expose through three interfaces:

| Interface | Target User | Use Case |
|-----------|-------------|----------|
| **REST API** | Sports app developers | Programmatic access, app integration |
| **CLI** (`se`) | Data engineers, DFS analysts | Terminal queries, scripts, pipelines |
| **AI Chatbot** | Journalists, content creators | Natural language queries, no code needed |

Each sport includes **correlated data**: stats + fantasy projections + betting odds linked via universal entity IDs. No developer-tier API currently offers this combination.

## Quick Start

```bash
# Install
npm install

# Run CLI
npm start -- help

# Build
npm run build

# Development (watch mode)
npm run dev
```

## Project Structure

```
src/
  index.ts           # CLI entry point
  core/              # Shared types, normalization engine, entity IDs
    types.ts          # Core TypeScript interfaces
  api/               # REST API layer
  cli/               # CLI commands
  chatbot/           # AI chatbot interface
  providers/         # Data provider adapters
docs/
  business/          # Business research and analysis
```

## Sports Coverage (Planned)

**Phase 1:** NFL, NBA, MLB
**Phase 2:** WNBA, NWSL, Esports, College
**Phase 3:** EPL, Cricket, UFC, Pickleball

## Business Research

Detailed market research, competitive analysis, and validation plans are in [`docs/business/`](docs/business/).

- **Market:** $8.4B TAM growing to $19.8B by 2030
- **Feasibility Score:** 31/40 (Promising)
- **Full analysis:** [Business README](docs/business/README.md)

## License

MIT
