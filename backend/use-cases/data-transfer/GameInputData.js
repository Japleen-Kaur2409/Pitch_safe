// backend/use-cases/data-transfer/GameInputData.js
class GameInputData {
  constructor(playerId, gameDate, pitchType, releaseSpeed, spinRate, releasePosX = null, releasePosY = null, releasePosZ = null) {
    this.playerId = playerId;
    this.gameDate = gameDate;
    this.pitchType = pitchType;
    this.releaseSpeed = releaseSpeed;
    this.spinRate = spinRate;
    this.releasePosX = releasePosX;
    this.releasePosY = releasePosY;
    this.releasePosZ = releasePosZ;
  }
}

module.exports = GameInputData;