// frontend/src/frameworks-drivers/services/gameRecordService.js
class GameRecordService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async addGameRecord(gameRecordData) {
    try {
      const response = await this.apiService.post('/api/games', gameRecordData);
      return response;
    } catch (error) {
      console.error('Error adding game record:', error);
      throw new Error(`Failed to add game record: ${error.message}`);
    }
  }

  async getPlayerGames(playerId) {
    try {
      const response = await this.apiService.get(`/api/games/player/${playerId}`);
      return response;
    } catch (error) {
      console.error('Error fetching player games:', error);
      throw new Error(`Failed to fetch player games: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const apiService = {
  post: async (endpoint, data) => {
    const response = await fetch(`http://localhost:5001${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  get: async (endpoint) => {
    const response = await fetch(`http://localhost:5001${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};

export const gameRecordService = new GameRecordService(apiService);