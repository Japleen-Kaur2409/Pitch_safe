// backend/use-cases/game/DeleteGameRecordUseCase.js
class DeleteGameRecordUseCase {
  constructor(gameDataAccess, outputBoundary) {
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(recordId) {
    try {
      // Validate input
      if (!recordId || recordId <= 0) {
        throw new Error('Valid record ID is required');
      }

      // Delete game record
      const deletedRecord = await this.gameDataAccess.deleteGameRecord(recordId);
      
      // Present success
      this.outputBoundary.presentDeleteSuccess({
        message: 'Game record deleted successfully',
        recordId: deletedRecord.record_id
      });
    } catch (error) {
      this.outputBoundary.presentDeleteError(error.message);
    }
  }
}

module.exports = DeleteGameRecordUseCase;