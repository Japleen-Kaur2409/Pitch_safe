// backend/use-cases/data-transfer/PlayerOutputData.js
class PlayerOutputData {
  constructor(players = null, playerInfo = null) {
    this.players = players;
    this.playerInfo = playerInfo;
  }
}

module.exports = PlayerOutputData;