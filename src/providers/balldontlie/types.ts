/** Raw types for the balldontlie API v1 responses (https://api.balldontlie.io/v1/) */

export interface BdlTeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface BdlPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string | null;
  weight: string | null;
  jersey_number: string | null;
  college: string | null;
  country: string | null;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: BdlTeam | null;
}

export interface BdlGame {
  id: number;
  date: string;
  season: number;
  status: string;
  period: number;
  time: string;
  postseason: boolean;
  home_team_score: number;
  visitor_team_score: number;
  home_team: BdlTeam;
  visitor_team: BdlTeam;
}

export interface BdlStats {
  id: number;
  min: string;
  fgm: number | null;
  fga: number | null;
  fg3m: number | null;
  fg3a: number | null;
  ftm: number | null;
  fta: number | null;
  oreb: number | null;
  dreb: number | null;
  reb: number | null;
  ast: number | null;
  stl: number | null;
  blk: number | null;
  turnover: number | null;
  pf: number | null;
  pts: number | null;
  fg_pct: number | null;
  fg3_pct: number | null;
  ft_pct: number | null;
  player: BdlPlayer;
  team: BdlTeam;
  game: BdlGame;
}

export interface BdlMeta {
  total_pages: number;
  current_page: number;
  next_page: number | null;
  per_page: number;
  total_count: number;
}

export interface BdlListResponse<T> {
  data: T[];
  meta: BdlMeta;
}
