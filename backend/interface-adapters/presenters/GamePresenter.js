// backend/interface-adapters/presenters/GamePresenter.js
const { GameOutputBoundary } = require('../../use-cases/game/interfaces/AddGameRecordInputBoundary');

class GamePresenter extends GameOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  presentSuccess(outputData) {
    this.viewModel.setResponse({
      status: 201,
      body: {
        message: outputData.message,
        record: {
          record_id: outputData.recordId,
          player_id: outputData.playerId,
          game_date: this.formatDate(outputData.gameDate),
          pitch_type: outputData.pitchType,
          release_speed: outputData.releaseSpeed,
          spin_rate: outputData.spinRate
        }
      }
    });
  }

  presentError(error) {
    this.viewModel.setResponse({
      status: 400,
      body: {
        error: typeof error === 'string' ? error : error.message || 'Failed to add game record'
      }
    });
  }

  presentPlayerGamesSuccess(games) {
    this.viewModel.setResponse({
      status: 200,
      body: games
    });
  }

  presentPlayerGamesError(error) {
    this.viewModel.setResponse({
      status: 400,
      body: {
        error: typeof error === 'string' ? error : error.message || 'Failed to fetch player games'
      }
    });
  }

  presentUpdateSuccess(updatedRecord) {
    this.viewModel.setResponse({
      status: 200,
      body: {
        message: 'Game record updated successfully',
        record: updatedRecord
      }
    });
  }

  presentUpdateError(error) {
    this.viewModel.setResponse({
      status: 400,
      body: {
        error: typeof error === 'string' ? error : error.message || 'Failed to update game record'
      }
    });
  }

  presentDeleteSuccess(outputData) {
    this.viewModel.setResponse({
      status: 200,
      body: {
        message: outputData.message,
        recordId: outputData.recordId
      }
    });
  }

  presentDeleteError(error) {
    this.viewModel.setResponse({
      status: 400,
      body: {
        error: typeof error === 'string' ? error : error.message || 'Failed to delete game record'
      }
    });
  }

  formatDate(date) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }
}

module.exports = GamePresenter;