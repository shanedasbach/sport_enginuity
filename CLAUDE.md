# sport_enginuity

## Commands
```bash
cd sport_enginuity
npm start            # Run CLI
npm run build        # Compile TypeScript to dist/
npm run dev          # Watch mode with tsx
npm run se           # Direct CLI entry
npm run lint         # ESLint
npm test             # Vitest
npm run test:coverage  # Coverage report
```

## Architecture
- **Three interfaces**: REST API (`src/api/`), CLI (`src/cli/`), AI Chatbot (`src/chatbot/`)
- **Core layer** in `src/core/`: normalization engine, universal entity IDs, shared types
- **Provider adapter pattern** in `src/providers/`: each data source implements `ProviderAdapter` interface
- **Correlated data model**: stats + fantasy + betting linked per entity via universal IDs
- **CLI entry** in `src/index.ts` using process.argv dispatch (modeled on yahoo-wizard)
- Path alias: `@/*` maps to `src/*`

## Data Model
- `EntityId` — branded string type for universal IDs across all providers
- `ProviderAdapter` — interface every data source must implement
- `CorrelatedPlayerData` — unified view: Player + Stats + Fantasy + Betting
- Core types in `src/core/types.ts`

## Sports Coverage (Planned)
- **Phase 1**: NFL, NBA, MLB (proven demand, abundant data)
- **Phase 2**: WNBA, NWSL, Esports, College (underserved niches)
- **Phase 3**: EPL, Cricket, UFC, Pickleball (international expansion)

## Business Research
- Full business analysis in `docs/business/` (problem, market, customer, competition, business-model, gtm, validation)
- User stories: `docs/business/user-stories.xlsx` (275 stories across 12 segments)
- Feasibility: 31/40 (Promising)

## Agents

This project has 14 specialized agents in `.claude/agents/`:

| Agent | Role |
|-------|------|
| **cto** | Technical leadership, orchestration, architecture decisions |
| **cli-engineer** | CLI commands, terminal UX, argument parsing |
| **backend-engineer** | API endpoints, data layer, server logic |
| **frontend-engineer** | Documentation portal, dashboard UI |
| **qa-engineer** | Testing, coverage, data validation |
| **devops-engineer** | CI/CD, deployment, Docker, infrastructure |
| **security-engineer** | API key management, auth, OWASP |
| **data-engineer** | Data pipelines, ingestion, ETL, provider integrations |
| **ai-engineer** | Claude config, agent management, chatbot integration |
| **product-engineer** | Feature requirements, MVP specs, user stories |
| **accountant** | Data licensing costs, revenue modeling, unit economics |
| **technical-writer** | API docs, SDK docs, changelogs |
| **performance-engineer** | API latency, caching, query optimization |
| **normalization-specialist** | Entity resolution, universal ID mapping, schema normalization |
