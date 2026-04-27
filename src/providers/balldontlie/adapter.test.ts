import { describe, it, expect, vi, beforeEach } from "vitest";
import { BalldontlieAdapter } from "./adapter.js";
import { BdlClient } from "./client.js";
import type { BdlPlayer, BdlTeam, BdlGame, BdlStats, BdlListResponse, BdlMeta } from "./types.js";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const LAKERS: BdlTeam = {
  id: 14,
  conference: "West",
  division: "Pacific",
  city: "Los Angeles",
  name: "Lakers",
  full_name: "Los Angeles Lakers",
  abbreviation: "LAL",
};

const CELTICS: BdlTeam = {
  id: 2,
  conference: "East",
  division: "Atlantic",
  city: "Boston",
  name: "Celtics",
  full_name: "Boston Celtics",
  abbreviation: "BOS",
};

const LEBRON: BdlPlayer = {
  id: 237,
  first_name: "LeBron",
  last_name: "James",
  position: "F",
  height: "6-9",
  weight: "250",
  jersey_number: "23",
  college: "None",
  country: "USA",
  draft_year: 2003,
  draft_round: 1,
  draft_number: 1,
  team: LAKERS,
};

const FREE_AGENT: BdlPlayer = {
  id: 999,
  first_name: "No",
  last_name: "Team",
  position: "",
  height: null,
  weight: null,
  jersey_number: null,
  college: null,
  country: null,
  draft_year: null,
  draft_round: null,
  draft_number: null,
  team: null,
};

const GAME: BdlGame = {
  id: 1001,
  date: "2024-01-15",
  season: 2023,
  status: "Final",
  period: 4,
  time: " ",
  postseason: false,
  home_team_score: 115,
  visitor_team_score: 108,
  home_team: LAKERS,
  visitor_team: CELTICS,
};

const SCHEDULED_GAME: BdlGame = {
  ...GAME,
  id: 1002,
  status: "Scheduled",
  home_team_score: 0,
  visitor_team_score: 0,
};

const STAT: BdlStats = {
  id: 5001,
  min: "32:10",
  fgm: 12,
  fga: 20,
  fg3m: 2,
  fg3a: 5,
  ftm: 6,
  fta: 7,
  oreb: 1,
  dreb: 7,
  reb: 8,
  ast: 10,
  stl: 2,
  blk: 1,
  turnover: 3,
  pf: 2,
  pts: 32,
  fg_pct: 0.6,
  fg3_pct: 0.4,
  ft_pct: 0.857,
  player: LEBRON,
  team: LAKERS,
  game: GAME,
};

function meta(total: number): BdlMeta {
  return { total_pages: 1, current_page: 1, next_page: null, per_page: 100, total_count: total };
}

function listResponse<T>(data: T[]): BdlListResponse<T> {
  return { data, meta: meta(data.length) };
}

// ─── BdlClient (unit) ──────────────────────────────────────────────────────────

