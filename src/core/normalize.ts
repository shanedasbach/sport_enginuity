import { createHash } from "crypto";
import type { EntityId, NormalizedName, DataProvider, Sport } from "./types.js";

export type EntityType = "player" | "team" | "game" | "league";

export interface EntityIdInput {
  type: EntityType;
  sport: Sport;
  /** Stable key fields used to generate the hash (e.g. last name + first name) */
  keys: string[];
}

const SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv", "v"]);

/**
 * Generates a deterministic, stable EntityId from the given inputs.
 * The hash is based on normalized key fields, so the same entity always
 * produces the same ID regardless of provider or input formatting.
 */
export function createEntityId(input: EntityIdInput): EntityId {
  const normalized = input.keys.map((k) =>
    k
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
  );
  const payload = `${input.type}|${input.sport}|${normalized.join("|")}`;
  const hash = createHash("sha256").update(payload).digest("hex").slice(0, 12);
  return `${input.type}-${input.sport}-${hash}` as EntityId;
}

/**
 * Normalizes a raw player name into structured NormalizedName.
 * Handles:
 *   - "Last, First" format
 *   - Accent characters (José → Jose)
 *   - Suffixes (Jr., Sr., II, III)
 *   - Single-word names
 */
export function normalizeName(rawName: string): NormalizedName {
  let name = rawName.trim();

  // Handle "Last, First [suffix]" format — move suffix to end before reassembling
  if (name.includes(",")) {
    const commaIdx = name.indexOf(",");
    const last = name.slice(0, commaIdx).trim();
    const firstPart = name.slice(commaIdx + 1).trim();
    const firstParts = firstPart.split(/\s+/);
    const maybeFirstSuffix = firstParts[firstParts.length - 1]?.toLowerCase().replace(/\.$/, "");
    if (maybeFirstSuffix && SUFFIXES.has(maybeFirstSuffix) && firstParts.length > 1) {
      const firstName = firstParts.slice(0, -1).join(" ");
      name = `${firstName} ${last} ${firstParts[firstParts.length - 1]}`;
    } else {
      name = `${firstPart} ${last}`;
    }
  }

  // Strip accents
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Normalize internal whitespace
  const parts = name.split(/\s+/).filter(Boolean);

  // Detect and strip suffix
  let suffix = "";
  const lastPart = parts[parts.length - 1]?.toLowerCase().replace(/\.$/, "");
  if (lastPart && SUFFIXES.has(lastPart)) {
    suffix = parts.pop()!.replace(/\.$/, "");
  }

  if (parts.length === 0) {
    return { full: rawName, first: rawName, last: "", display: rawName, aliases: [] };
  }

  if (parts.length === 1) {
    const solo = parts[0];
    return { full: solo, first: solo, last: "", display: solo, aliases: [] };
  }

  const first = parts[0];
  const last = parts.slice(1).join(" ");
  const canonical = suffix ? `${first} ${last} ${suffix}` : `${first} ${last}`;
  const display = `${first[0]}. ${last}`;

  const aliases: string[] = [];
  // Always include "Last, First" as alias
  aliases.push(`${last}, ${first}`);
  if (suffix) {
    // "First Last" without suffix
    aliases.push(`${first} ${last}`);
  }

  return {
    full: canonical,
    first,
    last,
    display,
    aliases,
  };
}

/**
 * Calculates a confidence score (0–1) for how likely two NormalizedNames
 * refer to the same entity.
 *
 * Rules (checked in order):
 *   1.0  — exact full name match (case-insensitive)
 *   0.95 — alias cross-match
 *   0.90 — last name + first name exact match (different casing/suffix)
 *   0.85 — last name match + first initial match
 *   0.60 — last name only match
 *   0.0  — no match
 */
export function matchConfidence(a: NormalizedName, b: NormalizedName): number {
  const aFull = a.full.toLowerCase();
  const bFull = b.full.toLowerCase();

  if (aFull === bFull) return 1.0;

  const aAll = [aFull, ...a.aliases.map((x) => x.toLowerCase())];
  const bAll = [bFull, ...b.aliases.map((x) => x.toLowerCase())];

  // Check if any alias from a matches any alias from b
  for (const aVal of aAll) {
    if (bAll.includes(aVal)) return 0.95;
  }

  const aFirst = a.first.toLowerCase();
  const bFirst = b.first.toLowerCase();
  const aLast = a.last.toLowerCase();
  const bLast = b.last.toLowerCase();

  if (aLast && bLast && aLast === bLast) {
    if (aFirst === bFirst) return 0.90;
    if (aFirst[0] === bFirst[0]) return 0.85;
    return 0.60;
  }

  return 0;
}

/**
 * Returns the provider index key used to look up entities by provider ref.
 */
export function providerKey(provider: DataProvider, externalId: string): string {
  return `${provider}:${externalId}`;
}
