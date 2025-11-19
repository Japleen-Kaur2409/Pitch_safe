// frontend/src/interface-adapters/presenters/MLPresenter.js
class MLPresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
    console.log('🎯 MLPresenter constructor - viewModel:', viewModel);
  }

  presentInjuryRiskSuccess(playerRiskMap) {
    console.log('🎯 MLPresenter.presentInjuryRiskSuccess START');
    console.log('🎯 playerRiskMap:', playerRiskMap);
    console.log('🎯 this.viewModel:', this.viewModel);
    
    try {
      const dataToSet = {
        playerRiskMap,
        message: 'Injury risk data loaded successfully'
      };
      console.log('🎯 About to call viewModel.setSuccess with:', dataToSet);
      
      this.viewModel.setSuccess(dataToSet);
      
      console.log('🎯 viewModel.setSuccess COMPLETED');
      console.log('🎯 New state:', this.viewModel.getState());
    } catch (error) {
      console.error('🎯 ERROR in presentInjuryRiskSuccess:', error);
    }
  }

  presentInjuryRiskError(errorMessage) {
    console.log('🎯 MLPresenter.presentInjuryRiskError called');
    this.viewModel.setError({
      error: errorMessage,
      message: 'Failed to load injury risk data'
    });
  }
}

export default MLPresenter;