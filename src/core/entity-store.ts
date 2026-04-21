import type {
  EntityId,
  Player,
  Team,
  Game,
  ProviderEntityRef,
  DataProvider,
  Sport,
} from "./types.js";
import { normalizeName, matchConfidence, providerKey } from "./normalize.js";

export type StoredEntity = Player | Team | Game;
export type EntityKind = "player" | "team" | "game";

interface EntityRecord {
  id: EntityId;
  kind: EntityKind;
  data: StoredEntity;
  providerRefs: Map<string, ProviderEntityRef>; // key: providerKey(provider, externalId)
}

export interface PlayerMatch {
  player: Player;
  confidence: number;
}

/**
 * In-memory registry for all normalized entities.
 *
 * Responsibilities:
 *   - Store and update Player, Team, and Game entities by EntityId
 *   - Index entities by provider-specific IDs for fast cross-reference lookups
 *   - Find players by name with confidence scoring for deduplication
 *   - Merge provider refs when the same entity appears from multiple sources
 */
export class EntityStore {
  private records = new Map<EntityId, EntityRecord>();
  private providerIdx = new Map<string, EntityId>();

  // ── Registration ──────────────────────────────────────────────────────────

  registerPlayer(player: Player): void {
    this.upsert("player", player);
  }

  registerTeam(team: Team): void {
    this.upsert("team", team);
  }

  registerGame(game: Game): void {
    this.upsert("game", game);
  }

  private upsert(kind: EntityKind, entity: StoredEntity): void {
    const existing = this.records.get(entity.id);
    if (existing) {
      existing.data = entity;
      for (const ref of entity.externalIds) {
        this.addRef(existing, ref);
      }
    } else {
      const record: EntityRecord = {
        id: entity.id,
        kind,
        data: entity,
        providerRefs: new Map(),
      };
      for (const ref of entity.externalIds) {
        this.addRef(record, ref);
      }
      this.records.set(entity.id, record);
    }
  }

  // ── Provider ref linking ───────────────────────────────────────────────────

  /**
   * Associates a provider-specific ID with an existing entity.
   * Safe to call multiple times — updates the ref if already present.
   */
  linkProviderRef(entityId: EntityId, ref: ProviderEntityRef): void {
    const record = this.records.get(entityId);
    if (!record) return;
    this.addRef(record, ref);
  }

  private addRef(record: EntityRecord, ref: ProviderEntityRef): void {
    const key = providerKey(ref.provider, ref.externalId);
    record.providerRefs.set(key, ref);
    this.providerIdx.set(key, record.id);
  }

  // ── Lookups ────────────────────────────────────────────────────────────────

  findById(id: EntityId): StoredEntity | null {
    return this.records.get(id)?.data ?? null;
  }

  findByProviderRef(provider: DataProvider, externalId: string): StoredEntity | null {
    const key = providerKey(provider, externalId);
    const entityId = this.providerIdx.get(key);
    if (!entityId) return null;
    return this.findById(entityId);
  }

  getProviderRefs(id: EntityId): ProviderEntityRef[] {
    const record = this.records.get(id);
    if (!record) return [];
    return Array.from(record.providerRefs.values());
  }

  /**
   * Searches players by name using confidence scoring.
   * Returns matches above the given threshold (default 0.5), sorted by confidence descending.
   */
  findPlayersByName(
    rawName: string,
    options: { sport?: Sport; minConfidence?: number } = {}
  ): PlayerMatch[] {
    const { sport, minConfidence = 0.5 } = options;
    const query = normalizeName(rawName);
    const results: PlayerMatch[] = [];

    for (const record of this.records.values()) {
      if (record.kind !== "player") continue;
      const player = record.data as Player;
      if (sport && player.sport !== sport) continue;

      const confidence = matchConfidence(query, player.name);
      if (confidence >= minConfidence) {
        results.push({ player, confidence });
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  getAllPlayers(): Player[] {
    return this.getByKind("player") as Player[];
  }

  getAllTeams(): Team[] {
    return this.getByKind("team") as Team[];
  }

  getAllGames(): Game[] {
    return this.getByKind("game") as Game[];
  }

  getAll(): StoredEntity[] {
    return Array.from(this.records.values()).map((r) => r.data);
  }

  private getByKind(kind: EntityKind): StoredEntity[] {
    return Array.from(this.records.values())
      .filter((r) => r.kind === kind)
      .map((r) => r.data);
  }

  // ── Deduplication ──────────────────────────────────────────────────────────

  /**
   * Merges two entity records, transferring all provider refs from the
   * duplicate into the canonical entity, then removing the duplicate.
   * Use this when entity resolution determines two records are the same entity.
   */
  mergeEntities(canonicalId: EntityId, duplicateId: EntityId): boolean {
    const canonical = this.records.get(canonicalId);
    const duplicate = this.records.get(duplicateId);
    if (!canonical || !duplicate) return false;

    for (const ref of duplicate.providerRefs.values()) {
      this.addRef(canonical, ref);
    }

    this.records.delete(duplicateId);
    return true;
  }

  // ── Utility ────────────────────────────────────────────────────────────────

  size(): number {
    return this.records.size;
  }

  clear(): void {
    this.records.clear();
    this.providerIdx.clear();
  }
}
