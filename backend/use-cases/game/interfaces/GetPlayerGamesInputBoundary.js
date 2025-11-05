// backend/use-cases/game/interfaces/GetPlayerGamesInputBoundary.js
class GetPlayerGamesInputBoundary {
  async execute(playerId) {
    throw new Error('Method not implemented');
  }
}

class GetPlayerGamesOutputBoundary {
  presentPlayerGamesSuccess(games) {
    throw new Error('Method not implemented');
  }

  presentPlayerGamesError(error) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  GetPlayerGamesInputBoundary,
  GetPlayerGamesOutputBoundary
};