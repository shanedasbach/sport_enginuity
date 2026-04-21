import { describe, it, expect, beforeEach } from "vitest";
import { EntityStore } from "./entity-store.js";
import { createEntityId, normalizeName } from "./normalize.js";
import type { Player, Team, Game, ProviderEntityRef } from "./types.js";

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: createEntityId({ type: "player", sport: "nba", keys: ["james", "lebron"] }),
    externalIds: [],
    name: normalizeName("LeBron James"),
    sport: "nba",
    position: "SF",
    team: createEntityId({ type: "team", sport: "nba", keys: ["lal"] }),
    status: "active",
    metadata: {},
    ...overrides,
  };
}

function makeTeam(overrides: Partial<Team> = {}): Team {
  return {
    id: createEntityId({ type: "team", sport: "nba", keys: ["lal"] }),
    externalIds: [],
    sport: "nba",
    league: createEntityId({ type: "league", sport: "nba", keys: ["nba"] }),
    name: "Los Angeles Lakers",
    abbreviation: "LAL",
    city: "Los Angeles",
    venue: "Crypto.com Arena",
    metadata: {},
    ...overrides,
  };
}

function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    id: createEntityId({ type: "game", sport: "nba", keys: ["lal", "bos", "2026-01-15"] }),
    externalIds: [],
    sport: "nba",
    league: createEntityId({ type: "league", sport: "nba", keys: ["nba"] }),
    season: "2025-26",
    week: null,
    homeTeam: createEntityId({ type: "team", sport: "nba", keys: ["lal"] }),
    awayTeam: createEntityId({ type: "team", sport: "nba", keys: ["bos"] }),
    scheduledAt: new Date("2026-01-15T19:30:00Z"),
    status: "scheduled",
    score: null,
    venue: "Crypto.com Arena",
    ...overrides,
  };
}

const ESPN_REF: ProviderEntityRef = {
  provider: "espn",
  externalId: "1966",
  confidence: 1.0,
  lastVerified: new Date("2026-01-01"),
};

