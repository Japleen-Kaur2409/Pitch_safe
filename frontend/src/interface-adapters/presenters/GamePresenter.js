// frontend/src/interface-adapters/presenters/GamePresenter.js
import GameOutputBoundary from '../../use-cases/game/interfaces/GameOutputBoundary';

class GamePresenter extends GameOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  presentAddGameRecordSuccess(gameRecord) {
    const currentState = this.viewModel.getState();
    this.viewModel.update({
      gameRecords: [...currentState.gameRecords, gameRecord],
      addGameRecordLoading: false,
      addGameRecordError: null
    });
  }

  presentAddGameRecordError(error) {
    this.viewModel.update({
      addGameRecordLoading: false,
      addGameRecordError: error
    });
  }

  presentPlayerGameRecordsSuccess(records) {
    this.viewModel.update({
      gameRecords: records,
      getGameRecordsLoading: false,
      getGameRecordsError: null
    });
  }

  presentPlayerGameRecordsError(error) {
    this.viewModel.update({
      gameRecords: [],
      getGameRecordsLoading: false,
      getGameRecordsError: error
    });
  }
}

export default GamePresenter;