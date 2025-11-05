// frontend/src/frameworks-drivers/services/interfaces/PlayerDataAccessInterface.js
class PlayerDataAccessInterface {
  async getAllPlayers() {
    throw new Error('Method not implemented: getAllPlayers');
  }

  async getPlayerInfo(playerId) {
    throw new Error('Method not implemented: getPlayerInfo');
  }

  async addPlayer(playerData) {
    throw new Error('Method not implemented: addPlayer');
  }

  async updatePlayer(playerId, playerData) {
    throw new Error('Method not implemented: updatePlayer');
  }

  async deletePlayer(playerId) {
    throw new Error('Method not implemented: deletePlayer');
  }
}

export default PlayerDataAccessInterface;