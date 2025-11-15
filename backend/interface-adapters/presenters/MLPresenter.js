// backend/interface-adapters/presenters/MLPresenter.js
class MLPresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  presentInjuryRiskSuccess(playerRiskMap) {
    this.viewModel.setSuccess({
      playerRiskMap,
      message: 'Injury risk predictions retrieved successfully'
    });
  }

  presentInjuryRiskError(errorMessage) {
    this.viewModel.setError({
      error: errorMessage,
      message: 'Failed to retrieve injury risk predictions'
    });
  }
}

module.exports = MLPresenter;