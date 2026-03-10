# Business Model

## Revenue Model

### How do you make money?

- [x] **Subscription** — Monthly API access tiers with increasing limits and features
- [ ] ~~Transaction fee~~
- [ ] ~~Marketplace~~
- [x] **Freemium** — Free tier with rate limits to drive developer adoption and conversion
- [ ] ~~Advertising~~
- [ ] ~~One-time purchase~~
- [x] **Usage-based** — API call overages beyond tier limits, premium data add-ons
- [ ] **Licensing** — Future: bulk data licensing deals with larger companies
- [ ] Other:

### Revenue streams breakdown

| Stream | % of Revenue | Notes |
|--------|--------------|-------|
| API subscriptions (monthly tiers) | 60% | Core recurring revenue. Developer, Pro, and Business tiers. |
| Usage overages | 15% | Per-call charges above tier limits. Scales with customer growth. |
| AI chatbot premium | 15% | Natural language query subscription. Attracts non-developer segment. |
| CLI premium features | 5% | Advanced CLI capabilities (batch exports, scripting, CI/CD hooks). |
| Data licensing (future) | 5% | Bulk/enterprise data deals. Phase 2+ revenue stream. |

---

## Pricing

### Price point

Five tiers designed to capture the "missing middle" between free APIs ($0-20/mo) and enterprise contracts ($50K+/yr). Each tier maps to a customer segment with increasing willingness to pay.

| Tier | Price | Target | API Calls/Day | Sports | Data Types | Interfaces | Support |
|------|-------|--------|---------------|--------|------------|------------|---------|
| **Free** | $0/mo | Hobbyists, evaluators | 100 | 1 sport | Historical stats only | API + basic CLI | Community |
| **Developer** | $49/mo | Indie devs, side projects | 5,000 | 3 sports | Historical + delayed (60s) | API + CLI | Email |
| **Pro** | $149/mo | Serious builders, DFS grinders | 25,000 | All sports | Near-real-time (5-10s), stats + fantasy + betting | API + CLI + basic chatbot | Priority email |
| **Business** | $499/mo | Companies, betting analytics | 100,000 | All sports + all data types | Real-time, full correlated data | API + CLI + full chatbot | Dedicated |
| **Enterprise** | Custom ($2K+/mo) | Large operations | Unlimited | All + custom | Everything + bulk exports + SLA | All + custom integrations | Dedicated + SLA |

### Pricing research

**What do competitors charge?**
- The Odds API: $10-250/mo (betting odds only — single data type)
- Sportsdata.io: $499-999/mo (multi-sport, no fantasy/betting correlation)
- API-Sports: $10-90/mo (basic quality, no normalization)
- MySportsFeeds: $60-300/mo (limited sports)
- Sportradar/Genius: $50K-500K+/yr (enterprise)

**Positioning:** sport_enginuity's $49 Developer tier undercuts Sportsdata.io's $499 entry point while offering unique features (universal entity IDs, correlated data). The $149 Pro tier matches The Odds API's upper tier pricing but offers 3x the data types + CLI + chatbot. The $499 Business tier directly competes with Sportsdata.io on price but adds significant feature differentiation.

**What did customers say they'd pay?**
- Developer community signals: $50-200/mo for reliable multi-sport normalized data (Reddit, HN threads)
- DFS grinders already pay $200-500/mo combined for multiple data subscriptions — consolidation is attractive
- Content creators willing to pay $20-50/mo for AI chatbot access (comparable to ChatGPT Plus pricing)

**What's the value delivered worth?**
- Saves 10-20 hours/month of data wrangling for developers ($50-150/hr = $500-3,000 of dev time saved)
- DFS/betting edge from correlated data easily worth $100+/mo in improved outcomes
- Content creation speed from AI chatbot saves 5-10 hours/month of manual research

### Pricing model
- [ ] Per user
- [ ] Per seat
- [x] Tiered plans
- [x] Usage-based (overages)
- [ ] Flat rate
- [x] Custom/enterprise

---

## Unit Economics

### Key metrics (estimate)

