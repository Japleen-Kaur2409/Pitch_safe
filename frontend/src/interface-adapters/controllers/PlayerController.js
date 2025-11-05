// frontend/src/interface-adapters/controllers/PlayerController.js
import PlayerInputData from '../../use-cases/data-transfer/PlayerInputData';

class PlayerController {
  constructor(
    getAllPlayersUseCase, 
    getPlayerDetailUseCase, 
    fetchMLBPlayerIdUseCase
  ) {
    this.getAllPlayersUseCase = getAllPlayersUseCase;
    this.getPlayerDetailUseCase = getPlayerDetailUseCase;
    this.fetchMLBPlayerIdUseCase = fetchMLBPlayerIdUseCase;
  }

  async handleGetAllPlayers() {
    console.log('PlayerController: Getting all players');
    await this.getAllPlayersUseCase.execute();
  }

  async handleGetPlayerDetail(playerId, playerData) {
    console.log('PlayerController: Getting player detail for', playerId);
    const inputData = new PlayerInputData(playerId);
    await this.getPlayerDetailUseCase.execute(inputData.playerId, playerData);
  }

  async handleFetchMLBPlayerId(playerId, firstName, lastName) {
    console.log(`PlayerController: Fetching MLB ID for player ${playerId}: ${firstName} ${lastName}`);
    
    // Pass playerId, firstName, and lastName to the use case
    await this.fetchMLBPlayerIdUseCase.execute(
      playerId,
      firstName, 
      lastName
    );
  }
}

export default PlayerController;