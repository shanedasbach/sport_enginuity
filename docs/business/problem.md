# Problem & Opportunity

## The Problem

### What's the pain?

Sports data is one of the most fragmented data markets in tech. Every league, provider, and platform uses different schemas, different entity IDs, and different delivery formats for the same underlying data. A developer building a fantasy sports app needs player stats from one provider, betting odds from another, and injury reports from a third — and none of them agree on how to identify "Patrick Mahomes."

**The seven pain points developers face daily:**

1. **Schema inconsistency** — Every provider returns different JSON shapes for the same data. Sportradar's player object looks nothing like ESPN's, which looks nothing like Yahoo's. Joining data across sources requires custom transformation code for every provider pair.

2. **The "player ID problem"** — Sportradar, ESPN, Yahoo, PFF, and every other provider uses their own internal IDs. There is no universal sports entity ID standard. Developers maintain fragile mapping tables that break when players are traded, names are misspelled, or providers add new players inconsistently.

3. **Coverage gaps** — No single affordable API covers multiple sports well. Want NFL + NBA + EPL in one normalized API? Doesn't exist at a reasonable price point. Most APIs cover one sport deeply or many sports shallowly.

4. **Free API reliability** — Community-built and free APIs (Balldontlie, TheSportsDB) have inconsistent uptime, schema changes without warning, and are frequently abandoned. Multiple documented cases of apps breaking overnight because a free API changed a field name.

5. **The real-time cost cliff** — Getting data with sub-5-second latency costs 10-100x more than near-real-time (30-60 second delay). Most developer use cases only need near-real-time, but pricing tiers force them into expensive real-time plans or limit them to batch/historical data.

6. **Poor documentation** — Many sports APIs have incomplete, outdated, or missing documentation. Missing example responses, unclear rate limits, and no SDKs are common. Developer experience is an afterthought.

7. **Historical data scarcity** — Getting comprehensive historical statistics (5+ years) is either impossible or prohibitively expensive at the developer tier. Most APIs only offer recent seasons. Deep history requires scraping, manual collection, or enterprise licensing.

### How do people solve it today?

| Workaround | Pros | Cons |
|------------|------|------|
| **Multiple API subscriptions** | Broad coverage | Expensive ($500+/mo combined), schema mismatches, ID mapping nightmare |
| **Web scraping** | Free, comprehensive | Fragile, legally questionable, no real-time, constant maintenance |
| **Free APIs** (Balldontlie, TheSportsDB) | Free, easy to start | Unreliable, limited coverage, often abandoned, no SLAs |
| **Enterprise contracts** (Sportradar, Genius) | Official data, reliable | $50K+/yr minimum, sales process, overkill for small teams |
| **In-house normalization** | Full control | Months of engineering, constant maintenance, duplicate effort across industry |
| **ChatGPT / LLMs** for sports questions | Natural language, free | Hallucinations, no real-time data, not programmatic, can't build apps on it |

### Evidence the problem exists
- [x] Personal experience — yahoo-wizard project reveals the pain firsthand (fighting Yahoo's API format, missing data, needing supplementary sources)
- [x] Talked to people who have it — Developer communities consistently discuss data wrangling as the biggest time sink in sports app development
- [x] Found communities discussing it (Reddit, forums, etc.) — r/sportsbook, r/fantasyfootball developer threads, Stack Overflow sports API questions, Hacker News threads about sports data
- [x] Search volume / Google Trends — "sports API," "free sports data API," "sports betting API," "fantasy sports API" all have significant and growing search volume
- [x] Existing solutions with traction — The Odds API (10K+ API keys, $10-250/mo) validates demand for normalized aggregated data. Sportsdata.io ($499-999/mo) proves willingness to pay at mid-tier.

---

## The Opportunity

### Why now?

- [x] **Regulatory shift** — US sports betting legalized in 38+ states and DC. Each new state means more sportsbooks, fantasy platforms, and analytics tools that need data. In-play betting (the most data-intensive format) growing from 30% to 50% of total handle.
- [x] **Changing behavior/culture** — Fantasy sports has 62.5M US participants and is mainstream entertainment. The line between fantasy and betting has blurred with player props. Second-screen engagement during live sports is the norm.
- [x] **Market gap opened up** — The $100-$2,000/mo "missing middle" is underserved. Enterprise players (Sportradar, Genius Sports) have no incentive to build developer-tier products. Free APIs can't sustain quality. The Odds API proved the model works for odds — nobody has done it for general sports data.
- [x] **New technology** — AI/ML teams need massive amounts of clean, normalized historical data for sports-specific models (injury prediction, draft analytics, game strategy). LLMs enable natural language sports data queries that weren't possible 3 years ago.
- [x] Other: NIL (Name, Image, Likeness) market hit $1.7B+ in 2024, driving demand for college sports performance data to justify athlete valuations. Women's sports media rights are exploding (WNBA $2.2B deal, NWSL $240M deal), but data infrastructure for women's sports is a decade behind men's.

### Why hasn't this been solved?

1. **Data licensing economics favor big players.** Sportradar and Genius Sports have exclusive or preferred partnerships with virtually every major league. These deals cost hundreds of millions and create structural barriers. A new entrant can't access the same official data feeds.

2. **The normalization problem is genuinely hard.** Entity resolution across providers requires matching players by name, team, position, and context — and maintaining those mappings as rosters change, players are traded, and new seasons begin. It's not a one-time build; it's ongoing engineering.

3. **Enterprise players have no incentive to go down-market.** Sportradar makes $960M/yr selling to sportsbooks and broadcasters. Why build a $49/mo developer plan? The economics don't justify it for incumbents.

4. **The sports data developer market was too small before.** With 38+ states now legalizing sports betting, millions of DFS players, and AI/ML driving demand for training data, the developer market has reached the size where a dedicated product can sustain a real business.

**Our insight:** The aggregation and normalization layer is the valuable part — not the raw data itself. The Odds API proved this for a single data type (betting odds). We can do it comprehensively across stats, fantasy, and betting, with universal entity IDs as the moat, and three interfaces (API, CLI, chatbot) to serve different personas.

---

> 📊 **For market size and industry analysis, see [market.md](./market.md)**

---

## Sources & Notes

| Source | Key Insight | Link |
|--------|-------------|------|
| The Odds API | Validated aggregation model: 10K+ API keys, $10-250/mo, odds from 40+ sportsbooks | the-odds-api.com |
| Sportradar public filing (SRAD) | $960M revenue (2023), enterprise-only positioning | SEC filings |
| American Gaming Association | US sports betting handle $119B (2023), 38+ states legal | americangaming.org |
| Fantasy Sports & Gaming Association | 62.5M US fantasy sports participants | fsta.org |
| Reddit r/sportsbook | Developer threads documenting data wrangling pain | reddit.com/r/sportsbook |
| Stack Overflow | Recurring questions about sports API reliability and normalization | stackoverflow.com |
| Grand View Research | Sports analytics market $8.4B (2024) -> $19.8B (2030) | grandviewresearch.com |

---

*Last updated: 2026-03-09*
