// backend/data/gameDataAccessInterface.js

class GameDataAccessInterface {
  async getAllGames() {
    throw new Error('getAllGames() not implemented');
  }

  async getGamesByPlayerId(playerId) {
    throw new Error('getGamesByPlayerId() not implemented');
  }

  async addGameRecord(gameData) {
    throw new Error('addGameRecord() not implemented');
  }

  async updateGameRecord(recordId, gameData) {
    throw new Error('updateGameRecord() not implemented');
  }

  async deleteGameRecord(recordId) {
    throw new Error('deleteGameRecord() not implemented');
  }
}

module.exports = GameDataAccessInterface;
