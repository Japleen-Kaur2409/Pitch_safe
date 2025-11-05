// frontend/src/use-cases/player/GetPlayerDetailUseCase.js
class GetPlayerDetailUseCase {
  constructor(playerDataAccess, mlbDataAccess, outputBoundary) {
    this.playerDataAccess = playerDataAccess;
    this.mlbDataAccess = mlbDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(playerId, playerData) {
    try {
      // Get detailed player info
      const playerInfo = await this.playerDataAccess.getPlayerInfo(playerId);
      
      // Get MLB player ID for images
      const mlbPlayerId = await this.mlbDataAccess.getPlayerId(
        playerData.first_name, 
        playerData.last_name
      );

      // Combine data
      const detailedPlayer = {
        ...playerData,
        ...playerInfo,
        mlbPlayerId
      };

      this.outputBoundary.presentPlayerDetailSuccess(detailedPlayer);
    } catch (error) {
      this.outputBoundary.presentPlayerDetailError(error.message);
    }
  }
}

export default GetPlayerDetailUseCase;