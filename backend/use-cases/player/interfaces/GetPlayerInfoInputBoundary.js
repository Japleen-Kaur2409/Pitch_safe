// backend/use-cases/player/interfaces/GetPlayerInfoInputBoundary.js
class GetPlayerInfoInputBoundary {
  async execute(playerId) {
    throw new Error('Method not implemented');
  }
}

class GetPlayerInfoOutputBoundary {
  presentSuccess(playerInfo) {
    throw new Error('Method not implemented');
  }

  presentError(error) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  GetPlayerInfoInputBoundary,
  GetPlayerInfoOutputBoundary
};