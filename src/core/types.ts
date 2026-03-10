/**
 * Core type definitions for sport_enginuity
 *
 * These types define the normalized data model that sits at the center
 * of the platform. All data from upstream providers is normalized into
 * these types, and all three interfaces (API, CLI, chatbot) consume them.
 */

// ============================================================
// Universal Entity IDs
// ============================================================

/**
 * Universal Entity ID — the core differentiator.
 * Every player, team, and game gets a stable ID that persists
 * across providers, seasons, trades, and name changes.
 */
export type EntityId = string & { readonly __brand: "EntityId" };

/** Provider-specific ID with source attribution */
export interface ProviderEntityRef {
  provider: DataProvider;
  externalId: string;
  confidence: number; // 0-1, how confident the match is
  lastVerified: Date;
}

/** Supported data providers */
export type DataProvider =
  | "espn"
  | "yahoo"
  | "sportsdata"
  | "the_odds_api"
  | "api_sports"
  | "sportmonks"
  | "balldontlie"
  | "internal";

// ============================================================
// Sports & Leagues
// ============================================================

export type Sport =
  | "nfl"
  | "nba"
  | "mlb"
  | "nhl"
  | "epl"
  | "wnba"
  | "nwsl"
  | "ncaaf"
  | "ncaab"
  | "mls";

export interface League {
  id: EntityId;
  sport: Sport;
  name: string;
  abbreviation: string;
  country: string;
  currentSeason: string;
}

// ============================================================
// Core Entities
// ============================================================

export interface Player {
  id: EntityId;
  externalIds: ProviderEntityRef[];
  name: NormalizedName;
  sport: Sport;
  position: string;
  team: EntityId | null; // null if free agent
  status: PlayerStatus;
  metadata: Record<string, unknown>;
}

export interface NormalizedName {
  full: string;
  first: string;
  last: string;
  display: string; // "P. Mahomes" style
  aliases: string[]; // alternative spellings, nicknames
}

export type PlayerStatus = "active" | "injured" | "suspended" | "retired" | "free_agent";

export interface Team {
  id: EntityId;
  externalIds: ProviderEntityRef[];
  sport: Sport;
  league: EntityId;
  name: string;
  abbreviation: string;
  city: string;
  venue: string | null;
  metadata: Record<string, unknown>;
}

export interface Game {
  id: EntityId;
  externalIds: ProviderEntityRef[];
  sport: Sport;
  league: EntityId;
  season: string;
  week: number | null;
  homeTeam: EntityId;
  awayTeam: EntityId;
  scheduledAt: Date;
  status: GameStatus;
  score: GameScore | null;
  venue: string | null;
}

export type GameStatus =
  | "scheduled"
  | "in_progress"
  | "final"
  | "postponed"
  | "cancelled";

export interface GameScore {
  home: number;
  away: number;
  periods: { home: number; away: number }[];
}

// ============================================================
// Correlated Data Types
// ============================================================

/** Stats — Core performance data */
export interface PlayerStats {
  playerId: EntityId;
  gameId: EntityId | null; // null for season aggregates
  season: string;
  week: number | null;
  sport: Sport;
  stats: Record<string, number | string>;
  source: DataProvider;
  updatedAt: Date;
}

/** Fantasy — Projections and scoring */
export interface FantasyData {
  playerId: EntityId;
  sport: Sport;
  season: string;
  week: number | null;
  projections: FantasyProjection[];
  ownership: OwnershipData | null;
  adp: number | null;
  scoring: Record<string, number>; // format -> points
}

export interface FantasyProjection {
  source: string;
  format: "standard" | "ppr" | "half_ppr";
  projectedPoints: number;
  stats: Record<string, number>;
  updatedAt: Date;
}

export interface OwnershipData {
  espn: number | null;
  yahoo: number | null;
  sleeper: number | null;
}

/** Betting — Odds and lines */
export interface BettingData {
  gameId: EntityId;
  sport: Sport;
  market: BettingMarket;
  lines: BookmakerLine[];
  consensus: ConsensusLine | null;
  updatedAt: Date;
}

export type BettingMarket =
  | "spread"
  | "moneyline"
  | "total"
  | "player_prop"
  | "futures";

export interface BookmakerLine {
  bookmaker: string;
  odds: OddsFormat;
  line: number | null; // spread or total
  updatedAt: Date;
}

export interface OddsFormat {
  american: number;
  decimal: number;
  fractional: string;
  impliedProbability: number;
}

export interface ConsensusLine {
  odds: OddsFormat;
  line: number | null;
  bookmakerCount: number;
}

// ============================================================
// Correlated Entity — The unified view
// ============================================================

/**
 * The whole point of sport_enginuity: a single entity with
 * stats, fantasy, and betting data correlated via universal IDs.
 */
export interface CorrelatedPlayerData {
  player: Player;
  stats: PlayerStats[];
  fantasy: FantasyData | null;
  betting: BettingData[];
}

export interface CorrelatedGameData {
  game: Game;
  homeTeam: Team;
  awayTeam: Team;
  playerStats: PlayerStats[];
  betting: BettingData[];
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T;
  meta: {
    sport: Sport;
    season: string;
    totalResults: number;
    page: number;
    perPage: number;
    entityIdVersion: string;
  };
  _links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: string | null;
    documentation: string;
  };
  status: number;
}

// ============================================================
// Provider Adapter Interface
// ============================================================

/**
 * Every data provider implements this interface.
 * The normalization engine calls these methods and maps
 * the results into the canonical types above.
 */
export interface ProviderAdapter {
  readonly provider: DataProvider;
  readonly supportedSports: Sport[];

  fetchPlayers(sport: Sport, season: string): Promise<RawPlayerData[]>;
  fetchTeams(sport: Sport, season: string): Promise<RawTeamData[]>;
  fetchGames(sport: Sport, season: string, week?: number): Promise<RawGameData[]>;
  fetchPlayerStats(sport: Sport, season: string, week?: number): Promise<RawPlayerStatsData[]>;
  fetchOdds?(sport: Sport, gameId: string): Promise<RawOddsData[]>;
  fetchFantasy?(sport: Sport, season: string, week?: number): Promise<RawFantasyData[]>;
}

// Raw data types — provider-specific, pre-normalization
export interface RawPlayerData {
  externalId: string;
  name: string;
  team: string;
  position: string;
  raw: Record<string, unknown>;
}

export interface RawTeamData {
  externalId: string;
  name: string;
  abbreviation: string;
  raw: Record<string, unknown>;
}

export interface RawGameData {
  externalId: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: string;
  status: string;
  raw: Record<string, unknown>;
}

export interface RawPlayerStatsData {
  playerExternalId: string;
  gameExternalId: string | null;
  stats: Record<string, number | string>;
  raw: Record<string, unknown>;
}

export interface RawOddsData {
  gameExternalId: string;
  bookmaker: string;
  market: string;
  odds: number;
  line: number | null;
  raw: Record<string, unknown>;
}

export interface RawFantasyData {
  playerExternalId: string;
  source: string;
  projectedPoints: number;
  stats: Record<string, number>;
  raw: Record<string, unknown>;
}
