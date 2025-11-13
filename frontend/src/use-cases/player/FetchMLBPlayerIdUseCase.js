/**
 * Fetch MLB Player ID Use Case
 * 
 * Queries the MLB Stats API to find a player's official MLB ID.
 * This ID is used for:
 * - Fetching official player headshots
 * - Accessing detailed MLB statistics
 * - Linking to MLB.com profiles
 * 
 * The use case implements a name-based search with exact matching logic.
 * 
 * @class FetchMLBPlayerIdUseCase
 */
class FetchMLBPlayerIdUseCase {
  /**
   * Creates a new FetchMLBPlayerIdUseCase instance
   * 
   * @param {Object} mlbApiService - Service for querying MLB Stats API
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(mlbApiService, outputBoundary) {
    this.mlbApiService = mlbApiService;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the fetch MLB player ID use case
   * 
   * Searches the MLB API by player name and retrieves their official ID
   * along with detailed player information.
   * 
   * Search Strategy:
   * 1. Query MLB API people search endpoint
   * 2. Attempt exact name match first
   * 3. Fall back to first result if no exact match
   * 4. Fetch additional player details if ID found
   * 
   * @param {number} playerId - Internal player ID (for mapping)
   * @param {string} firstName - Player's first name
   * @param {string} lastName - Player's last name
   * @returns {Promise<void>}
   */
  async execute(playerId, firstName, lastName) {
    try {
      console.log(`FetchMLBPlayerIdUseCase: Fetching MLB ID for player ${playerId}: ${firstName} ${lastName}`);
      
      // Query MLB Stats API for player by name
      // This returns an MLB player ID or null if not found
      const mlbId = await this.mlbApiService.getPlayerId(firstName, lastName);
      
      if (mlbId) {
        console.log(`FetchMLBPlayerIdUseCase: Found MLB ID ${mlbId} for player ${playerId}`);
        
        // Fetch comprehensive player details from MLB API
        // Includes: height, weight, batting/throwing hand, birth date, etc.
        const playerDetails = await this.mlbApiService.getPlayerDetails(mlbId);
        console.log('FetchMLBPlayerIdUseCase: Player details:', playerDetails);
        
        // Present success with both MLB ID and detailed info
        // This allows the UI to update player cards with enhanced data
        this.outputBoundary.presentMLBPlayerIdSuccess({
          playerId: playerId,    // Internal ID for mapping
          mlbId: mlbId,          // MLB official ID
          details: playerDetails // Comprehensive player info
        });
      } else {
        // Player not found in MLB database
        // This is non-critical - app continues with internal data only
        console.log(`FetchMLBPlayerIdUseCase: No MLB ID found for ${firstName} ${lastName}`);
        this.outputBoundary.presentMLBPlayerIdError(`No MLB player found for ${firstName} ${lastName}`);
      }
    } catch (error) {
      // Log error but don't crash - MLB data is supplementary
      console.error('FetchMLBPlayerIdUseCase: Error fetching MLB player ID:', error);
      this.outputBoundary.presentMLBPlayerIdError(error.message || 'Failed to fetch MLB player ID');
    }
  }
}

export default FetchMLBPlayerIdUseCase;