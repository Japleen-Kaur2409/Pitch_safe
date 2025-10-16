// src/services/gameRecordService.js
// This layer handles ALL communication with the backend

const API_BASE_URL = 'http://localhost:5001/api';

export const gameRecordService = {
  // Add a new game record
  addGameRecord: async (gameRecord) => {
    try {
      console.log('Sending game record:', gameRecord);
      console.log('Request URL:', `${API_BASE_URL}/games`);
      
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameRecord),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to add game record: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Success! Record created:', data);
      return data;
    } catch (error) {
      console.error('Error adding game record:', error);
      throw error;
    }
  },

  // Get all game records for a player
  getPlayerGameRecords: async (playerId) => {
    try {
      console.log('Fetching records for player:', playerId);
      
      const response = await fetch(`${API_BASE_URL}/games/player/${playerId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch game records: ${response.status}`);
      }

      const data = await response.json();
      console.log('Game records fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching game records:', error);
      throw error;
    }
  },
};