// frontend/src/use-cases/player/FetchMLBPlayerIdUseCase.js
class FetchMLBPlayerIdUseCase {
  constructor(mlbApiService, outputBoundary) {
    this.mlbApiService = mlbApiService;
    this.outputBoundary = outputBoundary;
  }

  async execute(playerId, firstName, lastName) {
    try {
      console.log(`FetchMLBPlayerIdUseCase: Fetching MLB ID for player ${playerId}: ${firstName} ${lastName}`);
      
      // Fetch the MLB player ID from the MLB API
      const mlbId = await this.mlbApiService.getPlayerId(firstName, lastName);
      
      if (mlbId) {
        console.log(`FetchMLBPlayerIdUseCase: Found MLB ID ${mlbId} for player ${playerId}`);
        
        // Also fetch detailed player information
        const playerDetails = await this.mlbApiService.getPlayerDetails(mlbId);
        console.log('FetchMLBPlayerIdUseCase: Player details:', playerDetails);
        
        // Pass both the MLB ID and the player details
        this.outputBoundary.presentMLBPlayerIdSuccess({
          playerId: playerId,
          mlbId: mlbId,
          details: playerDetails
        });
      } else {
        console.log(`FetchMLBPlayerIdUseCase: No MLB ID found for ${firstName} ${lastName}`);
        this.outputBoundary.presentMLBPlayerIdError(`No MLB player found for ${firstName} ${lastName}`);
      }
    } catch (error) {
      console.error('FetchMLBPlayerIdUseCase: Error fetching MLB player ID:', error);
      this.outputBoundary.presentMLBPlayerIdError(error.message || 'Failed to fetch MLB player ID');
    }
  }
}

export default FetchMLBPlayerIdUseCase;