| Metric | Value | How calculated |
|--------|-------|----------------|
| **ARPU** (Avg Revenue Per User) | $175/mo | Blended across tiers. Most revenue from Pro ($149) and Business ($499) tiers. Free users contribute $0 but drive conversion. |
| **CAC** (Customer Acquisition Cost) | $100-300 | Developer marketing (content, SEO, community) is efficient. No enterprise sales team needed. Comparable to Stripe/Twilio developer CAC. |
| **LTV** (Lifetime Value) | $4,200 | 24-month average lifetime x $175 ARPU. Developer APIs tend to have long retention once integrated into production apps. |
| **LTV:CAC Ratio** | 14-42:1 | Well above the 3:1 threshold. Range depends on CAC efficiency. |
| **Payback Period** | <2 months | $175 ARPU vs $100-300 CAC. Fast payback enables reinvestment. |
| **Gross Margin** | 60-75% | Data licensing + infrastructure are primary COGS. Margins improve with scale as fixed costs are spread across more users. |
| **Churn Rate** | 3-5% monthly | Developer APIs have stickier retention once integrated into production. Switching costs (universal entity IDs) reduce churn over time. |

### Do the economics work?

**Break-even analysis:**
- Fixed monthly costs: ~$10K-15K (data licensing + infrastructure + LLM costs)
- At $175 blended ARPU and 65% gross margin: ~$114/user net contribution
- Break-even: **60-85 paid users** (excluding free tier costs)
- At 5% free-to-paid conversion: need 1,200-1,700 total users (free + paid) to break even

The economics work well at modest scale. The key risk is data licensing costs growing faster than revenue — mitigated by starting with free/public data and adding licensed sources only as revenue justifies the cost.

---

## Cost Structure

### Fixed costs (monthly)

| Cost | Amount | Notes |
|------|--------|-------|
| Data provider licensing fees | $2,000-10,000 | Scales with number of sports and data types. Start with 2-3 providers. |
| Cloud infrastructure (API hosting, DB, CDN) | $1,000-5,000 | Scales with traffic. Start on managed services (Vercel, Supabase, or similar). |
| LLM API costs (AI chatbot) | $500-2,000 | Depends on chatbot usage. Can use caching to reduce per-query cost. |
| Domain, monitoring, dev tools | $100-300 | Standard SaaS tooling. |
| Team (early stage) | $0 | Solo founder initially. |
| **Total fixed (early stage)** | **$3,600-17,300** | |

### Variable costs (per user/transaction)

| Cost | Amount | Notes |
|------|--------|-------|
| Data provider per-call costs | $0.001-0.01/call | Some providers charge per API call downstream |
| LLM cost per chatbot query | $0.01-0.05/query | GPT-4 class model. Can optimize with caching, smaller models for simple queries. |
| Infrastructure scaling per user | ~$2-5/mo/active user | CDN, compute, database connections |
| Payment processing (Stripe) | 2.9% + $0.30 | Standard Stripe pricing |

---

## Financial Projections (rough)

| Timeframe | Free Users | Paid Users | MRR | Notes |
|-----------|------------|------------|-----|-------|
| Month 1 | 20 | 0 | $0 | Beta launch, free tier only. Dogfooding via yahoo-wizard. |
| Month 3 | 80 | 5 | $600 | First paid tier users. Early adopters from Reddit/GitHub. |
| Month 6 | 200 | 30 | $4,500 | Hacker News / Product Hunt launch spike. Word of mouth starting. |
| Year 1 | 600 | 120 | $18,000 | Steady content/SEO traffic. 3-4 sports covered. CLI and API stable. |
| Year 18mo | 1,500 | 350 | $52,000 | AI chatbot launched. Expanding to niche verticals. |
| Year 2 | 3,000 | 700 | $105,000 | All major US sports + EPL. Strong developer community. |

**Assumptions:** 5% free-to-paid conversion rate, 4% monthly paid churn, $150 blended ARPU (conservative, weighted toward Developer tier early).

**Revenue milestones:**
- Break-even ($10-15K MRR): ~Month 8-10
- $100K MRR: ~Month 22-24
- $1M ARR: ~Month 20-24

---

*Last updated: 2026-03-09*
