/**
 * Player Controller
 * 
 * Interface adapter that handles all player-related user actions.
 * Converts UI input into use case input data.
 * 
 * @class PlayerController
 */
import PlayerInputData from '../../use-cases/data-transfer/PlayerInputData';

class PlayerController {
  /**
   * Creates a new PlayerController instance
   * 
   * @param {GetAllPlayersUseCase} getAllPlayersUseCase - Use case for fetching all players
   * @param {GetPlayerDetailUseCase} getPlayerDetailUseCase - Use case for player details
   * @param {FetchMLBPlayerIdUseCase} fetchMLBPlayerIdUseCase - Use case for MLB API integration
   */
  constructor(
    getAllPlayersUseCase, 
    getPlayerDetailUseCase, 
    fetchMLBPlayerIdUseCase,
    getPlayersByCoachUseCase
  ) {
    this.getAllPlayersUseCase = getAllPlayersUseCase;
    this.getPlayerDetailUseCase = getPlayerDetailUseCase;
    this.fetchMLBPlayerIdUseCase = fetchMLBPlayerIdUseCase;
    this.getPlayersByCoachUseCase = getPlayersByCoachUseCase;
  }

  /**
   * Handles request to get all players
   * 
   * Typically called on app load to populate the roster view.
   * 
   * @returns {Promise<void>}
   */
  async handleGetAllPlayers() {
    console.log('PlayerController: Getting all players');
    await this.getAllPlayersUseCase.execute();
  }

  /**
   * Handles request to get detailed player information
   * 
   * Fetches additional data beyond basic roster information.
   * 
   * @param {number} playerId - Unique player identifier
   * @param {Object} playerData - Basic player data from roster
   * @returns {Promise<void>}
   */
  async handleGetPlayersByCoach(coachId) {
    console.log('PlayerController: Getting players for coach', coachId);
    await this.getPlayersByCoachUseCase.execute(coachId);
  }

  async handleGetPlayerDetail(playerId, playerData) {
    console.log('PlayerController: Getting player detail for', playerId);
    
    // Convert to structured input data
    const inputData = new PlayerInputData(playerId);
    
    // Execute use case with both ID and existing data
    await this.getPlayerDetailUseCase.execute(inputData.playerId, playerData);
  }

  /**
   * Handles request to fetch MLB player ID
   * 
   * Queries the MLB Stats API to get the official MLB player ID
   * for enhanced data and images.
   * 
   * @param {number} playerId - Internal player ID
   * @param {string} firstName - Player's first name
   * @param {string} lastName - Player's last name
   * @returns {Promise<void>}
   */
  async handleFetchMLBPlayerId(playerId, firstName, lastName) {
    console.log(`PlayerController: Fetching MLB ID for player ${playerId}: ${firstName} ${lastName}`);
    
    // Execute use case to query MLB API
    await this.fetchMLBPlayerIdUseCase.execute(
      playerId,
      firstName, 
      lastName
    );
  }
}

export default PlayerController;