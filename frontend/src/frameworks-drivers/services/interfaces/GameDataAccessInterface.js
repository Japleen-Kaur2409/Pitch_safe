// frontend/src/frameworks-drivers/services/interfaces/GameDataAccessInterface.js
class GameDataAccessInterface {
  async addGameRecord(gameRecord) {
    throw new Error('Method not implemented: addGameRecord');
  }

  async getPlayerGames(playerId) {
    throw new Error('Method not implemented: getPlayerGames');
  }

  async getGameRecord(recordId) {
    throw new Error('Method not implemented: getGameRecord');
  }

  async updateGameRecord(recordId, gameRecord) {
    throw new Error('Method not implemented: updateGameRecord');
  }

  async deleteGameRecord(recordId) {
    throw new Error('Method not implemented: deleteGameRecord');
  }
}

export default GameDataAccessInterface;