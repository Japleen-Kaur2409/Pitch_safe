// backend/use-cases/game/interfaces/AddGameRecordInputBoundary.js
class AddGameRecordInputBoundary {
  async execute(inputData) {
    throw new Error('Method not implemented');
  }
}

class GameOutputBoundary {
  presentSuccess(outputData) {
    throw new Error('Method not implemented');
  }

  presentError(error) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  AddGameRecordInputBoundary,
  GameOutputBoundary
};