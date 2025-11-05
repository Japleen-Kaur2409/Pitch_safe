// backend/use-cases/game/GetPlayerGamesUseCase.js
class GetPlayerGamesUseCase {
  constructor(gameDataAccess, outputBoundary) {
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(playerId) {
    try {
      // Validate input
      if (!playerId || playerId <= 0) {
        throw new Error('Valid player ID is required');
      }

      // Get player games from data access
      const games = await this.gameDataAccess.getPlayerGames(playerId);
      
      // Present success
      this.outputBoundary.presentPlayerGamesSuccess(games);
    } catch (error) {
      this.outputBoundary.presentPlayerGamesError(error.message);
    }
  }
}

module.exports = GetPlayerGamesUseCase;