describe("BdlClient", () => {
  function makeMockFetch(responses: Record<string, unknown>) {
    return vi.fn(async (url: string | URL) => {
      const path = new URL(url.toString()).pathname;
      const body = responses[path] ?? { data: [], meta: meta(0) };
      return {
        ok: true,
        json: async () => body,
        text: async () => "",
      };
    });
  }

  it("calls /players and returns data", async () => {
    const mockFetch = makeMockFetch({ "/v1/players": listResponse([LEBRON]) });
    const client = new BdlClient({ fetch: mockFetch as unknown as typeof fetch, rateLimitMs: 0 });
    const players = await client.getPlayers();
    expect(players).toHaveLength(1);
    expect(players[0].id).toBe(237);
  });

  it("calls /teams and returns data", async () => {
    const mockFetch = makeMockFetch({ "/v1/teams": listResponse([LAKERS, CELTICS]) });
    const client = new BdlClient({ fetch: mockFetch as unknown as typeof fetch, rateLimitMs: 0 });
    const teams = await client.getTeams();
    expect(teams).toHaveLength(2);
  });

  it("calls /games with season param", async () => {
    const mockFetch = makeMockFetch({ "/v1/games": listResponse([GAME]) });
    const client = new BdlClient({ fetch: mockFetch as unknown as typeof fetch, rateLimitMs: 0 });
    const games = await client.getGames(2023);
    expect(games).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("seasons=2023"),
      expect.any(Object)
    );
  });

  it("sends Authorization header when apiKey is set", async () => {
    const mockFetch = makeMockFetch({ "/v1/teams": listResponse([]) });
    const client = new BdlClient({
      apiKey: "test-key",
      fetch: mockFetch as unknown as typeof fetch,
      rateLimitMs: 0,
    });
    await client.getTeams();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "test-key" }) })
    );
  });

  it("throws on non-ok response", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: false,
      status: 429,
      text: async () => "rate limited",
      json: async () => ({}),
    }));
    const client = new BdlClient({ fetch: mockFetch as unknown as typeof fetch, rateLimitMs: 0 });
    await expect(client.getTeams()).rejects.toThrow("429");
  });

  it("paginates through multiple pages", async () => {
    let page = 0;
    const mockFetch = vi.fn(async () => {
      page++;
      const isLastPage = page >= 2;
      return {
        ok: true,
        text: async () => "",
        json: async () => ({
          data: [LAKERS],
          meta: {
            total_pages: 2,
            current_page: page,
            next_page: isLastPage ? null : page + 1,
            per_page: 100,
            total_count: 2,
          },
        }),
      };
    });
    const client = new BdlClient({ fetch: mockFetch as unknown as typeof fetch, rateLimitMs: 0 });
    const teams = await client.getTeams();
    expect(teams).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

// ─── BalldontlieAdapter ────────────────────────────────────────────────────────

describe("BalldontlieAdapter", () => {
  let adapter: BalldontlieAdapter;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    adapter = new BalldontlieAdapter({ fetch: mockFetch as unknown as typeof fetch, rateLimitMs: 0 });
  });

  function setupMock(responses: Record<string, unknown>) {
    mockFetch.mockImplementation(async (url: string) => {
      const path = new URL(url).pathname;
      const body = responses[path] ?? { data: [], meta: meta(0) };
      return { ok: true, json: async () => body, text: async () => "" };
    });
  }

  // ── provider metadata ──

  it("has provider = 'balldontlie'", () => {
    expect(adapter.provider).toBe("balldontlie");
  });

  it("supports only nba", () => {
    expect(adapter.supportedSports).toEqual(["nba"]);
  });

  // ── fetchPlayers ──

  describe("fetchPlayers", () => {
    it("maps players to RawPlayerData", async () => {
      setupMock({ "/v1/players": listResponse([LEBRON]) });
      const players = await adapter.fetchPlayers("nba", "2023-24");
      expect(players).toHaveLength(1);
      expect(players[0].externalId).toBe("237");
      expect(players[0].name).toBe("LeBron James");
      expect(players[0].team).toBe("LAL");
      expect(players[0].position).toBe("F");
    });

    it("uses FA for players with no team", async () => {
      setupMock({ "/v1/players": listResponse([FREE_AGENT]) });
      const players = await adapter.fetchPlayers("nba", "2023-24");
      expect(players[0].team).toBe("FA");
    });

    it("uses Unknown for empty position", async () => {
      setupMock({ "/v1/players": listResponse([FREE_AGENT]) });
      const players = await adapter.fetchPlayers("nba", "2023-24");
      expect(players[0].position).toBe("Unknown");
    });

    it("preserves raw response", async () => {
      setupMock({ "/v1/players": listResponse([LEBRON]) });
      const players = await adapter.fetchPlayers("nba", "2023-24");
      expect((players[0].raw as typeof LEBRON).id).toBe(237);
    });
  });

  // ── fetchTeams ──

  describe("fetchTeams", () => {
    it("maps teams to RawTeamData", async () => {
      setupMock({ "/v1/teams": listResponse([LAKERS, CELTICS]) });
      const teams = await adapter.fetchTeams("nba", "2023-24");
      expect(teams).toHaveLength(2);
      expect(teams[0].externalId).toBe("14");
      expect(teams[0].name).toBe("Los Angeles Lakers");
      expect(teams[0].abbreviation).toBe("LAL");
    });
  });

  // ── fetchGames ──

  describe("fetchGames", () => {
    it("maps finished games to RawGameData", async () => {
      setupMock({ "/v1/games": listResponse([GAME]) });
      const games = await adapter.fetchGames("nba", "2023-24");
      expect(games).toHaveLength(1);
      expect(games[0].externalId).toBe("1001");
      expect(games[0].homeTeam).toBe("LAL");
      expect(games[0].awayTeam).toBe("BOS");
      expect(games[0].status).toBe("final");
      expect(games[0].scheduledAt).toBe("2024-01-15");
    });

    it("maps scheduled games with correct status", async () => {
      setupMock({ "/v1/games": listResponse([SCHEDULED_GAME]) });
      const games = await adapter.fetchGames("nba", "2023-24");
      expect(games[0].status).toBe("scheduled");
    });

    it("parses season year from 'YYYY-YY' format", async () => {
      setupMock({ "/v1/games": listResponse([]) });
      await adapter.fetchGames("nba", "2023-24");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("seasons=2023"),
        expect.any(Object)
      );
    });

    it("handles single-year season format", async () => {
      setupMock({ "/v1/games": listResponse([]) });
      await adapter.fetchGames("nba", "2024");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("seasons=2024"),
        expect.any(Object)
      );
    });
  });

  // ── fetchPlayerStats ──

  describe("fetchPlayerStats", () => {
    it("maps stats to RawPlayerStatsData", async () => {
      setupMock({ "/v1/stats": listResponse([STAT]) });
      const stats = await adapter.fetchPlayerStats("nba", "2023-24");
      expect(stats).toHaveLength(1);
      expect(stats[0].playerExternalId).toBe("237");
      expect(stats[0].gameExternalId).toBe("1001");
      expect(stats[0].stats.pts).toBe(32);
      expect(stats[0].stats.ast).toBe(10);
      expect(stats[0].stats.reb).toBe(8);
    });

    it("coerces null stats to 0", async () => {
      const nullStat = { ...STAT, pts: null, reb: null, ast: null };
      setupMock({ "/v1/stats": listResponse([nullStat]) });
      const stats = await adapter.fetchPlayerStats("nba", "2023-24");
      expect(stats[0].stats.pts).toBe(0);
      expect(stats[0].stats.reb).toBe(0);
      expect(stats[0].stats.ast).toBe(0);
    });

    it("paginates through all stats pages", async () => {
      let page = 0;
      mockFetch.mockImplementation(async () => {
        page++;
        const isLastPage = page >= 2;
        return {
          ok: true,
          text: async () => "",
          json: async () => ({
            data: [STAT],
            meta: {
              total_pages: 2,
              current_page: page,
              next_page: isLastPage ? null : page + 1,
              per_page: 100,
              total_count: 2,
            },
          }),
        };
      });
      const stats = await adapter.fetchPlayerStats("nba", "2023-24");
      expect(stats).toHaveLength(2);
    });
  });
});

// ─── Provider registry ────────────────────────────────────────────────────────

describe("provider registry", () => {
  it("registers and retrieves an adapter", async () => {
    const { registerAdapter, getAdapter, clearAdapters } = await import("../index.js");
    clearAdapters();
    const adapter = new BalldontlieAdapter({ rateLimitMs: 0 });
    registerAdapter(adapter);
    expect(getAdapter("balldontlie")).toBe(adapter);
    clearAdapters();
  });

  it("returns null for unregistered provider", async () => {
    const { getAdapter, clearAdapters } = await import("../index.js");
    clearAdapters();
    expect(getAdapter("espn")).toBeNull();
  });

  it("lists all registered adapters", async () => {
    const { registerAdapter, listAdapters, clearAdapters } = await import("../index.js");
    clearAdapters();
    registerAdapter(new BalldontlieAdapter({ rateLimitMs: 0 }));
    expect(listAdapters()).toHaveLength(1);
    clearAdapters();
  });
});
