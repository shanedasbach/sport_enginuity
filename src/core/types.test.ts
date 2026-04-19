import { describe, it, expect } from "vitest";
import type {
  EntityId,
  ProviderEntityRef,
  DataProvider,
  Sport,
  Player,
  Team,
  Game,
  PlayerStatus,
  GameStatus,
  BettingMarket,
  CorrelatedPlayerData,
  ApiResponse,
  ApiError,
  ProviderAdapter,
  RawPlayerData,
  RawGameData,
  RawOddsData,
} from "./types.js";

// Helper to create a branded EntityId for testing
function createEntityId(value: string): EntityId {
  return value as EntityId;
}

describe("Core Types", () => {
  describe("EntityId", () => {
    it("should be a branded string type", () => {
      const id = createEntityId("player-abc-123");
      expect(typeof id).toBe("string");
      expect(id).toBe("player-abc-123");
    });

    it("should be usable as a string", () => {
      const id = createEntityId("team-xyz");
      expect(id.startsWith("team")).toBe(true);
      expect(id.length).toBe(8);
    });
  });

  describe("DataProvider", () => {
    it("should accept all valid provider values", () => {
      const providers: DataProvider[] = [
        "espn",
        "yahoo",
        "sportsdata",
        "the_odds_api",
        "api_sports",
        "sportmonks",
        "balldontlie",
        "internal",
      ];
      expect(providers).toHaveLength(8);
      providers.forEach((p) => expect(typeof p).toBe("string"));
    });
  });

  describe("Sport", () => {
    it("should accept all valid sport values", () => {
      const sports: Sport[] = [
        "nfl",
        "nba",
        "mlb",
        "nhl",
        "epl",
        "wnba",
        "nwsl",
        "ncaaf",
        "ncaab",
        "mls",
      ];
      expect(sports).toHaveLength(10);
    });
  });

  describe("PlayerStatus", () => {
    it("should accept all valid status values", () => {
      const statuses: PlayerStatus[] = [
        "active",
        "injured",
        "suspended",
        "retired",
        "free_agent",
      ];
      expect(statuses).toHaveLength(5);
    });
  });

  describe("GameStatus", () => {
    it("should accept all valid status values", () => {
      const statuses: GameStatus[] = [
        "scheduled",
        "in_progress",
        "final",
        "postponed",
        "cancelled",
      ];
      expect(statuses).toHaveLength(5);
    });
  });

  describe("BettingMarket", () => {
    it("should accept all valid market values", () => {
      const markets: BettingMarket[] = [
        "spread",
        "moneyline",
        "total",
        "player_prop",
        "futures",
      ];
      expect(markets).toHaveLength(5);
    });
  });

  describe("ProviderEntityRef", () => {
    it("should hold provider-specific ID mapping", () => {
      const ref: ProviderEntityRef = {
        provider: "espn",
        externalId: "3139477",
        confidence: 0.99,
        lastVerified: new Date("2026-01-01"),
      };
      expect(ref.provider).toBe("espn");
      expect(ref.confidence).toBeGreaterThan(0);
      expect(ref.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe("Player", () => {
    it("should model a complete player entity", () => {
      const player: Player = {
        id: createEntityId("player-lebron"),
        externalIds: [
          {
            provider: "espn",
            externalId: "1966",
            confidence: 1.0,
            lastVerified: new Date(),
          },
        ],
        name: {
          full: "LeBron James",
          first: "LeBron",
          last: "James",
          display: "L. James",
          aliases: ["King James", "Bron"],
        },
        sport: "nba",
        position: "SF",
        team: createEntityId("team-lakers"),
        status: "active",
        metadata: { draftYear: 2003, draftPick: 1 },
      };
      expect(player.id).toBe("player-lebron");
      expect(player.name.aliases).toContain("King James");
      expect(player.team).not.toBeNull();
    });

    it("should allow null team for free agents", () => {
      const freeAgent: Player = {
        id: createEntityId("player-fa"),
        externalIds: [],
        name: { full: "Test Player", first: "Test", last: "Player", display: "T. Player", aliases: [] },
        sport: "nba",
        position: "PG",
        team: null,
        status: "free_agent",
        metadata: {},
      };
      expect(freeAgent.team).toBeNull();
      expect(freeAgent.status).toBe("free_agent");
    });
  });

  describe("Team", () => {
    it("should model a complete team entity", () => {
      const team: Team = {
        id: createEntityId("team-lakers"),
        externalIds: [],
        sport: "nba",
        league: createEntityId("league-nba"),
        name: "Los Angeles Lakers",
        abbreviation: "LAL",
        city: "Los Angeles",
        venue: "Crypto.com Arena",
        metadata: {},
      };
      expect(team.abbreviation).toBe("LAL");
      expect(team.venue).not.toBeNull();
    });
  });

  describe("Game", () => {
    it("should model a game with score", () => {
      const game: Game = {
        id: createEntityId("game-001"),
        externalIds: [],
        sport: "nba",
        league: createEntityId("league-nba"),
        season: "2025-26",
        week: null,
        homeTeam: createEntityId("team-lakers"),
        awayTeam: createEntityId("team-celtics"),
        scheduledAt: new Date("2026-01-15T19:30:00Z"),
        status: "final",
        score: {
          home: 110,
          away: 105,
          periods: [
            { home: 28, away: 25 },
            { home: 30, away: 28 },
            { home: 24, away: 30 },
            { home: 28, away: 22 },
          ],
        },
        venue: "Crypto.com Arena",
      };
      expect(game.status).toBe("final");
      expect(game.score!.home).toBe(110);
      expect(game.score!.periods).toHaveLength(4);
    });
  });

  describe("CorrelatedPlayerData", () => {
    it("should unify player with stats, fantasy, and betting", () => {
      const player: Player = {
        id: createEntityId("player-mahomes"),
        externalIds: [],
        name: { full: "Patrick Mahomes", first: "Patrick", last: "Mahomes", display: "P. Mahomes", aliases: [] },
        sport: "nfl",
        position: "QB",
        team: createEntityId("team-chiefs"),
        status: "active",
        metadata: {},
      };

      const correlated: CorrelatedPlayerData = {
        player,
        stats: [
          {
            playerId: player.id,
            gameId: createEntityId("game-001"),
            season: "2025",
            week: 1,
            sport: "nfl",
            stats: { passingYards: 312, touchdowns: 3, interceptions: 0 },
            source: "sportsdata",
            updatedAt: new Date(),
          },
        ],
        fantasy: {
          playerId: player.id,
          sport: "nfl",
          season: "2025",
          week: 1,
          projections: [
            {
              source: "espn",
              format: "ppr",
              projectedPoints: 24.5,
              stats: { passingYards: 290, touchdowns: 2 },
              updatedAt: new Date(),
            },
          ],
          ownership: { espn: 99.8, yahoo: 99.5, sleeper: 99.9 },
          adp: 3.2,
          scoring: { standard: 22.1, ppr: 24.5, half_ppr: 23.3 },
        },
        betting: [],
      };

      expect(correlated.player.id).toBe("player-mahomes");
      expect(correlated.stats).toHaveLength(1);
      expect(correlated.fantasy).not.toBeNull();
      expect(correlated.fantasy!.ownership!.espn).toBe(99.8);
    });
  });

  describe("ApiResponse", () => {
    it("should wrap data with metadata and pagination links", () => {
      const response: ApiResponse<Player[]> = {
        data: [],
        meta: {
          sport: "nba",
          season: "2025-26",
          totalResults: 0,
          page: 1,
          perPage: 25,
          entityIdVersion: "v1",
        },
        _links: {
          self: "/players?sport=nba",
          next: null,
          prev: null,
        },
      };
      expect(response.meta.perPage).toBe(25);
      expect(response._links.next).toBeNull();
    });
  });

  describe("ApiError", () => {
    it("should model error responses", () => {
      const error: ApiError = {
        error: {
          code: "NOT_FOUND",
          message: "Player not found",
          details: null,
          documentation: "https://docs.sportenginuity.com/errors#NOT_FOUND",
        },
        status: 404,
      };
      expect(error.status).toBe(404);
      expect(error.error.code).toBe("NOT_FOUND");
    });
  });

  describe("ProviderAdapter interface", () => {
    it("should define required and optional methods", () => {
      // Verify the interface shape via a mock implementation
      const mockAdapter: ProviderAdapter = {
        provider: "balldontlie",
        supportedSports: ["nba"],
        fetchPlayers: async () => [],
        fetchTeams: async () => [],
        fetchGames: async () => [],
        fetchPlayerStats: async () => [],
        fetchOdds: async () => [],
        fetchFantasy: async () => [],
      };
      expect(mockAdapter.provider).toBe("balldontlie");
      expect(mockAdapter.supportedSports).toContain("nba");
    });

    it("should work without optional methods", () => {
      const minimalAdapter: ProviderAdapter = {
        provider: "internal",
        supportedSports: [],
        fetchPlayers: async () => [],
        fetchTeams: async () => [],
        fetchGames: async () => [],
        fetchPlayerStats: async () => [],
      };
      expect(minimalAdapter.fetchOdds).toBeUndefined();
      expect(minimalAdapter.fetchFantasy).toBeUndefined();
    });
  });

  describe("Raw data types", () => {
    it("should model pre-normalization player data", () => {
      const raw: RawPlayerData = {
        externalId: "203999",
        name: "LeBron James",
        team: "LAL",
        position: "SF",
        raw: { height: "6-9", weight: 250 },
      };
      expect(raw.externalId).toBe("203999");
    });

    it("should model pre-normalization game data", () => {
      const raw: RawGameData = {
        externalId: "game-20260115",
        homeTeam: "LAL",
        awayTeam: "BOS",
        scheduledAt: "2026-01-15T19:30:00Z",
        status: "final",
        raw: {},
      };
      expect(raw.status).toBe("final");
    });

    it("should model raw odds data", () => {
      const raw: RawOddsData = {
        gameExternalId: "game-001",
        bookmaker: "DraftKings",
        market: "spread",
        odds: -110,
        line: -3.5,
        raw: {},
      };
      expect(raw.bookmaker).toBe("DraftKings");
      expect(raw.line).toBe(-3.5);
    });
  });
});
