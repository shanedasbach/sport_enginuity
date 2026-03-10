# Go-to-Market Strategy

## Launch Plan

### MVP Definition

**The smallest thing that delivers value:** A REST API with normalized endpoints for 2-3 sports, a CLI for terminal-based queries, and developer docs with self-serve signup. Correlated stats + fantasy + betting data linked by universal entity IDs.

**Core features (must have):**
1. REST API with normalized endpoints for NFL, NBA, and MLB
2. Universal entity ID system — players, teams, and games mapped across providers
3. Stats + fantasy projections + betting odds correlated per entity
4. CLI tool for terminal-based queries (`se query nfl players --name "Patrick Mahomes" --include fantasy,betting`)
5. Developer documentation portal with self-serve signup and API key management
6. Free tier with rate limits (100 calls/day, 1 sport, historical only)
7. Paid tiers ($49, $149, $499) with Stripe billing

**Nice to have (later):**
- AI chatbot interface (natural language queries)
- GraphQL endpoint
- More sports (NHL, EPL, college, women's, esports)
- Real-time streaming data (WebSockets / SSE)
- SDK packages (Python, JavaScript, Go)
- Historical data bulk exports
- Webhook notifications (injuries, trades, line movements)
- Public status page and uptime SLA

### First 10 users

1. **Self** — Dogfood via yahoo-wizard. First integration, first feedback loop, first proof the normalization works.
2. **5-7 developers from Reddit** — Find active posters in r/sportsbook and r/fantasyfootball who have discussed data frustrations. DM with early access offer. Target people who have posted about building betting models or fantasy tools.
3. **2-3 from GitHub** — Find popular sports API wrapper repos (nfl-data-py, sportsipy, NBA API wrappers). Contact maintainers with early access. They understand the problem deeply and will give honest feedback.

### First 100 users

1. **Hacker News "Show HN" launch** — Write a technical post about the universal entity ID problem and how we solved it. HN audience loves infrastructure tools and data normalization stories.
2. **Product Hunt launch** — Schedule for a Tuesday. Focus on the "three interfaces" angle — API + CLI + chatbot in one product is novel.
3. **Reddit posts** — r/sportsbook (800K+), r/fantasyfootball (1.5M+), r/webdev, r/datascience. Not spam — genuine posts sharing the tool and asking for feedback.
4. **Dev.to and Medium blog posts** — Technical articles: "How we built a universal sports entity ID system," "The state of sports data APIs in 2026," "Building a sports betting model with normalized data."
5. **Twitter engagement** — Sports analytics community, #SportsBetting, #FantasyFootball, data science Twitter. Share interesting data insights generated with our own API.
6. **Open-source client SDKs** — Release Python and JavaScript SDKs on GitHub. Each SDK repo is a discovery surface.
7. **Discord presence** — Join sports betting and DFS Discord servers. Be helpful, share the tool when relevant (not spammy).

### Launch channels
- [x] Product Hunt
- [x] Hacker News
- [x] Reddit
- [x] Twitter/X
- [x] Direct outreach (to GitHub repo maintainers, Reddit power users)
- [x] Friends & network (yahoo-wizard contacts, fantasy league members)
- [x] Other: Dev.to, Medium, Discord, open-source SDKs, sports analytics conferences

---

## Growth Strategy

### Hybrid Approach: Popular Sports First, Differentiate with Correlation

**Phase 1 (Months 1-12): Popular sports, differentiated features**
- Cover NFL, NBA, MLB — where data is abundant and demand is proven
- Differentiate from day one with correlated stats + fantasy + betting per entity and universal entity IDs
- Nobody else at the developer tier offers this combination
- Revenue target: 120 paid users, $18K MRR

**Phase 2 (Months 12-24): Niche vertical expansion**
- Add women's sports (WNBA, NWSL) — underserved, media investment surging, first-mover advantage
- Add esports (League of Legends, CS2, Valorant) — digital-native data, growing betting market
- Add college sports (D1 football, basketball) — NIL market driving data demand, no good API exists
- Less competition in each niche, stronger positioning as "the API that covers everything"
- Revenue target: 700 paid users, $105K MRR

**Phase 3 (Months 24+): International expansion**
- EPL / European soccer (Opta is expensive, room for affordable alternative)
- Cricket (massive global audience, fragmented data landscape)
- Combat sports (UFC, boxing — significant betting volume, limited data APIs)
- Pickleball (emerging sport, zero data infrastructure, early-mover opportunity)

### Alternative growth strategies considered

**Strategy A: Popular Sports Only (Horizontal from day one)**
- Pros: Largest addressable market, most data sources, easiest to validate demand
- Cons: Direct competition with Sportsdata.io and others. Commodity positioning. "Another sports API."
- Verdict: Too competitive without differentiation.

**Strategy B: Niche Verticals First (Start with esports + women's + college)**
- Pros: Less competition, can become the definitive source, strong differentiation
- Cons: Smaller initial market, harder to find data sources, slower revenue ramp, harder to validate willingness to pay
- Verdict: Too slow to reach break-even. Need popular sports revenue to fund niche expansion.

**Strategy C: Hybrid (Recommended)**
- Start with popular sports for revenue (NFL/NBA/MLB = proven demand)
- Differentiate with unique features (universal IDs, correlated data, three interfaces)
- Expand to niches from a position of strength (revenue funds expansion, normalized layer extends easily)
- Verdict: Best risk-reward balance.

### Primary acquisition channels

| Channel | Cost | Scalability | Notes |
|---------|------|-------------|-------|
| **Content/SEO** | Low | Medium | "How to build a sports betting model" type content. Long-tail SEO for sports data queries. |
| **Developer community** | Low | Medium | Reddit, Discord, GitHub engagement. Authentic participation, not marketing. |
| **Documentation as marketing** | Low | Medium | Best-in-class docs attract developers (Stripe model). Docs are the product's front door. |
| **Product Hunt / HN** | Low | One-time | Launch spike with long-tail SEO benefit. |
| **Open-source tools** | Low | Medium | CLI tool and SDK packages as top-of-funnel discovery. |
| **Paid ads** | Medium | Fast | Google Ads for "sports API," "betting data API." Phase 2 when CAC economics are proven. |
| **Conference talks** | Medium | Low | MIT Sloan Sports Analytics, local meetups. Builds credibility. |

### Which channels will you focus on first?
1. **Content/SEO** — Write the definitive guides on sports data engineering. Long-term compound growth.
2. **Developer community** — Be present where developers discuss sports data pain. Authentic engagement in Reddit, Discord, GitHub.
3. **Documentation** — Make the docs so good they're a competitive advantage. Every developer evaluates APIs by their docs first.

### Why these channels?
Developers evaluate tools by documentation quality, community reputation, and content credibility. These three channels align with how Dev Dave (primary persona) discovers and evaluates new tools. Paid acquisition comes later once organic channels prove the value proposition.

---

## Retention & Engagement

### How do you keep users coming back?
- **Integration lock-in**: Once an app is built against sport_enginuity's schema and universal entity IDs, switching requires re-mapping entities and rewriting data layer code
- **CLI daily workflow**: The CLI becomes part of developers' daily terminal workflow — quick lookups, scripting, CI/CD
- **Data coverage expansion**: Regular additions of new sports, leagues, and data types give existing users more reasons to stay and upgrade tiers
- **AI chatbot habit formation**: Casual queries ("What's Mahomes' fantasy outlook this week?") create a non-development-related usage pattern

### Key engagement loops
1. **Build → Integrate → Depend** — Developer builds app with our API → integrates universal entity IDs into their data model → becomes dependent on our schema. Switching costs increase with each integration.
2. **Query → Discover → Share** — Analyst queries correlated data → discovers insights they couldn't find elsewhere → shares insights (driving awareness). Particularly powerful with the AI chatbot.
3. **Free → Outgrow → Upgrade** — Developer starts on free tier → hits rate limits as their app grows → upgrades to paid tier. Natural expansion revenue.

### Churn risks
- **Data quality issues** — A single incorrect stat or missed update can erode trust. Mitigation: automated data quality checks, comparison across providers, monitoring dashboards.
- **Provider goes down** — Upstream data provider outage cascades. Mitigation: multiple providers per sport, fallback sources, caching.
- **Competitor catches up** — Sportsdata.io or a new entrant adds universal entity IDs. Mitigation: stay ahead on features (chatbot, CLI), build community moat, focus on DX.
- **Project dies** — Developer's project fails, they cancel subscription. Expected and normal. Mitigated by having many customers across segments.

---

## Metrics to Track

### North Star Metric

**Monthly Active API Keys (MAAK)** — The number of API keys that made at least one API call in the last 30 days. Measures actual integration and usage, not just signups. An active API key means a developer has integrated us into something they're actively using.

### Supporting metrics

| Metric | Target | Why it matters |
|--------|--------|----------------|
| API calls per key per day | 100+ | Indicates real integration, not just tire-kicking |
| Free → Paid conversion rate | 5-10% | Revenue funnel health. Below 3% indicates product/pricing problem. |
| Time to first API call | <30 min | Measures onboarding quality. Developers who don't make a call in 30 min usually don't come back. |
| Documentation NPS | >50 | Developer satisfaction with docs. Primary evaluation criterion for developer tools. |
| Monthly paid churn | <5% | Retention. Above 5% means product isn't sticky enough. |
| CLI daily active users | 20%+ of paid | Validates CLI as a real interface, not a gimmick |
| Chatbot queries per user per month | 10+ | Validates chatbot engagement and retention value |
| Entity ID match rate | >95% | Core product quality. Below 95% = normalization isn't working. |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Demand signal landing page live | +2 weeks | ⬜ |
| Entity normalization prototype (NFL, 3 providers) | +6 weeks | ⬜ |
| API MVP (NFL + NBA + MLB, basic endpoints) | +12 weeks | ⬜ |
| CLI v1 | +14 weeks | ⬜ |
| Free tier public launch | +16 weeks | ⬜ |
| Paid tiers launch (Stripe billing) | +20 weeks | ⬜ |
| 100 active API keys | +26 weeks | ⬜ |
| AI chatbot beta | +30 weeks | ⬜ |
| 1,000 active API keys | +12 months | ⬜ |
| Niche vertical expansion begins | +12 months | ⬜ |
| First $100K MRR month | +22-24 months | ⬜ |

---

*Last updated: 2026-03-09*
