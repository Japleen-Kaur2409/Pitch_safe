// backend/use-cases/game/AddGameRecordUseCase.js
const { AddGameRecordInputBoundary } = require('./interfaces/AddGameRecordInputBoundary');

class AddGameRecordUseCase extends AddGameRecordInputBoundary {
  constructor(gameDataAccess, outputBoundary) {
    super();
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    try {
      // Validate input data
      this.validateInput(inputData);

      // Create game record entity
      const gameRecord = {
        player_id: inputData.playerId,
        game_date: inputData.gameDate,
        pitch_type: inputData.pitchType,
        release_speed: inputData.releaseSpeed,
        spin_rate: inputData.spinRate,
        release_pos_x: inputData.releasePosX,
        release_pos_y: inputData.releasePosY,
        release_pos_z: inputData.releasePosZ
      };

      // Save to database
      const savedRecord = await this.gameDataAccess.addGameRecord(gameRecord);

      // Present success
      this.outputBoundary.presentSuccess({
        message: 'Game record added successfully',
        recordId: savedRecord.record_id,
        playerId: savedRecord.player_id,
        gameDate: savedRecord.game_date,
        pitchType: savedRecord.pitch_type,
        releaseSpeed: savedRecord.release_speed,
        spinRate: savedRecord.spin_rate
      });

    } catch (error) {
      this.outputBoundary.presentError(error.message);
    }
  }

  validateInput(inputData) {
    const errors = [];

    if (!inputData.playerId || inputData.playerId <= 0) {
      errors.push('Valid player ID is required');
    }

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

module.exports = AddGameRecordUseCase;