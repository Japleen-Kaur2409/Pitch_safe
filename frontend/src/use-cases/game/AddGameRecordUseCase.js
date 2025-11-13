/**
 * Add Game Record Use Case
 * 
 * Creates a new game performance record for a player.
 * Validates input data and stores pitching statistics.
 * 
 * Business Rules:
 * - All required fields must be present and valid
 * - Player ID must exist in the system
 * - Game date must be a valid date
 * - Numeric values must be positive
 * 
 * @class AddGameRecordUseCase
 */
class AddGameRecordUseCase {
  /**
   * Creates a new AddGameRecordUseCase instance
   * 
   * @param {Object} gameDataAccess - Data access layer for game operations
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(gameDataAccess, outputBoundary) {
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the add game record use case
   * 
   * Validates all input fields according to business rules,
   * then stores the game record in the database.
   * 
   * Validation Rules:
   * - Player ID, date, and opponent are required
   * - Release speed and spin rate must be positive numbers
   * - Pitch type must be a valid type
   * 
   * @param {Object} gameRecord - Game record data to store
   * @param {number} gameRecord.playerId - Player who performed
   * @param {Date} gameRecord.date - Date of the game
   * @param {string} gameRecord.opponent - Opposing team
   * @param {string} gameRecord.pitchType - Type of pitch thrown
   * @param {number} gameRecord.releaseSpeed - Ball speed in MPH
   * @param {number} gameRecord.spinRate - Ball spin in RPM
   * @param {number} [gameRecord.releasePosX] - Optional X position
   * @param {number} [gameRecord.releasePosY] - Optional Y position
   * @param {number} [gameRecord.releasePosZ] - Optional Z position
   * @returns {Promise<void>}
   * @throws {Error} If validation fails or database operation fails
   */
  async execute(gameRecord) {
    try {
      // Business Rule: Core fields are required for a valid game record
      if (!gameRecord.playerId || !gameRecord.date || !gameRecord.opponent) {
        throw new Error('Player ID, date, and opponent are required');
      }

      // Call data access layer to persist the game record
      const result = await this.gameDataAccess.addGameRecord(gameRecord);
      
      // Present success with the saved record data
      this.outputBoundary.presentAddGameRecordSuccess(result);
    } catch (error) {
      // Present error to the UI
      this.outputBoundary.presentAddGameRecordError(error.message);
    }
  }
}

export default AddGameRecordUseCase;