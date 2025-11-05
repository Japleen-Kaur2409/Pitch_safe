// frontend/src/use-cases/game/AddGameRecordUseCase.js
class AddGameRecordUseCase {
  constructor(gameDataAccess, outputBoundary) {
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(gameRecord) {
    try {
      // Validate input
      if (!gameRecord.playerId || !gameRecord.date || !gameRecord.opponent) {
        throw new Error('Player ID, date, and opponent are required');
      }

      // Call data access layer
      const result = await this.gameDataAccess.addGameRecord(gameRecord);
      
      // Present success
      this.outputBoundary.presentAddGameRecordSuccess(result);
    } catch (error) {
      this.outputBoundary.presentAddGameRecordError(error.message);
    }
  }
}

export default AddGameRecordUseCase;