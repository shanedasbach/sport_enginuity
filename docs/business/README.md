# Sport Enginuity

> One-line pitch: *Unified sports data platform that ingests, normalizes, and serves multi-sport stats, fantasy, and betting data through an API, CLI, and AI chatbot*

## Stage: 🔬 Research

---

## Quick Summary

**Problem:** Sports data is fragmented across dozens of providers with inconsistent schemas, no universal entity IDs, and a massive price gap between free/unreliable APIs ($0-20/mo) and enterprise-grade official data ($50K+/yr). Developers spend 30%+ of their time wrangling data instead of building products.

**Solution:** Ingest from multiple reputable providers, normalize into a unified data model with universal entity IDs, and expose through three interfaces: REST API (programmatic access), CLI (developer workflows and scripts), and AI chatbot (natural language queries). Each sport includes correlated stats, fantasy projections, and betting odds linked via universal IDs.

**Customer:** Sports app developers, fantasy sports operators, betting analytics teams, data scientists, and sports media companies stuck in the $100-$2,000/mo "missing middle" between free APIs and enterprise contracts.

**Why Now:** US sports betting legalized in 38+ states, fantasy sports is a $48.6B industry with 62.5M US participants, AI/ML in sports analytics needs clean normalized training data, and no one has solved the universal entity ID problem at the developer tier.

---

## Core Concept

### Three Interfaces, Three Personas

| Interface | Target User | Use Case |
|-----------|-------------|----------|
| **REST API** | Sports app developers | Programmatic access, app integration, data pipelines |
| **CLI** | DFS/betting analysts, data engineers | Quick queries, scripts, CI/CD, terminal workflows |
| **AI Chatbot** | Journalists, content creators, casual analysts | Natural language questions without writing code |

### Correlated Data Model

For each sport, three data types are normalized and linked via universal entity IDs:

| Data Type | Examples | Why It Matters |
|-----------|----------|----------------|
| **Stats** | Player/team performance, standings, schedules, play-by-play | Core sports data layer |
| **Fantasy** | Projections, ownership %, lineup optimizer inputs, scoring | $48.6B fantasy sports industry relies on this |
| **Betting** | Odds, lines, props, over/unders from multiple sportsbooks | Fastest growing sub-market (~22% CAGR) |

No developer-tier API currently correlates all three data types with universal entity IDs across providers.

### Growth Strategy: Hybrid Approach

**Phase 1 — Popular sports, differentiated features:** Start with NFL, NBA, MLB where data is abundant and demand is proven. Differentiate from day one with correlated stats+fantasy+betting and universal entity IDs.

**Phase 2 — Niche vertical expansion:** Expand to underserved verticals (women's sports, esports, college, international leagues) where competition is weaker and first-mover advantage is strongest.

---

## Research Docs

| Document | Status | Summary |
|----------|--------|---------|
| [Problem & Opportunity](./problem.md) | ✅ | 7 developer pain points, "missing middle" gap, why-now factors |
| [Market Research](./market.md) | ✅ | $8.4B TAM growing to $19.8B, Porter's Five Forces, 3-tier market map |
| [Customer Research](./customer.md) | ✅ | 3 personas (Dev Dave, Analytics Alex, Content Chris), early adopters |
| [Competitive Analysis](./competition.md) | ✅ | Sportradar/Genius/Stats Perform vs. developer-tier APIs, positioning |
| [Business Model](./business-model.md) | ✅ | 5-tier pricing ($0-$2K+/mo), unit economics, break-even analysis |
| [Go-to-Market](./gtm.md) | ✅ | MVP for 3 sports, developer marketing playbook, hybrid growth |
| [Validation & Risks](./validation.md) | ✅ | 5 experiments, risk matrix, kill criteria |

**Status:** ⬜ Not started | 🟡 In progress | ✅ Complete

---

## Feasibility Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Market Need | 4/5 | Real pain, universal developer complaints, validated by The Odds API traction. Workarounds exist but are painful. |
| Market Size | 5/5 | $8.4B TAM growing to $19.8B. Multiple sub-markets (betting, fantasy, analytics) all expanding. |
| Timing | 5/5 | Perfect storm: betting legalization, AI/ML demand, fantasy growth, women's sports investment, NIL markets. |
| Competition | 3/5 | Tier 1 giants dominate enterprise. Developer tier more accessible but The Odds API, Sportsdata.io exist. |
| Business Model | 4/5 | API subscription model battle-tested (Stripe, Twilio, The Odds API). Clear willingness-to-pay signals. |
| Technical | 3/5 | Entity normalization is genuinely hard. Universal ID mapping is unsolved. Real-time data adds cost/complexity. |
| Team Fit | 3/5 | yahoo-wizard project shows domain familiarity. Needs sustained data engineering effort. |
| Capital Efficiency | 4/5 | Can bootstrap with public/free data sources initially. Data licensing costs scale with revenue. |
| **Total** | **31/40** | |

**Verdict:** 🟡 Promising (24-31)

Strong market timing and clear pain point, but technical complexity of entity normalization and thin early-stage moat prevent a Green rating. Worth serious validation investment.

---

## Decision

**Pursue?** Yes, with focused validation

**Next Step:** Run Experiment 1 (demand signal landing page) and Experiment 2 (entity normalization prototype for NFL across 3 providers) in parallel. See [validation.md](./validation.md) for details.

---

## Portfolio Synergies

The **yahoo-wizard** project in this workspace is directly relevant — it's a CLI tool for Yahoo Fantasy Basketball that reveals the sports data fragmentation problem firsthand. sport_enginuity's CLI interface could eventually evolve from yahoo-wizard, and the development experience provides domain knowledge of the problem space.

---

*Last updated: 2026-03-09*
