// backend/use-cases/player/GetPlayerInfoUseCase.js
class GetPlayerInfoUseCase {
  constructor(playerDataAccess, outputBoundary) {
    this.playerDataAccess = playerDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(playerId) {
    try {
      const playerInfo = await this.playerDataAccess.getPlayerInfoById(playerId);
      
      if (!playerInfo) {
        throw new Error('Player not found');
      }

      this.outputBoundary.presentSuccess(playerInfo);
    } catch (error) {
      this.outputBoundary.presentError(error.message);
    }
  }
}

module.exports = GetPlayerInfoUseCase;