import type { BdlListResponse, BdlPlayer, BdlTeam, BdlGame, BdlStats } from "./types.js";

export interface BdlClientOptions {
  apiKey?: string;
  baseUrl?: string;
  /** Minimum ms between requests to stay under 60 req/min rate limit */
  rateLimitMs?: number;
  /** Injectable fetch for testing */
  fetch?: typeof globalThis.fetch;
}

export class BdlClient {
  private apiKey: string;
  private baseUrl: string;
  private rateLimitMs: number;
  private fetchFn: typeof globalThis.fetch;
  private lastRequestAt = 0;

  constructor(options: BdlClientOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.BALLDONTLIE_API_KEY ?? "";
    this.baseUrl = options.baseUrl ?? "https://api.balldontlie.io/v1";
    this.rateLimitMs = options.rateLimitMs ?? 1100; // ~55 req/min safety margin
    this.fetchFn = options.fetch ?? globalThis.fetch;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestAt;
    if (this.lastRequestAt > 0 && elapsed < this.rateLimitMs) {
      await new Promise((resolve) => setTimeout(resolve, this.rateLimitMs - elapsed));
    }
    this.lastRequestAt = Date.now();
  }

  private async get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    await this.throttle();

    const url = new URL(`${this.baseUrl}${path}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) headers["Authorization"] = this.apiKey;

    const response = await this.fetchFn(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`balldontlie API error ${response.status}: ${await response.text()}`);
    }
    return response.json() as Promise<T>;
  }

  private async fetchAllPages<T>(
    path: string,
    params: Record<string, string | number> = {}
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;

    while (true) {
      const res = await this.get<BdlListResponse<T>>(path, { ...params, per_page: 100, page });
      results.push(...res.data);
      if (!res.meta.next_page) break;
      page++;
    }

    return results;
  }

  async getPlayers(): Promise<BdlPlayer[]> {
    return this.fetchAllPages<BdlPlayer>("/players");
  }

  async getTeams(): Promise<BdlTeam[]> {
    return this.fetchAllPages<BdlTeam>("/teams");
  }

  async getGames(season: number): Promise<BdlGame[]> {
    return this.fetchAllPages<BdlGame>("/games", { seasons: season });
  }

  async getStats(season: number, page = 1, perPage = 100): Promise<BdlListResponse<BdlStats>> {
    return this.get<BdlListResponse<BdlStats>>("/stats", {
      seasons: season,
      per_page: perPage,
      page,
    });
  }
}
