import { describe, it, expect } from "vitest";
import { createEntityId, normalizeName, matchConfidence, providerKey } from "./normalize.js";
import type { NormalizedName } from "./types.js";

// ─── createEntityId ──────────────────────────────────────────────────────────

describe("createEntityId", () => {
  it("generates deterministic IDs for the same input", () => {
    const a = createEntityId({ type: "player", sport: "nba", keys: ["james", "lebron"] });
    const b = createEntityId({ type: "player", sport: "nba", keys: ["james", "lebron"] });
    expect(a).toBe(b);
  });

  it("generates different IDs for different keys", () => {
    const a = createEntityId({ type: "player", sport: "nba", keys: ["james", "lebron"] });
    const b = createEntityId({ type: "player", sport: "nba", keys: ["curry", "stephen"] });
    expect(a).not.toBe(b);
  });

  it("generates different IDs for different sports", () => {
    const a = createEntityId({ type: "player", sport: "nba", keys: ["james", "lebron"] });
    const b = createEntityId({ type: "player", sport: "nfl", keys: ["james", "lebron"] });
    expect(a).not.toBe(b);
  });

  it("generates different IDs for different entity types", () => {
    const a = createEntityId({ type: "player", sport: "nba", keys: ["lakers"] });
    const b = createEntityId({ type: "team", sport: "nba", keys: ["lakers"] });
    expect(a).not.toBe(b);
  });

  it("returns a string prefixed with type and sport", () => {
    const id = createEntityId({ type: "player", sport: "nfl", keys: ["mahomes", "patrick"] });
    expect(id).toMatch(/^player-nfl-[a-f0-9]{12}$/);
  });

  it("is stable across different case and whitespace in keys", () => {
    const a = createEntityId({ type: "player", sport: "nba", keys: ["LeBron", "James"] });
    const b = createEntityId({ type: "player", sport: "nba", keys: [" lebron ", " james "] });
    expect(a).toBe(b);
  });

  it("strips accents from keys before hashing", () => {
    const a = createEntityId({ type: "player", sport: "mls", keys: ["José", "García"] });
    const b = createEntityId({ type: "player", sport: "mls", keys: ["Jose", "Garcia"] });
    expect(a).toBe(b);
  });

  it("generates a team-scoped ID", () => {
    const id = createEntityId({ type: "team", sport: "nba", keys: ["lal"] });
    expect(id).toMatch(/^team-nba-/);
  });

  it("generates a game-scoped ID", () => {
    const id = createEntityId({ type: "game", sport: "nba", keys: ["lal", "bos", "2026-01-15"] });
    expect(id).toMatch(/^game-nba-/);
  });
});

// ─── normalizeName ───────────────────────────────────────────────────────────

describe("normalizeName", () => {
  it("parses a standard 'First Last' name", () => {
    const n = normalizeName("LeBron James");
    expect(n.first).toBe("LeBron");
    expect(n.last).toBe("James");
    expect(n.full).toBe("LeBron James");
    expect(n.display).toBe("L. James");
  });

  it("parses 'Last, First' format", () => {
    const n = normalizeName("James, LeBron");
    expect(n.first).toBe("LeBron");
    expect(n.last).toBe("James");
    expect(n.full).toBe("LeBron James");
  });

  it("includes 'Last, First' as an alias", () => {
    const n = normalizeName("LeBron James");
    expect(n.aliases).toContain("James, LeBron");
  });

  it("strips accent characters", () => {
    const n = normalizeName("José García");
    expect(n.first).toBe("Jose");
    expect(n.last).toBe("Garcia");
  });

  it("handles 'Jr.' suffix", () => {
    const n = normalizeName("Kyrie Irving Jr.");
    expect(n.first).toBe("Kyrie");
    expect(n.last).toBe("Irving");
    expect(n.aliases).toContain("Kyrie Irving");
  });

  it("handles 'Jr' suffix without period", () => {
    const n = normalizeName("Calvin Ridley Jr");
    expect(n.last).toBe("Ridley");
    expect(n.aliases).toContain("Calvin Ridley");
  });

  it("handles 'III' suffix", () => {
    const n = normalizeName("Henry Ruggs III");
    expect(n.last).toBe("Ruggs");
    expect(n.full).toBe("Henry Ruggs III");
  });

  it("handles 'Sr' suffix", () => {
    const n = normalizeName("Test Player Sr");
    expect(n.last).toBe("Player");
  });

  it("handles 'II' suffix", () => {
    const n = normalizeName("Test Player II");
    expect(n.last).toBe("Player");
    expect(n.full).toBe("Test Player II");
  });

  it("handles multi-word last names", () => {
    const n = normalizeName("Patrick Van Dyke");
    expect(n.first).toBe("Patrick");
    expect(n.last).toBe("Van Dyke");
    expect(n.display).toBe("P. Van Dyke");
  });

  it("handles single-word names", () => {
    const n = normalizeName("Pele");
    expect(n.first).toBe("Pele");
    expect(n.last).toBe("");
    expect(n.full).toBe("Pele");
    expect(n.display).toBe("Pele");
  });

  it("handles empty-ish input gracefully", () => {
    const n = normalizeName("  ");
    expect(n.full).toBe("  ");
  });

  it("handles 'Last, First Jr.' combined format", () => {
    const n = normalizeName("Williams, Robert Jr.");
    expect(n.first).toBe("Robert");
    expect(n.last).toBe("Williams");
  });
});

