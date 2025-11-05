// backend/use-cases/player/GetAllPlayersUseCase.js
class GetAllPlayersUseCase {
  constructor(playerDataAccess, outputBoundary) {
    this.playerDataAccess = playerDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute() {
    try {
      const players = await this.playerDataAccess.getAllPlayers();
      this.outputBoundary.presentSuccess(players);
    } catch (error) {
      this.outputBoundary.presentError(error.message);
    }
  }
}

module.exports = GetAllPlayersUseCase;