// backend/use-cases/game/UpdateGameRecordUseCase.js
class UpdateGameRecordUseCase {
  constructor(gameDataAccess, outputBoundary) {
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(recordId, inputData) {
    try {
      // Validate input
      this.validateInput(inputData);

      // Update game record
      const updatedRecord = await this.gameDataAccess.updateGameRecord(recordId, {
        game_date: inputData.gameDate,
        pitch_type: inputData.pitchType,
        release_speed: inputData.releaseSpeed,
        spin_rate: inputData.spinRate,
        release_pos_x: inputData.releasePosX,
        release_pos_y: inputData.releasePosY,
        release_pos_z: inputData.releasePosZ
      });

      // Present success
      this.outputBoundary.presentUpdateSuccess(updatedRecord);
    } catch (error) {
      this.outputBoundary.presentUpdateError(error.message);
    }
  }

  validateInput(inputData) {
    const errors = [];

    if (!inputData.gameDate) {
      errors.push('Game date is required');
    }

    if (!inputData.pitchType) {
      errors.push('Pitch type is required');
    }

    if (!inputData.releaseSpeed || inputData.releaseSpeed <= 0) {
      errors.push('Valid release speed is required');
    }

    if (!inputData.spinRate || inputData.spinRate <= 0) {
      errors.push('Valid spin rate is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

module.exports = UpdateGameRecordUseCase;