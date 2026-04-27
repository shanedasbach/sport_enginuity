import type {
  ProviderAdapter,
  DataProvider,
  Sport,
  RawPlayerData,
  RawTeamData,
  RawGameData,
  RawPlayerStatsData,
} from "../../core/types.js";
import { BdlClient, type BdlClientOptions } from "./client.js";
import type { BdlGame, BdlPlayer, BdlTeam } from "./types.js";

const GAME_STATUS_MAP: Record<string, string> = {
  Final: "final",
  "In Progress": "in_progress",
  Scheduled: "scheduled",
};

function mapGameStatus(raw: string): string {
  return GAME_STATUS_MAP[raw] ?? "scheduled";
}

function mapPlayer(p: BdlPlayer): RawPlayerData {
  const position = p.position?.trim() || "Unknown";
  const team = p.team?.abbreviation ?? "FA";
  return {
    externalId: String(p.id),
    name: `${p.first_name} ${p.last_name}`.trim(),
    team,
    position,
    raw: p as unknown as Record<string, unknown>,
  };
}

function mapTeam(t: BdlTeam): RawTeamData {
  return {
    externalId: String(t.id),
    name: t.full_name,
    abbreviation: t.abbreviation,
    raw: t as unknown as Record<string, unknown>,
  };
}

function mapGame(g: BdlGame): RawGameData {
  const score =
    g.status === "Final"
      ? { home: g.home_team_score, away: g.visitor_team_score }
      : null;

  return {
    externalId: String(g.id),
    homeTeam: g.home_team.abbreviation,
    awayTeam: g.visitor_team.abbreviation,
    scheduledAt: g.date,
    status: mapGameStatus(g.status),
    raw: { ...g, score } as unknown as Record<string, unknown>,
  };
}

export class BalldontlieAdapter implements ProviderAdapter {
  readonly provider: DataProvider = "balldontlie";
  readonly supportedSports: Sport[] = ["nba"];

  private client: BdlClient;

  constructor(options: BdlClientOptions = {}) {
    this.client = new BdlClient(options);
  }

  async fetchPlayers(_sport: Sport, _season: string): Promise<RawPlayerData[]> {
    const players = await this.client.getPlayers();
    return players.map(mapPlayer);
  }

  async fetchTeams(_sport: Sport, _season: string): Promise<RawTeamData[]> {
    const teams = await this.client.getTeams();
    return teams.map(mapTeam);
  }

  async fetchGames(_sport: Sport, season: string): Promise<RawGameData[]> {
    const year = parseInt(season.split("-")[0], 10);
    const games = await this.client.getGames(year);
    return games.map(mapGame);
  }

  async fetchPlayerStats(_sport: Sport, season: string): Promise<RawPlayerStatsData[]> {
    const year = parseInt(season.split("-")[0], 10);
    const results: RawPlayerStatsData[] = [];
    let page = 1;

    while (true) {
      const res = await this.client.getStats(year, page);
      for (const s of res.data) {
        results.push({
          playerExternalId: String(s.player.id),
          gameExternalId: String(s.game.id),
          stats: {
            min: s.min,
            pts: s.pts ?? 0,
            reb: s.reb ?? 0,
            ast: s.ast ?? 0,
            stl: s.stl ?? 0,
            blk: s.blk ?? 0,
            fgm: s.fgm ?? 0,
            fga: s.fga ?? 0,
            fg3m: s.fg3m ?? 0,
            fg3a: s.fg3a ?? 0,
            ftm: s.ftm ?? 0,
            fta: s.fta ?? 0,
            oreb: s.oreb ?? 0,
            dreb: s.dreb ?? 0,
            turnover: s.turnover ?? 0,
            pf: s.pf ?? 0,
            fg_pct: s.fg_pct ?? 0,
            fg3_pct: s.fg3_pct ?? 0,
            ft_pct: s.ft_pct ?? 0,
          },
          raw: s as unknown as Record<string, unknown>,
        });
      }
      if (!res.meta.next_page) break;
      page++;
    }

    return results;
  }
}
