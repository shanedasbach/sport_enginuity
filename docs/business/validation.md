# Validation & Risks

## Key Assumptions

*What must be true for this to work?*

| # | Assumption | Confidence | How to test |
|---|------------|------------|-------------|
| 1 | Developers will pay $49-499/mo for normalized multi-sport data with universal entity IDs | Medium | Landing page conversion, pricing survey, early paid sign-ups |
| 2 | Universal entity ID normalization is achievable with reasonable effort (95%+ match rate) | Medium | Prototype with NFL data from 3 providers |
| 3 | Correlated stats + fantasy + betting data is a compelling differentiator over separate APIs | Medium | Feature interest survey, early user feedback, usage analytics |
| 4 | The AI chatbot interface attracts non-developer users (journalists, content creators) | Low | Beta test chatbot with 10 sports content creators |
| 5 | Data licensing costs are manageable at developer-tier pricing ($49-499/mo) | Medium | Map actual costs from 3-5 data providers, model unit economics |
| 6 | Free tier users convert to paid at 5%+ rate | Low-Medium | Measure after 3 months of free tier availability |
| 7 | Developer community engagement (Reddit, GitHub, HN) drives organic growth | Medium | Track signup attribution from content/community vs. paid channels |

### Most critical assumption

**#2 — Universal entity ID normalization is achievable.** If entity resolution across providers is too fragile at scale (keeping mappings accurate as rosters change, new players enter leagues, trades happen mid-season), the core moat collapses and the product becomes "just another sports API." This is simultaneously the hardest thing to build and the most valuable differentiator. Everything else depends on this working reliably.

---

## Validation Experiments

### Experiment 1: Demand Signal Landing Page

| Attribute | Details |
|-----------|---------|
| **Hypothesis** | Developers in the $100-500/mo range want a normalized sports data API with universal entity IDs and correlated stats/fantasy/betting data |
| **Test method** | Build a landing page with value prop, feature comparison vs. competitors, and email signup for early access. Drive traffic via Reddit posts in r/sportsbook and r/fantasyfootball + targeted Google Ads for "sports data API." |
| **Success criteria** | 3%+ email signup rate from 1,000+ targeted visitors |
| **Timeline** | 2 weeks to build, 4 weeks to measure |
| **Cost** | $200-500 (landing page hosting + targeted Reddit/Google ads) |
| **Result** | *(fill in after)* |
| **Learning** | |

### Experiment 2: Entity Normalization Prototype

| Attribute | Details |
|-----------|---------|
| **Hypothesis** | Universal entity ID mapping across 3 providers is achievable for NFL players/teams with 95%+ automated match rate |
| **Test method** | Build normalization pipeline for NFL using data from ESPN (public), Yahoo Fantasy API (from yahoo-wizard), and one paid API (Sportsdata.io trial or similar). Match players by name + team + position. Measure automated match rate and manual intervention required. |
| **Success criteria** | 95%+ automated match rate across all active NFL players (~1,700 players) with <2% requiring manual review |
| **Timeline** | 3-4 weeks |
| **Cost** | $100-500 (API trial costs) + engineering time |
| **Result** | *(fill in after)* |
| **Learning** | |

### Experiment 3: Pricing Validation

| Attribute | Details |
|-----------|---------|
| **Hypothesis** | Developers will pay $49-499/mo for normalized sports data |
| **Test method** | Show 3 pricing page variants to 20+ developers who signed up from the landing page. Use Van Westendorp pricing sensitivity questions ("At what price is this too expensive?" / "too cheap?" / "getting expensive but worth it?" / "a bargain?"). |
| **Success criteria** | 50%+ say they'd pay $49+/mo. 20%+ would pay $149+/mo. |
| **Timeline** | 2 weeks (after landing page has signups) |
| **Cost** | Time only |
| **Result** | *(fill in after)* |
| **Learning** | |

### Experiment 4: CLI Dogfooding

| Attribute | Details |
|-----------|---------|
| **Hypothesis** | A sports data CLI is useful for developer workflows and provides value beyond what a REST API alone offers |
| **Test method** | Build a basic CLI (`se query`, `se compare`, `se export`) and use it daily for yahoo-wizard development. Share with 5 developer contacts who work with sports data. Track usage patterns and gather feedback. |
| **Success criteria** | Used daily by 3+ people for 2+ weeks. Generates 5+ feature requests (indicating engagement). At least 2 people say they prefer CLI over API for certain tasks. |
| **Timeline** | 2-3 weeks |
| **Cost** | Time only |
| **Result** | *(fill in after)* |
| **Learning** | |

### Experiment 5: Chatbot Value Test

| Attribute | Details |
|-----------|---------|
| **Hypothesis** | Natural language sports data queries attract non-developer users (journalists, podcasters, content creators) |
| **Test method** | Build a minimal AI chatbot over normalized NFL/NBA data. Share with 10 sports content creators and journalists. Track queries, return visits, and willingness to pay. |
| **Success criteria** | 6/10 use it more than once. 3/10 say they'd pay $20-50/mo. Average 5+ queries per returning user. |
| **Timeline** | 4-6 weeks (after API MVP exists) |
| **Cost** | ~$100-200 (LLM API costs) |
| **Result** | *(fill in after)* |
| **Learning** | |

---

## Validation Methods Checklist

- [x] **Landing page** — Measure signups/interest (Experiment 1)
- [ ] **Customer interviews** — 5+ conversations (planned after landing page signups)
- [ ] **Survey** — Quantitative data (Van Westendorp pricing in Experiment 3)
- [ ] **Pre-sales** — Can you get someone to pay? (After MVP, earliest Month 4-5)
- [ ] **Letter of intent** — Written commitment (B2B, later stage)
- [ ] **Concierge MVP** — Not applicable (data product, not service)
- [ ] ~~Wizard of Oz~~ — Not applicable
- [x] **Prototype feedback** — Entity normalization prototype (Experiment 2)
- [x] **Competitor analysis** — Completed in [competition.md](./competition.md)

