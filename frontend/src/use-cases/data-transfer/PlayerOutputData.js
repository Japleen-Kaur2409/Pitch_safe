// frontend/src/use-cases/data-transfer/PlayerOutputData.js
class PlayerOutputData {
  constructor(players = null, playerDetail = null, mlbPlayerId = null) {
    this.players = players;
    this.playerDetail = playerDetail;
    this.mlbPlayerId = mlbPlayerId;
  }
}

export default PlayerOutputData;