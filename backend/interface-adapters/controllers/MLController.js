// backend/interface-adapters/controllers/MLController.js
class MLController {
  constructor(getInjuryRiskUseCase, viewModel) {
    this.getInjuryRiskUseCase = getInjuryRiskUseCase;
    this.viewModel = viewModel;
  }

  async getInjuryRisk(req, res) {
    const { csvPath, topKRatio, startDate } = req.body;

    await this.getInjuryRiskUseCase.execute({
      csvPath,
      topKRatio,
      startDate
    });

    const result = this.viewModel.getResponse();
    res.status(result.success ? 200 : 500).json(result);
  }
}

module.exports = MLController;