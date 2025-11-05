// backend/frameworks-drivers/data/interfaces/gameDataAccessInterface.js
class GameDataAccessInterface {
  async addGameRecord(gameRecord) {
    throw new Error('Method not implemented');
  }

  async getPlayerGames(playerId) {
    throw new Error('Method not implemented');
  }

  async getGameById(gameId) {
    throw new Error('Method not implemented');
  }
}

module.exports = GameDataAccessInterface;