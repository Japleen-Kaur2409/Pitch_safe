// frontend/src/frameworks-drivers/services/playerService.js
import { apiService } from './apiService';

class PlayerService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getAllPlayers() {
    const response = await this.apiService.get('/api/players');
    return response;
  }

  async getPlayersByCoach(coachId) {
    try {
      const response = await this.apiService.get(`/api/players/coach/${coachId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching players for coach ${coachId}:`, error.message);
      throw error;
    }
  }

  async getPlayerInfo(playerId) {
    try {
      const response = await this.apiService.get(`/api/players/${playerId}/info`);
      return response;
    } catch (error) {
      console.warn(`Player info not found for ID ${playerId}:`, error.message);
      return {};
    }
  }
}

// Create and export singleton instance
export const playerService = new PlayerService(apiService);