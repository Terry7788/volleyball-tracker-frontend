export interface SetScore {
  id: number;
  setNumber: number;
  team1Points: number;
  team2Points: number;
}

export interface Match {
  id: number;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  team1Sets: number;
  team2Sets: number;
  currentSet: number;
  status: MatchStatus;
  createdAt: string;
  sets: SetScore[];
}

export type MatchStatus = 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';

export type TeamType = 'team1' | 'team2';

export interface CreateMatchRequest {
  team1Name: string;
  team2Name: string;
}

export interface ScoreUpdateRequest {
  team: TeamType;
}