const YAHOO_REF: ProviderEntityRef = {
  provider: "yahoo",
  externalId: "lebron-james",
  confidence: 0.98,
  lastVerified: new Date("2026-01-01"),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("EntityStore", () => {
  let store: EntityStore;

  beforeEach(() => {
    store = new EntityStore();
  });

  // ── Registration ───────────────────────────────────────────────────────────

  describe("registerPlayer", () => {
    it("stores a player and increments size", () => {
      store.registerPlayer(makePlayer());
      expect(store.size()).toBe(1);
    });

    it("updates existing player on re-registration", () => {
      const player = makePlayer();
      store.registerPlayer(player);
      const updated = { ...player, position: "PF" } as Player;
      store.registerPlayer(updated);
      const found = store.findById(player.id) as Player;
      expect(found.position).toBe("PF");
      expect(store.size()).toBe(1);
    });

    it("indexes provider refs at registration time", () => {
      const player = makePlayer({ externalIds: [ESPN_REF] });
      store.registerPlayer(player);
      expect(store.findByProviderRef("espn", "1966")).toBeTruthy();
    });
  });

  describe("registerTeam", () => {
    it("stores a team", () => {
      store.registerTeam(makeTeam());
      expect(store.size()).toBe(1);
    });
  });

  describe("registerGame", () => {
    it("stores a game", () => {
      store.registerGame(makeGame());
      expect(store.size()).toBe(1);
    });
  });

  // ── findById ───────────────────────────────────────────────────────────────

  describe("findById", () => {
    it("returns entity for known ID", () => {
      const player = makePlayer();
      store.registerPlayer(player);
      expect(store.findById(player.id)).toEqual(player);
    });

    it("returns null for unknown ID", () => {
      const unknownId = createEntityId({ type: "player", sport: "nba", keys: ["unknown"] });
      expect(store.findById(unknownId)).toBeNull();
    });
  });

  // ── findByProviderRef ──────────────────────────────────────────────────────

  describe("findByProviderRef", () => {
    it("finds entity by provider reference", () => {
      const player = makePlayer({ externalIds: [ESPN_REF] });
      store.registerPlayer(player);
      const found = store.findByProviderRef("espn", "1966");
      expect(found).toEqual(player);
    });

    it("returns null for unknown provider ref", () => {
      expect(store.findByProviderRef("espn", "99999")).toBeNull();
    });

    it("finds entity by any of multiple provider refs", () => {
      const player = makePlayer({ externalIds: [ESPN_REF, YAHOO_REF] });
      store.registerPlayer(player);
      expect(store.findByProviderRef("yahoo", "lebron-james")).toEqual(player);
    });
  });

  // ── linkProviderRef ────────────────────────────────────────────────────────

  describe("linkProviderRef", () => {
    it("adds a new provider ref to an existing entity", () => {
      const player = makePlayer({ externalIds: [ESPN_REF] });
      store.registerPlayer(player);
      store.linkProviderRef(player.id, YAHOO_REF);
      expect(store.findByProviderRef("yahoo", "lebron-james")).toBeTruthy();
    });

    it("updates an existing provider ref", () => {
      const player = makePlayer({ externalIds: [ESPN_REF] });
      store.registerPlayer(player);
      const updatedRef: ProviderEntityRef = { ...ESPN_REF, confidence: 0.75 };
      store.linkProviderRef(player.id, updatedRef);
      const refs = store.getProviderRefs(player.id);
      const espnRef = refs.find((r) => r.provider === "espn");
      expect(espnRef?.confidence).toBe(0.75);
    });

    it("does nothing for unknown entity ID", () => {
      const unknownId = createEntityId({ type: "player", sport: "nba", keys: ["ghost"] });
      expect(() => store.linkProviderRef(unknownId, ESPN_REF)).not.toThrow();
    });
  });

  // ── getProviderRefs ────────────────────────────────────────────────────────

  describe("getProviderRefs", () => {
    it("returns all provider refs for an entity", () => {
      const player = makePlayer({ externalIds: [ESPN_REF, YAHOO_REF] });
      store.registerPlayer(player);
      const refs = store.getProviderRefs(player.id);
      expect(refs).toHaveLength(2);
    });

    it("returns empty array for unknown entity", () => {
      const unknownId = createEntityId({ type: "player", sport: "nba", keys: ["ghost"] });
      expect(store.getProviderRefs(unknownId)).toEqual([]);
    });
  });

  // ── findPlayersByName ──────────────────────────────────────────────────────

  describe("findPlayersByName", () => {
    it("finds a player by exact name", () => {
      store.registerPlayer(makePlayer());
      const results = store.findPlayersByName("LeBron James");
      expect(results).toHaveLength(1);
      expect(results[0].confidence).toBe(1.0);
    });

    it("finds a player by 'Last, First' alias", () => {
      store.registerPlayer(makePlayer());
      const results = store.findPlayersByName("James, LeBron");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].confidence).toBeGreaterThanOrEqual(0.9);
    });

    it("finds a player by first initial + last name", () => {
      store.registerPlayer(makePlayer());
      // L. James vs LeBron James
      const results = store.findPlayersByName("Larry James");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].confidence).toBe(0.85);
    });

    it("filters by sport", () => {
      const nbaPlayer = makePlayer({ sport: "nba" });
      const nflPlayer = makePlayer({
        id: createEntityId({ type: "player", sport: "nfl", keys: ["james", "lebron"] }),
        sport: "nfl",
      });
      store.registerPlayer(nbaPlayer);
      store.registerPlayer(nflPlayer);
      const results = store.findPlayersByName("LeBron James", { sport: "nfl" });
      expect(results).toHaveLength(1);
      expect((results[0].player as Player).sport).toBe("nfl");
    });

    it("respects minConfidence option", () => {
      store.registerPlayer(makePlayer());
      const results = store.findPlayersByName("LeBron James", { minConfidence: 1.0 });
      expect(results.every((r) => r.confidence === 1.0)).toBe(true);
    });

    it("returns results sorted by confidence descending", () => {
      const curry = makePlayer({
        id: createEntityId({ type: "player", sport: "nba", keys: ["curry", "stephen"] }),
        name: normalizeName("Stephen Curry"),
      });
      const james = makePlayer();
      store.registerPlayer(curry);
      store.registerPlayer(james);
      const results = store.findPlayersByName("LeBron James");
      if (results.length > 1) {
        expect(results[0].confidence).toBeGreaterThanOrEqual(results[1].confidence);
      }
    });

    it("skips non-player entities", () => {
      store.registerTeam(makeTeam());
      const results = store.findPlayersByName("Los Angeles");
      expect(results).toHaveLength(0);
    });

    it("returns empty array when no match found", () => {
      store.registerPlayer(makePlayer());
      const results = store.findPlayersByName("Definitely Notaplayername", { minConfidence: 0.9 });
      expect(results).toHaveLength(0);
    });
  });

  // ── getAll* methods ────────────────────────────────────────────────────────

  describe("getAllPlayers", () => {
    it("returns only player entities", () => {
      store.registerPlayer(makePlayer());
      store.registerTeam(makeTeam());
      expect(store.getAllPlayers()).toHaveLength(1);
    });
  });

  describe("getAllTeams", () => {
    it("returns only team entities", () => {
      store.registerPlayer(makePlayer());
      store.registerTeam(makeTeam());
      expect(store.getAllTeams()).toHaveLength(1);
    });
  });

  describe("getAllGames", () => {
    it("returns only game entities", () => {
      store.registerGame(makeGame());
      store.registerTeam(makeTeam());
      expect(store.getAllGames()).toHaveLength(1);
    });
  });

  describe("getAll", () => {
    it("returns all registered entities", () => {
      store.registerPlayer(makePlayer());
      store.registerTeam(makeTeam());
      store.registerGame(makeGame());
      expect(store.getAll()).toHaveLength(3);
    });
  });

  // ── mergeEntities ──────────────────────────────────────────────────────────

  describe("mergeEntities", () => {
    it("transfers provider refs from duplicate to canonical", () => {
      const canonical = makePlayer({ externalIds: [ESPN_REF] });
      const duplicate = makePlayer({
        id: createEntityId({ type: "player", sport: "nba", keys: ["james", "lebron", "dup"] }),
        externalIds: [YAHOO_REF],
      });
      store.registerPlayer(canonical);
      store.registerPlayer(duplicate);

      const merged = store.mergeEntities(canonical.id, duplicate.id);
      expect(merged).toBe(true);
      expect(store.size()).toBe(1);
      expect(store.findByProviderRef("yahoo", "lebron-james")).toBeTruthy();
    });

    it("returns false when canonical does not exist", () => {
      const ghost = createEntityId({ type: "player", sport: "nba", keys: ["ghost"] });
      const player = makePlayer();
      store.registerPlayer(player);
      expect(store.mergeEntities(ghost, player.id)).toBe(false);
    });

    it("returns false when duplicate does not exist", () => {
      const ghost = createEntityId({ type: "player", sport: "nba", keys: ["ghost"] });
      const player = makePlayer();
      store.registerPlayer(player);
      expect(store.mergeEntities(player.id, ghost)).toBe(false);
    });
  });

  // ── clear ──────────────────────────────────────────────────────────────────

  describe("clear", () => {
    it("removes all entities and provider index", () => {
      const player = makePlayer({ externalIds: [ESPN_REF] });
      store.registerPlayer(player);
      store.clear();
      expect(store.size()).toBe(0);
      expect(store.findById(player.id)).toBeNull();
      expect(store.findByProviderRef("espn", "1966")).toBeNull();
    });
  });
});
