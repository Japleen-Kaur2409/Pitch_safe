/**
 * Get All Players Use Case
 * 
 * Retrieves the complete roster of players for the current team.
 * This is typically the first data load when entering the application.
 * 
 * Business Logic:
 * - Fetches all players from the data access layer
 * - No filtering or transformation applied
 * - Returns the raw player list for the roster view
 * 
 * @class GetAllPlayersUseCase
 */
class GetAllPlayersUseCase {
  /**
   * Creates a new GetAllPlayersUseCase instance
   * 
   * @param {Object} playerDataAccess - Data access layer for player operations
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(playerDataAccess, outputBoundary) {
    this.playerDataAccess = playerDataAccess;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the get all players use case
   * 
   * Fetches the complete player roster and presents it to the UI.
   * This is called on application load to populate the roster view.
   * 
   * @returns {Promise<void>}
   * @throws {Error} If data access layer fails to retrieve players
   */
  async execute() {
    try {
      // Fetch all players from the database
      const players = await this.playerDataAccess.getAllPlayers();
      
      // Present the player list to the UI
      this.outputBoundary.presentPlayersSuccess(players);
    } catch (error) {
      // Present error to the UI if fetch fails
      this.outputBoundary.presentPlayersError(error.message);
    }
  }
}

export default GetAllPlayersUseCase;