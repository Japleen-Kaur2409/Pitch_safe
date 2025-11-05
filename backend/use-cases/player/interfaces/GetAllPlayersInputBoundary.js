// backend/use-cases/player/interfaces/GetAllPlayersInputBoundary.js
class GetAllPlayersInputBoundary {
  async execute() {
    throw new Error('Method not implemented');
  }
}

class GetAllPlayersOutputBoundary {
  presentSuccess(players) {
    throw new Error('Method not implemented');
  }

  presentError(error) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  GetAllPlayersInputBoundary,
  GetAllPlayersOutputBoundary
};