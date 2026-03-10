# Customer Research

## Target Customer

### Who is this for?

Sports app developers, fantasy/betting analysts, and sports content creators who need clean, normalized multi-sport data but are priced out of enterprise contracts ($50K+/yr) and underserved by free/unreliable APIs.

**Strategy:** Build for the API Developer (core revenue engine), differentiate with the AI Chatbot (attracts non-developers who would never write API calls). The CLI bridges both worlds for power users.

### Primary Persona

| Attribute | Description |
|-----------|-------------|
| **Name** | "Dev Dave" |
| **Demographics** | 25-40, software developer, US-based, $80-150K income |
| **Role/Context** | Building a fantasy sports app, betting analytics tool, sports media product, or personal side project. May be indie, at a startup, or at a mid-size company. |
| **Pain Point** | Spends 30%+ of dev time wrangling data from multiple APIs — maintaining ID mapping tables, writing schema transformations, handling provider outages, and debugging data inconsistencies instead of building features. |
| **Current Solution** | Subscribes to 2-3 APIs ($200-800/mo combined), writes custom normalization code, maintains fragile player ID mapping scripts, supplements with scraping when APIs have gaps. |
| **Willingness to Pay** | $100-500/mo for reliable, normalized, multi-sport data with universal entity IDs. ROI is clear: saves 10-20 hours/month of data wrangling. |
| **Where to Find Them** | GitHub (sports API repos), Stack Overflow (sports data questions), Reddit (r/sportsbook, r/fantasyfootball), dev Twitter/X, Hacker News, Discord sports dev communities |

### Secondary Personas

#### "Analytics Alex" — The Fantasy/Betting Analyst

| Attribute | Description |
|-----------|-------------|
| **Name** | "Analytics Alex" |
| **Demographics** | 22-45, data analyst or quant, sports bettor or DFS player, semi-technical |
| **Role/Context** | Builds predictive models for sports betting or DFS (daily fantasy sports). Needs clean historical + live data to backtest strategies and make real-time decisions. |
| **Pain Point** | Can't easily correlate player stats with betting lines and fantasy projections across sources. Spends hours in spreadsheets manually joining data from ESPN, DraftKings, and sportsbook sites. |
| **Current Solution** | Manual spreadsheets, scraping scripts, cobbled-together free data, occasional paid API. |
| **Willingness to Pay** | $50-200/mo. ROI-driven — if the data helps them win even one more bet per week or optimize one more DFS lineup, it pays for itself. |
| **Where to Find Them** | r/sportsbook, Discord betting communities, DFS forums (RotoGrinders), Twitter sports betting accounts, YouTube handicapping channels |

#### "Content Chris" — The Sports Content Creator

| Attribute | Description |
|-----------|-------------|
| **Name** | "Content Chris" |
| **Demographics** | 25-45, sports journalist, blogger, podcaster, YouTuber |
| **Role/Context** | Needs quick stats and cross-sport correlations for articles, podcast segments, social media posts, and video content. Not a developer — won't write API calls. |
| **Pain Point** | Answering multi-source questions requires manual research across Basketball Reference, ESPN, PFF, and other sites. Copy-pasting stats into articles. Can't quickly answer "Who had the best fantasy value among QBs with favorable betting lines last week?" |
| **Current Solution** | Google searches, ESPN.com, Basketball Reference, manual copy-paste into articles. Sometimes uses ChatGPT but doesn't trust the accuracy. |
| **Willingness to Pay** | $20-50/mo for the AI chatbot. Won't use API or CLI directly. Values speed and accuracy over depth. |
| **Where to Find Them** | Twitter sports media, YouTube sports channels, podcast networks, sports journalism Slack groups, The Athletic |

---

## Customer Interviews

### People Talked To

| Date | Name/Type | Key Insights | Would Pay? |
|------|-----------|--------------|------------|
| — | Self (yahoo-wizard development) | Yahoo Fantasy API is poorly documented, rate-limited, and uses proprietary IDs that don't map to any other provider. Normalization is the hardest part of building fantasy tools. | Yes — already investing time building workarounds |
| — | r/sportsbook developers (observed) | Repeated threads asking for reliable sports data APIs. Common complaint: free APIs break, paid APIs are too expensive, no one correlates betting + stats data. | Signal suggests yes at $50-200/mo |
| — | GitHub sports API repo maintainers (observed) | Repos like nfl-data-py, sportsipy, and NBA API wrappers have 1K+ stars. Maintainers frequently express frustration with upstream data reliability. | Signal suggests yes for a stable alternative |

### Common Themes
- Data wrangling is universally cited as the #1 time sink for sports app developers
- The player ID problem is the most specific, actionable pain point
- Developers would happily pay to eliminate normalization work — but only if the data is actually reliable
- Fantasy and betting users want correlated data but assume it doesn't exist in one place

### Surprising Findings
- Many developers build their own normalization layers and never share them — the work is duplicated thousands of times across the industry
- Content creators (journalists, podcasters) don't know data APIs exist — they've never considered a tool like this. The AI chatbot could open an entirely new customer segment.
- DFS "grinders" (professional daily fantasy players) often spend $200-500/mo on multiple data subscriptions already. Consolidation into one source is attractive.

### Quotes

> "I spend more time mapping player IDs between ESPN and Yahoo than I do actually building features." — Reddit r/fantasyfootball developer thread

> "Every sports API I've used has either died, changed their schema without warning, or priced me out." — Hacker News comment on sports data tools

> "If someone built The Odds API but for everything — stats, fantasy, betting, all linked together — I'd switch tomorrow." — r/sportsbook power user

---

## Early Adopters

### Who are the first 10-100 users?

1. **Indie sports app developers on GitHub** — Already building tools with free/cheap APIs. Most frustrated by data quality. Will adopt a better alternative immediately.
2. **r/sportsbook power users building betting models** — Technically capable, willing to pay if ROI is clear. Active community, easy to reach.
3. **DFS grinders who automate lineup optimization** — Already paying for multiple data sources. Would consolidate subscriptions.
4. **Sports data science students and researchers** — Need clean historical data for projects. Price-sensitive but high volume. Good free-tier users who convert later.
5. **Self (dogfooding via yahoo-wizard)** — First user, first integration test, first feedback loop.
6. **Open-source sports tool maintainers** — People maintaining sportsipy, nfl-data-py, and similar libraries. They understand the problem deeply.

### Where do you find them?
- [x] Reddit / forums — r/sportsbook (800K+ members), r/fantasyfootball (1.5M+), r/datascience, r/sportsbetting
- [x] Social media — Twitter/X sports analytics community, #SportsBetting, #FantasyFootball, data science Twitter
- [x] Professional communities — SABR (baseball analytics), MIT Sloan Sports Analytics Conference attendees, sports hackathon participants
- [x] Friends/network — yahoo-wizard development network, personal fantasy league contacts
- [ ] Paid ads — Later stage, not for early adopters
- [x] Other: GitHub (search for repos with "sports API," "fantasy," "betting data," "nfl-data"), Discord (sports betting servers, DFS communities), Hacker News (Show HN launches)

### What makes them early adopters?
- **Already building** — They have working projects and feel the data pain daily. Not theoretical users.
- **Price-motivated** — Currently paying for multiple subscriptions or investing hours in scraping/normalization. Clear ROI from consolidation.
- **Community-connected** — Active in forums and open-source. Will provide feedback, report bugs, and tell others if the product is good.
- **Tolerance for imperfection** — Used to dealing with unreliable free APIs. Will accept an MVP if the normalization is solid and the docs are clear.

---

*Last updated: 2026-03-09*
