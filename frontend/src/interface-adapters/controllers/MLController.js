// frontend/src/interface-adapters/controllers/MLController.js
class MLController {
  constructor(getInjuryRiskUseCase, viewModel) {
    this.getInjuryRiskUseCase = getInjuryRiskUseCase;
    this.viewModel = viewModel;
  }

  async getInjuryRisk(csvPath, topKRatio = 0.10, startDate = '2024-04-01') {
    this.viewModel.setLoading(true);
    
    try {
      const result = await this.getInjuryRiskUseCase.execute(csvPath, topKRatio, startDate);
      return result;
    } catch (error) {
      console.error('ML Controller Error:', error);
      throw error;
    }
  }
}

export default MLController;