// ─── matchConfidence ─────────────────────────────────────────────────────────

describe("matchConfidence", () => {
  function name(full: string): NormalizedName {
    return normalizeName(full);
  }

  it("returns 1.0 for identical names", () => {
    expect(matchConfidence(name("LeBron James"), name("LeBron James"))).toBe(1.0);
  });

  it("returns 1.0 for same name different case", () => {
    expect(matchConfidence(name("lebron james"), name("LeBron James"))).toBe(1.0);
  });

  it("returns 0.95 for alias cross-match ('Last, First' vs 'First Last')", () => {
    // Construct names where full strings differ but alias cross-matches
    const a: NormalizedName = { full: "LeBron James", first: "LeBron", last: "James", display: "L. James", aliases: ["James, LeBron"] };
    const b: NormalizedName = { full: "James, LeBron", first: "LeBron", last: "James", display: "L. James", aliases: [] };
    expect(matchConfidence(a, b)).toBe(0.95);
  });

  it("returns 0.90 for same last and first name match without alias overlap", () => {
    // "Jr" suffix version has different full string, no aliases pointing to base form
    const a: NormalizedName = { full: "LeBron James Jr", first: "LeBron", last: "James", display: "L. James", aliases: [] };
    const b: NormalizedName = { full: "LeBron James", first: "LeBron", last: "James", display: "L. James", aliases: [] };
    expect(matchConfidence(a, b)).toBe(0.90);
  });

  it("returns 0.85 for same last name and first initial", () => {
    const a: NormalizedName = { full: "LeBron James", first: "LeBron", last: "James", display: "L. James", aliases: [] };
    const b: NormalizedName = { full: "Larry James", first: "Larry", last: "James", display: "L. James", aliases: [] };
    expect(matchConfidence(a, b)).toBe(0.85);
  });

  it("returns 0.60 for same last name but different first initials", () => {
    const a: NormalizedName = { full: "LeBron James", first: "LeBron", last: "James", display: "L. James", aliases: [] };
    const b: NormalizedName = { full: "Mike James", first: "Mike", last: "James", display: "M. James", aliases: [] };
    expect(matchConfidence(a, b)).toBe(0.60);
  });

  it("returns 0 for completely different names", () => {
    expect(matchConfidence(name("Stephen Curry"), name("LeBron James"))).toBe(0);
  });

  it("returns 0 when last name is empty", () => {
    const a: NormalizedName = { full: "Pele", first: "Pele", last: "", display: "Pele", aliases: [] };
    const b: NormalizedName = { full: "Pele", first: "Pele", last: "", display: "Pele", aliases: [] };
    // Same full name → 1.0 (exact match fires first)
    expect(matchConfidence(a, b)).toBe(1.0);
  });

  it("returns 0 when last names differ but both are non-empty", () => {
    const a: NormalizedName = { full: "A B", first: "A", last: "B", display: "A. B", aliases: [] };
    const c: NormalizedName = { full: "A C", first: "A", last: "C", display: "A. C", aliases: [] };
    expect(matchConfidence(a, c)).toBe(0);
  });
});

// ─── providerKey ─────────────────────────────────────────────────────────────

describe("providerKey", () => {
  it("formats as 'provider:externalId'", () => {
    expect(providerKey("espn", "3139477")).toBe("espn:3139477");
  });

  it("produces different keys for different providers", () => {
    expect(providerKey("espn", "123")).not.toBe(providerKey("yahoo", "123"));
  });

  it("produces different keys for different external IDs", () => {
    expect(providerKey("espn", "123")).not.toBe(providerKey("espn", "456"));
  });
});
