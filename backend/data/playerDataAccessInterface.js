// backend/data/playerDataAccessInterface.js

class PlayerDataAccessInterface {
  async getAllPlayers() {
    throw new Error('getAllPlayers() not implemented');
  }

  async getPlayerInfoById(id) {
    throw new Error('getPlayerInfoById() not implemented');
  }
}

module.exports = PlayerDataAccessInterface;
