/**
 * Get Player Detail Use Case
 * 
 * Retrieves comprehensive information about a specific player.
 * Combines data from multiple sources:
 * - Internal database (basic info, team association)
 * - MLB Stats API (physical stats, MLB career info)
 * 
 * This use case implements data aggregation from multiple sources,
 * a common pattern in Clean Architecture.
 * 
 * @class GetPlayerDetailUseCase
 */
class GetPlayerDetailUseCase {
  /**
   * Creates a new GetPlayerDetailUseCase instance
   * 
   * @param {Object} playerDataAccess - Internal database access for player data
   * @param {Object} mlbDataAccess - MLB Stats API access for external data
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(playerDataAccess, mlbDataAccess, outputBoundary) {
    this.playerDataAccess = playerDataAccess;
    this.mlbDataAccess = mlbDataAccess;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the get player detail use case
   * 
   * Orchestrates data retrieval from multiple sources and combines
   * them into a comprehensive player profile.
   * 
   * Data Flow:
   * 1. Get internal player info from database
   * 2. Get MLB player ID from MLB API (for images and stats)
   * 3. Combine all data sources
   * 4. Present to UI
   * 
   * @param {number} playerId - Internal player identifier
   * @param {Object} playerData - Basic player data from roster (for efficiency)
   * @returns {Promise<void>}
   */
  async execute(playerId, playerData) {
    try {
      // Fetch additional player info from internal database
      // This includes school, level, and other custom fields
      const playerInfo = await this.playerDataAccess.getPlayerInfo(playerId);
      
      // Fetch MLB player ID for accessing external resources
      // This enables getting official MLB headshots and stats
      const mlbPlayerId = await this.mlbDataAccess.getPlayerId(
        playerData.first_name, 
        playerData.last_name
      );

      // Combine data from all sources into comprehensive profile
      const detailedPlayer = {
        ...playerData,      // Basic roster data (name, team, etc.)
        ...playerInfo,      // Internal database details
        mlbPlayerId         // MLB API identifier for images
      };

      // Present the complete player profile to the UI
      this.outputBoundary.presentPlayerDetailSuccess(detailedPlayer);
    } catch (error) {
      // Present error to the UI if any data source fails
      this.outputBoundary.presentPlayerDetailError(error.message);
    }
  }
}

export default GetPlayerDetailUseCase;