// backend/use-cases/data-transfer/GameOutputData.js
class GameOutputData {
  constructor(recordId, playerId, gameDate, pitchType, releaseSpeed, spinRate) {
    this.recordId = recordId;
    this.playerId = playerId;
    this.gameDate = gameDate;
    this.pitchType = pitchType;
    this.releaseSpeed = releaseSpeed;
    this.spinRate = spinRate;
  }
}

module.exports = GameOutputData;