---

## Risks

### What could kill this?

#### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Entity normalization too fragile at scale | Medium | Critical | Start with fewer sports. Invest in automated matching + manual review pipeline. Use fuzzy matching + contextual signals (team, position, jersey number). |
| Data provider API changes break ingestion | High | High | Abstract provider layer with per-provider adapters. Monitor for schema changes. Maintain backup data sources per sport. |
| Real-time data costs prohibitively expensive | Medium | High | Start with delayed data (60s for Developer, 5-10s for Pro). Offer real-time only at Business+ tier to offset cost. |
| LLM hallucination in chatbot responses | Medium | High | Ground all answers in actual queried data. Show data sources. Add confidence scores. Never let the LLM "guess" — only answer with retrieved data. |
| Universal ID mapping doesn't transfer across sports | Low | Medium | Each sport has different entity structures. Design the mapping system to be sport-agnostic from day one. |

#### Competitive Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sportradar launches a developer tier | Low-Medium | Critical | Move fast. Build switching costs via universal entity IDs and developer community. Sportradar's enterprise culture makes developer products unlikely. |
| The Odds API expands to full sports data | Medium | High | Be broader (3 data types + 3 interfaces vs. their 1 data type + 1 interface). Move faster on correlated data model. |
| Well-funded startup enters same space | Medium | Medium | First-mover advantage. Developer community engagement. Open-source tooling creates lock-in. |
| Sportsdata.io adds universal entity IDs | Medium | Medium | IDs alone aren't enough — correlated data model + CLI + chatbot are the full differentiation package. |
| Data providers restrict redistribution access | Medium | High | Review all TOS before building. Diversify sources. Negotiate redistribution licenses upfront. |

#### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data licensing costs exceed revenue at early scale | Medium | High | Start with free/public data sources. Add licensed data only as revenue justifies cost. Model break-even carefully. |
| Low free-to-paid conversion (<3%) | High | High | Optimize free tier limits. Add premium-only features (chatbot, real-time, more sports). A/B test tier boundaries. |
| Solo founder bandwidth becomes bottleneck | High | Medium | Automate everything possible (data pipeline, monitoring, billing). Focus on one sport at a time. Consider co-founder if traction validates the idea. |
| Developer churn from data quality issues | Medium | High | Automated quality checks comparing data across multiple providers. Monitoring and alerting on anomalies. Transparent status page. |

#### Market Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Regulatory crackdown on sports betting | Low | Medium | Data provision is not wagering — different regulatory category. Stats and fantasy data unaffected. Betting data is one of three types, not the only revenue source. |
| Leagues publish their own affordable APIs (going direct) | Low-Medium | High | Normalization across leagues remains valuable even if individual leagues offer APIs. Universal entity IDs across league APIs would still be needed. |
| AI makes sports data queries commoditized | Low | Medium | LLMs can answer questions but can't provide reliable, programmatic, real-time data feeds. API use case is distinct from chatbot use case. |

### Categories considered
- [x] Market risk — Demand validated by competitors and community signals. Regulatory risk low.
- [x] Technical risk — Entity normalization is the critical risk. Prototype required.
- [x] Competitive risk — Enterprise giants unlikely to go down-market. Developer-tier competition manageable.
- [x] Regulatory risk — Data provision (not wagering) is unregulated. Low risk.
- [x] Team risk — Solo founder bandwidth is real constraint. Mitigated by automation.
- [x] Funding risk — Bootstrappable with free data sources. No VC required initially.
- [x] Timing risk — Multiple macro tailwinds. No timing concerns.

---

## Open Questions

*Things you still need to figure out*

1. **Which data providers explicitly allow redistribution via API?** Need to review TOS for ESPN, Yahoo, Sportsdata.io, and others to determine what's legally redistributable vs. what requires a licensing agreement.
2. **What's the actual cost to license data for 3-5 sports at the developer tier?** Need quotes from 3+ providers to model unit economics accurately.
3. **Is GraphQL worth adding as a first-class endpoint, or is REST sufficient?** Developer community is split. GraphQL adds development overhead but enables more efficient queries.
4. **How do you handle real-time data delivery?** WebSockets, Server-Sent Events, or polling? Each has cost/complexity tradeoffs. SSE is likely the right balance.
5. **Should the chatbot use a fine-tuned model or RAG over the normalized data?** RAG is simpler and more accurate for structured data queries. Fine-tuning adds latency and cost with unclear benefit.
6. **What's the entity normalization approach for international player names?** Unicode handling, transliteration, name ordering (family name first vs. last) — particularly important for soccer, cricket, and esports.
7. **Should niche verticals (women's sports, esports, college) start as Phase 2 or launch as a parallel beta?** Phase 2 is safer but loses first-mover advantage. A parallel beta for one niche could test demand earlier.

---

## Kill Criteria

*What would make you stop pursuing this?*

- [ ] Entity normalization match rate below 85% after 6 weeks of dedicated effort — the core moat is unachievable
- [ ] Fewer than 3/10 surveyed developers willing to pay $49/mo — insufficient willingness to pay
- [ ] Landing page signup rate below 1% after 2,000+ targeted visitors — insufficient demand signal
- [ ] Data licensing costs exceed $5K/mo before reaching 50 paid users — unit economics don't work
- [ ] Cannot source reliable data for 2+ sports at the developer-tier price point — supply-side problem
- [ ] Two or more direct competitors launch universal entity ID features within 6 months — differentiation window has closed

---

*Last updated: 2026-03-09*
