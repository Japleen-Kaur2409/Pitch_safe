// frontend/src/interface-adapters/controllers/GameController.js
import GameInputData from '../../use-cases/data-transfer/GameInputData';

class GameController {
  constructor(addGameRecordUseCase) {
    this.addGameRecordUseCase = addGameRecordUseCase;
  }

  async handleAddGameRecord(gameData) {
    const inputData = new GameInputData(
      gameData.playerId,
      gameData.date,
      gameData.opponent,
      gameData.inningsPitched,
      gameData.hits,
      gameData.runs,
      gameData.earnedRuns,
      gameData.walks,
      gameData.strikeouts,
      gameData.homeRuns,
      gameData.pitchesThrown,
      gameData.notes
    );
    await this.addGameRecordUseCase.execute(inputData);
  }
}

export default GameController;