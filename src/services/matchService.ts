
import { api } from './authService'
import { Match, CreateMatchRequest, TeamType } from '@/types/match';

export const matchService = {
  // Get all matches (will automatically include auth headers)
  getAllMatches: async (): Promise<Match[]> => {
    const response = await api.get<Match[]>('/matches');
    return response.data;
  },

  // Get match by ID
  getMatchById: async (id: number): Promise<Match> => {
    const response = await api.get<Match>(`/matches/${id}`);
    return response.data;
  },

  // Create new match
  createMatch: async (team1Name: string, team2Name: string): Promise<Match> => {
    const request: CreateMatchRequest = { team1Name, team2Name };
    const response = await api.post<Match>('/matches', request);
    return response.data;
  },

  // Update score
  updateScore: async (matchId: number, team: TeamType): Promise<Match> => {
    const response = await api.put<Match>(`/matches/${matchId}/score`, { team });
    return response.data;
  },

  // Undo last point
  undoLastPoint: async (matchId: number): Promise<Match> => {
    const response = await api.put<Match>(`/matches/${matchId}/undo`);
    return response.data;
  },

  // Reset current set
  resetCurrentSet: async (matchId: number): Promise<Match> => {
    const response = await api.put<Match>(`/matches/${matchId}/reset-set`);
    return response.data;
  },

  // Get active matches
  getActiveMatches: async (): Promise<Match[]> => {
    const response = await api.get<Match[]>('/matches/active');
    return response.data;
  },

  // Edit completed set
  editCompletedSet: async (matchId: number, setNumber: number, team1Points: number, team2Points: number): Promise<Match> => {
    const response = await api.put<Match>(`/matches/${matchId}/sets/${setNumber}`, {
      team1Points,
      team2Points
    });
    return response.data;
  },

  // Delete match
  deleteMatch: async (matchId: number): Promise<void> => {
    await api.delete(`/matches/${matchId}`);
  },

  // Pause/Resume match
  pauseMatch: async (matchId: number): Promise<Match> => {
    const response = await api.put<Match>(`/matches/${matchId}/pause`);
    return response.data;
  },

  // Get match statistics
  getStatistics: async (): Promise<{ totalMatches: number; completedMatches: number; activeMatches: number }> => {
    const response = await api.get('/matches/statistics');
    return response.data;
  },
};