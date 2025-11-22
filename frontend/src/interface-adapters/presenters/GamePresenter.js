// frontend/src/interface-adapters/presenters/GamePresenter.js
import GameOutputBoundary from '../../use-cases/game/interfaces/GameOutputBoundary';

class GamePresenter extends GameOutputBoundary {
  constructor(viewModel, mlPresenter = null) {
    super();
    this.viewModel = viewModel;
    this.mlPresenter = mlPresenter;
  }

  presentAddGameRecordSuccess(response) {
    // Backend returns { message, record, injuryRiskData? } in body
    const record = response && response.record ? response.record : response;
    const currentState = this.viewModel.getState();
    this.viewModel.update({
      gameRecords: [...currentState.gameRecords, record],
      addGameRecordLoading: false,
      addGameRecordError: null
    });

    // If ML data was included, forward it to ML presenter (which will update ML view model)
    try {
      const injuryRiskData = response && response.injuryRiskData ? response.injuryRiskData : null;
      if (injuryRiskData && this.mlPresenter) {
        this.mlPresenter.presentInjuryRiskSuccess(injuryRiskData);
      }
    } catch (e) {
      console.warn('Failed to forward injuryRiskData to ML presenter', e);
    }
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