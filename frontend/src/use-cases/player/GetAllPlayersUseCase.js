// frontend/src/use-cases/player/GetAllPlayersUseCase.js
class GetAllPlayersUseCase {
  constructor(playerDataAccess, outputBoundary) {
    this.playerDataAccess = playerDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute() {
    try {
      const players = await this.playerDataAccess.getAllPlayers();
      this.outputBoundary.presentPlayersSuccess(players);
    } catch (error) {
      this.outputBoundary.presentPlayersError(error.message);
    }
  }
}

export default GetAllPlayersUseCase;