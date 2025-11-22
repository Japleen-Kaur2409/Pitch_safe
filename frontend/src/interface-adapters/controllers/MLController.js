// frontend/src/interface-adapters/controllers/MLController.js
class MLController {
  constructor(getInjuryRiskUseCase, viewModel) {
    this.getInjuryRiskUseCase = getInjuryRiskUseCase;
    this.viewModel = viewModel;
  }

  async getInjuryRisk(csvPath, topKRatio = 0.10, startDate = '2024-04-01') {
    this.viewModel.setLoading(true);
    
    try {
      console.log('🎯 MLController.getInjuryRisk called with csvPath:', csvPath);
      const result = await this.getInjuryRiskUseCase.execute(csvPath, topKRatio, startDate);
      console.log('🎯 MLController received result:', result);
      
      // Explicitly set success on viewModel so frontend state updates
      if (result && typeof result === 'object') {
        console.log('🎯 Setting viewModel success with playerRiskMap');
        this.viewModel.setSuccess({ playerRiskMap: result });
      }
      
      return result;
    } catch (error) {
      console.error('❌ ML Controller Error:', error);
      this.viewModel.setError(error.message);
      throw error;
    }
  }
}

export default MLController;