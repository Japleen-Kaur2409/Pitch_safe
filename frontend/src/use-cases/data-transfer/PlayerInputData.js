// frontend/src/use-cases/data-transfer/PlayerInputData.js
class PlayerInputData {
  constructor(playerId, firstName = null, lastName = null) {
    this.playerId = playerId;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export default PlayerInputData;